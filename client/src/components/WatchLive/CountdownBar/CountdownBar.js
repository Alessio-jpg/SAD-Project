import { React } from 'react';
import { useEffect, useState, useRef } from 'react';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CountdownBar.css';

const CountDownBar = () => {
    const [percentage, setPercentage] = useState(30);
    const timeout = useRef(false);

    useEffect(() => {
        let interval = null;
        if(!timeout.current) {
            interval = setInterval(() => {
                setPercentage(percentage => percentage - 1)
            }, 1000);
        } else {
            clearInterval(interval);
        }
        updateTimeout();
        return () => clearInterval(interval);
    }, [timeout, percentage]);

    function updateTimeout() {
        if(percentage == 0) {
            timeout.current = true;
            alert('Fine');
        }
    }

    return (
        <div className='bar-container'>
            <ProgressBar max={30} min={1} now={percentage} animated/>
        </div>
    )
}

export default CountDownBar;

