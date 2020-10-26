function playSound(sound) {
    if (!appSettings.soundOn || !sound) {
        return;
    }

    sound.play();
}
