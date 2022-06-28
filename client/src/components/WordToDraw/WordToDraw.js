import { React } from 'react';
import './WordToDraw.css';

const WordToDrawArea = () => {

    var fisrtWard = 'prova1';
    var secondWord = 'prova2';

    return (
        <div className='words-area'>
            <div className='words-container'>
                <div className='first-word'>
                    <p>{fisrtWard}</p>
                </div>
                <div className='choose'>
                    <p>O</p>
                </div>
                <div className='second-word'>
                    <p>{secondWord}</p>
                </div>
            </div>
        </div>
    )
}

export default WordToDrawArea;