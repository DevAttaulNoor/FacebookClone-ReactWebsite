import emailjs from "@emailjs/browser"
import { useRef, useState } from "react"
import { InputField } from "@components/universal/inputs/InputField"
import { TextareaField } from "@components/universal/inputs/TextareaField";
import { ButtonWithLoadingLayout } from "@layouts/ButtonWithLoadingLayout";

const Contact = () => {
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleContacting = (e) => {
        e.preventDefault()
        setLoading(true);

        // Check if number contains only numeric characters
        if (!/^[\d\s()+-]*$/.test(formData.number)) {
            alert("Please enter a valid phone number.")
            setLoading(false);
            return
        }

        emailjs
            .sendForm("service_lruy9xa", "template_u9kcc9l", formRef.current, {
                publicKey: "qAmbbJxm0DfTTKkkU",
            })
            .then(
                () => {
                    alert("Your message has been sucessfully sent!")
                    console.log("SUCCESS!")
                },
                (error) => {
                    alert("Please try again!")
                    console.log("FAILED...", error.text)
                },
            )

        setFormData({
            name: '',
            email: '',
            number: '',
            subject: '',
            message: '',
        })
        setLoading(false);
    }

    return (
        <div className="w-full h-full flex flex-col p-4 overflow-x-hidden overflow-y-auto sm:p-6 md:p-8 xl:p-10">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl font-bold">Contact the Developer</h1>

                <form
                    ref={formRef}
                    onSubmit={handleContacting}
                    className="flex flex-col gap-4"
                >
                    <InputField
                        inputData={{
                            type: 'text',
                            name: 'name',
                            value: formData.name,
                            placeholder: 'User name',
                            onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })),
                            required: true
                        }}
                        inputStyle="launchpageInputStyle w-full p-4"
                    />

                    <InputField
                        inputData={{
                            type: 'email',
                            name: 'email',
                            value: formData.email,
                            placeholder: 'Email address',
                            onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })),
                            required: true
                        }}
                        inputStyle="launchpageInputStyle w-full p-4"
                    />

                    <InputField
                        inputData={{
                            type: 'text',
                            minlength: 10,
                            maxlength: 15,
                            name: 'number',
                            value: formData.number,
                            placeholder: 'Phone number',
                            onChange: (e) => setFormData(prev => ({ ...prev, number: e.target.value })),
                            required: true
                        }}
                        inputStyle="launchpageInputStyle w-full p-4"
                    />

                    <InputField
                        inputData={{
                            type: 'text',
                            name: 'subject',
                            value: formData.subject,
                            placeholder: 'Subject',
                            onChange: (e) => setFormData(prev => ({ ...prev, subject: e.target.value })),
                            required: true
                        }}
                        inputStyle="launchpageInputStyle w-full p-4"
                    />

                    <TextareaField
                        textareaData={{
                            rows: '7',
                            maxLength: 250,
                            name: 'message',
                            value: formData.message,
                            placeholder: 'Message',
                            onChange: (e) => setFormData(prev => ({ ...prev, message: e.target.value })),
                            required: true
                        }}
                        textareaStyle='w-full p-4 rounded-md resize-none border border-slate-300 bg-white'
                    />

                    <ButtonWithLoadingLayout
                        loadingState={loading}
                        btnStyleClass={'w-full rounded-md border border-slate-100 bg-customBlue-default text-white outline-none'}
                        loadingBtn={{
                            btnStyleClass: '!py-2',
                            textStyleClass: 'w-6 h-6'
                        }}
                        actionBtn={{
                            text: 'Submit',
                            textStyleClass: 'text-xl font-semibold',
                        }}
                    />
                </form>
            </div>
        </div>
    )
}

export default Contact