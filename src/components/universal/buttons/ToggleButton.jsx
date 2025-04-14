import '../../../assets/css/ToggleButtonStyle.css';

export const ToggleButton = ({ onClick, checked }) => {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                onChange={onClick}
                checked={checked}
            />
            <div className="toggle-switch-background">
                <div className="toggle-switch-handle"></div>
            </div>
        </label>
    );
};
