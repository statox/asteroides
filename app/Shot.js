function Shot(pos, speed) {
    Mover.call(this);
    this.pos = pos.copy();
    this.speed = speed.copy();

    this.draw = () => {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.speed.heading() + PI / 2);
        stroke(200);
        line(0, 0, 0, -20);
        pop();
    };
}
