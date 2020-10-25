function Asteroide(r, pos, speed) {
    Mover.call(this);
    this.minR = 30;
    this.r = r || map(random(), 0, 1, this.minR, 50);
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

    this.nbVertexes = 20;
    this.vertexes = [new p5.Vector(0, this.r)];

    for (let i = 1; i < this.nbVertexes; i++) {
        const v = this.vertexes[i - 1].copy();
        const offset = random() * 10000;
        const n = Noise({x: (offset + i) * 0.1});
        const r = map(n, 0, 1, -10, 10);
        v.rotate((2 * PI) / this.nbVertexes);
        v.setMag(this.r + r);
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

        if (this.r < this.minR) {
            return [];
        }
        const newA = [];
        return [
            new Asteroide(this.r * 0.8, this.pos.copy(), this.speed.copy().rotate(PI / 8)),
            new Asteroide(this.r * 0.8, this.pos.copy(), this.speed.copy().rotate(-PI / 8))
        ];
    };
}
