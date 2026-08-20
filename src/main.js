import * as THREE from 'three';

import {
    CSS3DRenderer,
    CSS3DObject
} from 'three/addons/renderers/CSS3DRenderer.js';

import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import * as TWEEN from '@tweenjs/tween.js';

import './style.css';


// ======================================================
// GOOGLE CONFIGURATION
// ======================================================

// IMPORTANT:
// Replace these values with your own values.

const CLIENT_ID =
    '1091210150082-mj1pptp0eh9jnoik16trsdnj0o7vmq2v.apps.googleusercontent.com';

const SPREADSHEET_ID =
    '1OwOkYFI8hKsak14uRW8aBH-qhNyFpEWpSAZ4GpR50C4';


// Your Google Sheet tab name
const SHEET_NAME = 'Data Template';


// ======================================================
// GOOGLE VARIABLES
// ======================================================

let gisReady = false;


// ======================================================
// 3D OBJECT STORAGE
// ======================================================

const objects = [];

const targets = {
    table: [],
    sphere: [],
    helix: [],
    grid: []
};


// ======================================================
// LOAD GOOGLE API CLIENT
// ======================================================

function loadScript(src) {

    return new Promise((resolve, reject) => {

        const script =
            document.createElement('script');

        script.src = src;

        script.onload = resolve;

        script.onerror = reject;

        document.head.appendChild(script);

    });

}


// ======================================================
// INITIALIZE GOOGLE API
// ======================================================

async function initializeGoogle() {

    try {

        // Load Google Identity Services
        await loadScript(
            'https://accounts.google.com/gsi/client'
        );

        google.accounts.id.initialize({

            client_id: CLIENT_ID,

            callback: handleGoogleLogin

        });

        google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'center'
        }
    );

        gisReady = true;

        console.log(
            'Google Sign-In initialized successfully.'
        );

    } catch (error) {

        console.error(
            'Google initialization failed:',
            error
        );

        setLoginStatus(
            'Failed to initialize Google services.'
        );

    }

}


function handleGoogleLogin(response) {

    console.log(
        'Google login successful.'
    );

    setLoginStatus(
        'Google login successful. Loading data...'
    );

    loadSpreadsheetData();

}


// ======================================================
// LOGIN STATUS
// ======================================================

function setLoginStatus(message) {

    document
        .getElementById('loginStatus')
        .textContent = message;

}


// ======================================================
// GET GOOGLE SHEET DATA
// ======================================================

async function loadSpreadsheetData() {

    try {

        const url =
            `https://sheets.googleapis.com/v4/spreadsheets/` +
            `${SPREADSHEET_ID}/values/` +
            `${encodeURIComponent(SHEET_NAME + '!A:F')}` +
            `?key=${API_KEY}`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                `Google Sheets request failed: ${response.status}`
            );

        }

        const data =
            await response.json();

        const rows =
            data.values;

        if (!rows || rows.length === 0) {

            console.error(
                'No spreadsheet data found.'
            );

            setLoginStatus(
                'No data found in Google Sheet.'
            );

            return;
        }

        console.log(
            'Raw Google Sheet data:',
            rows
        );

        const people =
            convertRowsToPeople(rows);

        console.log(
            'People loaded:',
            people
        );

        console.log(
            `Total people: ${people.length}`
        );

        // Hide login screen
        document
            .getElementById('loginScreen')
            .style.display = 'none';

        // Create the 3D cards
        createPeopleCards(people);

    } catch (error) {

        console.error(
            'Google Sheets error:',
            error
        );

        setLoginStatus(
            'Unable to read Google Sheet.'
        );

    }

}


// ======================================================
// CONVERT SHEET ROWS
// ======================================================

function convertRowsToPeople(rows) {

    // Remove header row
    const dataRows =
        rows.slice(1);


    return dataRows.map((row) => {

        return {

            name: row[0] || '',

            photo: row[1] || '',

            age: Number(row[2]) || 0,

            country: row[3] || '',

            interest: row[4] || '',

            netWorth:
                parseNetWorth(row[5])

        };

    });

}


// ======================================================
// CONVERT NET WORTH
// ======================================================

function parseNetWorth(value) {

    if (typeof value === 'number') {

        return value;

    }


    if (!value) {

        return 0;

    }


    // Remove $, commas and spaces
    return Number(
        String(value)
            .replace(/[$, ]/g, '')
    );

}


// ======================================================
// CREATE PERSON CARDS
// ======================================================

function createPeopleCards(people) {

    console.log(
        `Creating ${people.length} cards...`
    );


    people.forEach((person, index) => {

        createPersonCard(
            person,
            index
        );

    });


    // Create the required 20 × 10 table
    createTableTargets();


    // Start in Table layout
    transformToTable();
}


// ======================================================
// CREATE ONE PERSON CARD
// ======================================================

function createPersonCard(
    person,
    index
) {

    const card =
        document.createElement('div');


    card.className =
        'person-card';

    // Set card colour based on Net Worth
    card.style.background =
        getNetWorthColor(person.netWorth);


    // Photo
    const photo =
        document.createElement('img');


    photo.className =
        'person-photo';


    photo.src =
        person.photo;


    photo.alt =
        person.name;


    // Name
    const name =
        document.createElement('div');


    name.className =
        'name';


    name.textContent =
        person.name;


    // Age
    const age =
        document.createElement('div');


    age.className =
        'details';


    age.textContent =
        `Age: ${person.age}`;


    // Country
    const country =
        document.createElement('div');


    country.className =
        'details';


    country.textContent =
        `Country: ${person.country}`;


    // Interest
    const interest =
        document.createElement('div');


    interest.className =
        'details';


    interest.textContent =
        `Interest: ${person.interest}`;


    // Net Worth
    const netWorth =
        document.createElement('div');


    netWorth.className =
        'details';


    netWorth.textContent =
        `Net Worth: $${person.netWorth.toLocaleString(
            'en-US',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;


    // Put everything inside card
    card.appendChild(photo);

    card.appendChild(name);

    card.appendChild(age);

    card.appendChild(country);

    card.appendChild(interest);

    card.appendChild(netWorth);


    // Create 3D object
    const object =
      new CSS3DObject(card);


    // Start all cards at the center
      object.position.set(
      0,
      0,
      0
);


// Add the object to the Three.js scene
scene.add(object);


// Store the object
objects.push(object);

}


// ======================================================
// NET WORTH COLOUR
// ======================================================

function getNetWorthColor(netWorth) {

    if (netWorth < 100000) {

        return '#EF3022'; // Red

    }


    if (netWorth < 200000) {

        return '#FDCA35'; // Orange

    }


    return '#3A9F4B'; // Green

}


// ======================================================
// TABLE TARGETS
// 20 COLUMNS × 10 ROWS = 200 PEOPLE
// ======================================================

function createTableTargets() {

    targets.table = [];


    const columns = 20;

    const rows = 10;


    const spacingX = 155;

    const spacingY = 250;


    for (let i = 0; i < 200; i++) {

        const column =
            i % columns;


        const row =
            Math.floor(i / columns);


        const target =
            new THREE.Object3D();


        target.position.x =
            (column - (columns - 1) / 2)
            * spacingX;


        target.position.y =
            ((rows - 1) / 2 - row)
            * spacingY;


        target.position.z = 0;


        targets.table.push(target);

    }

}


// ======================================================
// SPHERE TARGETS
// 200 PEOPLE AROUND A SPHERE
// ======================================================

function createSphereTargets() {

    targets.sphere = [];

    const radius = 920;

    const vector = new THREE.Vector3();

    for (let i = 0; i < objects.length; i++) {

        const target = new THREE.Object3D();

        // Even distribution around sphere
        const phi = Math.acos(
            -1 + (2 * i) / objects.length
        );

        const theta =
            Math.sqrt(objects.length * Math.PI) * phi;

        vector.setFromSphericalCoords(
            radius,
            phi,
            theta
        );

        target.position.copy(vector);

        // Make each card face outward from the sphere
        target.lookAt(
            target.position.clone().multiplyScalar(2)
        );

        targets.sphere.push(target);
    }

    console.log(
        'Sphere targets created:',
        targets.sphere.length
    );
}


// ======================================================
// DOUBLE HELIX TARGETS
// 100 CARDS PER STRAND
// ======================================================

function createHelixTargets() {

    targets.helix = [];

    const radius = 1000;

    const cardsPerStrand = objects.length / 2;

    const verticalSpacing = 22;

    const angleStep = Math.PI / 12;

    const centerY = 0;


    for (let i = 0; i < objects.length; i++) {

        const target = new THREE.Object3D();

        // ------------------------------------------
        // Determine which strand this card belongs to
        // ------------------------------------------

        const strand =
            i < cardsPerStrand ? 0 : 1;

        const index =
            i % cardsPerStrand;


        // ------------------------------------------
        // Angle around the central axis
        // ------------------------------------------

        let theta =
            index * angleStep;


        // Second strand is 180 degrees opposite
        if (strand === 1) {
            theta += Math.PI;
        }


        // ------------------------------------------
        // Vertical position
        // ------------------------------------------

        const y =
            centerY
            - (index * verticalSpacing)
            + ((cardsPerStrand - 1) * verticalSpacing / 2);


        // ------------------------------------------
        // X / Z position
        // ------------------------------------------

        const x =
            radius * Math.sin(theta);

        const z =
            radius * Math.cos(theta);


        target.position.set(
            x,
            y,
            z
        );


        // ------------------------------------------
        // Make card face outward
        // ------------------------------------------

        const lookAtPosition =
            new THREE.Vector3(
                x * 2,
                y,
                z * 2
            );

        target.lookAt(
            lookAtPosition
        );


        targets.helix.push(
            target
        );

    }


    console.log(
        'Double Helix targets created:',
        targets.helix.length
    );

}


// ======================================================
// GRID TARGETS
// 5 × 4 × 10 = 200 CARDS
// ======================================================

function createGridTargets() {

    targets.grid = [];

    const columns = 5;
    const rows = 4;
    const depth = 10;

    const spacingX = 320;
    const spacingY = 300;
    const spacingZ = 350;

    for (let i = 0; i < objects.length; i++) {

        const target = new THREE.Object3D();

        // ------------------------------------------
        // Calculate 3D grid coordinates
        // ------------------------------------------

        const xIndex = i % columns;

        const yIndex =
            Math.floor(i / columns) % rows;

        const zIndex =
            Math.floor(
                i / (columns * rows)
            );


        // ------------------------------------------
        // Center the grid around the origin
        // ------------------------------------------

        const x =
            (xIndex - (columns - 1) / 2)
            * spacingX;

        const y =
            ((rows - 1) / 2 - yIndex)
            * spacingY;

        const z =
            (zIndex - (depth - 1) / 2)
            * spacingZ;


        target.position.set(
            x,
            y,
            z
        );


        // ------------------------------------------
        // Keep cards facing forward
        // ------------------------------------------

        target.rotation.set(
            0,
            0,
            0
        );


        targets.grid.push(
            target
        );
    }


    console.log(
        'Grid targets created:',
        targets.grid.length
    );

}


// ======================================================
// TRANSFORM TO GRID
// ======================================================

function transformToGrid() {

    console.log(
        'Transforming to GRID...'
    );

    console.log(
        'Objects:',
        objects.length
    );

    console.log(
        'Grid targets:',
        targets.grid.length
    );


    for (
        let i = 0;
        i < objects.length;
        i++
    ) {

        const object =
            objects[i];

        const target =
            targets.grid[i];


        if (!target) {

            console.error(
                'Missing Grid target:',
                i
            );

            continue;
        }


        // ------------------------------------------
        // Position animation
        // ------------------------------------------

        new TWEEN.Tween(
            object.position,
            true
        )

        .to(
            {
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            },
            2000
        )

        .easing(
            TWEEN.Easing.Exponential.InOut
        )

        .start();


        // ------------------------------------------
        // Rotation animation
        // ------------------------------------------

        new TWEEN.Tween(
            object.rotation,
            true
        )

        .to(
            {
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            },
            2000
        )

        .easing(
            TWEEN.Easing.Exponential.InOut
        )

        .start();

    }


    console.log(
        'GRID animation started.'
    );

}


// ======================================================
// TRANSFORM TO DOUBLE HELIX
// ======================================================

function transformToHelix() {

    console.log(
        'Transforming to DOUBLE HELIX...'
    );

    console.log(
        'Objects:',
        objects.length
    );

    console.log(
        'Helix targets:',
        targets.helix.length
    );


    for (
        let i = 0;
        i < objects.length;
        i++
    ) {

        const object =
            objects[i];

        const target =
            targets.helix[i];


        if (!target) {

            console.error(
                'Missing Helix target:',
                i
            );

            continue;

        }


        // ------------------------------------------
        // Position animation
        // ------------------------------------------

        new TWEEN.Tween(
            object.position,
            true
        )

        .to(
            {
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            },
            2000
        )

        .easing(
            TWEEN.Easing.Exponential.InOut
        )

        .start();


        // ------------------------------------------
        // Rotation animation
        // ------------------------------------------

        new TWEEN.Tween(
            object.rotation,
            true
        )

        .to(
            {
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            },
            2000
        )

        .easing(
            TWEEN.Easing.Exponential.InOut
        )

        .start();

    }


    console.log(
        'DOUBLE HELIX animation started.'
    );

}


// ======================================================
// TRANSFORM TO SPHERE
// ======================================================

function transformToSphere() {

    console.log('Transforming to SPHERE...');

    console.log(
        'Objects:',
        objects.length
    );

    console.log(
        'Sphere targets:',
        targets.sphere.length
    );

    for (let i = 0; i < objects.length; i++) {

        const object = objects[i];

        const target = targets.sphere[i];

        if (!target) {
            console.error(
                'Missing sphere target:',
                i
            );
            continue;
        }

        // Position animation
        new TWEEN.Tween(
            object.position,
            true
        )
        .to(
            {
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            },
            2000
        )
        .easing(
            TWEEN.Easing.Exponential.InOut
        )
        .start();


        // Rotation animation
        new TWEEN.Tween(
            object.rotation,
            true
        )
        .to(
            {
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            },
            2000
        )
        .easing(
            TWEEN.Easing.Exponential.InOut
        )
        .start();

    }

    console.log(
        'SPHERE animation started.'
    );
}


// ======================================================
// TRANSFORM TO TABLE
// ======================================================

function transformToTable() {

    console.log('Transforming to TABLE...');
    console.log('Objects:', objects.length);
    console.log('Targets:', targets.table.length);

    for (let i = 0; i < objects.length; i++) {

        const object = objects[i];
        const target = targets.table[i];

        if (!target) {
            console.error(`Missing target for object ${i}`);
            continue;
        }

        // Animate position
        new TWEEN.Tween(object.position, true)
            .to(
                {
                    x: target.position.x,
                    y: target.position.y,
                    z: target.position.z
                },
                1500
            )
            .easing(
                TWEEN.Easing.Exponential.InOut
            )
            .start();

        // Animate rotation
        new TWEEN.Tween(object.rotation, true)
            .to(
                {
                    x: 0,
                    y: 0,
                    z: 0
                },
                1500
            )
            .easing(
                TWEEN.Easing.Exponential.InOut
            )
            .start();

    }

    console.log(
        'TABLE animation started.'
    );
}


// ======================================================
// TABLE BUTTON
// ======================================================

document
    .getElementById('tableButton')
    .addEventListener(
        'click',
        () => {

            transformToTable();

        }
    );


// ======================================================
// SPHERE BUTTON
// ======================================================

document
    .getElementById('sphereButton')
    .addEventListener(
        'click',
        () => {

            // Create sphere positions
            createSphereTargets();

            // Move cards to sphere
            transformToSphere();

        }
    );


// ======================================================
// HELIX BUTTON
// ======================================================

document
    .getElementById('helixButton')
    .addEventListener(
        'click',
        () => {

            createHelixTargets();

            transformToHelix();

        }
    );


// ======================================================
// GRID BUTTON
// ======================================================

document
    .getElementById('gridButton')
    .addEventListener(
        'click',
        () => {

            createGridTargets();

            transformToGrid();

        }
    );


// ======================================================
// THREE.JS SCENE
// ======================================================

const scene =
    new THREE.Scene();


// ======================================================
// CAMERA
// ======================================================

const camera =
    new THREE.PerspectiveCamera(
        40,
        window.innerWidth /
            window.innerHeight,
        1,
        10000
    );


camera.position.z = 3300;


// ======================================================
// CSS3D RENDERER
// ======================================================

const renderer =
    new CSS3DRenderer();


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


document
    .getElementById('app')
    .appendChild(
        renderer.domElement
    );


// ======================================================
// CAMERA CONTROLS
// ======================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


// Allow rotation
controls.enableRotate = true;
controls.rotateSpeed = 0.35;


// Allow zoom
controls.enableZoom = true;


// Allow panning
controls.enablePan = true;


// Smooth camera movement
controls.enableDamping = true;

controls.dampingFactor = 0.05;


// ======================================================
// ANIMATION
// ======================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    // Update TWEEN animation
    TWEEN.update();

    // Update camera
    controls.update();

    // Render
    renderer.render(
        scene,
        camera
    );

}


// ======================================================
// WINDOW RESIZE
// ======================================================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// ======================================================
// START GOOGLE
// ======================================================

animate();

initializeGoogle();
