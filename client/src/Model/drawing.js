import Point from "./point";

export default class Drawing {
    constructor() {
        this.lines = [];
    }

    clearDrawing() {
        this.lines = [];
    }

    initializeLines(x,y) {
        this.point = new Point(x,y);
        this.lines = [...this.lines, {points: [this.point.getX(), this.point.getY()]}]
    }

    updateDrawing(x, y) {
        this.point = new Point(x,y);
        
        let lastLine = this.lines[this.lines.length - 1];

        if(lastLine) {
            lastLine.points = lastLine.points.concat([this.point.getX(), this.point.getY()]);

            this.lines.splice(this.lines.length -1, 1, lastLine);
            this.lines = this.lines.concat();
        }
    }

    getDrawing() {
        return this.lines;
    }

    setDrawing(val) {
        this.lines = val;
    }

    
}