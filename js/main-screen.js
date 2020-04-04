/**
 * Copyright (c) 2020
 *
 * @author      Mentisimo Rafael Frącek
 * @license     GNU General Public License version 3 (GPLv3)
 */
window.addEventListener('load', function() {
    const tetrisRacingGame = new TetrisRacingGame('game-canvas', 'game-resources',
        currentLevel => document.getElementById('level').textContent = currentLevel);
    tetrisRacingGame.run();
    setSoundIconClass(tetrisRacingGame.soundEnabled);
    getSoundIconElement().addEventListener('click', () => setSoundIconClass(tetrisRacingGame.toggleSound()));
});

function setSoundIconClass(soundEnabled) {
    const ON_CLASS = 'on';
    const OFF_CLASS = 'off';
    if (soundEnabled) {
        getSoundIconElement().classList.add(ON_CLASS);
        getSoundIconElement().classList.remove(OFF_CLASS);
    } else {
        getSoundIconElement().classList.remove(ON_CLASS);
        getSoundIconElement().classList.add(OFF_CLASS);
    }
}

function getSoundIconElement() {
    return document.getElementById('sound-icon');
}
