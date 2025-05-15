import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@services/firebase";

const handleLoggingOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
}

const handleLoggingIn = async (e, formData, setFormData, setError, setLoading) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setFormData({
            email: '',
            password: ''
        });
        setError('');
        setLoading(false);
    } catch (error) {
        let errorMsg = "Failed to sign in.";
        switch (error.code) {
            case "auth/invalid-email":
                errorMsg = "Invalid email address.";
                break;
            case "auth/user-not-found":
                errorMsg = "No user found with this email.";
                break;
            case "auth/wrong-password":
                errorMsg = "Incorrect password.";
                break;
            default:
                errorMsg = error.message;
        }

        setError(errorMsg);
        setLoading(false);
    }
};

export { handleLoggingIn, handleLoggingOut }