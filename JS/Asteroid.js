class Asteroid {
    constructor(x, y, radius) {
        this.pos = createVector(x, y);
        this.radius = radius;
        this.size = radius;
        this.rotationSpeed = random([-(1 / this.radius), (1 / this.radius)]);
        this.velocity = p5.Vector.random2D().normalize();
        this.angle = 0;
        this.vertices = [];
        this.heading = random(0, 2 * PI);
        this.isDestroyed = false;

        this.createAsteroid();
    }

    createAsteroid() {
        for (let i = 0; i <= 360; i += random(20, 80)) {
            let dx = this.radius * cos(radians(i)),
                dy = this.radius * sin(radians(i));

                this.vertices.push(new PolyPoint2D(dx, dy, this));
        }
    }

    getAbsoluteVertices() {
        let absoluteVertices = [];
        this.vertices.forEach(vertex => {
            /**
             * Too much mathematics is going around here. This is basically finding out the absolute position of the vertices
             * of the asteroid w.r.t the top left corner of the screen which is the origin. the formula that is deriving out
             * the transformed_x and transformed_y is nothing but the formula of rotation of a 2D cartesian point w.r.t an
             * arbitrary point. We have learnt that in coordinate geometry or in computer graphics if you remember.
             */
            let x = vertex.x + this.pos.x, y = vertex.y + this.pos.y;
            let transformed_x = this.pos.x + (x - this.pos.x) * cos(this.angle) - (y - this.pos.y) * sin(this.angle),
                transformed_y = this.pos.y + (x - this.pos.x) * sin(this.angle) + (y - this.pos.y) * cos(this.angle);
            absoluteVertices.push(new PolyPoint2D(transformed_x, transformed_y, this));
        })

        return absoluteVertices;
    }

    getArrayOfVertexVectors() {
        let vertices = [];
        this.vertices.forEach(vertex => {
            let x = vertex.x + this.pos.x, y = vertex.y + this.pos.y;
            let transformed_x = this.pos.x + (x - this.pos.x) * cos(this.angle) - (y - this.pos.y) * sin(this.angle),
                transformed_y = this.pos.y + (x - this.pos.x) * sin(this.angle) + (y - this.pos.y) * cos(this.angle);
            vertices.push(createVector(transformed_x, transformed_y));
        })

        return vertices;
    }

    move() {
        this.pos.add(this.velocity);
        rotate(this.angle);
        this.angle += this.rotationSpeed;
    }

    hit() {
        this.isDestroyed = true;
    }

    divide() {
        let n = floor(random(3, 5)); // this many mini asteroids will get generated
        let babyAsteroids = [];

        if (this.size > 22) {
            for (let i = 0; i < n; i++) {
                let babyAsteroidSize = this.size / 2 > 20 ? this.size / 2 : 20
                babyAsteroids.push(new Asteroid(this.pos.x + random([-random(5, 20), (5, 20)]), this.pos.y + random([-random(5, 20), random(5, 20)]), babyAsteroidSize));
            }
        }
        return babyAsteroids;
    }

    render() {
        push();
        translate(this.pos.x, this.pos.y);
        this.move();
        beginShape();

        noFill();
        strokeWeight(2);
        stroke(color('white'));
        for (let i = 0; i < this.vertices.length; i++)
            vertex(this.vertices[i].x, this.vertices[i].y);

        endShape(CLOSE);
        pop();
    }

    debugRender() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        noFill();
        strokeWeight(2);
        stroke(color('red'));
        for (let i = 0; i < this.vertices.length; i++)
            vertex(this.vertices[i].x, this.vertices[i].y);

        endShape(CLOSE);
        pop();
    }
}