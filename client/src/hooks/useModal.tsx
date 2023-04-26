
function getModalRoot() {
    const modalRoot = document.getElementById('modal-root')
    if (!modalRoot) {
        const modal = document.createElement('div');
        modal.id = 'modal-root'
        const root = document.getElementById('root')
        root?.after(modal)
        return modal
    } else {
        return modalRoot
    }
}
function useModal() {
    const modalRoot = getModalRoot()
    const enableModal = () => modalRoot.setAttribute('class', 'active')
    const disableModal = () => modalRoot.setAttribute('class', '')
    return { modalRoot, enableModal, disableModal }
}
export default useModal