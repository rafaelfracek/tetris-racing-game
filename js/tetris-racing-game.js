/**
 * Copyright (c) 2020
 *
 * @author      Mentisimo Rafael Frącek
 * @license     GNU General Public License version 3 (GPLv3)
 */
const TetrisRacingGame = (function() {

    const _state = new WeakMap();
    const _ctx = new WeakMap();
    const _resources = new WeakMap();
    const _interval = new WeakMap();
    const _levelChangeListener = new WeakMap();

    const CONST = TetrisRacingGameConstants;

    class TetrisRacingGame {

        constructor(canvasId, resourcesId, levelChangeListener = () => {}) {
            _state.set(this, getDefaultState());
            _ctx.set(this, document.getElementById(canvasId).getContext('2d'));
            _levelChangeListener.set(this, levelChangeListener);
            _resources.set(this, readResources(resourcesId));
            addKeyDownEventListener.call(this);
        }

        run() {
            const {state, levelChangeListener} = _get(this);
            state.currentLevelLines = generateLevelLines();
            state.running = true;
            levelChangeListener(state.level);
            _interval.set(this, setInterval(processCurrentFrame.bind(this), CONST.INTERVAL_TIMEOUT));
        }

        toggleSound() {
            const {state} = _get(this);
            return state.soundEnabled = !state.soundEnabled;
        }

        get soundEnabled() {
            return _state.get(this).soundEnabled;
        }
    }

    function _get(obj) {
        return {
            state: _state.get(obj),
            ctx: _ctx.get(obj),
            resources: _resources.get(obj),
            interval: _interval.get(obj),
            levelChangeListener: _levelChangeListener.get(obj)
        };
    }

    function getDefaultState() {
        return {
            currentLevelLines: [],
            level: 1,
            progress: 0,
            player: {
                position: 1
            },
            running: false,
            soundEnabled: false
        };
    }

    function readResources(resourcesId) {
        const resources = {};
        document.querySelectorAll(`#${resourcesId} > *`).forEach(resource => {
            resources[resource.getAttribute('data-name')] = resource;
        });
        return resources;
    }

    function generateLevelLines() {
        const lines = [];
        for (let i = 0; i <= CONST.NUMBER_OF_LINES * 2 + 1; i++) {
            if (i % 2 === 0 && i < CONST.NUMBER_OF_LINES*2) {
                lines.push(CONST.POSSIBLE_LEVEL_LINES[Math.floor(Math.random() * CONST.POSSIBLE_LEVEL_LINES.length)]);
            } else {
                lines.push(CONST.EMPTY_LINE);
            }
        }
        return lines;
    }

    function playSound(sound) {
        if (_state.get(this).soundEnabled) {
            sound.play();
        }
    }

    function processCurrentFrame() {
        const playerData = calculatePlayerData.call(this);
        const currentLineHeight = calculateCurrentLineHeight.call(this);
        const opponentRectangles = calculateOpponentRectangles.call(this, currentLineHeight);
        clearContext.call(this);
        drawPlayer.call(this, playerData);
        drawOpponentCars.call(this, opponentRectangles);
        drawWalls.call(this);
        if (isGameOverDetected(opponentRectangles, playerData)) {
            processGameOver.call(this);
        } else if (isNextLevelDetected.call(this, currentLineHeight)) {
            processNextLevel.call(this);
        } else {
            increaseProgress.call(this);
        }
    }

    function clearContext() {
        const {ctx} = _get(this);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function calculatePlayerData() {
        const {state, ctx} = _get(this);
        return {
            x: CONST.WALL_WIDTH_MARGIN + state.player.position * CONST.CAR_WIDTH_MARGIN,
            y: ctx.canvas.height - CONST.CAR_HEIGHT_MARGIN,
            width: CONST.CAR_WIDTH_NO_MARGIN,
            height: CONST.CAR_HEIGHT_NO_MARGIN
        }
    }

    function drawPlayer(playerData) {
        const {ctx, resources} = _get(this);
        ctx.drawImage(resources[CONST.PLAYER_CAR_IMG], playerData.x, playerData.y);
    }

    function calculateOpponentRectangles(currentLineHeight) {
        const {ctx, state} = _get(this);
        const lines = state.currentLevelLines;
        const opponentRectangles = [];
        for (let i = 0; i < lines.length; i++) {
            let y = i * currentLineHeight - (lines.length * currentLineHeight) + ctx.canvas.height + Math.round(state.progress);
            if (y > -CONST.CAR_HEIGHT_MARGIN && y < ctx.canvas.height) {
                const lineElements = lines[i];
                for (let j = 0; j < lineElements.length; j++) {
                    if (lines[i][j] === 1) {
                        const opponentRectangle = {
                            x: CONST.WALL_WIDTH_MARGIN + j * CONST.CAR_WIDTH_MARGIN,
                            y: y,
                            width: CONST.CAR_WIDTH_NO_MARGIN,
                            height: CONST.CAR_HEIGHT_NO_MARGIN
                        };
                        opponentRectangles.push(opponentRectangle);
                    }
                }
            }
        }
        return opponentRectangles;
    }

    function drawOpponentCars(opponentRectangles) {
        const {ctx, resources} = _get(this);
        opponentRectangles.forEach(opponentRectangle => ctx.drawImage(resources[CONST.OPPONENT_CAR_IMG], opponentRectangle.x, opponentRectangle.y));
    }

    function isGameOverDetected(opponentRectangles, playerData) {
        for (let i = 0; i < opponentRectangles.length; i++) {
            if (CollisionDetector.detectCollision(playerData, opponentRectangles[i])) {
                return true;
            }
        }
        return false;
    }

    function isNextLevelDetected(currentLineHeight) {
        let {state} = _get(this);
        return state.progress > state.currentLevelLines.length * currentLineHeight;
    }

    function addKeyDownEventListener() {
        const {state, resources} = _get(this);
        window.addEventListener('keydown', event => {
            if (!state.running) return;
            if (event.code === CONST.ARROW_LEFT) {
                event.preventDefault();
                if (state.player.position > 0) {
                    state.player.position--;
                    playSound.call(this, resources[CONST.MOVE_SOUND]);
                }
            } else if (event.code === CONST.ARROW_RIGHT) {
                event.preventDefault();
                if (state.player.position < 2) {
                    state.player.position++;
                    playSound.call(this, resources[CONST.MOVE_SOUND]);
                }
            }
        });
    }

    function resetState() {
        const {state} = _get(this);
        Object.assign(state, (({running, level, progress, player: {position}}) =>
            ({running, level, progress, player: {position: position}}))(getDefaultState()));
    }

    function prepareStateToNextLevel() {
        const {state} = _get(this);
        state.level++;
        Object.assign(state, (({running, progress, player: {position}}) =>
            ({running, progress, player: {position: position}}))(getDefaultState()));
    }

    function drawWalls() {
        const {ctx, state, resources} = _get(this);
        const minPosition = -Math.ceil(1.5 * state.currentLevelLines.length * calculateCurrentLineHeight.call(this));
        for (let i = minPosition; i < ctx.canvas.height; i += CONST.WALL_HEIGHT_MARGIN) {
            const y = i +  Math.round(1.5 * state.progress);
            if (y > -CONST.WALL_HEIGHT_MARGIN && y < ctx.canvas.height) {
                ctx.drawImage(resources[CONST.WALL_IMG], 0, y);
                ctx.drawImage(resources[CONST.WALL_IMG], ctx.canvas.width - CONST.WALL_WIDTH_NO_MARGIN, y);
            }
        }
    }

    function processGameOver() {
        const {ctx, interval, resources} = _get(this);
        clearInterval(interval);
        ctx.drawImage(resources[CONST.GAME_OVER_IMG], 0, 0);
        playSound.call(this, resources[CONST.GAME_OVER_SOUND]);
        resetState.call(this);
        setTimeout(this.run.bind(this), CONST.PAUSE_TIMEOUT);
    }

    function processNextLevel() {
        const {ctx, interval, resources} = _get(this);
        clearInterval(interval);
        ctx.drawImage(resources[CONST.NEXT_LEVEL_IMG], 0, 0);
        playSound.call(this, resources[CONST.NEXT_LEVEL_SOUND]);
        prepareStateToNextLevel.call(this);
        setTimeout(this.run.bind(this), CONST.PAUSE_TIMEOUT);
    }

    function increaseProgress() {
        const {state} = _get(this);
        state.progress += (2 + state.level * 2) * (24/CONST.FPS);
    }

    function calculateCurrentLineHeight() {
        return CONST.BASE_LINE_HEIGHT + Math.ceil(_state.get(this).level * 0.033 * CONST.BASE_LINE_HEIGHT);
    }

    return TetrisRacingGame;
})();
