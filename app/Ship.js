function Ship() {
    Mover.call(this);
    this.dir = p5.Vector.random2D();
    this.speed = this.dir.copy();
    this.speed.setMag(3);
    this.vertexes = [new p5.Vector(-10, 10), new p5.Vector(0, -20), new p5.Vector(10, 10)];
    this.shots = [];
    this.coolDown = 300;
    this.ringShotCoolDown = 10 * 1000;
    this.lastShot = millis();
    this.lastRingShot = millis();
    this.rotationSpeed = radians(6);
    this.thrusting = false;
    this.lives = 1;
    this.bonuses = {
        tripleGun: false,
        autoshoot: false
    };

    this.draw = () => {
        if (this.bonuses.slowTurn) {
            stroke(200, 0, 0);
        } else {
            stroke(200);
        }

        if (this.lives > 1) {
            push();
            translate(this.pos.x, this.pos.y);
            scale(1.5);
            rotate(this.dir.heading() + PI / 2);
            beginShape();
            this.vertexes.forEach((v) => vertex(v.x, v.y));
            endShape(CLOSE);
            pop();
        }

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.dir.heading() + PI / 2);
        beginShape();
        this.vertexes.forEach((v) => vertex(v.x, v.y));
        endShape(CLOSE);
        pop();

        if (this.thrusting) {
            push();
            fill(200, 100, 100);
            translate(this.pos.x, this.pos.y);
            scale(0.5);
            rotate(this.dir.heading() + PI / 2 + PI);
            translate(0, -30);
            beginShape();
            this.vertexes.forEach((v) => vertex(v.x, v.y));
            endShape(CLOSE);
            pop();
        }

        // Should be in an inherited move function
        if (this.bonuses.autoshoot) {
            this.shoot();
        }
        if (this.bonuses.forcedEngine) {
            this.thrust();
        }
    };

    this.updateShots = () => {
        let i = this.shots.length - 1;
        while (i >= 0) {
            const shot = this.shots[i];
            if (shot.pos.mag() > R || shot.hit) {
                this.shots.splice(i, 1);
            }
            i--;
        }
    };

    this.shoot = () => {
        if (millis() > this.lastShot + this.coolDown) {
            const index = parseInt(random() * shotSounds.length);
            shotSounds[index].play();

            this.lastShot = millis();

            const shotSpeed = this.dir.copy();
            shotSpeed.setMag(11);
            this.shots.push(new Shot(this.pos, shotSpeed));
            if (this.bonuses.tripleGun) {
                shotSpeed.rotate(PI / 6);
                this.shots.push(new Shot(this.pos, shotSpeed));
                shotSpeed.rotate((-2 * PI) / 6);
                this.shots.push(new Shot(this.pos, shotSpeed));
            }
        }
    };

    this.ringShoot = () => {
        const index = parseInt(random() * shotSounds.length);
        shotSounds[index].play();
        this.lastRingShot = millis();

        const shotSpeed = this.dir.copy();
        shotSpeed.setMag(11);
        this.shots.push(new Shot(this.pos, shotSpeed));
        for (let i = 0; i < 360; i++) {
            shotSpeed.rotate((2 * PI) / 360);
            this.shots.push(new Shot(this.pos, shotSpeed));
        }
    };

    this.thrust = () => {
        this.acc = this.dir.copy();
        this.acc.setMag(0.5);
        this.thrusting = true;
        setTimeout(() => {
            this.thrusting = false;
        }, 500);
    };

    this.turnLeft = () => {
        this.dir.rotate(-this.rotationSpeed);
    };
    this.turnRight = () => {
        this.dir.rotate(this.rotationSpeed);
    };

    this.setTripleGun = () => {
        this.bonuses.tripleGun = true;
        setTimeout(() => {
            this.bonuses.tripleGun = false;
        }, 5000);
    };

    this.setAutoshoot = () => {
        this.bonuses.autoshoot = true;
        this.coolDown = 50;

        setTimeout(() => {
            this.bonuses.autoshoot = false;
            this.coolDown = 300;
        }, 5000);
    };

    this.addShield = () => {
        this.lives++;
    };

    this.setSlowTurn = () => {
        this.bonuses.slowTurn = true;
        this.rotationSpeed = radians(1);
        setTimeout(() => {
            this.bonuses.slowTurn = false;
            this.rotationSpeed = radians(6);
        }, 5000);
    };

    this.setForcedEngine = () => {
        this.bonuses.forcedEngine = true;

        setTimeout(() => {
            this.bonuses.forcedEngine = false;
        }, 5000);
    };

    this.hit = () => {
        this.lives--;
        console.log(this.lives);
    };
}
