const WIDTH = window.innerWidth - 5;
const HEIGHT = window.innerHeight - 5;
const SCREEN_CENTER_X = WIDTH / 2;
const SCREEN_CENTER_Y = HEIGHT / 2;
const QUADTREE_CAPACITY = 4;

/**
 * exp is the expression for calculating the largest size of the asteroid based upon screen size.
 * Because on mobile devices, an asteroid with a 100px radius seems much more bigger than on a
 * computer screen. However, I have made it to never exceed a maximum of 130px cause otherwise,
 * in case of very large displays, it could get too big.
 */
let exp = HEIGHT >= WIDTH ? HEIGHT / 10 : WIDTH / 10;
const GREATEST_ASTEROID_SIZE = exp < 130 ? exp : 130;