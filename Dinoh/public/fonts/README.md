# Roche Sans Fonts

Lege hier die offiziellen Roche Sans `.woff2`-Dateien aus dem RDS ab.

## Erwartete Dateinamen

- `RocheSans-Regular.woff2` (400)
- `RocheSans-Medium.woff2` (500)
- `RocheSans-SemiBold.woff2` (600)
- `RocheSans-Bold.woff2` (700)

Optional (für Headlines / Serif):
- `RocheSerif-Regular.woff2` (400)
- `RocheSerif-Bold.woff2` (700)

## Woher

1. Auf https://rdesignsystem.roche.com einloggen (Google SSO mit Roche-Account)
2. Bereich **Foundations → Typography** oder **Developers → Assets/Fonts** öffnen
3. Roche Sans als `.woff2` herunterladen
4. Dateien hierhin kopieren — fertig

Die `@font-face`-Regeln liegen schon in `Dinoh/src/styles.css` und zeigen auf `/fonts/...`.
