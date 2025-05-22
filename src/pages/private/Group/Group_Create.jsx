import { useRef, useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@services/firebase";
import { useFriends } from "@hooks/useFriends";
import { useAuth } from "@contexts/AuthContext";
import { ReactIcons } from "@constants/ReactIcons";
import { DropdownLayout } from "@layouts/DropdownLayout";
import { ProfileAvatar } from "@components/universal/ProfileAvatar";
import { InputField } from "@components/universal/inputs/InputField";
import { BasicButton } from "@components/universal/buttons/BasicButton";
import { ButtonWithLoadingLayout } from "@layouts/ButtonWithLoadingLayout";
import group_coverphoto from '/Images/universal/group/group-coverphoto.png';

const groupComponents = [
    { id: 1, title: 'About' },
    { id: 2, title: 'Posts' },
    { id: 3, title: 'Members' },
];

const feedPostingOptions = [
    {
        id: 1,
        title: "Live video",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg",
    },
    {
        id: 2,
        title: "Photo/video",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j",
    },
    {
        id: 3,
        title: "Feeling/activity",
        icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77",
    },
];

const Group_Create = () => {
    const coverPhotoRef = useRef(null);
    const { user } = useAuth();
    const { acceptedFriends } = useFriends(user.uid);
    const [loading, setLoading] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [coverPhoto, setCoverPhoto] = useState('')
    const [searchInput, setSearchInput] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const searchedUser = acceptedFriends?.filter((data) =>
        data?.username?.toLowerCase().includes(searchInput.toLowerCase()) &&
        !selectedUsers.includes(data.uid)
    );

    const removeSelectedUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
    };

    const handleUserSelection = (userId) => {
        if (!selectedUsers.includes(userId)) {
            setSelectedUsers([...selectedUsers, userId]);
        }
        setSearchInput('');
    };

    const handleGroupCreation = async () => {
        try {
            setLoading(true);
            const allMembers = [...selectedUsers, user.uid];

            let coverPhotoUrl = "";
            if (coverPhoto) {
                const file = coverPhoto;
                const storageRef = ref(storage, `Groups/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);
                coverPhotoUrl = await getDownloadURL(storageRef);
            } else {
                const response = await fetch(group_coverphoto);
                const blob = await response.blob();
                const storageRef = ref(storage, `Groups/${user.uid}/cover_photo.jpg`);
                await uploadBytes(storageRef, blob);
                coverPhotoUrl = await getDownloadURL(storageRef);
            }

            await setDoc(doc(collection(db, "Groups")), {
                adminId: user.uid,
                adminEmail: user.email,
                name: groupName,
                members: allMembers,
                coverPhoto: coverPhotoUrl,
                timestamp: Math.floor(new Date().getTime() / 1000),
            });

            setLoading(false);
            setGroupName('');
            setCoverPhoto('');
            setSelectedUsers([]);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="pageWithLeftbarStyle">
            <div className='leftbarStyle relative flex flex-col'>
                <div className="flex flex-col p-4">
                    <p className="text-xs text-customGray-200">Create group</p>
                    <h5 className="text-2xl font-bold">Create group</h5>
                </div>

                <div className="flex items-center px-4 gap-2 mb-4">
                    <ProfileAvatar
                        userData={user}
                        imageStyleClass="w-10 h-10"
                        iconStyleClass="text-3xl"
                    />

                    <div className="flex flex-col gap-1">
                        <h5 className="font-medium leading-none">{user?.username}</h5>
                        <p className="text-sm leading-none text-customGray-200">Admin</p>
                    </div>
                </div>

                <div className="h-full flex flex-col px-4 gap-4">
                    <InputField
                        inputStyle="p-4 border rounded-md"
                        inputData={{
                            type: 'text',
                            value: groupName,
                            placeholder: 'Group name',
                            onChange: (e) => setGroupName(e.target.value),
                        }}
                    />

                    <div className="relative flex flex-col">
                        <div className="flex flex-col p-4 gap-2 border rounded-md">
                            <InputField
                                inputStyle=""
                                inputData={{
                                    type: 'text',
                                    value: searchInput,
                                    placeholder: 'Invite friends',
                                    onChange: (e) => setSearchInput(e.target.value),
                                }}
                            />

                            {selectedUsers.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map(userId => {
                                        const userData = acceptedFriends?.find(data => data?.uid === userId);
                                        return (
                                            <div key={userId} className="w-fit flex items-center p-2 gap-1 rounded-md text-customBlue-default bg-customGray-default">
                                                <p className="text-sm font-medium">{userData?.username}</p>
                                                <span
                                                    onClick={() => removeSelectedUser(userId)}
                                                    className="text-sm cursor-pointer"
                                                >
                                                    {ReactIcons.CLOSE}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <DropdownLayout
                            isOpen={searchInput}
                            isClose={selectedUsers.length > 0}
                            dropdownContainerStyle='top-14 right-0 left-0 p-2 border rounded-md bg-white'
                        >
                            {searchedUser.length > 0 ? (searchedUser.map((data) => (
                                <div
                                    key={data.uid}
                                    onClick={() => handleUserSelection(data.uid)}
                                    className="flex items-center px-2 py-1 mt-2 gap-2 rounded-md cursor-pointer first:mt-0 hover:bg-customGray-default"
                                >
                                    <ProfileAvatar
                                        userData={data}
                                        imageStyleClass="w-10 h-10"
                                        iconStyleClass="text-[38px]"
                                    />

                                    <p className="text-sm font-medium">{data.username}</p>
                                </div>
                            ))) : (
                                <p className="text-sm text-customGray-400">No users found</p>
                            )}
                        </DropdownLayout>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 shadow-customFull2 bg-white">
                    {groupName ? (
                        <ButtonWithLoadingLayout
                            loadingState={loading}
                            btnStyleClass={'text-white bg-customBlue-default'}
                            loadingBtn={{
                                btnStyleClass: '!py-1.5',
                                textStyleClass: 'w-6 h-6'
                            }}
                            actionBtn={{
                                text: 'Create',
                                textStyleClass: 'text-base',
                                onClick: handleGroupCreation
                            }}
                        />
                    ) : (
                        <BasicButton
                            btnStyleClass="cursor-not-allowed text-customGray-200 bg-customGray-100"
                            btnData={{
                                text: 'Create',
                                textStyleClass: 'text-base'
                            }}
                        />
                    )}
                </div>
            </div>

            <div className='w-full flex items-center justify-center'>
                <div className="w-2/3 flex flex-col justify-center p-4 gap-5 rounded-lg shadow-lg bg-white">
                    <h5 className="text-sm font-medium">Preview</h5>

                    <div className="h-full flex flex-col justify-between border rounded-lg overflow-y-auto bg-customGray-default">
                        <div className="flex flex-col gap-4 shadow-md bg-white">
                            <div
                                style={{ backgroundImage: `url(${coverPhoto ? URL.createObjectURL(coverPhoto) : group_coverphoto})` }}
                                className="bg-contain bg-center bg-no-repeat h-44 flex items-end justify-end p-1.5 rounded-t-md bg-customGray-default xs:p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4"
                            >
                                <BasicButton
                                    btnStyleClass="!w-fit z-[5] bg-white hover:bg-slate-50"
                                    btnData={{
                                        text: 'Add',
                                        icon: ReactIcons.ADD_PLUS,
                                        onClick: () => coverPhotoRef.current.click(),
                                    }}
                                />

                                <input
                                    ref={coverPhotoRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setCoverPhoto(e.target.files[0])}
                                />
                            </div>

                            <div className="px-6">
                                <h1 className="text-2xl font-extrabold text-customGray-200">{groupName ? groupName : 'Group Name'}</h1>
                                <p className="text-sm font-medium text-customGray-300">
                                    {selectedUsers.length + 1} members {/* +1 for the admin */}
                                </p>

                                <div className="flex gap-1 mt-4 border-t">
                                    {groupComponents.map((data) => (
                                        <div
                                            key={data.id}
                                            className='relative text-sm font-semibold p-4 my-1 rounded-lg cursor-pointer text-customGray-300 hover:bg-customGray-default'
                                        >
                                            {data.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex w-full flex-col rounded-lg bg-white px-4 shadow">
                                <div className="flex items-center gap-2 py-3">
                                    <ProfileAvatar
                                        imageStyleClass="w-11 h-11"
                                        iconStyleClass="text-4xl"
                                    />

                                    <div className="w-full cursor-pointer rounded-3xl bg-customGray-default px-3 py-2.5 hover:bg-[#E4E6EB]">
                                        <p className="text-slate-500">{`What's on your mind`}</p>
                                    </div>
                                </div>

                                <div className="h-[1px] w-full bg-slate-100" />

                                <div className="grid grid-cols-3 gap-1 py-2">
                                    {feedPostingOptions.map((data) => (
                                        <div key={data.id} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg p-3 hover:bg-slate-100">
                                            <img src={data.icon} alt={""} className="w-5" />
                                            <p className="text-sm font-medium text-[#65676B]">
                                                {data.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Group_Create