import { LightningElement } from 'lwc';

export default class NewDatabase extends LightningElement {
    isModalOpen = false;

    handleOpenModal() {
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }

    handleCreate() {
        // Add your form submission logic here
        this.handleCloseModal();
    }
}
