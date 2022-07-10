import { React } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEffect, useState, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import {SocketContext} from '../../socket';
import $ from 'jquery';
import './DrawingArea.css';

const DrawingArea = ({onClearLines, clearLines}) => {

    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    const width = $('.drawing-area').width();
    const socket = useContext(SocketContext);

    useEffect(() => {
        //loadImage();
    }, [clearLines])

    const sendDrawing = (e) => {
        isDrawing.current = false;
        console.log(lines);

        socket.emit("upload-event", lines);
    }

    const clearDrawing = (e) => {
        isDrawing.current = false;
        setLines([]);
        socket.emit("upload-event", []);
    };

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [pos.x/width, pos.y/width] }]);
    };
    
    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
          return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
    
        // To draw line
        let lastLine = lines[lines.length - 1];
        
        if(lastLine) {
            // add point
            lastLine.points = lastLine.points.concat([point.x/width, point.y/width]);
                
            // replace last
            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        }

        socket.emit("upload-event", lines);
        
    };
    
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return (
        <div className="drowing-container">
            <div className=" text-center text-dark">
                <Stage
                    width={width}
                    height={width}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                    className="canvas-stage"
                >
                    <Layer>
                        {lines.map((line, i) => (
                            <Line
                            key={i}
                            points={line.points.map(function(x) {return x * width})}
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
                
                <button className="send-button" onClick={sendDrawing}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <p>Invia</p>
                </button>
                <button className="delete-button" onClick={clearDrawing}>
                    <FontAwesomeIcon icon={faEraser} /> 
                    <p>Cancella</p>            
                </button>
                
            </div>
        </div>
    )
}



export default DrawingArea;