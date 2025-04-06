import { TextareaField } from "@components/universal/inputs/TextareaField";
import { ReactIcons } from "@constants/ReactIcons"
import { useAuth } from "@contexts/AuthContext";
import { db, storage } from "@services/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react"

const Reel_Create = () => {
    const inputRef = useRef(null);
    const { user } = useAuth();
    const [stage, setStage] = useState(1)
    const [reelLoading, setReelLoading] = useState(false);
    const [input, setInput] = useState({
        media: '',
        message: '',
    });

    const handleReel = async () => {
        try {
            setReelLoading(true);
            const file = input.media;
            const storageRef = ref(storage, `Reels/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            let mediaUrl = await getDownloadURL(storageRef);

            await setDoc(doc(collection(db, "Reels")), {
                uid: user.uid,
                video: mediaUrl,
                email: user.email,
                message: input.message,
                timestamp: Math.floor(new Date().getTime() / 1000),
            });

            setReelLoading(false);
            setInput({
                media: '',
                message: '',
            })
            setStage(1)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="w-full h-full flex">
            <div className='leftbarStyle relative flex flex-col'>
                <div className="flex flex-col p-4">
                    <p className="text-xs text-customGray-200">Create a reel</p>
                    <h5 className="text-2xl font-bold">Upload Video</h5>
                </div>

                <div className="h-full flex flex-col justify-between px-4">
                    {stage === 1 && (
                        <button
                            onClick={() => inputRef.current.click()}
                            className="h-60 flex flex-col items-center justify-center p-4 border rounded-md"
                        >
                            <span className="text-2xl p-2 mb-1.5 rounded-full bg-customGray-100">{ReactIcons.VIDEO}</span>
                            <h5 className="font-medium">{input.media ? 'Replace video' : 'Add Video'}</h5>
                            <p className="text-sm text-customGray-200">or drap and drop</p>

                            <input
                                type="file"
                                accept="video/*"
                                ref={inputRef}
                                className="hidden"
                                onChange={(e) => setInput(prev => ({ ...prev, media: e.target.files[0] }))}
                            />
                        </button>
                    )}

                    {stage === 2 && (
                        <TextareaField
                            textareaStyle={'p-4 rounded-lg border resize-none'}
                            textareaData={{
                                rows: 4,
                                value: input.message,
                                placeholder: 'Describe your reel...',
                                onChange: (e) => setInput(prev => ({ ...prev, message: e.target.value }))
                            }}
                        />
                    )}
                </div>

                <div className="flex items-center gap-3 p-4 shadow-customFull2 bg-white">
                    {stage > 1 && (
                        <>
                            {stage < 0 ? (
                                <button
                                    className="w-full font-semibold p-2.5 rounded-lg cursor-not-allowed bg-customGray-100"
                                >
                                    Previous
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStage(stage - 1)}
                                    className="w-full font-semibold p-2.5 rounded-lg cursor-pointer bg-customGray-100"
                                >
                                    Previous
                                </button>
                            )}
                        </>
                    )}

                    {stage === 1 && (
                        <>
                            {input.media ? (
                                <button
                                    onClick={() => setStage(stage + 1)}
                                    className="w-full font-semibold p-2.5 rounded-lg cursor-pointer text-white bg-customBlue-default"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    className="w-full font-semibold p-2.5 rounded-lg cursor-not-allowed text-white bg-customBlue-default"
                                >
                                    Next
                                </button>
                            )}
                        </>
                    )}

                    {stage === 2 && (
                        <>
                            {reelLoading ? (
                                <button className="w-full flex items-center justify-center p-2 rounded-lg bg-customBlue-default">
                                    <div className='w-7 h-7 border-2 border-b-0 animate-spin rounded-full border-white' />
                                </button>
                            ) : (
                                <button
                                    onClick={handleReel}
                                    className="w-full font-semibold p-2.5 rounded-lg cursor-pointer text-white bg-customBlue-default"
                                >
                                    Publish
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className='w-full flex justify-center py-4'>
                <div className="w-[80%] flex flex-col gap-5 p-4 rounded-lg shadow-lg bg-white">
                    <h5 className="text-sm font-medium">Preview</h5>

                    {input.media ? (
                        <div className="h-full flex flex-col items-center justify-center p-4 border rounded-lg bg-black">
                            <video
                                loop
                                autoPlay
                                className="w-80 h-full border rounded-md object-cover border-white"
                            >
                                <source src={URL.createObjectURL(input.media)} type="video/mp4" />
                            </video>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-4 border rounded-lg bg-customGray-default">
                            <h5 className="text-xl font-bold text-customGray-300">Your Video Preview</h5>
                            <p className="text-lg font-light">Upload your video in order to see a preview here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Reel_Create