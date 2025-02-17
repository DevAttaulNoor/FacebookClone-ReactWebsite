import { useState } from "react";
import { Link } from "react-router";
import { auth, db } from "@services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Routes } from "@constants/Routes";
import { InputField } from "@components/universal/inputs/InputField";
import { setDoc, doc } from "firebase/firestore";

const genderOptions = [
    {
        id: 1,
        title: 'Male'
    },
    {
        id: 2,
        title: 'Female'
    },
    {
        id: 3,
        title: 'Trans'
    },
];

const dobOptions = [
    {
        id: 1,
        title: 'day',
        value: Array.from({ length: 31 }, (_, i) => i + 1)
    },
    {
        id: 2,
        title: 'month',
        value: Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleString('en', { month: 'short' })),
    },
    {
        id: 3,
        title: 'year',
        value: Array.from({ length: 100 }, (_, i) => new Date().getUTCFullYear() - i),
    },
];

const initialState = {
    name: { first: '', last: '' },
    email: '',
    gender: '',
    password: '',
    dob: { day: "", month: "", year: "" },
};

const Signup = () => {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');

    const handleDobChange = (type, value) => {
        setFormData(prev => ({
            ...prev,
            dob: { ...prev.dob, [type]: value }
        }));
    };

    const handleGenderChange = (value) => {
        setFormData(prev => ({
            ...prev,
            gender: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredentials.user;

            await updateProfile(user, {
                displayName: `${formData.name.first} ${formData.name.last}`,
            });

            await setDoc(doc(db, "Users", user.uid), {
                uid: user.uid,
                email: user.email,
                gender: formData.gender,
                username: user.displayName,
                dob: `${formData.dob.day}/${formData.dob.month}/${formData.dob.year}`,
            });

            setFormData(initialState)
            setError('');
            console.log("User creation successful", user);
        } catch (error) {
            setError(error.message);
            console.error("User creation failed", error);
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center py-8 gap-8 overflow-y-auto">
            <h1 className="text-[64px] font-bold text-customBlue-default">facebook</h1>

            <div className="flex flex-col rounded-lg bg-white shadow-customFull">
                <div className="flex flex-col items-center justify-center px-4 py-2.5">
                    <h1 className="text-center text-2xl font-bold">
                        Create a new account
                    </h1>
                    <p className="font-light text-slate-700">
                        It's quick and easy.
                    </p>
                </div>

                <hr className="text-slate-500" />

                <div className="flex flex-col items-center gap-3.5 p-4">
                    <form
                        onSubmit={handleSignup}
                        className="flex flex-col gap-3.5"
                    >
                        <div className="w-full flex items-center gap-2.5">
                            <InputField
                                inputData={{
                                    type: 'text',
                                    value: formData.name.first,
                                    placeholder: "First name",
                                    onChange: (e) => setFormData(prev => ({ ...prev, name: { ...prev.name, first: e.target.value } })),
                                    required: true,
                                }}
                                inputStyle="px-3 py-2"
                            />

                            <InputField
                                inputData={{
                                    type: 'text',
                                    value: formData.name.last,
                                    placeholder: "Last name",
                                    onChange: (e) => setFormData(prev => ({ ...prev, name: { ...prev.name, last: e.target.value } })),
                                    required: true,
                                }}
                                inputStyle="px-3 py-2"
                            />
                        </div>

                        <InputField
                            inputData={{
                                type: 'email',
                                value: formData.email,
                                placeholder: "Email address",
                                onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })),
                                required: true,
                            }}
                            inputStyle="px-3 py-2"
                        />

                        <InputField
                            inputData={{
                                type: 'password',
                                value: formData.password,
                                placeholder: "New password",
                                onChange: (e) => setFormData(prev => ({ ...prev, password: e.target.value })),
                                required: true,
                            }}
                            inputStyle="px-3 py-2"
                        />

                        <div className="flex flex-col gap-2">
                            <h5 className="text-xs text-customGray-200">Date of birth</h5>

                            <div className="grid grid-cols-3 gap-2.5">
                                {dobOptions.map((data) => (
                                    <select 
                                        key={data.id}
                                        className="w-full px-1 py-2 outline-none rounded-md border border-slate-300 cursor-pointer"
                                        value={formData.dob[data.title]} 
                                        onChange={(e) => handleDobChange(data.title, e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select {data.title}</option>
                                        {data.value.map((elem, index) => (
                                            <option key={index} value={elem}>{elem}</option>
                                        ))}
                                    </select>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h5 className="text-xs text-customGray-200">Gender</h5>

                            <div className="grid grid-cols-3 gap-2.5">
                                {genderOptions.map((data) => (
                                    <div 
                                        key={data.id} 
                                        onClick={() => handleGenderChange(data.title)}
                                        className="w-full flex items-center justify-between p-2 rounded-md border border-slate-300 cursor-pointer"
                                    >
                                        <p>{data.title}</p>
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value={data.title}  
                                            checked={formData.gender === data.title}  
                                            onChange={() => handleGenderChange(data.title)} 
                                            className="cursor-pointer" 
                                            required 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-96">
                            <p className="mb-4 text-xs text-customGray-200">
                                People who use our service may have uploaded
                                your contact information to Facebook.{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Learn more
                                </span>
                                .
                            </p>
                            <p className="text-xs text-customGray-200">
                                By clicking Sign Up, you agree to our{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Terms
                                </span>
                                ,{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Privacy Policy
                                </span>{" "}
                                and{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Cookies Policy
                                </span>
                                . You may receive SMS notifications from us and
                                can opt out at any time.
                            </p>
                        </div>

                        <button
                            className="mx-auto w-fit rounded-md bg-[#42b72a] px-16 py-2 text-lg font-bold text-white"
                        >
                            Sign Up
                        </button>

                        {error && <p className="text-center text-sm text-red-500">{error}</p>}
                    </form>

                    <Link
                        to={Routes.LOGIN.path}
                        className="text-lg text-customBlue-default"
                    >
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;