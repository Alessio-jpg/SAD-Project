import { React } from 'react';
import { useEffect, useState} from 'react';
import './MatchedWord.css';

const MatchedWord = () => {
    const [matchedWord, setMatchedWord] = useState();
    
    useEffect(() => {
        setMatchedWord('prova3');
    })

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
