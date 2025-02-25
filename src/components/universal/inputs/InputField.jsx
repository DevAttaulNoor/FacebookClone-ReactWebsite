export const InputField = ({ inputStyle = 'w-full',inputData }) => {
    return (
        <input
            type={inputData.type}
            value={inputData.value}
            placeholder={inputData.placeholder}
            onChange={inputData.onChange}
            className={`${inputStyle} rounded-md border border-slate-300`}
            required={inputData.required ?? false}
        />
    )
}
