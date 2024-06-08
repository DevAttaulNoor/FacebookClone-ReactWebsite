import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LazyLoadingImage = ({ key, alt, effect, className, lowResSrc, highResSrc }) => {
    return (
        <LazyLoadImage
            key={key}
            alt={alt}
            effect={effect}
            placeholderSrc={lowResSrc}
            src={highResSrc}
            className={className}
        />
    );
};

export default LazyLoadingImage;