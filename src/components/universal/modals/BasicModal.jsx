import { ModalLayout } from "@layouts/ModalLayout"

export const BasicModal = ({ isOpen }) => {
    return (
        <ModalLayout
            isOpen={isOpen}
        >
            Modal
        </ModalLayout>
    )
}