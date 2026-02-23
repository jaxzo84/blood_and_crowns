# Blood & Crowns Force Builder

A web-based force builder for the **Blood & Crowns** miniatures wargame — the medieval sister game of *Blood & Plunder*, covering the Hundred Years' War and related conflicts.

## Features

- **All Factions** — England/Wales/Ireland, France, Scotland, Spanish Kingdoms, Unaligned
- **All Company Lists** — 12 company lists with their correct unit restrictions
- **All Unit Profiles** — Complete stats, costs, min/max models for every unit type
- **All Upgrades** — Armor, weapons, special options per unit
- **Legendary Leaders** — Edward the Black Prince, Henry V, Joan of Arc, Robert the Bruce, and more
- **Characters** — Banner Bearer, Grizzled Veteran, Knight Bachelor, Musician, Ship's Constable, Vintenar
- **Army Validation** — Real-time checks for Main Battle / Vanguard / Reserve limits
- **Force Points Tracker** — Live running total with visual bar
- **Export to TXT** — Nicely formatted plain-text roster
- **Export to PDF** — Print-ready PDF with medieval styling (opens in new window for browser print)
- **Medieval Aesthetic** — Parchment-inspired design matching the Blood & Crowns rulebook style

## How to Use

1. Open `index.html` in a web browser (no server required — works as a local file)
2. Set your **Force Points** limit
3. Select a **Faction** and **Company List**
4. Choose a **Leader type** and set retinue size & upgrades
5. Add **Main Battle**, **Vanguard**, and **Reserve** units
6. Optionally add **Characters**
7. Export to TXT or PDF

## Company Building Rules (quick reference)

- Must have **1 Command Unit** (Leader + Retinue)
- Must have **at least 2 Main Battle units**
- **Vanguard**: 1 unit per 2 Main Battle units
- **Reserve**: 1 unit per 3 Main Battle units

## File Structure

```
blood-crowns-builder/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles (medieval parchment theme)
├── js/
│   ├── data.js         # All game data (units, factions, company lists)
│   └── app.js          # Application logic
└── README.md
```

## Factions Included

| Faction | Company Lists |
|---------|--------------|
| England, Wales & Ireland | English Army Crecy to Poitiers (1345-56), English Army in Scotland, English Army Agincourt to Orléans (1415-44) |
| France | French Army Crecy to Poitiers, French Army Agincourt to Orléans, French Army Orléans & Loire (1428-29) |
| Scotland | Scottish Army Wars of Independence, Scottish Raiders, Scottish Army 1419 French Expedition |
| Spanish Kingdoms | Forces of Pedro de Castilla (Castilian Civil War), Forces of Enrique de Trastámara |
| Unaligned | Free Company, Routiers, Pirate/Merchant Crew |

## Unit Types Covered

**Men-at-Arms:** Afoot (Trained & Veteran), Mounted (Trained & Veteran), Esquires  
**Light Cavalry:** Hobelars, Jinetes  
**Archers:** Archers, English Archers (Trained & Veteran), Welsh Archers  
**Crossbowmen:** Light, Heavy, Genoese  
**Footmen:** Feudal Levy, Footmen, Veteran Footmen, Galloglass, Kern, Pikemen, Slingers  
**Naval:** Able Seamen, Mariners, Ship's Boys  

## Deployment & Hosting on GitHub

1. Create a new GitHub repository
2. Upload all files (preserving the folder structure)
3. Go to **Settings → Pages** → set source to `main` branch, root folder
4. Your builder will be live at `https://yourusername.github.io/repository-name/`

## Based On

*Blood & Crowns* by Eric Hansen, developed from the *Blood & Plunder* system by Mike Tuñez.  
This is an unofficial, fan-made tool. All game content belongs to Firelock Games.

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Edge, Safari). No build process required — pure HTML/CSS/JavaScript.
