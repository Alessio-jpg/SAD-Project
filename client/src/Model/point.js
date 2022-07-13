export default class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }


    setX(val) {
        this.x = val;
    }

    setY(val) {
        this.y = val; 
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

}