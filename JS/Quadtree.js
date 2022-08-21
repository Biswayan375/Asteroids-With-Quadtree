class PolyPoint2D{
    constructor(x, y, poly){
        this.x = x;
        this.y = y;
        this.isCollided = false;
        this.poly = poly
    }

    render() {
        push();
        strokeWeight(2);
        stroke("white");
        point(this.x, this.y);
        pop();
    }
}

class Rectangle{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w; // w represents actual width/2 because rectmode is set as RADIUS
        this.h = h; // h represents actual height/2 because rectmode is set as RADIUS
    }

    contains(p) {
        return(p.x > this.x - this.w && 
            p.x < this.x + this.w &&
            p.y > this.y - this.h &&
            p.y < this.y + this.h);
    }

    intersects(area) {
        return !(this.x + this.w < area.x - area.w ||
                this.x - this.w > area.x + area.w ||
                this.y + this.h < area.y - area.h ||
                this.y - this.h > area.y + area.h);
    }

    render() {
        push();
        noFill();
        stroke("white");
        // strokeWeight(5);
        rect(this.x, this.y, this.w, this.h);
        pop();
    }
}

class QuadTree{
    constructor(boundary, n){
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.isDivided = false;

        this.topLeft;
        this.topRight;
        this.bottomRight;
        this.bottomLeft;
    }

    insert(p){
        if(this.boundary.contains(p)){
            if(this.points.length < this.capacity){
                this.points.push(p);
            }else{
                if(!this.isDivided) this.subdivide();
                this.topLeft.insert(p);
                this.bottomLeft.insert(p);
                this.topRight.insert(p);
                this.bottomRight.insert(p);
            }
        }else return;
    }

    subdivide() {
        this.isDivided = true;

        let tl = new Rectangle(this.boundary.x - (this.boundary.w / 2), this.boundary.y - (this.boundary.h / 2), this.boundary.w / 2, this.boundary.h / 2),
        tr = new Rectangle(this.boundary.x + (this.boundary.w / 2), this.boundary.y - (this.boundary.h / 2), this.boundary.w / 2, this.boundary.h / 2),
        bl = new Rectangle(this.boundary.x - (this.boundary.w / 2), this.boundary.y + (this.boundary.h / 2), this.boundary.w / 2, this.boundary.h / 2),
        br = new Rectangle(this.boundary.x + (this.boundary.w / 2), this.boundary.y + (this.boundary.h / 2), this.boundary.w / 2, this.boundary.h / 2);

        this.topLeft = new QuadTree(tl, this.capacity);
        this.topRight = new QuadTree(tr, this.capacity);
        this.bottomRight = new QuadTree(br, this.capacity);
        this.bottomLeft = new QuadTree(bl, this.capacity);
    }

    query(area, points) {
        if(this.boundary.intersects(area)){
            for(let i = 0; i < this.points.length; i++)
                if(area.contains(this.points[i]))
                    points.push(this.points[i]);

            if(this.isDivided){
                points = this.topLeft.query(area, points);
                points = this.topRight.query(area, points);
                points = this.bottomRight.query(area, points);
                points = this.bottomLeft.query(area, points);
            }
        } 
        return points;
    }

    queryForPoly(poly, points) {
        poly.getAbsoluteVertices().forEach(p => {
            if(this.boundary.contains(p)){
                for(let i = 0; i < this.points.length; i++)
                    if(p != this.points[i])
                        points.push(this.points[i]);
    
                if(this.isDivided){
                    points = this.topLeft.queryForPoint(p, points);
                    points = this.bottomLeft.queryForPoint(p, points);
                    points = this.topRight.queryForPoint(p, points);
                    points = this.bottomRight.queryForPoint(p, points);
                }
            }
        });
        return points;
    }

    queryForPoint(p, points) {
        if(this.boundary.contains(p)){
            for(let i = 0; i < this.points.length; i++)
                if(p != this.points[i])
                    points.push(this.points[i]);

            if(this.isDivided){
                points = this.topLeft.queryForPoint(p, points);
                points = this.bottomLeft.queryForPoint(p, points);
                points = this.topRight.queryForPoint(p, points);
                points = this.bottomRight.queryForPoint(p, points);
            }
        }
        return points;
    }

    render() {
        this.boundary.render();
        if(this.isDivided){
            this.topLeft.render();
            this.bottomLeft.render();
            this.topRight.render();
            this.bottomRight.render();
        }
    }

    reset() {
        this.points = [];
        this.isDivided = false;

        this.topLeft = null;
        this.topRight = null;
        this.bottomRight = null;
        this.bottomLeft = null;
    }
}