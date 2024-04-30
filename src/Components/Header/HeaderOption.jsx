import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderNormal from './HeaderNormal';
import HeaderTransformed from './HeaderTransformed';

function HeaderOption() {
    const pathsToHideHeader = ['/homepage/storyreels'];
    const showHeader = !pathsToHideHeader.includes(useLocation().pathname);

    return (
        <>
            {showHeader ? (
                <HeaderNormal />
            ) : (
                <HeaderTransformed />
            )}
        </>
    );
}

export default HeaderOption