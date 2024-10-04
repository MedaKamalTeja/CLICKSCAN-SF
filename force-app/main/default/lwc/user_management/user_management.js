import { LightningElement, track } from 'lwc';
import logo from '@salesforce/resourceUrl/clickScan';
import icon from '@salesforce/resourceUrl/user_icon';


export default class UserManagement extends LightningElement {
    iconUrl = icon;
    adminPermissions = true;

  handleAdminPermissionsChange(event) {
    this.adminPermissions = event.target.checked;
  }
    @track users = [
        { id: 1, username: 'Zara_Smith', email: 'zara.smith@example.com', description: 'No description', createdDate: '09/05/2024', isAdmin: true },
        { id: 2, username: 'Olivia_Johnson', email: 'olivia.johnson@example.com', description: 'No description', createdDate: '09/04/2024', isAdmin: false },
        { id: 3, username: 'Liam_Williams', email: 'liam.williams@example.com', description: 'No description', createdDate: '08/31/2024', isAdmin: true },
        { id: 4, username: 'Noah_Brown', email: 'noah.brown@example.com', description: 'No description', createdDate: '08/26/2024', isAdmin: false },
        { id: 5, username: 'Sophia_Martin', email: 'sophia.martin@example.com', description: 'No description', createdDate: '08/16/2024', isAdmin: true },
        { id: 6, username: 'Mason_Lee', email: 'mason.lee@example.com', description: 'No description', createdDate: '08/13/2024', isAdmin: false },
        { id: 7, username: 'Ella_Harris', email: 'ella.harris@example.com', description: 'No description', createdDate: '08/06/2024', isAdmin: true },
        { id: 8, username: 'Henry_Clark', email: 'henry.clark@example.com', description: 'No description', createdDate: '06/13/2024', isAdmin: false },
        { id: 9, username: 'Jack_King', email: 'jack.king@example.com', description: 'No description', createdDate: '04/10/2024', isAdmin: true },
        { id: 10, username: 'Amelia_Wright', email: 'amelia.wright@example.com', description: 'No description', createdDate: '03/10/2024', isAdmin: false }
    ];

    @track filteredUsers = [...this.users];
    @track selectedUser = null;
    @track sortDirection = 'asc'; // Default sort direction

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        this.filteredUsers = this.users.filter(user =>
            user.username.toLowerCase().includes(searchTerm)
        );
    }



    isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }











    handleUserClick(event) {
        const userId = event.currentTarget.dataset.id;
        this.selectedUser = this.users.find(user => user.id === parseInt(userId));
    }

    handleEditClick() {
        alert('Edit functionality is not implemented yet.');
    }

    handleResetPassword() {
        alert('Reset Password functionality is not implemented yet.');
    }

    handleAdminToggle(event) {
        if (this.selectedUser) {
            this.selectedUser.isAdmin = event.target.checked;
        }
    }

    handleSortByName() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.filteredUsers = [...this.users].sort((a, b) => {
            if (a.username < b.username) return this.sortDirection === 'asc' ? -1 : 1;
            if (a.username > b.username) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    handleSortByDate() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.filteredUsers = [...this.users].sort((a, b) => {
            const dateA = new Date(a.createdDate);
            const dateB = new Date(b.createdDate);
            return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    get logoUrl() {
        return logo;
    }

    globalPermissions = [
        'Display',
        'Create Folder',
        'Delete Folder',
        'Modify Index Field',
        'Modify Page',
        'Modify Annotation',
        'Scan',
        'Export',
        'Migrate Folder',
        'Print',
        'Batch Management'
    ];

    drawerPermissions = [
        'DOCUMENTS',
        'Key_Ref',
        'Drawer_1',
        'DRAWER_0310'
    ];
    
}