import { BasicButton } from "@components/universal/buttons/BasicButton"

export const ButtonWithLoadingLayout = ({ loadingState, btnStyleClass = '', loadingBtn, actionBtn }) => {
    return (
        <>
            {loadingState ? (
                <BasicButton
                    btnStyleClass={`${btnStyleClass} ${loadingBtn.btnStyleClass ? loadingBtn.btnStyleClass : ''}`}
                    btnData={{
                        textStyleClass: `${loadingBtn.textStyleClass ? loadingBtn.textStyleClass : ''} border-2 border-b-0 animate-spin rounded-full border-white`,
                    }}
                />
            ) : (
                <BasicButton
                    btnStyleClass={`${btnStyleClass} ${actionBtn.btnStyleClass ? actionBtn.btnStyleClass : ''}`}
                    btnData={{
                        text: actionBtn.text,
                        icon: actionBtn.icon,
                        textStyleClass: actionBtn.textStyleClass,
                        onClick: actionBtn.onClick,
                    }}
                />
            )}
        </>
    )
}