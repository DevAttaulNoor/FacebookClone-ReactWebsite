import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "@services/firebase";

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

const handleSigningUp = async (e, formDataInitial, formData, setFormData, setError, setLoading) => {
    e.preventDefault();
    setLoading(true);

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredentials.user;

        let photoURL = "";
        if (formData.profilePhoto) {
            const file = formData.profilePhoto;
            const storageRef = ref(storage, `Users/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            photoURL = await getDownloadURL(storageRef);
        }

        await updateProfile(user, {
            displayName: `${formData.name.first} ${formData.name.last}`,
            photoURL: photoURL,
        });

        await setDoc(doc(db, "Users", user.uid), {
            uid: user.uid,
            email: user.email,
            gender: formData.gender,
            username: user.displayName,
            profilePhoto: photoURL,
            dob: `${formData.dob.day}/${formData.dob.month}/${formData.dob.year}`,
        });

        setError('');
        setLoading(false);
        setFormData(formDataInitial);
    } catch (error) {
        setLoading(false);
        setError(error.message);
        console.error("User creation failed", error);
    }
};

export { handleLoggingIn, handleLoggingOut, handleSigningUp }