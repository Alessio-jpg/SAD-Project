import  React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEffect, useState } from 'react';
import './WatchLive.css'
import $ from 'jquery';


const WatchLiveArea = ({onClearLines, clearLines}) => {
    const [lines, setLines] = useState([]);
    const width = $('.single-live-screen').width();

    useEffect(() => {
        //loadImage();
    }, [clearLines])


    return (
        <>
            <h5 className='user-name'>Name</h5>
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
                            points={line.points}
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
            </div>
        </>
    )
}

export default WatchLiveArea;