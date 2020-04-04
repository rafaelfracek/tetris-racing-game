/**
 * Copyright (c) 2020
 *
 * @author      Mentisimo Rafael Frącek
 * @license     GNU General Public License version 3 (GPLv3)
 */
class TetrisRacingGameConstants {}

TetrisRacingGameConstants.FPS = 120;
TetrisRacingGameConstants.INTERVAL_TIMEOUT = 1000 / TetrisRacingGameConstants.FPS;
TetrisRacingGameConstants.PAUSE_TIMEOUT = 1000;
TetrisRacingGameConstants.BASE_LINE_HEIGHT = 120;
TetrisRacingGameConstants.CAR_WIDTH_MARGIN = 72;
TetrisRacingGameConstants.CAR_WIDTH_NO_MARGIN = 69;
TetrisRacingGameConstants.CAR_HEIGHT_MARGIN = 96;
TetrisRacingGameConstants.CAR_HEIGHT_NO_MARGIN = 93;
TetrisRacingGameConstants.WALL_WIDTH_MARGIN = 24;
TetrisRacingGameConstants.WALL_WIDTH_NO_MARGIN = 21;
TetrisRacingGameConstants.WALL_HEIGHT_MARGIN = 96;
TetrisRacingGameConstants.WALL_HEIGHT_NO_MARGIN = 93;
TetrisRacingGameConstants.NUMBER_OF_LINES = 15;

TetrisRacingGameConstants.OPPONENT_CAR_IMG = 'opponent-car-img';
TetrisRacingGameConstants.PLAYER_CAR_IMG = 'player-car-img';
TetrisRacingGameConstants.GAME_OVER_IMG = 'game-over-img';
TetrisRacingGameConstants.NEXT_LEVEL_IMG = 'next-level-img';
TetrisRacingGameConstants.WALL_IMG = 'wall-img';
TetrisRacingGameConstants.MOVE_SOUND = 'move-sound';
TetrisRacingGameConstants.GAME_OVER_SOUND = 'game-over-sound';
TetrisRacingGameConstants.NEXT_LEVEL_SOUND = 'next-level-sound';

TetrisRacingGameConstants.POSSIBLE_LEVEL_LINES = [
    [1,0,0],
    [0,1,0],
    [0,0,1],
    [1,0,1],
    [0,1,1],
    [1,1,0]
];
TetrisRacingGameConstants.EMPTY_LINE = [0,0,0];

TetrisRacingGameConstants.ARROW_LEFT = 'ArrowLeft';
TetrisRacingGameConstants.ARROW_RIGHT = 'ArrowRight';

Object.freeze(TetrisRacingGameConstants);
