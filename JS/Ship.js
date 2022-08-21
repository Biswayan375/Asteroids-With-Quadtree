const LEFT = 0;
const RIGHT = 1;

class PointLocation2D {
    // A conveinient class to store x and y coordinate values of a 2D cartesian point
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Bullet {
    constructor(x, y, heading) {
        this.pos = createVector(x, y);
        this.bulletSpeed = 10;
        this.heading = heading;
        this.velocity = p5.Vector.fromAngle(this.heading - (PI / 2)).normalize().mult(this.bulletSpeed);
    }

    move() {
        this.pos.add(this.velocity);
    }

    render() {
        push();
        this.move();
        translate(this.pos.x, this.pos.y);
        strokeWeight(5);
        stroke(color('red'));
        point(0, 0);
        pop();
    }
}

class Ship {
    constructor(x, y, size) {
        this.pos = createVector(x, y);
        this.size = size;
        this.heading = 0;
        this.turnSensitivity = 0.1;
        this.velocity = createVector(0, 0);
        this.maxSpeed = 50;
        this.antiDampForce = 0.98;
        this.acceleration = 0.08;
        this.bullets = [];
        this.ammo = 10;

        this.isThrusting = false;

        this.shipColor = 'blueviolet';

        this.pointA = new PointLocation2D(0, -this.size);
        this.pointB = new PointLocation2D(this.size, this.size);
        this.pointC = new PointLocation2D(-this.size, this.size);
        this.leftThruster = new PointLocation2D(-(this.size / 4), this.size); // location is relative to the ship's position and rotation
        this.rightThruster = new PointLocation2D((this.size / 4), this.size); // location is relative to the ship's position and rotation
        
        this.objDef1 = {
            name: "objDef1",
            size: [2,8], //vary size of default ellipse
            color: ["red", "rgba(255,0,0,0.5)", "rgba(255,0,0,0.1)"],
            rate: [0, 20], //20 particles every move of a ball
            speedx: 0.3,   //vary the speed slightly
            gravity: 0,    //negligible effect of gravity on exhaust
            lifetime: 50,  //larger values mean longer exhaust trails
            angle: [-100, 100],//exhaust spread
            x: WIDTH / 2,
            y: HEIGHT / 2
        };
        this.objDef2 = {
            name: "objDef2",
            size: [2,8], //vary size of default ellipse
            color: ["yellow", "rgba(0,255,255,0.5)", "rgba(0,255,255,0.1)"],
            rate: [0, 20], //20 particles every move of a ball
            speedx: 0.3,   //vary the speed slightly
            gravity: 0,    //negligible effect of gravity on exhaust
            lifetime: 50,  //larger values mean longer exhaust trails
            angle: [-100, 100],//exhaust spread
            x: WIDTH / 2,
            y: HEIGHT / 2
        }
        this.exhaustTail1 = new Fountain(null, this.objDef1);
        this.exhaustTail2 = new Fountain(null, this.objDef2);
    }

    turn(direc) {
        // This function turns the ship i.e. changes the angle called heading.
        // Tweek turn sensitivity to specify how much the ship should turn.
        if (direc === LEFT) {
            this.heading -= this.turnSensitivity;
        }
        if (direc === RIGHT) {
            this.heading += this.turnSensitivity;
        }
    }

    thrust() {
        this.isThrusting = true;
        let headingVector = p5.Vector.fromAngle(this.heading - (PI / 2)).normalize().mult(this.acceleration);

        this.velocity.add(headingVector);
        let thrusterLoc = this.getAbsoluteThrusterLocations();
        this.exhaustTail1.CreateN(thrusterLoc.leftThruster.x, thrusterLoc.leftThruster.y, degrees(this.heading + PI / 2));
        this.exhaustTail2.CreateN(thrusterLoc.rightThruster.x, thrusterLoc.rightThruster.y, degrees(this.heading + PI / 2));
    }

    move() {
        if (!this.isThrusting){
            // console.log('damping');
            this.velocity.mult(this.antiDampForce);
        }
        this.velocity.limit(this.maxSpeed);
        this.pos.add(this.velocity);
    }

    fire() {
        if (this.ammo > 0) {
            this.bullets.push(new Bullet(this.pos.x, this.pos.y, this.heading));
            // this.ammo--;
        }
    }

    getAbsoluteThrusterLocations() {
        // Returns the absolute position of the left and right thrusters with translation and rotation adjusted

        // Adjusting translation
        let xR = this.rightThruster.x + this.pos.x, yR = this.rightThruster.y + this.pos.y;
        let xL = this.leftThruster.x + this.pos.x, yL = this.leftThruster.y + this.pos.y;

        // Adjusting rotation
        let transformedXR = this.pos.x + (xR - this.pos.x) * cos(this.heading) - (yR - this.pos.y) * sin(this.heading),
            transformedYR = this.pos.y + (xR - this.pos.x) * sin(this.heading) + (yR - this.pos.y) * cos(this.heading),
            transformedXL = this.pos.x + (xL - this.pos.x) * cos(this.heading) - (yL - this.pos.y) * sin(this.heading),
            transformedYL = this.pos.y + (xL - this.pos.x) * sin(this.heading) + (yL - this.pos.y) * cos(this.heading)

        return {
            "leftThruster": {"x": transformedXL, "y": transformedYL},
            "rightThruster": {"x": transformedXR, "y": transformedYR}
        };
    }

    getAbsoluteVertices() {
        // Does same work as Asteroid class's getAbsoluteVertices method
        let xA = this.pointA.x + this.pos.x, yA = this.pointA.y + this.pos.y,
        xB = this.pointB.x + this.pos.x, yB = this.pointB.y + this.pos.y,
        xC = this.pointC.x + this.pos.x, yC = this.pointC.y + this.pos.y;

        // ref topic - rotation of a 2D point about an arbitrary point
        let transformedXa = this.pos.x + (xA - this.pos.x) * cos(this.heading) - (yA - this.pos.y) * sin(this.heading),
            transformedYa = this.pos.y + (xA - this.pos.x) * sin(this.heading) + (yA - this.pos.y) * cos(this.heading),
            transformedXb = this.pos.x + (xB - this.pos.x) * cos(this.heading) - (yB - this.pos.y) * sin(this.heading),
            transformedYb = this.pos.y + (xB - this.pos.x) * sin(this.heading) + (yB - this.pos.y) * cos(this.heading),
            transformedXc = this.pos.x + (xC - this.pos.x) * cos(this.heading) - (yC - this.pos.y) * sin(this.heading),
            transformedYc = this.pos.y + (xC - this.pos.x) * sin(this.heading) + (yC - this.pos.y) * cos(this.heading);
        
        return [new PolyPoint2D(transformedXa, transformedYa, this), new PolyPoint2D(transformedXb, transformedYb, this), new PolyPoint2D(transformedXc, transformedYc, this)];
    }

    getArrayOfVertexVectors() {
        let absPoints = this.getAbsoluteVertices();
        return [
            createVector(absPoints[0].x, absPoints[0].y),
            createVector(absPoints[1].x, absPoints[1].y),
            createVector(absPoints[2].x, absPoints[2].y)
        ];
    }

    drawBullets(quadtree) {
        if (this.bullets.length > 0) {
            for (let i = 0; i < this.bullets.length; i++) {
                let bullet = this.bullets[i];

                if (bullet) {
                    if (bullet.pos.x < 0 || bullet.pos.y < 0 ||
                        bullet.pos.y > HEIGHT ||
                        bullet.pos.x > WIDTH) {
                        this.bullets.splice(i, 1);
                        i--;
                    } else {
                        let nearbyAsteroidSet = new Set();
                        let points = quadtree.queryForPoint(new PointLocation2D(bullet.pos.x, bullet.pos.y), []);
                        points.forEach(pt => {
                            nearbyAsteroidSet.add(pt.poly);
                        })

                        let flag = 0;
                        nearbyAsteroidSet.forEach(asteroid => {
                            if (collidePointPoly(bullet.pos.x, bullet.pos.y, asteroid.getArrayOfVertexVectors())) {
                                asteroid.isDestroyed = true;
                                this.bullets.splice(i, 1);
                                i--;
                                flag = 1;
                            }
                        })
                        if (flag == 0)
                            bullet.render();
                    }
                }
            }
        }
    }

    render(quadtree) {
        this.drawBullets(quadtree);
        push();

        push();
        this.exhaustTail1.Draw();
        this.exhaustTail1.Step();
        this.exhaustTail2.Draw();
        this.exhaustTail2.Step();
        pop();

        stroke(this.shipColor);
        fill(this.shipColor);

        translate(this.pos);
        this.move();
        rotate(this.heading);
        triangle(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y, this.pointC.x, this.pointC.y);
        this.isThrusting = false;
        pop();
    }

    static get LEFT() {
        return 0;
    }
    static get RIGHT() {
        return 1;
    }
}