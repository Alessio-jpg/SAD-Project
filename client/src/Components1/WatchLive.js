import React from "react";
import { Stage, Layer, Line } from 'react-konva';
import "../Styles/WatchDraw.css";
import $ from 'jquery';

export default class WatchLive extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lines: []
        }
        this.name = props.name;

        this.name = props.name;
        this.id = props.id;

    }

    componentDidMount() {
        this.width = $('.single-live-screen').width();
        this.setState({
            lines: this.props.lines,
        })
    }

    componentDidUpdate(prevPops, prevState) {
        if(this.props.lines !== prevPops.lines) {
            this.setState({
                lines: this.props.lines,
            })
        }
    }

    render() {
        var width = this.width;
        return(
            <>
            <h5 className='user-name'>{this.name}</h5>
            <div className= "watch-live-container">
                <Stage
                    width={this.width}
                    height={this.width}
                    className="canvas-live"
                >
                    <Layer>
                        {this.state.lines.map((line, i) => (
                            <Line
                            key={i}
                            points={line.points.map(function(x) {return x * width})}
                            stroke="#000"
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
            </div>
            </>            
        )
    }
    
}