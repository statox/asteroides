function Asteroide(pos, r, speed) {
    Mover.call(this);
    this.minR = 30;
    this.maxR = 60;
    this.r = r || map(random(), 0, 1, this.minR, this.maxR);
    if (pos) {
        this.pos = pos;
    } else {
        this.pos = pos || p5.Vector.random2D();
        this.pos.setMag(R * 0.8);
    }
    this.speed = speed || p5.Vector.random2D();
    this.randomValue = random();
    this.maxSpeed = map(this.randomValue, 0, 1, 0.5, 2);
    this.speed.setMag(this.maxSpeed);
    this.rotateAngle = map(this.randomValue, 0, 1, -radians(1), radians(1));

    this.nbVertexes = 40;
    this.vertexes = [];

    const offset = random() * 10000;
    for (let i = 0; i < this.nbVertexes; i++) {
        const v = new p5.Vector(0, this.r);
        v.rotate((i * (2 * PI)) / this.nbVertexes);
        const n = Noise({x: offset + v.x * 0.01, y: offset * 11 + v.y * 0.01});
        const r = map(n, 0, 1, this.r * 0.1, this.r * 2);
        v.setMag(r);
        this.vertexes.push(v);
    }

    this.draw = () => {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.dir.heading() + PI / 2);
        noStroke();
        fill(200, 200, 200, 200);
        beginShape();
        this.vertexes.forEach((v) => vertex(v.x, v.y));
        endShape(CLOSE);
        pop();

        // Should be in an inherited move() function
        this.dir.rotate(this.rotateAngle);
    };

    this.explode = () => {
        const index = parseInt(random() * explosionShounds.length);
        explosionShounds[index].play();

        plusOnes.push(new PlusOne(this.pos));

        if (this.r < this.minR) {
            return [];
        }
        return [
            new Asteroide(this.pos.copy(), this.r * 0.7, this.speed.copy().rotate(-PI / 8)),
            new Asteroide(this.pos.copy(), this.r * 0.7, this.speed.copy().rotate(PI / 8))
        ];
    };
}
