import '../../CSS/UniversalComponent/LoadingLine.css'
import React, { useEffect, useRef } from 'react';

function LoadingLine({ progress }) {
    const progressRef = useRef(progress);

    useEffect(() => {
        const interval = setInterval(() => {
            if (progressRef.current < 100) {
                progressRef.current = progressRef.current + 1;
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loadingLine">
            <div className="loadingLinefill" style={{ width: `${progressRef.current}%` }}></div>
        </div>
    );
}

export default LoadingLine;