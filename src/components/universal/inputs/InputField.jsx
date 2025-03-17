export const InputField = ({ inputStyle = '', inputData }) => {
    return (
        <input
            type={inputData.type}
            value={inputData.value}
            placeholder={inputData.placeholder}
            onChange={inputData.onChange}
            onKeyDown={inputData.onKeyDown}
            required={inputData.required ?? false}
            className={`${inputStyle}`}
        />
    )
}