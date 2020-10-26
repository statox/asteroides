function playSound(sound) {
    if (!appSettings.soundOn) {
        return;
    }

    sound.play();
}
