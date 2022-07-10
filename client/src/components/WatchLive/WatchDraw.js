import  React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEffect, useState } from 'react';
import './WatchDraw.css'
import $ from 'jquery';


const WatchLiveArea = (props, {onClearLines, clearLines}) => {
    const [lines, setLines] = useState([]);
    const width = $('.single-live-screen').width();

    var name = props.name;
    var id = props.id;
    

    useEffect(() => {
        //loadImage();
        setLines(props.lines);
        console.log("aggiorno le lines");
    }, [props.lines])


    return (
        <>
            <h5 className='user-name'>{name}</h5>
            <div className= "watch-live-container">
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

export default WatchLiveArea;