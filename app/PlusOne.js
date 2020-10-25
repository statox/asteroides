function PlusOne(pos, message) {
    this.message = message || '+1';
    this.ttl = 100;
    this.pos = pos;

    this.move = () => {
        this.pos.y -= 1;
        this.ttl--;
    };

    this.draw = () => {
        push();
        translate(this.pos.x, this.pos.y);
        fill(250);
        text(this.message, -textWidth(this.text) / 2, 0);
        pop();
    };
}
