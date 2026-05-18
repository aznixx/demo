# StayNL

StayNL is a hand-built Dutch hotel directory prototype using HTML, CSS, and vanilla JavaScript only.

## Structure

```text
staynl/
├── index.html
├── results.html
├── hotel.html
├── destination.html
├── about.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   └── pages/
│       ├── home.css
│       ├── results.css
│       └── hotel.css
├── js/
│   ├── hotels.js
│   ├── search.js
│   ├── filters.js
│   └── ui.js
```

Additional page CSS files support the populated destination and about pages.

## Run

```powershell
cd staynl
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.
