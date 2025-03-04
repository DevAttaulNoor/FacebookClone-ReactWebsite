export const TextareaField = ({ textareaStyle = '', textareaData }) => {
    return (
        <textarea
            rows={textareaData.rows}
            onChange={textareaData.onChange}
            placeholder={textareaData.placeholder}
            className={textareaStyle}
        >
            {textareaData.value}
        </textarea>
    )
}
