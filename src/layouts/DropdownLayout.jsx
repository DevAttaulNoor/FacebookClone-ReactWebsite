import { useEffect, useRef } from 'react';

export const DropdownLayout = ({ isOpen, isClose, dropdownContainerStyle = '', children }) => {
    const dropdownRef = useRef(null);

    // Handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                isClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isClose]);

    return (
        <>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`${dropdownContainerStyle} absolute`}
                >
                    {children}
                </div>
            )}
        </>
    );
};