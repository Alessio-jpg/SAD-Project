import React from "react";
import { Stage, Layer, Line } from 'react-konva';
import "../Styles/WatchDraw.css";
import $ from 'jquery';

export default class WatchLive extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lines: [],
            name: "",
            id: props.id
        }

    }

    componentDidMount() {
        console.log("MOUNT")
        this.width = $('.single-live-screen').width();
        
        this.setState({
            lines: this.props.lines,
            name: this.props.name
        })
        
    }


    componentDidUpdate(prevPops, prevState) {
        if(this.props.lines !== prevPops.lines) {
            this.setState({
                lines: this.props.lines,
            })
        }
        if(this.props.name !== prevPops.name) {
            this.setState({
                name: this.props.name,
            })
        }
        if(this.props.id !== prevPops.id) {
            this.setState({
                id: this.props.id,
            })
        }
    }

    render() {
        var width = this.width;
        var name = this.state.name;
        var lines = this.state.lines;

        return(
            <>
            <div className= "watch-live-container">
            <h5 className='user-name'>{this.state.name}</h5>
                <Stage
                    width={width}
                    height={width}
                    className="canvas-live"
                >
                    <Layer>
                        {lines.map((line, i) => (
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