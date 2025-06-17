export const TextareaField = ({ textareaStyle = '', textareaData }) => {
    return (
        <textarea
            className={textareaStyle}
            rows={textareaData.rows}
            name={textareaData.name}
            value={textareaData.value}
            onChange={textareaData.onChange}
            maxLength={textareaData.maxLength}
            placeholder={textareaData.placeholder}
        />
    )
}
