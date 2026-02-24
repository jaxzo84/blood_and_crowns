// Blood & Crowns Force Builder — Application Logic
// Fixes: faction upgrade costs, legendary leader retinue warnings, ships UI, sea battle units
'use strict';

// ============================================================
// STATE
// ============================================================
const State = {
  forcePts: 200,
  faction: null,
  companyList: null,
  leaderType: null,
  legendaryLeader: null,
  retinueSize: 3,
  retinueUpgrades: {},      // { upgradeId: boolean }
  leaderFactionUpgrades: {}, // { ruleId: boolean }  — keyed by rule.id
  units: [],                 // [{ id, unitId, qty, section, upgrades }]
  ships: [],                 // [{ id, shipId, options: {name:bool} }]
  characters: {},            // { characterId: boolean }
  companyName: "My Company",
  nextUnitId: 1,
  nextShipId: 1,
};

// ============================================================
// COMPUTED
// ============================================================
const Computed = {

  leader() {
    if (State.legendaryLeader) return BC_DATA.legendaryLeaders[State.legendaryLeader];
    return State.leaderType ? BC_DATA.standardLeaders[State.leaderType] : null;
  },

  // Retinue leader profile (standard leader backing the retinue)
  retinueLeader() {
    if (!State.leaderType) return null;
    return BC_DATA.standardLeaders[State.leaderType] || null;
  },

  retinueCost() {
    const rl = this.retinueLeader();
    if (!rl) return 0;
    let cost = rl.cost * State.retinueSize;
    if (rl.upgrades) {
      for (const [upId, enabled] of Object.entries(State.retinueUpgrades)) {
        if (!enabled) continue;
        const upg = rl.upgrades.find(u => u.id === upId);
        if (!upg) continue;
        if (upg.type === 'model') cost += (upg.costPerModel || 0) * State.retinueSize;
        else cost += upg.cost || 0;
      }
    }
    return cost;
  },

  legendaryCost() {
    return State.legendaryLeader ? (BC_DATA.legendaryLeaders[State.legendaryLeader].cost || 0) : 0;
  },

  unitsCost() {
    let total = 0;
    for (const unit of State.units) {
      const profile = BC_DATA.units[unit.unitId];
      if (!profile) continue;
      let c = profile.costPerModel * unit.qty;
      for (const [upId, enabled] of Object.entries(unit.upgrades)) {
        if (!enabled) continue;
        const upg = profile.upgrades?.find(u => u.id === upId);
        if (!upg) continue;
        if (upg.type === 'model') c += (upg.costPerModel || 0) * unit.qty;
        else c += upg.cost || 0;
      }
      total += c;
    }
    return total;
  },

  shipsCost() {
    let total = 0;
    for (const ship of State.ships) {
      const profile = BC_DATA.ships[ship.shipId];
      if (!profile) continue;
      total += profile.cost;
      for (const [optName, enabled] of Object.entries(ship.options)) {
        if (!enabled) continue;
        const opt = profile.options?.find(o => o.name === optName);
        if (opt) total += opt.cost || 0;
      }
    }
    return total;
  },

  charactersCost() {
    let total = 0;
    for (const [cId, enabled] of Object.entries(State.characters)) {
      if (!enabled) continue;
      const c = BC_DATA.characters[cId];
      if (c) total += c.cost;
    }
    return total;
  },

  // FIX: faction upgrades now keyed by rule.id, not rule.name
  factionUpgradesCost() {
    if (!State.faction) return 0;
    const faction = BC_DATA.factions[State.faction];
    let total = 0;
    for (const [ruleId, enabled] of Object.entries(State.leaderFactionUpgrades)) {
      if (!enabled) continue;
      const rule = faction.specialRules.find(r => r.id === ruleId);
      if (rule?.cost) total += rule.cost;
    }
    return total;
  },

  totalCost() {
    return this.legendaryCost() + this.retinueCost() + this.unitsCost()
         + this.shipsCost() + this.charactersCost() + this.factionUpgradesCost();
  },

  validate() {
    const errors = [];
    const warnings = [];

    if (!State.faction) { errors.push("Select a Faction to begin building your Company."); return { errors, warnings }; }
    if (!State.companyList) { errors.push("Select a Company List."); return { errors, warnings }; }
    if (!State.leaderType && !State.legendaryLeader) { errors.push("Select a Leader type."); return { errors, warnings }; }

    const cl = BC_DATA.companyLists[State.companyList];

    // FIX: Legendary leader must use correct retinue type
    if (State.legendaryLeader && State.leaderType) {
      const ll = BC_DATA.legendaryLeaders[State.legendaryLeader];
      if (ll.allowedRetinueTypes && !ll.allowedRetinueTypes.includes(State.leaderType)) {
        const required = ll.allowedRetinueTypes.map(t => BC_DATA.standardLeaders[t]?.name || t).join(' or ');
        errors.push(`⚠ ${ll.name} requires a ${required} retinue, not a ${BC_DATA.standardLeaders[State.leaderType]?.name}.`);
      }
    }

    // FIX: Joan of Arc — must be Noble retinue
    if (State.legendaryLeader === 'joan_of_arc' && State.leaderType !== 'noble') {
      errors.push("⚜ Joan of Arc may only lead a Noble retinue.");
    }

    const mainBattleUnits = State.units.filter(u => cl.mainBattle.includes(u.unitId));
    const vanguardUnits   = State.units.filter(u => cl.vanguard.includes(u.unitId));
    const reserveUnits    = State.units.filter(u => cl.reserve.includes(u.unitId));

    if (mainBattleUnits.length < 2) {
      errors.push(`Must include at least 2 Main Battle units (currently ${mainBattleUnits.length}).`);
    }

    const maxVanguard = Math.floor(mainBattleUnits.length / 2);
    const maxReserve  = Math.floor(mainBattleUnits.length / 3);

    if (vanguardUnits.length > maxVanguard)
      errors.push(`Too many Vanguard units. With ${mainBattleUnits.length} Main Battle: max ${maxVanguard}.`);
    if (reserveUnits.length > maxReserve)
      errors.push(`Too many Reserve units. With ${mainBattleUnits.length} Main Battle: max ${maxReserve}.`);

    if (maxVanguard > vanguardUnits.length)
      warnings.push(`You may add up to ${maxVanguard - vanguardUnits.length} more Vanguard unit(s).`);
    if (maxReserve > reserveUnits.length)
      warnings.push(`You may add up to ${maxReserve - reserveUnits.length} more Reserve unit(s).`);

    // Sea battles: require at least one ship (non-Boat)
    const hasShips = State.ships.some(s => BC_DATA.ships[s.shipId] && !BC_DATA.ships[s.shipId].specialRules.includes('Boat'));
    const hasNavalUnits = State.units.some(u => ['mariners', 'able_seamen', 'ships_boys'].includes(u.unitId));
    if (hasNavalUnits && !hasShips) {
      warnings.push("You have naval units but no ships. Sea battles require at least one ship (non-Boat).");
    }

    const total = this.totalCost();
    if (total > State.forcePts) {
      errors.push(`Over Force Point limit by ${total - State.forcePts} FP.`);
    } else if (State.forcePts - total > 0 && State.forcePts - total <= 20) {
      warnings.push(`${State.forcePts - total} FP remaining.`);
    }

    // Grizzled Veteran
    if (State.characters['grizzled_veteran'] && Math.floor(State.forcePts / 100) < 1) {
      errors.push(`Grizzled Veteran: max 1 per 100 FP. Not enough FP.`);
    }

    return { errors, warnings };
  }
};

// ============================================================
// RENDER HELPERS
// ============================================================
function el(tag, attrs = {}, children = []) {
  const elem = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') elem.className = v;
    else if (k === 'style') Object.assign(elem.style, v);
    else if (k.startsWith('on')) elem.addEventListener(k.slice(2).toLowerCase(), v);
    else elem.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === 'string') elem.appendChild(document.createTextNode(child));
    else if (child) elem.appendChild(child);
  }
  return elem;
}

function sectionTitle(icon, text) {
  return `<div class="section-title"><span class="title-icon">${icon}</span>${text}</div>`;
}

// ============================================================
// FP BAR
// ============================================================
function renderFPBar() {
  const total = Computed.totalCost();
  const pct = Math.min(100, (total / State.forcePts) * 100);
  const remaining = State.forcePts - total;
  const over = remaining < 0;
  document.getElementById('fp-bar').innerHTML = `
    <div class="fp-display"><div class="fp-label">Force Points</div><div class="fp-total">${State.forcePts}</div></div>
    <div class="fp-bar-track">
      <div class="fp-bar-fill" style="width:${pct}%;background:${over ? 'linear-gradient(to right,#c42222,#8b1a1a)' : 'linear-gradient(to right,#b8860b,#c42222)'}"></div>
    </div>
    <div class="fp-display"><div class="fp-label">Spent</div><div class="fp-total" style="color:${over ? '#c42222' : '#d4a017'}">${total}</div></div>
    <div class="fp-display"><div class="fp-label">Remaining</div><div class="fp-total" style="color:${over ? '#c42222' : '#f5c842'}">${remaining}</div></div>
  `;
}

// ============================================================
// SIDEBAR
// ============================================================
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  // ── Setup panel
  const setupPanel = document.createElement('div');
  setupPanel.className = 'parchment-panel';
  setupPanel.innerHTML = `
    ${sectionTitle('⚔', 'Company Setup')}
    <div class="select-group">
      <label class="select-label">Company Name</label>
      <input type="text" id="company-name-input" value="${State.companyName}" placeholder="Enter company name..." />
    </div>
    <div class="select-group">
      <label class="select-label">Force Points Limit</label>
      <div class="fp-input-group">
        <input type="number" id="fp-limit-input" value="${State.forcePts}" min="50" max="2000" step="25" />
        <div class="fp-quick-btns">
          ${[100,150,200,300,400,500].map(v => `<button class="fp-quick-btn" data-fp="${v}">${v}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="select-group">
      <label class="select-label">Faction</label>
      <select id="faction-select">
        <option value="">— Select Faction —</option>
        ${Object.values(BC_DATA.factions).map(f =>
          `<option value="${f.id}" ${State.faction === f.id ? 'selected' : ''}>${f.name}</option>`
        ).join('')}
      </select>
    </div>
    ${State.faction ? `
    <div class="select-group">
      <label class="select-label">Company List</label>
      <select id="company-list-select">
        <option value="">— Select Company List —</option>
        ${BC_DATA.factions[State.faction].companyLists.map(clId => {
          const cl = BC_DATA.companyLists[clId];
          return `<option value="${cl.id}" ${State.companyList === cl.id ? 'selected' : ''}>${cl.name}${cl.subtitle ? ` (${cl.subtitle})` : ''}</option>`;
        }).join('')}
      </select>
    </div>` : ''}
  `;
  sidebar.appendChild(setupPanel);

  // ── Faction abilities
  if (State.faction) {
    const faction = BC_DATA.factions[State.faction];
    const abilPanel = document.createElement('div');
    abilPanel.className = 'parchment-panel';
    // FIX: key faction upgrades by rule.id for cost lookup
    abilPanel.innerHTML = `
      ${sectionTitle('👑', 'Faction Abilities')}
      <div class="faction-abilities">
        ${faction.specialRules.map(rule => `
          <div class="faction-ability-item">
            <span class="faction-ability-name">${rule.name}${rule.cost ? ` <span style="color:var(--gold)">(+${rule.cost} FP)</span>` : ''}</span>
            <span class="faction-ability-text">${rule.description}</span>
            ${rule.cost ? `
            <div style="margin-top:4px">
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.85em">
                <input type="checkbox" class="faction-upgrade-cb upgrade-checkbox" data-rule-id="${rule.id}"
                  ${State.leaderFactionUpgrades[rule.id] ? 'checked' : ''} />
                Take upgrade (+${rule.cost} FP)
                ${rule.restriction ? `<span style="color:var(--stone-gray);font-size:0.85em">(${rule.restriction})</span>` : ''}
              </label>
            </div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
    sidebar.appendChild(abilPanel);
  }

  // ── Leader selection
  if (State.companyList) {
    const cl = BC_DATA.companyLists[State.companyList];
    const availableStandard  = cl.availableLeaders.filter(l => BC_DATA.standardLeaders[l]);
    const availableLegendary = cl.availableLeaders.filter(l => BC_DATA.legendaryLeaders[l]);

    const leaderPanel = document.createElement('div');
    leaderPanel.className = 'parchment-panel';
    leaderPanel.innerHTML = `
      ${sectionTitle('🏰', 'Leader')}
      <div class="select-group">
        <label class="select-label">Leader Type</label>
        <select id="leader-select">
          <option value="">— Select Leader —</option>
          ${availableStandard.map(lId => {
            const l = BC_DATA.standardLeaders[lId];
            return `<option value="${lId}" ${State.leaderType === lId ? 'selected' : ''}>${l.name} (${l.cost} FP/model)</option>`;
          }).join('')}
        </select>
      </div>
      ${State.leaderType ? renderLeaderCard() : ''}
      ${availableLegendary.length > 0 ? `
      <div class="select-group" style="border-top:1px solid var(--parchment-darker);padding-top:12px">
        <label class="select-label">⚜ Legendary Leader (optional)</label>
        <select id="legendary-select">
          <option value="">— None —</option>
          ${availableLegendary.map(lId => {
            const l = BC_DATA.legendaryLeaders[lId];
            return `<option value="${lId}" ${State.legendaryLeader === lId ? 'selected' : ''}>${l.name} (+${l.cost} FP)</option>`;
          }).join('')}
        </select>
        ${State.legendaryLeader ? renderLegendaryCard() : ''}
      </div>` : ''}
    `;
    sidebar.appendChild(leaderPanel);

    // ── Company special rules / notes
    if (cl.specialRules?.length > 0 || cl.notes) {
      const srPanel = document.createElement('div');
      srPanel.className = 'parchment-panel';
      srPanel.innerHTML = `
        ${sectionTitle('📜', 'Company Rules')}
        <div class="faction-abilities">
          ${(cl.specialRules || []).map(sr => `
            <div class="faction-ability-item">
              <span class="faction-ability-name">${sr.name}</span>
              <span class="faction-ability-text">${sr.description}</span>
            </div>
          `).join('')}
        </div>
        ${cl.notes ? `<div class="notes-box" style="margin-top:8px;padding:8px;background:rgba(184,134,11,0.1);border-left:3px solid var(--gold);font-size:0.83em;color:var(--stone-gray)">${cl.notes}</div>` : ''}
      `;
      sidebar.appendChild(srPanel);
    }

    // ── Validation panel
    const { errors, warnings } = Computed.validate();
    if (errors.length || warnings.length || State.leaderType) {
      const valPanel = document.createElement('div');
      valPanel.className = 'parchment-panel';
      valPanel.innerHTML = `
        ${sectionTitle('⚠', 'Validation')}
        <div class="validation-area">
          ${errors.map(e => `<div class="alert alert-error"><span class="alert-icon">✗</span>${e}</div>`).join('')}
          ${warnings.map(w => `<div class="alert alert-warning"><span class="alert-icon">!</span>${w}</div>`).join('')}
          ${!errors.length && State.leaderType ? `<div class="alert alert-success"><span class="alert-icon">✓</span>Company is valid!</div>` : ''}
        </div>
      `;
      sidebar.appendChild(valPanel);
    }
  }

  bindSidebarEvents();
}

function renderLeaderCard() {
  if (!State.leaderType) return '';
  const leader = BC_DATA.standardLeaders[State.leaderType];
  return `
    <div class="leader-card">
      <div>
        <span class="leader-cost">${leader.cost}</span>
        <div class="leader-name">${leader.name} Retinue</div>
        <span class="leader-type-badge">${leader.experienceLevel}</span>
      </div>
      <div class="stat-line">
        <div class="stat-block"><span class="stat-name">Shoot</span><span class="stat-value">${leader.shoot}</span></div>
        <div class="stat-block"><span class="stat-name">Melee</span><span class="stat-value">${leader.melee}</span></div>
        <div class="stat-block"><span class="stat-name">Resolve</span><span class="stat-value">${leader.resolve}</span></div>
        <div class="stat-block"><span class="stat-name">CP</span><span class="stat-value">${leader.commandPoints}</span></div>
        <div class="stat-block"><span class="stat-name">Range</span><span class="stat-value">${leader.commandRange}</span></div>
      </div>
      <div class="retinue-controls">
        <label class="select-label" style="margin:0">Models:</label>
        <button class="qty-btn" id="retinue-minus">−</button>
        <span class="qty-display">${State.retinueSize}</span>
        <button class="qty-btn" id="retinue-plus">+</button>
        <span class="retinue-range">(3–6)</span>
        <span style="margin-left:auto;font-family:var(--font-title);color:var(--gold);font-weight:700">${leader.cost * State.retinueSize} FP base</span>
      </div>
      ${leader.upgrades?.length ? `
      <div class="unit-upgrades" style="margin-top:8px;border-top:1px solid var(--parchment-darker);padding-top:8px">
        <div class="select-label">Upgrades</div>
        ${leader.upgrades.map(u => `
          <div class="upgrade-item">
            <input type="checkbox" class="upgrade-checkbox retinue-upgrade-cb" data-upgrade="${u.id}" id="ru-${u.id}" ${State.retinueUpgrades[u.id] ? 'checked' : ''} />
            <label class="upgrade-label" for="ru-${u.id}">${u.name}<br><small style="color:var(--stone-gray)">${u.description}</small></label>
            <span class="upgrade-cost">${u.type === 'model' ? `+${u.costPerModel}×${State.retinueSize}=${u.costPerModel*State.retinueSize}` : `+${u.cost}`} FP</span>
          </div>
        `).join('')}
      </div>` : ''}
      <div style="margin-top:8px;font-size:0.82em;color:var(--stone-gray)"><strong>Rules:</strong> ${leader.specialRules.join(', ')}</div>
    </div>
  `;
}

function renderLegendaryCard() {
  if (!State.legendaryLeader) return '';
  const ll = BC_DATA.legendaryLeaders[State.legendaryLeader];
  // FIX: show retinue type warning
  const wrongRetinue = State.leaderType && ll.allowedRetinueTypes && !ll.allowedRetinueTypes.includes(State.leaderType);
  const requiredName = ll.allowedRetinueTypes?.map(t => BC_DATA.standardLeaders[t]?.name || t).join(' or ');
  return `
    <div class="legendary-card" style="margin-top:10px">
      <div>
        <span class="legendary-cost">+${ll.cost} FP</span>
        <div class="legendary-name">⚜ ${ll.name}</div>
        <div style="font-size:0.8em;color:var(--stone-gray);margin-top:3px">Required Retinue: <strong>${requiredName || ll.retinueType}</strong></div>
      </div>
      ${wrongRetinue ? `<div class="alert alert-error" style="margin-top:6px"><span class="alert-icon">⚠</span>This Legendary Leader requires a <strong>${requiredName}</strong> retinue!</div>` : ''}
      <div class="legendary-ability" style="margin-top:8px">${ll.ability}</div>
      <div style="margin-top:6px;font-size:0.8em;color:var(--stone-gray)"><strong>Rules:</strong> ${ll.specialRules.join(', ')}</div>
    </div>
  `;
}

// ============================================================
// MAIN PANEL
// ============================================================
function renderMain() {
  const main = document.getElementById('main-panel');
  main.innerHTML = '';

  if (!State.companyList || !State.leaderType) {
    const panel = document.createElement('div');
    panel.className = 'parchment-panel';
    panel.innerHTML = `<div class="empty-state"><div class="empty-icon">⚜</div><div class="empty-text">Select a Faction, Company List, and Leader<br>to begin mustering your Company.</div></div>`;
    main.appendChild(panel);
    return;
  }

  const cl      = BC_DATA.companyLists[State.companyList];
  const faction = BC_DATA.factions[State.faction];

  const armyPanel = document.createElement('div');
  armyPanel.className = 'parchment-panel';
  armyPanel.innerHTML = `
    <div class="company-name-wrapper">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div>
          <span class="leader-type-badge" style="background:var(--steel-blue)">${faction.name}</span>
          <span class="leader-type-badge">${cl.name}${cl.subtitle ? ` — ${cl.subtitle}` : ''}</span>
        </div>
        <span style="font-family:var(--font-title);color:var(--gold);font-size:1.2em;font-weight:700">${Computed.totalCost()} / ${State.forcePts} FP</span>
      </div>
      <input type="text" class="company-name-input" id="company-name-main" value="${State.companyName}" placeholder="Company Name..." />
    </div>
    ${sectionTitle('🏰', 'Command Unit')}
    <div class="unit-section">${renderCommandUnit()}</div>
  `;

  // Unit sections
  const sections = [
    { key: 'mainBattle', label: 'Main Battle', icon: '⚔', badge: 'min. 2 units', units: cl.mainBattle },
    { key: 'vanguard',   label: 'Vanguard',    icon: '🏹', badge: '1 per 2 Main Battle', units: cl.vanguard },
    { key: 'reserve',    label: 'Reserve',     icon: '🛡', badge: '1 per 3 Main Battle', units: cl.reserve },
  ];

  for (const section of sections) {
    const sectionUnits = State.units.filter(u => section.units.includes(u.unitId));
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="display:flex;align-items:center;padding:0 15px;gap:10px;border-top:1px solid var(--parchment-darker);margin-top:5px">
        <div class="unit-section-header" style="flex:1;border-bottom:none;margin:0;padding:12px 0 6px">
          <span class="unit-section-label">${section.icon} ${section.label}</span>
          <span class="unit-section-badge">${section.badge}</span>
        </div>
        <button class="add-unit-btn" data-section="${section.key}"><span class="btn-icon">+</span> Add ${section.label} Unit</button>
      </div>
      <div class="unit-section" id="units-${section.key}">
        ${sectionUnits.length === 0 ? `<div class="empty-state" style="padding:15px"><span class="empty-text">No units added yet.</span></div>` : ''}
        ${sectionUnits.map(u => renderUnitRow(u)).join('')}
      </div>
    `;
    armyPanel.appendChild(div);
  }

  // Characters
  const charDiv = document.createElement('div');
  charDiv.innerHTML = `
    <div style="border-top:1px solid var(--parchment-darker);margin-top:5px">
      ${sectionTitle('⭐', 'Characters')}
      <div class="unit-section">
        ${Object.values(BC_DATA.characters).map(char => {
          // FIX: show retinue warning for characters with restricted unit types
          const isSeaOnly = char.restrictions?.includes('Sea Battles Only');
          return `
          <div class="character-item">
            <input type="checkbox" class="character-checkbox char-cb" id="char-${char.id}" data-char="${char.id}" ${State.characters[char.id] ? 'checked' : ''} />
            <div class="character-info">
              <div class="character-name">${char.name}${isSeaOnly ? ' <span style="color:var(--steel-blue);font-size:0.8em">[Sea]</span>' : ''}</div>
              <div class="character-restriction">${char.restrictions}</div>
              ${char.commandPoints ? `<div style="font-size:0.78em;color:var(--stone-gray)">CP: ${char.commandPoints}, Range: ${char.commandRange}</div>` : ''}
              <div style="font-size:0.78em;color:var(--stone-gray);font-style:italic">${char.specialRules.join(', ')}</div>
            </div>
            <span class="character-cost">+${char.cost} FP</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
  armyPanel.appendChild(charDiv);

  // ── Ships section (Sea Battles)
  const shipsDiv = document.createElement('div');
  shipsDiv.innerHTML = `
    <div style="border-top:1px solid var(--parchment-darker);margin-top:5px">
      <div style="display:flex;align-items:center;padding:0 15px;gap:10px">
        <div class="unit-section-header" style="flex:1;border-bottom:none;margin:0;padding:12px 0 6px">
          <span class="unit-section-label">⚓ Ships</span>
          <span class="unit-section-badge">Sea Battles — requires 1+ non-Boat ship</span>
        </div>
        <button class="btn btn-ghost" id="add-ship-btn" style="font-size:0.82em;padding:4px 10px">+ Add Ship</button>
      </div>
      <div class="unit-section" id="ships-section">
        ${State.ships.length === 0
          ? `<div class="empty-state" style="padding:15px"><span class="empty-text">No ships added. Only needed for Sea Battles.</span></div>`
          : State.ships.map(s => renderShipRow(s)).join('')
        }
      </div>
    </div>
  `;
  armyPanel.appendChild(shipsDiv);

  // Action bar
  const actionBar = document.createElement('div');
  actionBar.className = 'action-bar';
  actionBar.innerHTML = `
    <button class="btn btn-primary" id="export-txt-btn">📄 Export TXT</button>
    <button class="btn btn-secondary" id="export-pdf-btn">📋 Export PDF</button>
    <button class="btn btn-ghost" id="reset-btn" style="margin-left:auto">🗑 Reset Company</button>
  `;
  armyPanel.appendChild(actionBar);

  main.appendChild(armyPanel);
  bindMainEvents();
}

function renderCommandUnit() {
  const leader = Computed.leader();
  if (!leader) return '';
  const isLegendary = !!State.legendaryLeader;
  const displayName = isLegendary
    ? `${BC_DATA.legendaryLeaders[State.legendaryLeader].name} & Retinue`
    : `${leader.name} Retinue`;
  return `
    <div class="unit-row">
      <div class="unit-row-header">
        <div>
          <div class="unit-row-name">${isLegendary ? '⚜ ' : ''}${displayName}</div>
          <div class="unit-row-type">${leader.experienceLevel || 'Veteran'} — ${State.retinueSize} models</div>
        </div>
        <div></div><div></div>
        <div class="unit-row-cost">${Computed.retinueCost() + Computed.legendaryCost()}</div>
      </div>
      <div class="unit-stats-row">
        <div class="unit-stat-item"><span class="unit-stat-label">Shoot</span><span class="unit-stat-value">${leader.shoot}</span></div>
        <div class="unit-stat-item"><span class="unit-stat-label">Melee</span><span class="unit-stat-value">${leader.melee}</span></div>
        <div class="unit-stat-item"><span class="unit-stat-label">Resolve</span><span class="unit-stat-value">${leader.resolve}</span></div>
      </div>
    </div>
  `;
}

function renderUnitRow(unit) {
  const profile = BC_DATA.units[unit.unitId];
  if (!profile) return '';
  let upgradesCost = 0;
  for (const [upId, enabled] of Object.entries(unit.upgrades)) {
    if (!enabled) continue;
    const upg = profile.upgrades?.find(u => u.id === upId);
    if (!upg) continue;
    if (upg.type === 'model') upgradesCost += (upg.costPerModel || 0) * unit.qty;
    else upgradesCost += upg.cost || 0;
  }
  const totalUnitCost = profile.costPerModel * unit.qty + upgradesCost;

  return `
    <div class="unit-row" data-unit-id="${unit.id}">
      <div class="unit-row-header">
        <div>
          <div class="unit-row-name">${profile.name}</div>
          <div class="unit-row-type">${profile.experienceLevel} — ${profile.arms}</div>
          ${profile.notes ? `<div style="font-size:0.78em;color:#b8860b;margin-top:2px">${profile.notes}</div>` : ''}
        </div>
        <div class="unit-row-controls">
          <button class="qty-btn" data-action="decrease" data-unit="${unit.id}">−</button>
          <span class="qty-display">${unit.qty}</span>
          <button class="qty-btn" data-action="increase" data-unit="${unit.id}">+</button>
          <span style="font-size:0.75em;color:var(--stone-gray);margin-left:2px">(${profile.minModels}–${profile.maxModels})</span>
        </div>
        <div class="unit-row-cost">${totalUnitCost}</div>
        <button class="remove-unit-btn" data-remove="${unit.id}" title="Remove">✕</button>
      </div>
      <div class="unit-stats-row">
        <div class="unit-stat-item"><span class="unit-stat-label">Shoot</span><span class="unit-stat-value">${profile.shoot}</span></div>
        <div class="unit-stat-item"><span class="unit-stat-label">Melee</span><span class="unit-stat-value">${profile.melee}</span></div>
        <div class="unit-stat-item"><span class="unit-stat-label">Resolve</span><span class="unit-stat-value">${profile.resolve}</span></div>
      </div>
      ${profile.specialRules?.length ? `
      <div class="special-rules-row">
        ${profile.specialRules.map(sr => `<span class="special-rule-tag">${sr}</span>`).join('')}
      </div>` : ''}
      ${profile.upgrades?.length ? `
      <div class="unit-upgrades">
        <div class="select-label" style="margin-bottom:4px">Upgrades</div>
        ${profile.upgrades.map(u => `
          <div class="upgrade-item">
            <input type="checkbox" class="upgrade-checkbox unit-upgrade-cb"
              data-unit="${unit.id}" data-upgrade="${u.id}" id="upg-${unit.id}-${u.id}"
              ${unit.upgrades[u.id] ? 'checked' : ''} />
            <label class="upgrade-label" for="upg-${unit.id}-${u.id}">${u.name}<br>
              <small style="color:var(--stone-gray)">${u.description}</small></label>
            <span class="upgrade-cost">
              ${u.type === 'model' && u.costPerModel
                ? `+${u.costPerModel}×${unit.qty}=${u.costPerModel*unit.qty}`
                : `+${u.cost||0}`} FP
            </span>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  `;
}

function renderShipRow(ship) {
  const profile = BC_DATA.ships[ship.shipId];
  if (!profile) return '';
  let shipCost = profile.cost;
  for (const [optName, enabled] of Object.entries(ship.options)) {
    if (!enabled) continue;
    const opt = profile.options?.find(o => o.name === optName);
    if (opt) shipCost += opt.cost || 0;
  }
  return `
    <div class="unit-row" data-ship-id="${ship.id}">
      <div class="unit-row-header">
        <div>
          <div class="unit-row-name">⚓ ${profile.name}</div>
          <div class="unit-row-type">Size ${profile.size} · Hull ${profile.hullSave} · Draft ${profile.draft}</div>
        </div>
        <div></div>
        <div class="unit-row-cost">${shipCost}</div>
        <button class="remove-unit-btn" data-remove-ship="${ship.id}" title="Remove">✕</button>
      </div>
      <div class="unit-stats-row">
        <div class="unit-stat-item"><span class="unit-stat-label">Top Spd</span><span class="unit-stat-value">${profile.topSpeed}</span></div>
        <div class="unit-stat-item"><span class="unit-stat-label">Wind</span><span class="unit-stat-value">${profile.windward}</span></div>
        <div class="unit-stat-item"><span class="unit-stat-label">Turn</span><span class="unit-stat-value">${profile.turn}</span></div>
        <div class="unit-stat-item"><span class="unit-stat-label">Sails</span><span class="unit-stat-value" style="font-size:0.75em">${profile.sailSettings}</span></div>
      </div>
      <div class="special-rules-row">
        ${profile.specialRules.map(sr => `<span class="special-rule-tag">${sr}</span>`).join('')}
      </div>
      ${profile.options?.length ? `
      <div class="unit-upgrades">
        <div class="select-label" style="margin-bottom:4px">Ship Options</div>
        ${profile.options.map(opt => `
          <div class="upgrade-item">
            <input type="checkbox" class="upgrade-checkbox ship-option-cb"
              data-ship="${ship.id}" data-option="${opt.name}" id="sopt-${ship.id}-${opt.name.replace(/\s/g,'_')}"
              ${ship.options[opt.name] ? 'checked' : ''} />
            <label class="upgrade-label" for="sopt-${ship.id}-${opt.name.replace(/\s/g,'_')}">${opt.name}</label>
            <span class="upgrade-cost">+${opt.cost} FP</span>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  `;
}

// ============================================================
// UNIT SELECTOR MODAL
// ============================================================
function openUnitSelector(sectionKey) {
  const cl = BC_DATA.companyLists[State.companyList];
  const availableIds = cl[sectionKey] || [];
  const sectionLabels = { mainBattle: 'Main Battle', vanguard: 'Vanguard', reserve: 'Reserve' };

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(26,18,8,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';

  const modal = document.createElement('div');
  modal.className = 'parchment-panel';
  modal.style.cssText = 'max-width:700px;width:100%;max-height:80vh;overflow:auto';
  modal.innerHTML = `
    ${sectionTitle('⚔', `Add ${sectionLabels[sectionKey]} Unit`)}
    <div class="unit-selector">
      <div class="unit-selector-grid">
        ${availableIds.map(unitId => {
          const profile = BC_DATA.units[unitId];
          if (!profile) return '';
          const hasNote = profile.notes ? `<div style="color:#b8860b;font-size:0.78em;margin-top:2px">${profile.notes}</div>` : '';
          return `
            <button class="unit-option-btn" data-add-unit="${unitId}" data-section="${sectionKey}">
              <span class="unit-option-name">${profile.name}</span>
              <span class="unit-option-cost">${profile.costPerModel} FP/model · ${profile.minModels}–${profile.maxModels} models · ${profile.experienceLevel}</span>
              ${profile.specialRules?.length ? `<div style="margin-top:3px">${profile.specialRules.slice(0,2).map(sr => `<span class="special-rule-tag">${sr}</span>`).join('')}${profile.specialRules.length > 2 ? '…' : ''}</div>` : ''}
              ${hasNote}
            </button>`;
        }).join('')}
      </div>
      <div style="margin-top:15px;text-align:right"><button class="btn btn-ghost close-modal-btn">Cancel</button></div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.close-modal-btn') || e.target === overlay) { overlay.remove(); return; }
    const addBtn = e.target.closest('[data-add-unit]');
    if (addBtn) { addUnit(addBtn.dataset.addUnit, addBtn.dataset.section); overlay.remove(); }
  });
}

function openShipSelector() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(26,18,8,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';

  const modal = document.createElement('div');
  modal.className = 'parchment-panel';
  modal.style.cssText = 'max-width:750px;width:100%;max-height:80vh;overflow:auto';
  modal.innerHTML = `
    ${sectionTitle('⚓', 'Add Ship')}
    <div style="font-size:0.84em;color:var(--stone-gray);margin-bottom:10px">All Companies add these to their list for Sea Battles (see p.98). At least one non-Boat ship is required.</div>
    <div class="unit-selector-grid">
      ${Object.values(BC_DATA.ships).map(ship => `
        <button class="unit-option-btn" data-add-ship="${ship.id}">
          <span class="unit-option-name">⚓ ${ship.name}</span>
          <span class="unit-option-cost">${ship.cost} FP · Size ${ship.size} · Hull ${ship.hullSave}${ship.specialRules.includes('Boat') ? ' · 🚣 Boat' : ''}</span>
          <div style="font-size:0.78em;color:var(--stone-gray);margin-top:2px">
            Top: ${ship.topSpeed} · Wind: ${ship.windward} · Turn: ${ship.turn} · Draft: ${ship.draft}
          </div>
          <div style="margin-top:3px">${ship.specialRules.slice(0,3).map(sr => `<span class="special-rule-tag">${sr}</span>`).join('')}${ship.specialRules.length > 3 ? '…' : ''}</div>
        </button>
      `).join('')}
    </div>
    <div style="margin-top:15px;text-align:right"><button class="btn btn-ghost close-modal-btn">Cancel</button></div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.close-modal-btn') || e.target === overlay) { overlay.remove(); return; }
    const addBtn = e.target.closest('[data-add-ship]');
    if (addBtn) { addShip(addBtn.dataset.addShip); overlay.remove(); }
  });
}

// ============================================================
// STATE MUTATIONS
// ============================================================
function addUnit(unitId) {
  const profile = BC_DATA.units[unitId];
  if (!profile) return;
  State.units.push({ id: State.nextUnitId++, unitId, qty: profile.minModels, upgrades: {} });
  render();
}

function removeUnit(id) {
  State.units = State.units.filter(u => u.id !== id);
  render();
}

function changeUnitQty(id, delta) {
  const unit = State.units.find(u => u.id === id);
  if (!unit) return;
  const profile = BC_DATA.units[unit.unitId];
  unit.qty = Math.max(profile.minModels, Math.min(profile.maxModels, unit.qty + delta));
  render();
}

function toggleUpgrade(id, upgradeId, checked) {
  const unit = State.units.find(u => u.id === id);
  if (unit) { unit.upgrades[upgradeId] = checked; render(); }
}

function addShip(shipId) {
  State.ships.push({ id: State.nextShipId++, shipId, options: {} });
  render();
}

function removeShip(id) {
  State.ships = State.ships.filter(s => s.id !== id);
  render();
}

function toggleShipOption(id, optName, checked) {
  const ship = State.ships.find(s => s.id === id);
  if (ship) { ship.options[optName] = checked; render(); }
}

// ============================================================
// EVENT BINDING
// ============================================================
function bindSidebarEvents() {
  const nameInput = document.getElementById('company-name-input');
  if (nameInput) nameInput.addEventListener('input', (e) => {
    State.companyName = e.target.value;
    const mn = document.getElementById('company-name-main');
    if (mn) mn.value = State.companyName;
  });

  const fpInput = document.getElementById('fp-limit-input');
  if (fpInput) fpInput.addEventListener('change', (e) => { State.forcePts = parseInt(e.target.value) || 200; render(); });

  document.querySelectorAll('.fp-quick-btn').forEach(btn =>
    btn.addEventListener('click', () => { State.forcePts = parseInt(btn.dataset.fp); render(); }));

  const factionSelect = document.getElementById('faction-select');
  if (factionSelect) factionSelect.addEventListener('change', (e) => {
    State.faction = e.target.value || null;
    State.companyList = null; State.leaderType = null; State.legendaryLeader = null;
    State.units = []; State.ships = []; State.retinueUpgrades = {}; State.leaderFactionUpgrades = {};
    render();
  });

  const clSelect = document.getElementById('company-list-select');
  if (clSelect) clSelect.addEventListener('change', (e) => {
    State.companyList = e.target.value || null;
    State.leaderType = null; State.legendaryLeader = null; State.units = [];
    render();
  });

  const leaderSelect = document.getElementById('leader-select');
  if (leaderSelect) leaderSelect.addEventListener('change', (e) => {
    State.leaderType = e.target.value || null;
    State.retinueUpgrades = {}; State.legendaryLeader = null;
    render();
  });

  const legendarySelect = document.getElementById('legendary-select');
  if (legendarySelect) legendarySelect.addEventListener('change', (e) => {
    State.legendaryLeader = e.target.value || null;
    render();
  });

  const retMinus = document.getElementById('retinue-minus');
  const retPlus  = document.getElementById('retinue-plus');
  if (retMinus) retMinus.addEventListener('click', () => { State.retinueSize = Math.max(3, State.retinueSize - 1); render(); });
  if (retPlus)  retPlus.addEventListener('click',  () => { State.retinueSize = Math.min(6, State.retinueSize + 1); render(); });

  document.querySelectorAll('.retinue-upgrade-cb').forEach(cb =>
    cb.addEventListener('change', (e) => { State.retinueUpgrades[e.target.dataset.upgrade] = e.target.checked; render(); }));

  // FIX: faction upgrades now use data-rule-id (maps to rule.id)
  document.querySelectorAll('.faction-upgrade-cb').forEach(cb =>
    cb.addEventListener('change', (e) => { State.leaderFactionUpgrades[e.target.dataset.ruleId] = e.target.checked; render(); }));
}

function bindMainEvents() {
  const mainName = document.getElementById('company-name-main');
  if (mainName) mainName.addEventListener('input', (e) => { State.companyName = e.target.value; });

  document.querySelectorAll('.add-unit-btn').forEach(btn =>
    btn.addEventListener('click', () => openUnitSelector(btn.dataset.section)));

  const addShipBtn = document.getElementById('add-ship-btn');
  if (addShipBtn) addShipBtn.addEventListener('click', openShipSelector);

  document.querySelectorAll('[data-action]').forEach(btn =>
    btn.addEventListener('click', () => changeUnitQty(parseInt(btn.dataset.unit), btn.dataset.action === 'increase' ? 1 : -1)));

  document.querySelectorAll('[data-remove]').forEach(btn =>
    btn.addEventListener('click', () => removeUnit(parseInt(btn.dataset.remove))));

  document.querySelectorAll('[data-remove-ship]').forEach(btn =>
    btn.addEventListener('click', () => removeShip(parseInt(btn.dataset.removeShip))));

  document.querySelectorAll('.unit-upgrade-cb').forEach(cb =>
    cb.addEventListener('change', (e) => toggleUpgrade(parseInt(e.target.dataset.unit), e.target.dataset.upgrade, e.target.checked)));

  document.querySelectorAll('.ship-option-cb').forEach(cb =>
    cb.addEventListener('change', (e) => toggleShipOption(parseInt(e.target.dataset.ship), e.target.dataset.option, e.target.checked)));

  document.querySelectorAll('.char-cb').forEach(cb =>
    cb.addEventListener('change', (e) => { State.characters[e.target.dataset.char] = e.target.checked; render(); }));

  document.getElementById('export-txt-btn')?.addEventListener('click', exportTXT);
  document.getElementById('export-pdf-btn')?.addEventListener('click', exportPDF);
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Reset the company? All selections will be cleared.')) {
      State.units = []; State.ships = []; State.characters = {};
      State.retinueUpgrades = {}; State.leaderFactionUpgrades = {}; State.legendaryLeader = null;
      render();
    }
  });
}

// ============================================================
// EXPORT
// ============================================================
function buildArmyText() {
  const leader  = Computed.leader();
  const cl      = State.companyList ? BC_DATA.companyLists[State.companyList] : null;
  const faction = State.faction ? BC_DATA.factions[State.faction] : null;
  const lines = [];
  const line = (s = '') => lines.push(s);

  line('╔══════════════════════════════════════════════════════════╗');
  line('║  BLOOD & CROWNS — FORCE ROSTER');
  line('╚══════════════════════════════════════════════════════════╝');
  line();
  line(`Company Name : ${State.companyName}`);
  line(`Faction      : ${faction?.name || '—'}`);
  line(`Company List : ${cl?.name || '—'}${cl?.subtitle ? ` (${cl.subtitle})` : ''}`);
  line(`Force Points : ${Computed.totalCost()} / ${State.forcePts}`);
  line();

  // Leader
  line('──────────────────────────────────────────────────────────');
  line('  COMMAND UNIT');
  line('──────────────────────────────────────────────────────────');
  if (leader) {
    if (State.legendaryLeader) {
      const ll = BC_DATA.legendaryLeaders[State.legendaryLeader];
      line(`  ⚜ ${ll.name} (+${ll.cost} FP)`);
      line(`  Rules: ${ll.specialRules.join(', ')}`);
      line();
    }
    const rl = Computed.retinueLeader();
    line(`  ${rl?.name || leader.name} Retinue  (${State.retinueSize} models × ${rl?.cost || leader.cost} FP)`);
    line(`  Shoot: ${leader.shoot}  Melee: ${leader.melee}  Resolve: ${leader.resolve}  CP: ${leader.commandPoints}  Range: ${leader.commandRange}`);
    const retUpgNames = Object.entries(State.retinueUpgrades).filter(([,v]) => v)
      .map(([k]) => rl?.upgrades?.find(u => u.id === k)?.name).filter(Boolean);
    if (retUpgNames.length) line(`  Upgrades: ${retUpgNames.join(', ')}`);
    line(`  Cost: ${Computed.retinueCost() + Computed.legendaryCost()} FP`);
  }
  line();

  // Faction upgrades
  const takenFactionUpgrades = Object.entries(State.leaderFactionUpgrades).filter(([,v]) => v);
  if (takenFactionUpgrades.length && faction) {
    line('  Faction Upgrades:');
    for (const [rId] of takenFactionUpgrades) {
      const rule = faction.specialRules.find(r => r.id === rId);
      if (rule) line(`    • ${rule.name} (+${rule.cost} FP)`);
    }
    line();
  }

  // Unit sections
  const sections = [
    { key: 'mainBattle', label: 'MAIN BATTLE', ids: cl?.mainBattle || [] },
    { key: 'vanguard',   label: 'VANGUARD',    ids: cl?.vanguard   || [] },
    { key: 'reserve',    label: 'RESERVE',     ids: cl?.reserve    || [] },
  ];
  for (const section of sections) {
    const sectionUnits = State.units.filter(u => section.ids.includes(u.unitId));
    if (!sectionUnits.length) continue;
    line('──────────────────────────────────────────────────────────');
    line(`  ${section.label}`);
    line('──────────────────────────────────────────────────────────');
    for (const unit of sectionUnits) {
      const profile = BC_DATA.units[unit.unitId];
      if (!profile) continue;
      let unitCost = profile.costPerModel * unit.qty;
      const upgNames = [];
      for (const [upId, enabled] of Object.entries(unit.upgrades)) {
        if (!enabled) continue;
        const upg = profile.upgrades?.find(u => u.id === upId);
        if (!upg) continue;
        upgNames.push(upg.name);
        if (upg.type === 'model') unitCost += (upg.costPerModel||0) * unit.qty;
        else unitCost += upg.cost || 0;
      }
      line(`  ${profile.name} — ${unit.qty} models`);
      line(`    ${profile.experienceLevel} | Shoot: ${profile.shoot}  Melee: ${profile.melee}  Resolve: ${profile.resolve}`);
      if (profile.specialRules?.length) line(`    Rules: ${profile.specialRules.join(', ')}`);
      if (upgNames.length) line(`    Upgrades: ${upgNames.join(', ')}`);
      line(`    Cost: ${unitCost} FP`);
      line();
    }
  }

  // Ships
  if (State.ships.length) {
    line('──────────────────────────────────────────────────────────');
    line('  SHIPS');
    line('──────────────────────────────────────────────────────────');
    for (const ship of State.ships) {
      const profile = BC_DATA.ships[ship.shipId];
      if (!profile) continue;
      let shipCost = profile.cost;
      const opts = [];
      for (const [optName, enabled] of Object.entries(ship.options)) {
        if (!enabled) continue;
        const opt = profile.options?.find(o => o.name === optName);
        if (opt) { opts.push(opt.name); shipCost += opt.cost || 0; }
      }
      line(`  ${profile.name} — Size ${profile.size}, Hull ${profile.hullSave}`);
      line(`    Top Speed: ${profile.topSpeed} · Windward: ${profile.windward} · Turn: ${profile.turn}`);
      line(`    Rules: ${profile.specialRules.join(', ')}`);
      if (opts.length) line(`    Options: ${opts.join(', ')}`);
      line(`    Cost: ${shipCost} FP`);
      line();
    }
  }

  // Characters
  const selectedChars = Object.entries(State.characters).filter(([,v]) => v);
  if (selectedChars.length) {
    line('──────────────────────────────────────────────────────────');
    line('  CHARACTERS');
    line('──────────────────────────────────────────────────────────');
    for (const [charId] of selectedChars) {
      const char = BC_DATA.characters[charId];
      if (!char) continue;
      line(`  ${char.name} (+${char.cost} FP)`);
      line(`    Rules: ${char.specialRules.join(', ')}`);
    }
    line();
  }

  line('──────────────────────────────────────────────────────────');
  line(`  TOTAL: ${Computed.totalCost()} / ${State.forcePts} Force Points`);
  const { errors } = Computed.validate();
  if (errors.length) { line(); line('  VALIDATION ISSUES:'); for (const e of errors) line(`  ✗ ${e}`); }
  line('──────────────────────────────────────────────────────────');
  line('  Generated by Blood & Crowns Force Builder');
  return lines.join('\n');
}

function exportTXT() {
  const blob = new Blob([buildArmyText()], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${State.companyName.replace(/[^a-z0-9]/gi,'_') || 'company'}.txt`;
  a.click(); URL.revokeObjectURL(url);
}

function exportPDF() {
  const leader  = Computed.leader();
  const cl      = State.companyList ? BC_DATA.companyLists[State.companyList] : null;
  const faction = State.faction ? BC_DATA.factions[State.faction] : null;
  const win = window.open('', '_blank');
  if (!win) { alert('Please allow popups to export PDF.'); return; }

  const sections = [
    { key: 'mainBattle', label: 'Main Battle', ids: cl?.mainBattle || [] },
    { key: 'vanguard',   label: 'Vanguard',    ids: cl?.vanguard   || [] },
    { key: 'reserve',    label: 'Reserve',     ids: cl?.reserve    || [] },
  ];

  let unitsHTML = '';
  for (const section of sections) {
    const sUnits = State.units.filter(u => section.ids.includes(u.unitId));
    if (!sUnits.length) continue;
    unitsHTML += `<h3 style="font-family:Cinzel,serif;font-size:13px;border-bottom:1px solid #8b1a1a;padding-bottom:4px;margin:16px 0 8px;color:#8b1a1a;text-transform:uppercase;letter-spacing:1px">${section.label}</h3>`;
    for (const unit of sUnits) {
      const profile = BC_DATA.units[unit.unitId];
      if (!profile) continue;
      let unitCost = profile.costPerModel * unit.qty;
      const upgNames = [];
      for (const [upId, enabled] of Object.entries(unit.upgrades)) {
        if (!enabled) continue;
        const upg = profile.upgrades?.find(u => u.id === upId);
        if (!upg) continue;
        upgNames.push(upg.name);
        if (upg.type === 'model') unitCost += (upg.costPerModel||0) * unit.qty;
        else unitCost += upg.cost || 0;
      }
      unitsHTML += `<div style="background:#fdf5de;border:1px solid #d4bc7c;border-radius:3px;padding:8px 12px;margin-bottom:6px;page-break-inside:avoid">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-family:Cinzel,serif;font-size:12px;font-weight:700;color:#1a1208">${profile.name}</span>
          <span style="font-family:Cinzel,serif;font-size:11px;color:#b8860b;font-weight:700">${unitCost} FP</span>
        </div>
        <div style="font-size:10px;color:#7f6f5a;margin-top:2px">${unit.qty} models · ${profile.experienceLevel} · ${profile.arms}</div>
        <div style="font-size:10px;margin-top:3px"><strong>Shoot:</strong> ${profile.shoot} &nbsp;<strong>Melee:</strong> ${profile.melee} &nbsp;<strong>Resolve:</strong> ${profile.resolve}</div>
        ${profile.specialRules?.length ? `<div style="font-size:10px;margin-top:3px;color:#6b1414"><em>Rules: ${profile.specialRules.join(', ')}</em></div>` : ''}
        ${upgNames.length ? `<div style="font-size:10px;margin-top:2px;color:#3d2b1f"><strong>Upgrades:</strong> ${upgNames.join(', ')}</div>` : ''}
      </div>`;
    }
  }

  const selectedChars = Object.entries(State.characters).filter(([,v]) => v);

  // Ships HTML
  let shipsHTML = '';
  if (State.ships.length) {
    shipsHTML = `<h3 style="font-family:Cinzel,serif;font-size:13px;border-bottom:1px solid #8b1a1a;padding-bottom:4px;margin:16px 0 8px;color:#8b1a1a;text-transform:uppercase;letter-spacing:1px">⚓ Ships</h3>`;
    for (const ship of State.ships) {
      const profile = BC_DATA.ships[ship.shipId];
      if (!profile) continue;
      let cost = profile.cost;
      const opts = [];
      for (const [optName, enabled] of Object.entries(ship.options)) {
        if (!enabled) continue;
        const opt = profile.options?.find(o => o.name === optName);
        if (opt) { opts.push(opt.name); cost += opt.cost || 0; }
      }
      shipsHTML += `<div style="background:#fdf5de;border:1px solid #d4bc7c;border-radius:3px;padding:8px 12px;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-family:Cinzel,serif;font-size:12px;font-weight:700">⚓ ${profile.name}</span>
          <span style="font-family:Cinzel,serif;font-size:11px;color:#b8860b;font-weight:700">${cost} FP</span>
        </div>
        <div style="font-size:10px;margin-top:2px">Size ${profile.size} · Hull ${profile.hullSave} · Top ${profile.topSpeed} · Turn ${profile.turn} · Draft ${profile.draft}</div>
        <div style="font-size:10px;margin-top:2px;color:#6b1414"><em>${profile.specialRules.join(', ')}</em></div>
        ${opts.length ? `<div style="font-size:10px">Options: ${opts.join(', ')}</div>` : ''}
      </div>`;
    }
  }

  win.document.write(`<!DOCTYPE html><html><head>
    <title>Blood &amp; Crowns — ${State.companyName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>body{font-family:'Crimson Text',Georgia,serif;margin:0;padding:20px;color:#1a1208;background:white;font-size:12px}@page{size:A4;margin:1.5cm}@media print{body{padding:0}}</style>
  </head><body>
    <div style="background:linear-gradient(135deg,#8b1a1a,#3d2b1f);color:#f4e8c1;padding:20px 25px;border-radius:4px;margin-bottom:16px">
      <div style="font-family:Cinzel,serif;font-size:8px;letter-spacing:4px;text-transform:uppercase;opacity:0.8;margin-bottom:4px">Force Roster</div>
      <h1 style="font-family:Cinzel,serif;font-size:22px;font-weight:900;margin:0 0 6px;letter-spacing:2px">${State.companyName}</h1>
      <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:11px;opacity:0.9">
        <span><strong>Faction:</strong> ${faction?.name || '—'}</span>
        <span><strong>Company:</strong> ${cl?.name || '—'}${cl?.subtitle ? ` — ${cl.subtitle}` : ''}</span>
        <span style="margin-left:auto"><strong>Force Points:</strong> ${Computed.totalCost()} / ${State.forcePts}</span>
      </div>
    </div>
    <h3 style="font-family:Cinzel,serif;font-size:13px;border-bottom:1px solid #8b1a1a;padding-bottom:4px;margin:0 0 8px;color:#8b1a1a;text-transform:uppercase;letter-spacing:1px">Command Unit</h3>
    ${leader ? `<div style="background:#fdf5de;border:1px solid #d4bc7c;border-radius:3px;padding:8px 12px;margin-bottom:6px">
      ${State.legendaryLeader ? `<div style="font-family:Cinzel,serif;font-size:11px;color:#8b1a1a;font-weight:700;margin-bottom:4px">⚜ ${BC_DATA.legendaryLeaders[State.legendaryLeader].name} (+${BC_DATA.legendaryLeaders[State.legendaryLeader].cost} FP)</div>` : ''}
      <div style="display:flex;justify-content:space-between">
        <span style="font-family:Cinzel,serif;font-size:12px;font-weight:700">${leader.name} Retinue (${State.retinueSize} models)</span>
        <span style="font-family:Cinzel,serif;font-size:11px;color:#b8860b;font-weight:700">${Computed.retinueCost() + Computed.legendaryCost()} FP</span>
      </div>
      <div style="font-size:10px;margin-top:3px"><strong>Shoot:</strong> ${leader.shoot} &nbsp;<strong>Melee:</strong> ${leader.melee} &nbsp;<strong>Resolve:</strong> ${leader.resolve} &nbsp;<strong>CP:</strong> ${leader.commandPoints} &nbsp;<strong>Range:</strong> ${leader.commandRange}</div>
      <div style="font-size:10px;margin-top:2px;color:#6b1414"><em>Rules: ${leader.specialRules?.join(', ') || '—'}</em></div>
    </div>` : ''}
    ${unitsHTML}
    ${shipsHTML}
    ${selectedChars.length ? `
    <h3 style="font-family:Cinzel,serif;font-size:13px;border-bottom:1px solid #8b1a1a;padding-bottom:4px;margin:16px 0 8px;color:#8b1a1a;text-transform:uppercase;letter-spacing:1px">Characters</h3>
    ${selectedChars.map(([charId]) => {
      const char = BC_DATA.characters[charId];
      return char ? `<div style="font-size:11px;padding:4px 0;border-bottom:1px solid #e8d5a0">
        <strong>${char.name}</strong> (+${char.cost} FP) — <em>${char.specialRules.join(', ')}</em>
        <span style="color:#7f6f5a;margin-left:6px;font-size:10px">${char.restrictions}</span>
      </div>` : '';
    }).join('')}` : ''}
    <div style="margin-top:20px;background:#1a1208;color:#f4e8c1;padding:10px 16px;border-radius:3px;display:flex;justify-content:space-between">
      <span style="font-family:Cinzel,serif;font-size:11px;letter-spacing:1px;text-transform:uppercase">Total Force Points</span>
      <span style="font-family:Cinzel,serif;font-size:18px;font-weight:700;color:#f5c842">${Computed.totalCost()} <span style="font-size:12px;color:#d4a017">/ ${State.forcePts}</span></span>
    </div>
    <div style="margin-top:12px;text-align:center;font-size:9px;color:#7f6f5a;font-style:italic">Blood &amp; Crowns Force Builder · Generated ${new Date().toLocaleDateString()}</div>
    <script>window.onload=()=>window.print();<\/script>
  </body></html>`);
  win.document.close();
}

// ============================================================
// MAIN RENDER + INIT
// ============================================================
function render() {
  renderFPBar();
  renderSidebar();
  renderMain();
}

document.addEventListener('DOMContentLoaded', () => render());
