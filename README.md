# Kasatria 3D Visualization

An interactive 3D data visualization web application built with Three.js. The application retrieves data from Google Sheets after Google authentication and presents 200 data records in multiple interactive 3D layouts.

## Features

- Google Sign-In authentication
- Google OAuth authentication for accessing the application
- Retrieves data from Google Sheets using the Google Sheets API
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
- Smooth animated transitions between layouts
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
- Google OAuth / Google Identity Services

## Visualization Layouts

### Table

Arranges the 200 data elements into a 20 × 10 table layout.

### Sphere

Arranges the 200 data elements around a 3D spherical structure.

### Double Helix

Arranges the 200 data elements into a double helix structure instead of the default single helix.

### Grid

Arranges the 200 data elements into a 5 × 4 × 10 3D grid.

## Authentication

The application uses Google Sign-In through Google Identity Services.

After successful authentication, the application retrieves the required data from the connected Google Sheet and generates the 3D visualization.

The application is configured for production use through Google Cloud OAuth.

## Data Source

The visualization data is retrieved from a Google Sheet using the Google Sheets API.

The dataset contains 200 records and includes information such as:

- Name
- Photo
- Age
- Country
- Interest
- Net Worth

## Net Worth Colour Coding

Each card is assigned a background colour according to the person's Net Worth:

| Net Worth | Colour |
|---|---|
| < $100K | Red |
| $100K–$200K | Orange |
| > $200K | Green |

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
├── vite.config.js
└── .gitignore
