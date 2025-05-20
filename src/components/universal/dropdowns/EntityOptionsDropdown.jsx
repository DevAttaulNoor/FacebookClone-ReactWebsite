import { SvgIcons } from "@constants/SvgIcons"
import { ReactIcons } from "@constants/ReactIcons"
import { DropdownLayout } from "@layouts/DropdownLayout"
import { handleDeleting, handleSaving } from "@utils/EntityHandling"

export const EntityOptionsDropdown = ({ dropdownStateData, modalStateData, entity, entityData, userData, goToNextReel }) => {
    return (
        <DropdownLayout
            isOpen={dropdownStateData.dropdownOpen === entityData?.id}
            isClose={() => dropdownStateData.setDropdownOpen(null)}
            dropdownContainerStyle="dropdownContainerStyle1 p-2 gap-1.5 top-14 right-6 shadow-customFull2"
        >
            {entityData?.uid === userData?.uid ? (
                <>
                    {entity === 'Posts' && (
                        <div
                            onClick={() => {
                                modalStateData.setModalOpen(prev => ({ ...prev, editing: entityData?.id }))
                                dropdownStateData.setDropdownOpen(null)
                            }}
                            className='flex items-center p-1.5 gap-3 rounded-lg cursor-pointer hover:bg-customGray-default'
                        >
                            <span className="text-lg">{ReactIcons.EDIT_PENCIL}</span>

                            <div className="flex flex-col gap-0.5">
                                <h5 className="text-sm font-medium">Edit post</h5>
                                <p className="text-xs text-customGray-200">Edit your post as require</p>
                            </div>
                        </div>
                    )}

                    <div
                        onClick={() => {
                            handleDeleting(entity, entityData?.id);
                            dropdownStateData.setDropdownOpen(null);
                            if (entity === 'Reels') { goToNextReel() }
                        }}
                        className='flex items-center p-1.5 gap-3 rounded-lg cursor-pointer hover:bg-customGray-default'
                    >
                        <span className="text-lg">{ReactIcons.DELETE_TRASHBIN}</span>

                        <div className="flex flex-col gap-0.5">
                            <h5 className="text-sm font-medium">Move to trash</h5>
                            <p className="text-xs text-customGray-200">Items in your trash are deleted</p>
                        </div>
                    </div>
                </>
            ) : (
                <div
                    onClick={() => {
                        handleSaving(entity, entityData?.id, userData?.uid);
                        dropdownStateData.setDropdownOpen(null);
                    }}
                    className='flex items-center p-1.5 gap-3 rounded-lg cursor-pointer hover:bg-customGray-default'
                >
                    <span>{SvgIcons.SAVED({ styleClass: 'w-[18px] h-[18px]' })}</span>

                    <div className="flex flex-col gap-0.5">
                        <h5 className="text-sm font-medium">{entityData?.saves?.find(elem => elem.uid === userData?.uid) ? 'Unsave post' : 'Save post'}</h5>
                        <p className="text-xs text-customGray-200">Add this to your saved items</p>
                    </div>
                </div>
            )}
        </DropdownLayout>
    )
}