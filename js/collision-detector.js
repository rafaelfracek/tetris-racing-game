/**
 * Copyright (c) 2020
 *
 * @author      Mentisimo Rafael Frącek
 * @license     GNU General Public License version 3 (GPLv3)
 */
class CollisionDetector {
    static detectCollision({x: x1, y: y1, width: width1, height: height1},
                           {x: x2, y: y2, width: width2, height: height2}) {
        return x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2;
    }
}
