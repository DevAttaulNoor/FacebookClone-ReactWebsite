import { Link } from "react-router"
import { Routes } from "@constants/Routes"

const Signup = () => {
    return (
        <div className='w-full h-full flex items-center justify-center py-10'>
            <div className="flex flex-col rounded-lg bg-white">
                <div className="flex flex-col items-center justify-center px-4 py-2.5">
                    <h1 className="text-center text-xl font-bold text-[#1C1E21]">Create a new account</h1>
                    <p className="text-sm font-medium text-[#606770]">It's quick and easy.</p>
                </div>

                <hr className="text-slate-300" />

                <div className="flex flex-col items-center p-4 gap-3.5">
                    <form className='flex flex-col gap-3.5'>
                        <div className="w-92 flex items-center gap-2.5">
                            <input
                                type="text"
                                placeholder="First name"
                                required
                                className="w-full p-2 rounded-md outline-none border border-slate-300"
                            />

                            <input
                                type="text"
                                placeholder="Last name"
                                required
                                className="w-full p-2 rounded-md outline-none border border-slate-300"
                            />
                        </div>

                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            className="w-92 p-2 rounded-md outline-none border border-slate-300"
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            required
                            className="w-92 p-2 rounded-md outline-none border border-slate-300"
                        />

                        {/* <div className="dobContainer">
                    <h5>Date of birth</h5>

                    <div className="dobOptions">
                        <div className="dobOption">
                            <select value={dob.getDate()} onChange={(e) => setDOB(new Date(dob.setUTCDate(e.target.value)))}>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="dobOption">
                            <select value={monthNames[dob.getMonth()]} onChange={(e) => {
                                const monthIndex = monthNames.indexOf(e.target.value);
                                setDOB(new Date(dob.setUTCMonth(monthIndex)));
                            }}>
                                {monthNames.map((monthName) => (
                                    <option key={monthName} value={monthName}>
                                        {monthName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="dobOption">
                            <select value={dob.getFullYear()} onChange={(e) => setDOB(new Date(dob.setUTCFullYear(e.target.value)))}>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="genderContainer">
                    <h5>Gender</h5>

                    <div className="genderOptions">
                        <div className={`genderOption ${selectedGender === 'Male' ? 'active' : ''}`} onClick={() => handleGenderClick('Male')}>
                            <p>Male</p>
                            <AdjustOutlinedIcon className={`${selectedGender === 'Male' ? 'active' : ''}`} />
                        </div>

                        <div className={`genderOption ${selectedGender === 'Female' ? 'active' : ''}`} onClick={() => handleGenderClick('Female')}>
                            <p>Female</p>
                            <AdjustOutlinedIcon className={`${selectedGender === 'Female' ? 'active' : ''}`} />
                        </div>

                        <div className={`genderOption ${selectedGender === 'Other' ? 'active' : ''}`} onClick={() => handleGenderClick('Other')}>
                            <p>Other</p>
                            <AdjustOutlinedIcon className={`${selectedGender === 'Other' ? 'active' : ''}`} />
                        </div>
                    </div>
                </div>

                <div className='profilePicContainer'>
                    <button type="button" className='picturesBtn' onClick={() => document.getElementById("profilePictureInput").click()}>Choose Profile Picture</button>
                    <input
                        type="file"
                        accept="image/*"
                        id="profilePictureInput"
                        style={{ display: "none" }}
                        onChange={handleProfilePictureChange}
                    />

                    {selectedProfileImage && (
                        <div className='imgContainer'>
                            <img src={selectedProfileImage} alt="profilePicture" />
                            <CloseIcon id='closeIcon' onClick={() => handlePictureRemoval('profilePic')} />
                        </div>
                    )}
                </div>

                <div className='coverPicContainer'>
                    <button type="button" className='picturesBtn' onClick={() => document.getElementById("coverPictureInput").click()}>Choose Cover Picture</button>
                    <input
                        type="file"
                        accept="image/*"
                        id="coverPictureInput"
                        style={{ display: "none" }}
                        onChange={handleCoverPictureChange}
                    />

                    {selectedCoverImage && (
                        <div className='imgContainer'>
                            <img src={selectedCoverImage} alt="coverPicture" />
                            <CloseIcon id='closeIcon' onClick={() => handlePictureRemoval('coverPic')} />
                        </div>
                    )}
                </div> */}

                        <div className='w-92'>
                            <p className="text-xs font-medium mb-4 text-slate-500">People who use our service may have uploaded your contact information to Facebook. <span className="cursor-pointer text-[#385898] hover:underline">Learn more</span>.</p>
                            <p className="text-xs font-medium text-slate-500">By clicking Sign Up, you agree to our <span className="cursor-pointer text-[#385898] hover:underline">Terms</span>, <span className="cursor-pointer text-[#385898] hover:underline">Privacy Policy</span> and <span className="cursor-pointer text-[#385898] hover:underline">Cookies Policy</span>. You may receive SMS notifications from us and can opt out at any time.</p>
                        </div>

                        <button className="w-fit text-lg font-bold px-16 py-2 mx-auto rounded-md text-white bg-[#42b72a]"
                        >{'Sign Up'}</button>
                    </form>

                    <Link
                        to={Routes.LOGIN.path}
                        className="text-lg outline-none text-[#1877f2]"
                    >
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup