export const InputField = ({ inputStyle = '', inputData }) => {
    return (
        <input
            type={inputData.type}
            value={inputData.value}
            placeholder={inputData.placeholder}
            onChange={inputData.onChange}
            className={`${inputStyle}`}
            required={inputData.required ?? false}
        />
    )
}