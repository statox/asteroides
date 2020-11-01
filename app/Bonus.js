function Bonus(pos) {
    const actions = [
        {
            message: '+1',
            f: () => (score += 1)
        },
        {
            message: 'Slow turn',
            f: () => ship.setSlowTurn()
        },
        {
            message: 'Crazy engine',
            f: () => ship.setForcedEngine()
        }
    ];

    if (!ship.bonuses.tripleGun) {
        actions.push({
            message: 'Triple Pew',
            f: () => ship.setTripleGun()
        });
    }

    if (!ship.bonuses.autoshoot) {
        actions.push({
            message: 'Autopew',
            f: () => ship.setAutoshoot()
        });
    }

    if (ship.lives < 2) {
        actions.push({
            message: 'Shield',
            f: () => ship.addShield()
        });
    }

    if (millis() > ship.lastRingShot + ship.ringShotCoolDown) {
        actions.push({
            message: 'Ring pew',
            f: () => ship.ringShoot()
        });
    }

    if (actions.length > 0) {
        const {message, f} = actions[parseInt(random() * actions.length)];
        f();
        PlusOne.call(this, pos, message);
    }
}
