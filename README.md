# ProtoPhish
ProtoPhish ist ein Node.js-basiertes Gamification Projekt, das Express.js und SQLite3 verwendet.

## Änderungen nach der Abgabe

### Datenbankkorrektur am [29.09.2024]
- **Fehlerbeschreibung**: Am [28.09.2024] wurden versehentlich falsche `max_points`-Werte in der `Training`-Tabelle eingetragen.
- **Änderung**: Die fehlerhaften Werte wurden korrigiert, um die Badge-Funktion zu gewährleisten.
- **Auswirkungen**: Obwohl die Programmlogik selbst nicht verändert wurde, hatte der Fehler Einfluss auf die Funktionalität der Badges. Die Korrektur stellt die beabsichtigte Funktionalität wieder her.
- **Transparenzhinweis**: Die fehlerhafte Version der SQLite-Datenbank ist weiterhin in der Commit-Historie einsehbar (siehe Commit `335659a`) und würde zusätzlich dem Root Verzeichnis hinzugefügt.


## Voraussetzungen
Stelle sicher, dass folgende Software auf deinem System installiert ist:

- [Node.js](https://nodejs.org/) (empfohlen: Version 14.x oder höher)
- [npm](https://www.npmjs.com/) (wird normalerweise mit Node.js installiert)
- SQLite3 (optional, falls du es direkt auf dem System verwenden möchtest)

## Installation

### 1. Repository klonen
```bash
git clone https://github.com/sophie4075/ProtoPhisg.git
```

### 2. In das Projektverzeichnis wechseln
```bash
cd ProtoPhish/Server
```

### Dependencies installieren
```bash
npm install
```

### Server starten
```bash
node app.js
```
### Anwendung im Browser ausprobieren 😊
```bash
http://localhost:5001/
```

Es kann jederzeit ein neuer User Registriert werden. Nach jeder Regestrierung wird man zum Login redirected. Dann bitte mit den gewählten Credentials einloggen :)


## Anmerkung
Es handelt sich bei dieser Anwendung um einen Prototypen. Die Badges stehen derzeit nur eingeschränkt zur Verfügung (ohne Images). 
