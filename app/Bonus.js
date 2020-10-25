function Bonus(pos) {
    const actions = [
        {
            message: 'Triple Gun',
            f: () => ship.setTripleGun()
        },
        {
            message: 'Autoshoot',
            f: () => ship.setAutoshoot()
        }
    ];

    const {message, f} = actions[parseInt(random() * actions.length)];
    f();
    PlusOne.call(this, pos, message);
}
