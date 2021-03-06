let appSettings = {
    soundOn: true
};

let ship;
let asteroides;
let plusOnes = [];
let bonuses = [];
let R;
let score;
let best;
let last;
let shotSounds;
let explosionShounds;
let gameOverSound;
let crazyEngineSound;
let thrustSound;
let highScoreSound;
let nbAsteroides;

const itemNames = {
    best: 'statox-asteroides-best'
};

function customResizeCanvas() {
    const dim = Math.min(windowHeight, windowWidth) * 0.8;
    R = (dim * 0.95) / 2;
    resizeCanvas(dim, dim);
}

function generateAsteroides() {
    asteroides = [];
    for (let _ = 0; _ < nbAsteroides; _++) {
        let pos = p5.Vector.random2D();
        pos.setMag(R * random());
        while (pos.dist(ship.pos) < 250) {
            pos = p5.Vector.random2D();
            pos.setMag(R * random() || 0.1);
        }
        asteroides.push(new Asteroide(pos));
    }
}

function resetGame() {
    if (score > best) {
        best = score;
        storeItem(itemNames.best, score);
    }
    last = score;
    score = 0;
    ship = new Ship();
    nbAsteroides = 0;
    generateAsteroides();
}

function preload() {
    soundFormats('mp3', 'm4a');
    const baseUrl = 'https://raw.githubusercontent.com/statox/asteroides/master/assets';
    // const baseUrl = '../assets';
    shotSounds = [];
    try {
        shotSounds.push(loadSound(`${baseUrl}/shot_1.mp3`));
        shotSounds.push(loadSound(`${baseUrl}/shot_2.mp3`));
        shotSounds.push(loadSound(`${baseUrl}/Shot_3.m4a`));
        shotSounds.push(loadSound(`${baseUrl}/Shot_21.m4a`));
        shotSounds.push(loadSound(`${baseUrl}/Shot_22.m4a`));
        shotSounds.push(loadSound(`${baseUrl}/Shot_23.m4a`));

        explosionShounds = [];
        explosionShounds.push(loadSound(`${baseUrl}/Boum_1.m4a`));
        explosionShounds.push(loadSound(`${baseUrl}/Boum_2.m4a`));
        explosionShounds.push(loadSound(`${baseUrl}/Boum_3.m4a`));

        gameOverSound = loadSound(`${baseUrl}/Game_over.m4a`);

        crazyEngineSound = loadSound(`${baseUrl}/Wooah.m4a`);

        highScoreSound = loadSound(`${baseUrl}/Highscore.m4a`);
    } catch (e) {
        console.error("Couldn't load all the sounds");
        console.error(e);
    }

    noLoop();
}

function setup() {
    app = new Vue({
        el: '#appDiv',
        data: appSettings
    });

    // Create the canvas and put it in its div
    const myCanvas = createCanvas(800, 800);
    customResizeCanvas();
    myCanvas.parent('canvasDiv');

    initInterface();

    try {
        best = Number(getItem(itemNames.best));
    } catch (e) {
        console.error('Could not get best score from local storage');
        best = 0;
    }
    score = 0;
    last = 0;
    resetGame();
}

function draw() {
    background(0);
    getInput();

    const boundaries = new Rectangle(0, 0, width, height);
    const capacity = 4;
    asteroidesQTree = new QuadTree(boundaries, capacity);

    push();
    translate(width / 2, height / 2);
    fill(5);
    circle(0, 0, R * 2);

    let i = plusOnes.length;
    while (i > 0) {
        i--;
        const p = plusOnes[i];
        if (p.ttl <= 0) {
            plusOnes.splice(i, 1);
        } else {
            p.move();
            p.draw();
        }
    }

    ship.move();
    ship.updateShots();
    ship.draw();

    ship.shots.forEach((s) => s.move());
    ship.shots.forEach((s) => s.draw());

    const shipVertexes = ship.vertexes.map((v) => p5.Vector.add(v, ship.pos));
    asteroides.forEach((a) => {
        a.move();
        a.draw();

        const asteroideVertexes = a.vertexes.map((v) => p5.Vector.add(v, a.pos));
        if (collidePolyPoly(shipVertexes, asteroideVertexes, true)) {
            ship.hit();
            a.hit = true;
            if (ship.lives === 0) {
                if (score > best) {
                    playSound(highScoreSound);
                } else {
                    playSound(gameOverSound);
                }
                resetGame();
            }
        }

        ship.shots.forEach((s) => {
            const hit = collidePointPoly(s.pos.x, s.pos.y, asteroideVertexes);
            if (hit) {
                a.hit = true;
                s.hit = true;
                score++;

                if (random() < 0.2) {
                    plusOnes.push(new Bonus(a.pos));
                }
            }
        });
    });

    i = asteroides.length - 1;
    while (i >= 0) {
        const a = asteroides[i];
        if (a.hit) {
            asteroides.splice(i, 1);
            asteroides.push(...a.explode());
        }
        i--;
    }
    pop();

    if (asteroides.length === 0) {
        nbAsteroides++;
        generateAsteroides();
    }

    fill(200);
    textSize(20);
    text(`score: ${score}`, 50, 50);
    text(`last: ${last}`, 50, 70);
    text(`best: ${best}`, 50, 90);
}

function getInput() {
    // Left
    if (keyIsDown(37) || keyIsDown(72)) {
        ship.turnLeft();
    }
    // right
    if (keyIsDown(39) || keyIsDown(76)) {
        ship.turnRight();
    }
    // up
    if (keyIsDown(38) || keyIsDown(75)) {
        ship.thrust();
    }
}

function keyPressed() {
    // Chromes forces to start audio context on user input
    if (getAudioContext().state !== 'running') {
        userStartAudio();
    }

    // space
    if (keyCode === 32) {
        // This is needed to avoid toggling the sound with space after clicking the button
        document.activeElement.blur();
        ship.shoot();
    }

    /*
     * Cheats
     */
    switch (keyCode) {
        // q
        case 81:
            ship.setTripleGun();
            break;
        // w
        case 87:
            ship.setAutoshoot();
            break;
        // e
        case 69:
            ship.addShield();
            break;
        // r
        case 82:
            ship.ringShoot();
            break;
        // t
        case 84:
            ship.setSlowTurn();
            break;
        // y
        case 89:
            ship.setForcedEngine();
            break;
    }
}
