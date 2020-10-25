function Mover() {
    this.pos = new p5.Vector(0, 0);
    this.dir = new p5.Vector(0, -1);
    this.acc = new p5.Vector(0, 0);
    this.speed = new p5.Vector(0, 0);
    this.maxSpeed = 10;

    this.move = () => {
        this.speed.add(this.acc);
        if (this.speed.mag() > 10) {
            this.speed.setMag(this.maxSpeed);
        }
        this.pos.add(this.speed);
        this.acc.setMag(0);

        // wrap around edges
        if (this.pos.mag() > R) {
            this.pos.mult(-1);
            this.pos.mag(R);
        }
    };
}
