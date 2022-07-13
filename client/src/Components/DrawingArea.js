import React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
import "../Styles/DrawingArea.css"



export default class DrawingArea extends React.Component {

    //static socket = SocketContext;

    constructor(props) {
        super(props);

        this.state = {
            lines: [],
        }
        this.isDrawing = React.createRef(false);

        this.clearDrawing = this.clearDrawing.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.controller = props.controller;
    }

    componentDidMount() {
        this.width = $('.drawing-area').width();
    }


    componentWillUnmount() {
        this.props.onClearLines();
    }


    clearDrawing() {
        this.isDrawing.current = false;
        this.controller.clearDrawing();
        const newLines = this.controller.getLines();
        this.setState({
            lines: newLines
        })
    }

    handleMouseDown(e) {
        this.isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        
        this.controller.handleMouseDown(pos.x/this.width, pos.y/this.width);
        const newLines = this.controller.getLines();
        this.setState({
            lines: newLines
        })

    }

    handleMouseMove(e) {
        if (!this.isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
       
        this.controller.handleMouseMove(point.x/this.width, point.y/this.width);
        const newLines = this.controller.getLines();
        this.setState({
            lines: newLines
        })
    }

    handleMouseUp() {
        this.isDrawing.current = false;
    }


    render() {
        var width = this.width;
        return(
            <div className="drowing-container">
                <div className=" text-center text-dark">
                    <Stage
                        width={this.width}
                        height={this.width}
                        onMouseDown={this.handleMouseDown}
                        onMouseMove={this.handleMouseMove}
                        onMouseUp={this.handleMouseUp}
                        onTouchStart={this.handleMouseDown}
                        onTouchMove={this.handleMouseMove}
                        onTouchEnd={this.handleMouseUp}
                        className="canvas-stage"
                    >
                        <Layer>

                            {this.state.lines.map((line, i) => (
                                <Line
                                key={i}
                                points={line.points.map(function(x) { return x  * width })}
                                stroke="#fff"
                                strokeWidth={2}
                                tension={0.5}
                                lineCap="round"
                                /*
                                globalCompositeOperation={
                                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                }
                                */
                                />
                            ))}
                        </Layer>
                    </Stage>
            
                <button className="delete-button" onClick={this.clearDrawing}>
                    <FontAwesomeIcon icon={faEraser} /> 
                    <p>Cancella</p>            
                </button>
                </div>
            </div>            
        )
    }
}