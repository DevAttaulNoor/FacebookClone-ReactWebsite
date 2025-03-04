import { TextareaField } from "@components/universal/inputs/TextareaField"
import { ReactIcons } from "@constants/ReactIcons"

const Reel = () => {
    return (
        <div className="w-full h-full flex">
            <div className='w-[420px] h-full flex flex-col p-2 shadow-customFull2 bg-white'>
                <div className='flex flex-col justify-center px-4 border-b border-b-customGray-100'>
                    <div className="flex">
                        <h5 className="text-xl font-semibold">Your story</h5>
                        <span className="text-3xl p-1 rounded-full bg-customGray-100 cursor-pointer hover:bg-customGray-300">{ReactIcons.SETTING}</span>
                    </div>

                    <div className="flex">
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto}
                                alt={`profile picture of ${user.username}`}
                                className="w-12 h-12 rounded-full border border-customGray-100 object-contain bg-white"
                            />
                        ) : (
                            <span className="text-3xl">{ReactIcons.PROFILE_AVATAR}</span>
                        )}
                        <p className="font-medium text-sm">{user.username}</p>
                    </div>
                </div>

                <div className="flex flex-col px-4">
                    {showForText && (
                        <div className='flex flex-col'>
                            <div className='flex flex-col'>
                                <TextareaField
                                    textareaStyle={'rounded-sm border border-custom-default p-4 resize-none'}
                                    textareaData={{
                                        rows: '7',
                                        placeholder: 'Start typing',
                                        value: textAreaValue,
                                        onChange: handleTextAreaChange
                                    }}
                                />

                                <p className="text-end text-xs font-medium text-customGray-300">{textAreaValueCount} charcters remaining</p>
                            </div>

                            <select
                                name="fonts"
                                onChange={(e) => handleFontStyleChange(e.target.value)}
                                className="text-sm px-3 py-4 rounded-sm border border-customGray-100"
                            >
                                {fontStyles.map((fontStyle) => (
                                    <option key={fontStyle} value={fontStyle} className="text-sm">{fontStyle}</option>
                                ))}
                            </select>

                            <div className='py-3 px-4 rounded-sm border border-customGray-100'>
                                <h5 className="text-sm text-customGray-300">Backgrounds</h5>

                                <div className="grid grid-cols-8 gap-1 items-center justify-center">
                                    {colors.map((color) => (
                                        <div
                                            key={color}
                                            onClick={() => handleDotClick(color)}
                                            className={`${color} ${activeDot === color && 'border-customBlue-default'} w-6 h-6 rounded-full border-2 border-transparent cursor-pointer`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='flex flex-col'>
                        {showAddText && (
                            <h5
                                onClick={handleTextInPhoto}
                                className="text-sm font-medium text-center py-4 px-2.5 rounded-lg cursor-pointer hover:bg-customGray-100"
                            >
                                Add Text
                            </h5>
                        )}

                        {showForPhoto && (
                            <div className='flex flex-col'>
                                <div className='flex flex-col'>
                                    <TextareaField
                                        textareaStyle={'rounded-sm border border-custom-default p-4 resize-none'}
                                        textareaData={{
                                            rows: '7',
                                            placeholder: 'Start typing',
                                            value: textAreaValue,
                                            onChange: handleTextAreaChange
                                        }}
                                    />

                                    <p className="text-end text-xs font-medium text-customGray-300">{textAreaValueCount} charcters remaining</p>
                                </div>

                                <select
                                    name="fonts"
                                    onChange={(e) => handleFontStyleChange(e.target.value)}
                                    className="text-sm px-3 py-4 rounded-sm border border-customGray-100"
                                >
                                    {fontStyles.map((fontStyle) => (
                                        <option key={fontStyle} value={fontStyle} className="text-sm">{fontStyle}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {(showTextContent || showPhotoContent) && (
                    <div className="flex items-center gap-2 p-3 shadow-lg bg-white">
                        <button className="text-sm font-semibold px-3 py-2 rounded-sm cursor-pointer bg-customGray-100" onClick={handleDiscardClick}>Discard</button>
                        {uploadLoading ? (
                            <button className="text-sm font-semibold px-3 py-2 rounded-sm cursor-pointer text-white bg-customBlue-default"> <div className="w-6 h-6 border-2 border-white rounded-full"></div> </button>
                        ) : (
                            <button className="text-sm font-semibold px-3 py-2 rounded-sm cursor-pointer text-white bg-customBlue-default" onClick={handleUpload}>Share to Story</button>
                        )}
                    </div>
                )}
            </div>

            <div className='w-full h-full flex justify-center py-4'>
                {showCards && (
                    <div className='flex items-center justify-center gap-4'>
                        <div
                            style={{ backgroundImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/Zd_TxH-pOMv.png?_nc_eui2=AeFCXpL4BPrnTmp7wz4-oOnM3bslaZtoocHduyVpm2ihwSxn_qkK8uAyp2i1oSPCVIaZYEGdpMGnpeqI-K_KeaA4")' }}
                            onClick={() => inputRef.current.click()}
                            className="w-56 h-80 flex flex-col items-center justify-center rounded-xl cursor-pointer"
                        >
                            <div className='icon'>
                                <i></i>
                            </div>
                            <p>Create a Photo Story</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hiddenInput"
                                ref={inputRef}
                            />
                        </div>

                        <div className="cardContainer textCard" onClick={handleAddTextClick}>
                            <div className='icon'>
                                <i></i>
                            </div>
                            <p>Create a Text Story</p>
                        </div>
                    </div>
                )}

                {showTextContent && (
                    <div className="textReelContent">
                        <h5>Preview</h5>
                        <div className="textReelContentInner">
                            <div className={`textStoryWindow ${activeDot}`}>
                                <p style={{ fontFamily: activeFontStyle }}>{textAreaValue}</p>
                            </div>
                        </div>
                    </div>
                )}

                {showPhotoContent && (
                    <div className="photoReelContent">
                        <h5>Peview</h5>
                        <div className="photoReelContentInner">
                            <div className="photoStoryWindow" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}>
                                <p style={{ fontFamily: activeFontStyle }}>{textAreaValue}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Reel