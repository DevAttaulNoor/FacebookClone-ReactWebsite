export const TextareaField = ({ textareaStyle = '', textareaData }) => {
    return (
        <textarea
            rows={textareaData.rows}
            value={textareaData.value}
            onChange={textareaData.onChange}
            maxLength={textareaData.maxLength}
            placeholder={textareaData.placeholder}
            className={textareaStyle}
        />
    )
}
