export const InputField = ({ inputStyle = '', inputData }) => {
    return (
        <input
            className={`${inputStyle}`}
            id={`${inputData.id}`}
            type={inputData.type}
            name={inputData.name}
            value={inputData.value}
            onChange={inputData.onChange}
            minLength={inputData.minlength}
            maxLength={inputData.maxlength}
            onKeyDown={inputData.onKeyDown}
            placeholder={inputData.placeholder}
            required={inputData.required ?? false}
        />
    )
}