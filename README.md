# Kasatria 3D Visualization

An interactive 3D data visualization web application built with Three.js. The application retrieves data from Google Sheets and presents 200 data records in multiple interactive 3D layouts.

## Features

- Google authentication for secure access
- Retrieves data from Google Sheets
- Displays 200 data records
- Interactive 3D visualization using Three.js
- Four visualization layouts:
  - Table
  - Sphere
  - Double Helix
  - Grid
- Background colours based on Net Worth:
  - Red: < $100K
  - Orange: $100K–$200K
  - Green: > $200K
- Interactive layout switching
- Responsive 3D visualization

## Data Fields

Each visualization element contains:

- Name
- Photo
- Age
- Country
- Interest
- Net Worth

## Technologies

- HTML5
- CSS3
- JavaScript
- Three.js
- Vite
- Google Sheets API
- Google OAuth

## Visualization Layouts

### Table

Arranges the data into a 20 × 10 table layout.

### Sphere

Arranges the data elements around a 3D spherical structure.

### Double Helix

Arranges the data elements into a double helix structure.

### Grid

Arranges the data into a 5 × 4 × 10 3D grid.

## Live Demo

https://kasatria-3d-visualization-self.vercel.app

## Project Structure

```text
Kasatria-3D-Visualization/
├── public/
├── src/
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
└── .gitignore
