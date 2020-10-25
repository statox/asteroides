let appSettings = {};
let ship;
let asteroides;
let R;
let score;
let best;
let shotSounds;
let explosionShounds;
let gameOverSound;
const itemName = 'statox-asteroides-best';

function customResizeCanvas() {
    const dim = Math.min(windowHeight, windowWidth);
    R = (dim * 0.95) / 2;
    resizeCanvas(dim, dim);
}

function resetGame() {
    if (score > best) {
        best = score;
        storeItem(itemName, score);
    }
    score = 0;
    ship = new Ship();
    asteroides = [];
    for (let _ = 0; _ < 10; _++) {
        asteroides.push(new Asteroide());
    }
}

function preload() {
    soundFormats('mp3', 'm4a');
    shotSounds = [];
    shotSounds.push(loadSound('../assets/shot_1.mp3'));
    shotSounds.push(loadSound('../assets/shot_2.mp3'));
    shotSounds.push(loadSound('../assets/Shot_3.m4a'));
    shotSounds.push(loadSound('../assets/Shot_4.m4a'));

    explosionShounds = [];
    explosionShounds.push(loadSound('../assets/Boum_1.m4a'));
    explosionShounds.push(loadSound('../assets/Boum_2.m4a'));
    explosionShounds.push(loadSound('../assets/Boum_3.m4a'));

    gameOverSound = loadSound('../assets/Game_over.m4a');
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

    try {
        best = Number(getItem(itemName));
    } catch (e) {
        console.error('Could not get best score from local storage');
        best = 0;
    }
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

    ship.move();
    ship.updateShots();
    ship.draw();

    ship.shots.forEach((s) => s.move());
    ship.shots.forEach((s) => s.draw());

    const shipVertexes = ship.vertexes.map((v) => p5.Vector.add(v, ship.pos));
    let hitShip = false;
    asteroides.forEach((a) => {
        a.move();
        a.draw();

        const asteroideVertexes = a.vertexes.map((v) => p5.Vector.add(v, a.pos));
        if (collidePolyPoly(shipVertexes, asteroideVertexes, true)) {
            hitShip = true;
            gameOverSound.play();
            resetGame();
        }

        ship.shots.forEach((s) => {
            const hit = collidePointPoly(s.pos.x, s.pos.y, asteroideVertexes);
            if (hit) {
                a.hit = true;
                s.hit = true;
                score++;
            }
        });
    });

    let i = asteroides.length - 1;
    while (i >= 0) {
        const a = asteroides[i];
        if (a.hit) {
            asteroides.splice(i, 1);
            asteroides.push(...a.explode());
        }
        i--;
    }
    pop();

    fill(200);
    textSize(20);
    text(`score: ${score}`, 50, 50);
    text(`best: ${best}`, 50, 70);
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
    if (keyIsDown(38)) {
        ship.thrust();
    }
}

function keyPressed() {
    // space
    if (keyCode === 32) {
        ship.shoot();
    }
}
