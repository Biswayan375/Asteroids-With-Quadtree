class GameService {
    constructor() {
        this.ship = null;
        this.asteroids = [];
        this.quadtree = null;
        this.isGameover = false;
    }

    init() {
        this.isGameover = false;
        this.asteroids = [];
        rectMode(RADIUS);
        createCanvas(WIDTH, HEIGHT);

        let boundary = new Rectangle(SCREEN_CENTER_X, SCREEN_CENTER_Y, WIDTH, HEIGHT);
        this.quadtree = new QuadTree(boundary, 4);

        this.ship = new Ship(SCREEN_CENTER_X, SCREEN_CENTER_Y, 20);

        // This extra gibberrish below is done so that no asteroid spawns over the player spaceship making a gameover
        // before the game actually starts.
        for (let i = 0; i < 10; i++) this.asteroids.push(new Asteroid(random([floor(random(0, SCREEN_CENTER_X - GREATEST_ASTEROID_SIZE)), floor(random(SCREEN_CENTER_X + GREATEST_ASTEROID_SIZE, WIDTH))]), random([floor(random(0, SCREEN_CENTER_Y - GREATEST_ASTEROID_SIZE)), floor(random(SCREEN_CENTER_Y + GREATEST_ASTEROID_SIZE, HEIGHT))]), random(20, GREATEST_ASTEROID_SIZE)));
    }

    wrapObjectAround(obj) {
        // Wraps the ship across the screen if needed
        
        if (obj) {
            // Across left wall
            if (obj.pos.x - obj.size > WIDTH) {
                obj.pos.x = -obj.size;
                obj.pos.y = HEIGHT - obj.pos.y
            }
        
            // Across right wall
            if (obj.pos.x + obj.size < -obj.size) {
                obj.pos.x = WIDTH + obj.size;
                obj.pos.y = HEIGHT - obj.pos.y;
            }
        
            // Across the top wall
            if (obj.pos.y + obj.size < 0) {
                obj.pos.y = HEIGHT + obj.size;
                obj.pos.x = WIDTH - obj.pos.x;
            }
        
            // Across the bottom wall
            if (obj.pos.y - obj.size > HEIGHT) {
                obj.pos.y = -obj.size;
                obj.pos.x = WIDTH - obj.pos.x;
            }
        }
    }

    checkForInputs() {
        if (keyIsDown(LEFT_ARROW)) {
            this.ship.turn(Ship.LEFT);
        }
        
        if (keyIsDown(RIGHT_ARROW)) {
            this.ship.turn(Ship.RIGHT);
        }
    
        if (keyIsDown(UP_ARROW)) {
            this.ship.thrust();
        }
    }

    gameLoop() {
        background(0);

        this.checkForInputs();
        this.wrapObjectAround(this.ship);

        for (let i = 0; i < this.asteroids.length; i++) {
            let asteroid = this.asteroids[i];
            this.wrapObjectAround(asteroid);
            if (asteroid.isDestroyed) {
                let babyAsteroids = asteroid.divide();
                this.asteroids.splice(i, 1);
                i--;
                this.asteroids = this.asteroids.concat(babyAsteroids);
            } else {
                asteroid.render();
                asteroid.getAbsoluteVertices().forEach(vertex => { this.quadtree.insert(vertex); })
            }
        }
        // this.quadtree.render();
        this.ship.render(this.quadtree);

        let points = []
        let nearbyAsteroidSet = new Set();
        points = this.quadtree.queryForPoly(this.ship, []);
        push();
        strokeWeight(10);
        stroke(color('red'));
        points.forEach(pt => { nearbyAsteroidSet.add(pt.poly); })
        pop();

        nearbyAsteroidSet.forEach(asteroid => {
            if (collidePolyPoly(this.ship.getArrayOfVertexVectors(), asteroid.getArrayOfVertexVectors(), true))
                this.isGameover = true;
                // console.log('game over');
        })

        this.quadtree.reset();
    }
}