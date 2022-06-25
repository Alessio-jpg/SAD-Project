import { React } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './DrawingArea.css';

const DrawingArea = ({onClearLines, clearLines}) => {

    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    useEffect(() => {
        //loadImage();
    }, [clearLines])
    
    const sendDrawing = (e) => {
        isDrawing.current = false;
        console.log(lines);
    }

    const clearDrawing = (e) => {
        isDrawing.current = false;
        setLines([]);
    };

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);
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
            lastLine.points = lastLine.points.concat([point.x, point.y]);
                
            // replace last
            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        }
        
    };
    
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return (
        <div className="drowing-container">
            <div className=" text-center text-dark">
                <Stage
                    width={700}
                    height={700}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    className="canvas-stage"
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