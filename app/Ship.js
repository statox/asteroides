function Ship() {
    Mover.call(this);
    this.speed = p5.Vector.random2D();
    this.speed.setMag(3);
    this.dir = this.speed.copy();
    this.vertexes = [new p5.Vector(-10, 10), new p5.Vector(0, -20), new p5.Vector(10, 10)];
    this.shots = [];
    this.coolDown = 300;
    this.lastShot = millis();

    this.draw = () => {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.dir.heading() + PI / 2);
        stroke(200);
        beginShape();
        this.vertexes.forEach((v) => vertex(v.x, v.y));
        endShape(CLOSE);
        pop();
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
            const shotSpeed = this.dir.copy();
            shotSpeed.setMag(11);
            this.shots.push(new Shot(this.pos, shotSpeed));
            this.lastShot = millis();
        }
    };
}
