import { InputField } from "./InputField"

export const InputFieldWithFloatingLabel = ({ inputData, label }) => {
    return (
        <div className="relative">
            <InputField
                inputData={inputData}
                inputStyle="peer w-full p-4 rounded-md border border-slate-300 bg-white"
            />

            <label
                htmlFor="floating_outlined"
                className="absolute start-0 transform top-2 -translate-y-5 -translate-x-2 py-0.5 px-4 duration-300 scale-75 z-10 cursor-text text-slate-400 bg-transparent peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-x-0"
            >
                {label}
            </label>
        </div>
    )
}