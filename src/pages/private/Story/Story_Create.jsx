import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@contexts/AuthContext";
import { db, storage } from "@services/firebase";
import { ReactIcons } from "@constants/ReactIcons";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { BasicButton } from "@components/universal/buttons/BasicButton";
import { TextareaField } from "@components/universal/inputs/TextareaField";
import { ButtonWithLoadingLayout } from "@layouts/ButtonWithLoadingLayout";
import { StoryContainerContent } from "@components/story-related/StoryContainerContent";

const Story_Create = () => {
    const { user } = useAuth();
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
        fonts: [
            { label: 'Helvetica', value: 'font-helvetica' },
            { label: 'Times New Roman', value: 'font-times' },
            { label: 'Courier New', value: 'font-courier' },
            { label: 'Verdana', value: 'font-verdana' },
        ],
        activeFont: 'font-helvetica',
    });

    const [textCardBgColor, setTextCardBgColor] = useState({
        colors: ['blue', 'red', 'green', 'brown', 'yellow', 'purple', 'cyan', 'black', 'violet', 'gray'],
        activeColor: 'blue',
    });

    const handleDiscardClick = () => {
        setPhotoInput(prev => ({ ...prev, value: '' }))
        setTextInput({
            value: '',
            count: 250,
        })
        setStoryContent({
            isStoryCardsVisible: true,
            isTextStoryContentVisible: false,
            isPhotoStoryContentVisible: false
        });
        setTextCardBgColor(prev => ({ ...prev, activeColor: textCardBgColor.colors[0] }))
        setCardsFontFamily(prev => ({ ...prev, activeFont: cardsFontFamily.fonts[0].value }))

        // Reset the file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleTextStoryContent = () => {
        setStoryContent({
            isStoryCardsVisible: false,
            isTextStoryContentVisible: true,
            isPhotoStoryContentVisible: false
        });
    };

    const handlePhotoStoryContent = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage && selectedImage.type.includes('image')) {
            setPhotoInput({
                value: selectedImage,
                url: (URL.createObjectURL(selectedImage))
            })
            setStoryContent({
                isStoryCardsVisible: false,
                isTextStoryContentVisible: false,
                isPhotoStoryContentVisible: true
            });
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
                const canvas = await html2canvas(document.getElementById('textStoryContent'));
                const dataUrl = canvas.toDataURL('image/png');
                const blob = await fetch(dataUrl).then(res => res.blob());

                // Generate a filename in the format "IMG-YYYYMMDD"
                const now = new Date();
                const year = now.getFullYear(); // YYYY
                const month = String(now.getMonth() + 1).padStart(2, '0'); // MM (zero-padded)
                const day = String(now.getDate()).padStart(2, '0'); // DD (zero-padded)
                const fileName = `IMG-${year}${month}${day}.png`; // Example: IMG-20240109.png

                const storageRef = ref(storage, `Stories/${user.uid}/${fileName}`);
                await uploadBytes(storageRef, blob);
                const background = await getDownloadURL(storageRef);

                await setDoc(storyPostRef, {
                    ...storyPostDetails,
                    message: textInput.value,
                    background: background,
                });
            }

            if (storyContent.isPhotoStoryContentVisible && photoInput.value) {
                const canvas = await html2canvas(document.getElementById('photoStoryContent'));
                const dataUrl = canvas.toDataURL('image/png');
                const blob = await fetch(dataUrl).then(res => res.blob());
                const storageRef = ref(storage, `Stories/${user.uid}/${photoInput.value.name}`);
                await uploadBytes(storageRef, blob);
                const background = await getDownloadURL(storageRef);

                await setDoc(storyPostRef, {
                    ...storyPostDetails,
                    message: textInput.value,
                    background: background
                });
            }

            // Reset the form and loading state
            handleDiscardClick();
            setUploadLoading(false);
        } catch (error) {
            setUploadLoading(false);
            console.error("Error uploading story: ", error);
        }
    };

    return (
        <div className="pageWithLeftbarStyle">
            <div className='leftbarStyle relative flex flex-col'>
                <div className="flex items-center justify-between p-4">
                    <h5 className="text-2xl font-bold">Your story</h5>
                    <span className="text-2xl p-2 rounded-full bg-customGray-default cursor-pointer hover:bg-customGray-100">{ReactIcons.SETTING}</span>
                </div>

                <div className="flex items-center px-4 gap-2 mb-3">
                    <ProfileAvatar
                        userData={user}
                        imageStyleClass="w-14 h-14"
                        iconStyleClass="text-[56px]"
                    />

                    <p className="font-medium">{user?.username}</p>
                </div>

                <span className="w-full h-[1px] bg-customGray-100" />

                {(storyContent.isTextStoryContentVisible || storyContent.isPhotoStoryContentVisible) && (
                    <div className="h-full flex flex-col justify-between">
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
                                onChange={(e) => setCardsFontFamily((prev) => ({ ...prev, activeFont: e.target.value }))}
                            >
                                {cardsFontFamily.fonts.map((font, index) => (
                                    <option key={index} value={font.value} className="text-sm">
                                        {font.label}
                                    </option>
                                ))}
                            </select>

                            {storyContent.isTextStoryContentVisible && (
                                <div className='p-4 rounded-lg border'>
                                    <h6 className="text-sm mb-2 text-customGray-300">Backgrounds</h6>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {textCardBgColor.colors.map((color, index) => (
                                            <span
                                                key={index}
                                                onClick={() => setTextCardBgColor(prev => ({ ...prev, activeColor: color }))}
                                                style={{ backgroundColor: color }}
                                                className={`${textCardBgColor.activeColor === color ? 'border-customBlue-default' : 'border-transparent'} w-7 h-7 rounded-full border-[3px] cursor-pointer`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 p-4 shadow-customFull2 bg-white">
                            <BasicButton
                                btnStyleClass="h-full bg-customGray-100 hover:bg-customGray-default"
                                btnData={{
                                    text: 'Discard',
                                    textStyleClass: 'text-base',
                                    onClick: handleDiscardClick
                                }}
                            />

                            <ButtonWithLoadingLayout
                                loadingState={uploadLoading}
                                btnStyleClass={'h-full text-white bg-customBlue-default'}
                                loadingBtn={{
                                    btnStyleClass: '!py-1',
                                    textStyleClass: 'w-6 h-6'
                                }}
                                actionBtn={{
                                    text: 'Share to Story',
                                    textStyleClass: 'text-base',
                                    onClick: handleStoryPosting
                                }}
                            />
                        </div>
                    </div>
                )}
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

                {(storyContent.isTextStoryContentVisible || storyContent.isPhotoStoryContentVisible) && (
                    <StoryContainerContent
                        storyData={{
                            id: (storyContent.isTextStoryContentVisible && 'textStoryContent') || (storyContent.isPhotoStoryContentVisible && 'photoStoryContent'),
                            background: (storyContent.isTextStoryContentVisible && textCardBgColor.activeColor) || (storyContent.isPhotoStoryContentVisible && `url(${photoInput.url})`),
                            fontfamily: cardsFontFamily.activeFont,
                            inputValue: textInput.value
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default Story_Create