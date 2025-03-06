import { useRef, useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthUser } from "@hooks/useAuthUser"
import { db, storage } from "@services/firebase";
import { ReactIcons } from "@constants/ReactIcons"
import { TextareaField } from "@components/universal/inputs/TextareaField"

const Story_Create = () => {
    const user = useAuthUser();
    const inputRef = useRef(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [textInput, setTextInput] = useState({
        value: '',
        count: 250,
    })
    const [photoInput, setPhotoInput] = useState({
        value: '',
        url: '',
    })
    const [storyContent, setStoryContent] = useState({
        isStoryCardsVisible: true,
        isTextStoryContentVisible: false,
        isPhotoStoryContentVisible: false,
    })
    const [cardsFontFamily, setCardsFontFamily] = useState({
        fonts: ['Helvetica', 'Times New Roman', 'Courier New', 'Verdana'],
        activeFont: 'Helvetica',
    });
    const [textCardBgColor, setTextCardBgColor] = useState({
        colors: ['blue-600', 'red-600', 'green-600', '[#A52A2A]', 'yellow-500', 'purple-600', 'cyan-500', '[#FFD700]', 'violet-500', 'gray-300'],
        activeColor: 'blue-600',
    });

    const handleDiscardClick = () => {
        setTextInput(prev => ({ ...prev, value: '' }))
        setPhotoInput(prev => ({ ...prev, value: '' }))
        setTextInput(prev => ({ ...prev, count: 250 }))
        setStoryContent(prev => ({ ...prev, isStoryCardsVisible: true }));
        setStoryContent(prev => ({ ...prev, isTextStoryContentVisible: false }));
        setStoryContent(prev => ({ ...prev, isPhotoStoryContentVisible: false }));
        setTextCardBgColor(prev => ({ ...prev, activeColor: textCardBgColor.colors[0] }))

        // Reset the file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleTextStoryContent = () => {
        setStoryContent(prev => ({ ...prev, isStoryCardsVisible: false }));
        setStoryContent(prev => ({ ...prev, isTextStoryContentVisible: true }));
        setStoryContent(prev => ({ ...prev, isPhotoStoryContentVisible: false }));
    };

    const handlePhotoStoryContent = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage && selectedImage.type.includes('image')) {
            setPhotoInput(prev => ({ ...prev, value: selectedImage }));
            setPhotoInput(prev => ({ ...prev, url: (URL.createObjectURL(selectedImage)) }));
            setStoryContent(prev => ({ ...prev, isStoryCardsVisible: false }));
            setStoryContent(prev => ({ ...prev, isTextStoryContentVisible: false }));
            setStoryContent(prev => ({ ...prev, isPhotoStoryContentVisible: true }));
        } else {
            console.error('Invalid file type. Please select an image.');
        }
    };

    const handleStoryPosting = async (e) => {
        e.preventDefault();
        setUploadLoading(true);

        const storyPostDetails = {
            uid: user.uid,
            email: user.email,
            timestamp: Math.floor(new Date().getTime() / 1000),
        };

        try {
            const storyPostRef = doc(collection(db, "Stories"));

            if (storyContent.isTextStoryContentVisible && textInput.value) {
                await setDoc(storyPostRef, {
                    ...storyPostDetails,
                    message: textInput.value,
                    background: textCardBgColor.activeColor
                });
            }

            if (storyContent.isPhotoStoryContentVisible && photoInput.value) {
                const file = photoInput.value;
                const storageRef = ref(storage, `Stories/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                let background = await getDownloadURL(storageRef);

                await setDoc(storyPostRef, {
                    ...storyPostDetails,
                    message: textInput.value,
                    background: background
                });
            }

            handleDiscardClick();
            setUploadLoading(false);
        } catch (error) {
            setUploadLoading(false);
            console.error("Error uploading story: ", error);
        }
    };

    return (
        <div className="w-full h-full flex">
            <div className='relative w-[420px] flex flex-col shadow-customFull2 bg-white'>
                <div className="flex items-center justify-between p-4">
                    <h5 className="text-2xl font-bold">Your story</h5>
                    <span className="text-2xl p-2 rounded-full bg-customGray-default cursor-pointer hover:bg-customGray-100">{ReactIcons.SETTING}</span>
                </div>

                <div className="flex items-center px-4 gap-2 mb-3">
                    {user?.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt={`profile picture of ${user.username}`}
                            className="w-14 h-14 rounded-full border border-customGray-100 object-contain bg-white"
                        />
                    ) : (
                        <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                    )}

                    <p className="font-medium">{user.username}</p>
                </div>

                <span className="w-full h-[1px] bg-customGray-100" />

                <div className="h-full flex flex-col justify-between">
                    {storyContent.isTextStoryContentVisible && (
                        <div className='flex flex-col p-4 gap-4'>
                            <div className='flex flex-col'>
                                <TextareaField
                                    textareaStyle={'p-4 rounded-lg border resize-none'}
                                    textareaData={{
                                        rows: '7',
                                        placeholder: 'Start typing',
                                        value: textInput.value,
                                        maxLength: 250,
                                        onChange: (e) => setTextInput(prev => ({ ...prev, value: e.target.value }))
                                    }}
                                />

                                <p className="text-end text-xs font-medium text-customGray-300">
                                    {textInput.count - textInput.value.length} characters limit
                                </p>
                            </div>

                            <select
                                className="px-3 py-4 rounded-lg border"
                                onChange={(e) => setCardsFontFamily(prev => ({ ...prev, activeFont: e.target.value }))}
                            >
                                {cardsFontFamily.fonts.map((font, index) => (
                                    <option
                                        key={index}
                                        value={font}
                                        className="text-sm"
                                    >
                                        {font}
                                    </option>
                                ))}
                            </select>

                            <div className='p-4 rounded-lg border'>
                                <h6 className="text-sm mb-2 text-customGray-300">Backgrounds</h6>

                                <div className="flex flex-wrap items-center gap-2">
                                    {textCardBgColor.colors.map((color, index) => (
                                        <span
                                            key={index}
                                            onClick={() => setTextCardBgColor(prev => ({ ...prev, activeColor: color }))}
                                            className={`${textCardBgColor.activeColor === color ? 'border-customBlue-default' : 'border-transparent'} w-7 h-7 rounded-full border-[3px] cursor-pointer bg-${color}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {storyContent.isPhotoStoryContentVisible && (
                        <div className='flex flex-col p-4 gap-4'>
                            <div className='flex flex-col'>
                                <TextareaField
                                    textareaStyle={'p-4 rounded-lg border resize-none'}
                                    textareaData={{
                                        rows: '7',
                                        placeholder: 'Start typing',
                                        value: textInput.value,
                                        maxLength: 250,
                                        onChange: (e) => setTextInput(prev => ({ ...prev, value: e.target.value }))
                                    }}
                                />

                                <p className="text-end text-xs font-medium text-customGray-300">
                                    {textInput.count - textInput.value.length} characters limit
                                </p>
                            </div>

                            <select
                                className="px-3 py-4 rounded-lg border"
                                onChange={(e) => setCardsFontFamily(prev => ({ ...prev, activeFont: e.target.value }))}
                            >
                                {cardsFontFamily.fonts.map((font, index) => (
                                    <option
                                        key={index}
                                        value={font}
                                        className="text-sm"
                                    >
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(storyContent.isTextStoryContentVisible || storyContent.isPhotoStoryContentVisible) && (
                        <div className="flex items-center gap-3 p-4 shadow-customFull2 bg-white">
                            <button
                                onClick={handleDiscardClick}
                                className="w-full font-semibold p-2.5 rounded-lg cursor-pointer bg-customGray-100"
                            >
                                Discard
                            </button>

                            {uploadLoading ? (
                                <button className="w-full font-semibold p-2.5 rounded-lg cursor-pointer text-white bg-customBlue-default">
                                    ...
                                </button>
                            ) : (
                                <button
                                    onClick={handleStoryPosting}
                                    className="w-full font-semibold p-2.5 rounded-lg cursor-pointer text-white bg-customBlue-default"
                                >
                                    Share to Story
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full flex justify-center py-4'>
                {storyContent.isStoryCardsVisible && (
                    <div className='flex items-center justify-center gap-4'>
                        <div
                            onClick={() => inputRef.current.click()}
                            className="w-56 h-80 flex flex-col items-center justify-center gap-2.5 rounded-xl cursor-pointer bg-gradient-to-r from-[#654EEE] from-[4%] to-[#BBE5FD] to-[97%]"
                        >
                            <span className="text-xl p-3 rounded-full shadow-2xl bg-white">{ReactIcons.PHOTO_GALLERY}</span>
                            <h5 className="text-center text-sm font-semibold text-white">Create a Photo Story</h5>
                            <input
                                type="file"
                                accept="image/*"
                                ref={inputRef}
                                className="hidden"
                                onChange={handlePhotoStoryContent}
                            />
                        </div>

                        <div
                            onClick={handleTextStoryContent}
                            className="w-56 h-80 flex flex-col items-center justify-center gap-2.5 rounded-xl cursor-pointer bg-gradient-to-br from-[#B86DE0] to-[#CE57B1]"
                        >
                            <span className="text-xl p-3 rounded-full shadow-2xl bg-white">{ReactIcons.TEXT}</span>
                            <h5 className="text-center text-sm font-semibold text-white">Create a Text Story</h5>
                        </div>
                    </div>
                )}

                {storyContent.isTextStoryContentVisible && (
                    <div className="w-[80%] flex flex-col gap-5 p-4 rounded-lg shadow-lg bg-white">
                        <h5 className="text-sm font-medium">Preview</h5>

                        <div className="h-full flex items-center justify-center p-4 rounded-lg bg-black">
                            <div className={`font-${cardsFontFamily.activeFont} w-72 h-full text-xl font-semibold flex items-center justify-center py-10 px-8 rounded-2xl break-words bg-no-repeat bg-cover overflow-x-hidden overflow-y-auto text-white bg-${textCardBgColor.activeColor}`}>
                                {textInput.value}
                            </div>
                        </div>
                    </div>
                )}

                {storyContent.isPhotoStoryContentVisible && (
                    <div className="w-[80%] flex flex-col gap-5 p-4 rounded-lg shadow-lg bg-white">
                        <h5 className="text-sm font-medium">Preview</h5>

                        <div className="h-full flex items-center justify-center p-4 rounded-lg bg-black">
                            <div
                                style={{ backgroundImage: `url(${photoInput.url})` }}
                                className={`font-${cardsFontFamily.activeFont} w-72 h-full text-xl font-semibold flex items-center justify-center py-10 px-8 rounded-2xl break-words bg-no-repeat bg-cover overflow-x-hidden overflow-y-auto text-white`}
                            >
                                {textInput.value}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Story_Create