import { React, useContext } from 'react';
import { useEffect, useState} from 'react';
import {SocketContext} from '../../socket'; 
import './MatchedWord.css';

const MatchedWord = () => {
    const [matchedWord, setMatchedWord] = useState();
    
    useEffect(() => {
        setMatchedWord('prova3');
    }, [])
    const socket = useContext(SocketContext);
    socket.on("neural-guess", (pred) => {setMatchedWord(pred)})

    return (
        <div className='matchedWord-container'>
            <p className='legend'>Hai disegnato</p>
            <div className='matchedWord'>
                <p>{matchedWord}</p>
            </div>
        </div>
    )
}

export default MatchedWord;
