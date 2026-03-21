# Mans Templis — Ikdienas Ieradumu Tracker v2.0

Personīga PWA aplikācija ikdienas ieradumu izsekošanai ar dark theme dizainu.

## Funkcijas

**Core Tracking**
- Pozitīvo un negatīvo ieradumu izsekošana
- Checkmark un numeric (minūtes, gabali, u.c.) ieradumu tipi
- Datuma navigācija — atzīmē arī iepriekšējās dienas
- Streak kalkulācija katram ieradumam un kopēji
- Pilna ieradumu pārvaldība — pievieno, rediģē, dzēs

**Statistika**
- Mēneša pārskats ar progress bariem
- Detalizēta vēsture katram ieradumam
- Mēnešu navigācija

**Premium Grafiki (👑)**
- 30 dienu tendences līniju grafiks (Chart.js)
- Ieradumu veiktspējas salīdzinājums
- 12 nedēļu aktivitātes heatmap
- Labāko dienu analīze pa nedēļas dienām
- Ieradumu korelāciju analīze (phi koeficients)
- Personiskie rekordi

**Datu pārvaldība**
- JSON eksports/imports
- Noklusējumu atjaunošana
- Pilna datu dzēšana

## Tehnoloģijas

- Vanilla HTML/CSS/JS (nav build process)
- Chart.js grafiku vizualizācijai
- Inter fonts
- PWA ar Service Worker (offline atbalsts)
- localStorage datu glabāšanai

## Datu formāts (localStorage)

- `customHabits` — ieradumu definīcijas `{good: [...], bad: [...]}`
- `tracking:YYYY-MM-DD` — dienas dati `{habitId: value, ...}`
- `templis_premium` — premium statuss

## Instalācija

### GitHub Pages (ieteicams)
1. Push uz GitHub
2. Settings → Pages → ieslēdz GitHub Pages
3. Atver URL telefonā un instalē kā PWA

### Lokāli
```bash
python3 -m http.server 8000
# Atver http://localhost:8000
```

## Failu struktūra
```
├── index.html       — galvenā aplikācija
├── manifest.json    — PWA konfigurācija
├── sw.js            — service worker
├── icon-192.png     — mazā ikona
└── icon-512.png     — lielā ikona
```

---
Templis v2.0 · Opus Edition
