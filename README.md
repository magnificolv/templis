# Manis Templis - PWA Instalācijas Instrukcijas

## 📱 Kā instalēt Android ierīcē

### Variants 1: Izmantojot Web Hostingu

1. **Augšupielādē visus failus** uz web serveri:
   - index.html
   - manifest.json
   - sw.js
   - icon-192.png
   - icon-512.png

2. **Atver lapu Chrome pārlūkā** (nevis file://)
   - Piemēram: https://tavs-domens.lv/templis/

3. **Uzvedne parādīsies** automātiski pēc pāris sekundēm
   - Vai arī Chrome izvēlnē (⋮) → "Instalēt aplikāciju"

4. **Nospied "Instalēt"** un aplikācija būs sākuma ekrānā!

### Variants 2: Izmantojot Lokālu Serveri (Testēšanai)

```bash
# Terminālī, failu direktorijā:
python3 -m http.server 8000

# Tad telefonā atver:
http://TAVA-DATORA-IP:8000
```

### Variants 3: GitHub Pages (Bezmaksas)

1. Izveido GitHub repo
2. Augšupielādē visus failus
3. Settings → Pages → Ieslēdz GitHub Pages
4. Atver ģenerēto URL telefonā

### Variants 4: Netlify Drop (Vienkāršākais!)

1. Apmeklē https://app.netlify.com/drop
2. Ievilc visus failus (index.html, manifest.json, sw.js, icon-192.png, icon-512.png)
3. Saņem linku
4. Atver linku telefonā un instalē!

## ⚠️ SVARĪGI

- **PWA NESTRĀDĀ ar file:// protokolu** - vajag HTTP/HTTPS serveri
- **Vajag Chrome vai Edge** pārlūku Android ierīcē
- Pēc instalācijas aplikācija strādā offline!
- Visi dati tiek glabāti vienīgi tavā ierīcē

## 🧪 Kā pārbaudīt vai PWA ir gatavs

Chrome DevTools → Application tab:
- ✅ Manifest should be valid
- ✅ Service Worker should be registered
- ✅ Icons should be loaded

## 📂 Failu Struktūra

```
/
├── index.html          (galvenā lapa)
├── manifest.json       (PWA konfigurācija)
├── sw.js              (service worker)
├── icon-192.png       (maza ikona)
└── icon-512.png       (liela ikona)
```

Visi faili jāglabā VIENĀ direktorijā!
