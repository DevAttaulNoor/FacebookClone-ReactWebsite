import '../../CSS/UniversalComponent/LoadingLine.css'
import React, { useEffect } from 'react';

function LoadingLine({ progress }) {
    useEffect(() => {
        const interval = setInterval(() => {
            if (progress < 100) {
                progress = progress + 1;
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [progress]);

    return (
        <div className="loadingLine">
            <div className="loadingLinefill" style={{ width: `${progress}%` }}></div>
        </div>
    );
}

export default LoadingLine