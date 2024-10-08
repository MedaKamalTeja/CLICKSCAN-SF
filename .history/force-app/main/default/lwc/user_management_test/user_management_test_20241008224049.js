import { LightningElement, track, wire, api } from 'lwc';
// import logo from '@salesforce/resourceUrl/click_scan';
import icon from '@salesforce/resourceUrl/user_icon';
import getUsers from '@salesforce/apex/getUsersList.getUsers';
import getDrawers from '@salesforce/apex/getDrawersList.getDrawers';
import getDrawerById from '@salesforce/apex/getUsersInfo.getDrawerById';
import resetUserPassword from '@salesforce/apex/ResetPassword.resetUserPassword';
import deleteUserById from '@salesforce/apex/DeleteUser.deleteUserById';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createUser from '@salesforce/apex/UserCreation.createUser';
import getPermissionsByUserId from '@salesforce/apex/FetchPermission.getPermissionsByUserId';
import fetchUserData from '@salesforce/apex/UserManagement.fetchUserData'; // Assuming you have this imported
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UserManagement extends LightningElement {
    iconUrl = icon;
    isVisible = false;
    isResetPasswordModalOpen = false;
    isDeleteModalOpen = false;

    @track searchTerm = ''; // Track the search input
    @track userId;
    @track userId1;
    @track drawers = [];
    @track drawers1 = [];
    @track error;
    @track wiredData;
    @track selectedDrawerId = null; 
    @track users = [];
    @track users1 = [];
    @track userData = {}; // Initialize as an empty object
    @track roles = []; // Initialize as an empty array
   // Default to false
    error; // Default is undefined or empty
    @track checkboxStates = {};
    @track filteredUsers = [];
    @track filteredUsers1 = [];
    @track selectedUser = null;
    @track selectedUser1 = null;
    @track selected_Id1;
    @track isAdmin = false; 
    @track toggleLabel = 'Off'; 
    // @track isToggled = false; // Track the toggle state
    @track roles = [
        { id: 2, name: 'Admin', checked: false },
        { id: 3, name: 'Client', checked: false },
        // Add more roles as needed
    ];
    @track userData = {
        username: 'N/A',
        description: 'N/A',
        created_at: 'N/A',
        email: 'N/A',
        thumbnail: 'N/A',
    };
    @track isModalOpen = false; // Track if the modal is open
    @track email;
    @track username;
    @track description;
    @track password;
    @track areAllPermissionsChecked = false;
    @track error;
    @api userId; // Input property to pass userId
    toggleState = false; // To manage toggle state

  

    loadUserData() {
        console.log('Called function loadUserData', this.userId);
        
        // Call fetchUserData with the dynamic userId
        fetchUserData({ userId: String(this.userId) }) // Use String(this.userId) to ensure it's a string
            .then(result => {
                console.log('Result from fetchUserData:', result);
                
                // Extract role IDs from the fetched result
                const roleIds = result.map(role => role.id); // Assuming result contains role objects
                console.log('Extracted role IDs:', roleIds); // Log the extracted role IDs
    
                // Define roles with their checked states based on the role IDs
                this.roles = [
                    {
                        id: 2,
                        name: 'Admin',
                        checked: roleIds.includes(2) // Checked if role ID 2 is present
                    },
                    {
                        id: 3,
                        name: 'Client',
                        checked: roleIds.includes(3) && !roleIds.includes(2) // Checked if only role ID 3 is present
                    }
                ];
    
                // Log the roles array to see their checked states
                console.log('Roles with checked states:', this.roles);
    
                // Determine isAdmin based on role IDs
                this.isAdmin = roleIds.includes(2); // Set isAdmin based on the presence of the Admin role
                console.log('Is Admin after check:', this.isAdmin);
    
                this.roles.forEach(role => {
                    console.log('Role ID:', role.id, 'Checked:', role.checked);
                });
            })
            .catch(error => {
                this.error = error.body.message;
                console.error('Error fetching user data:', this.error, this.userId);
                this.userData = undefined;
            });
    }
    
    get toggleLabel() {
        console.log('Current toggle label:', this.isAdmin ? 'Yes' : 'No'); // Log current toggle label
        return this.isAdmin ? 'Yes' : 'No'; // Dynamically set the label
    }
    
    handleToggleChange(event) {
        this.isAdmin = event.target.checked; // Update isAdmin based on toggle state
        console.log('Toggle state changed to:', this.isAdmin); // Log the new toggle state
    
        // Optional: Add logic to handle role assignment based on the toggle
        // For example, you might want to update roles array here
    }
    permissions = []; // To store permissions

    connectedCallback() {
        this.fetchPermissions();
    }
    



    // @track isAdmin = false; // Track state of the toggle
 
    // Handler for Global Permissions checkbox
    handleGlobalPermissionChange(event) {
        this.areAllPermissionsChecked = event.target.checked;
    }

    // Handle Save action
    handleSave() {
        // Logic for saving changes
        console.log('Permissions saved!');
    }

    // Handle Cancel action
    handleCancel() {
        // Logic for canceling changes
        console.log('Changes canceled.');
    }

    // Method to open the modal
    openModal() {
        this.isModalOpen = true;
    }

    // Method to close the modal
    closeModal() {
        this.isModalOpen = false;
        // Reset form values when closing
        this.username = '';
        this.email = '';
        this.description = '';
        this.password = '';
    }

    // Input change handlers
    handleUsernameChange(event) {
        this.username = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    // This method will be called when the save button is clicked
    handleSave() {
        // Create the payload for the Apex method
        // const userPayload = {
        //     email: this.email,
        //     username: this.username,
        //     description: this.description
        // };

        createUser({ 
            email: this.email, 
            username: this.username, 
            description: this.description 
        })
        .then((result) => {
            // Handle success
            this.showToast('Success', 'User created successfully!', 'success');
            console.log(result);
            this.closeModal(); // Close modal on success
        })
        .catch((error) => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    // Method to show toast messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    @track userId = 'USER_ID'; // Set this dynamically if needed
    @track userData;
    // @track isAdmin = false;
    
    connectedCallback() {
        this.fetchUserDetails();
    }

    fetchUserDetails() {
        fetchUserData({ userId: this.userId })
            .then((result) => {
                this.userData = result;
    
                // Extract role IDs
                const roleIds = this.userData.role_id; // Assume this is an array of role IDs
    
                // Determine isAdmin based on role IDs
                if (roleIds.includes(2) && roleIds.includes(3)) {
                    // If both Admin (2) and Client (3) are present, set isAdmin to true
                    this.isAdmin = true; 
                } else if (roleIds.includes(3) && !roleIds.includes(2)) {
                    // If only Client (3) is present, set isAdmin to false
                    this.isAdmin = false;
                } else {
                    // For all other combinations, you can set isAdmin to a default value
                    this.isAdmin = false; // Assuming you want false as a default if neither Admin nor Client roles are present
                }
    
                console.log("Is Admin:", this.isAdmin); // Log the value of isAdmin for debugging
                this.error = undefined; // Reset any previous errors
            })
            .catch((error) => {
                this.error = error.body.message; // Capture any errors that occur during fetch
                this.userData = undefined; // Reset userData on error
            });
    }
    
    
   
    
    

    // Hardcoded Permissions
    @track areAllPermissionsChecked = false; // Track Global Permissions checkbox
    @track permissions = [
        { id: 1, label: 'Display', checked: false },
        { id: 2, label: 'Create Folder', checked: false },
        { id: 3, label: 'Delete Folder', checked: false },
        { id: 4, label: 'Modify Index Field', checked: false },
        { id: 5, label: 'Modify Page', checked: false },
        { id: 6, label: 'Modify Annotation', checked: false },
        { id: 7, label: 'Scanning', checked: false },
        { id: 8, label: 'Export', checked: false },
        { id: 10, label: 'Migrate Folder', checked: false },
        { id: 11, label: 'Print', checked: false },
        { id: 12, label: 'Batch Management', checked: false }
    ];

    // // Drawer Permissions List
    // childOptions = [
    //     { id: 1, name: 'Display' },
    //     { id: 2, name: 'Create Folder' },
    //     { id: 3, name: 'Delete Folder' },
    //     { id: 4, name: 'Modify Index Field' },
    //     { id: 5, name: 'Modify Page' },
    //     { id: 6, name: 'Modify Annotation' },
    //     { id: 7, name: 'Scan' },
    //     { id: 8, name: 'Export' },
    //     { id: 9, name: 'Migrate Folder' },
    //     { id: 10, name: 'Print' },
    //     { id: 11, name: 'Batch Management' }
    // ];
    

    areAllDrawersChecked = false;
    areAllPermissionsChecked = false;

    handlePermissionChange(event) {
        const allCheckboxes = this.template.querySelectorAll('input[type="checkbox"]');
        this.areAllPermissionsChecked = [...allCheckboxes].every(checkbox => checkbox.checked);
    }
    
    
    // handleUserClick(event) {
    //     this.selectedUserId = event.currentTarget.dataset.id;
    // }
    


    // handleDrawerPermissionsChange(event) {
    //     this.areAllDrawersChecked = event.target.checked;
    //     this.drawers1 = this.drawers1.map(drawer => {
    //         drawer.checked = event.target.checked;
    //         return drawer;
    //     });
    // }

    

    // handlePermissionChange(event) {
    //     const drawerId = event.target.dataset.id;
    //     const permissionName = event.target.name;
    //     this.drawers1 = this.drawers1.map(drawer => {
    //         if (drawer.id === drawerId) {
    //             drawer.permissions[permissionName] = event.target.checked;
    //         }
    //         return drawer;
    //     });
    // }

   
    // Handle Global Checkbox Change
    // handleGlobalCheckboxChange(event) {
    //     this.areAllPermissionsChecked = event.target.checked;
    //     console.log("checked permissions", this.areAllPermissionsChecked);
    //     this.permissions.forEach(permission => {
    //         permission.checked = this.areAllPermissionsChecked;
    //     });
    // }
     
   // Create New User

   isModalOpen = false;

   openModal() {
       this.isModalOpen = true;
   }

   closeModal() {
       this.isModalOpen = false;
   }

    // Handler for parent checkbox of each drawer (working one)
    // handleParentCheckboxChange(event) {
    //     const drawerId = event.target.dataset.id;
    //     const isChecked = event.target.checked;

    //     this.drawers1 = this.drawers1.map(drawer => {
    //         if (drawer.id === drawerId) {
    //             drawer.checked = isChecked;
    //             drawer.permissions.forEach(permission => {
    //                 permission.checked = isChecked; // Update child permissions
    //             });
    //         }
    //         return drawer;
    //     });
    // }


    // Handle individual child permission checkbox changes (working one)
    // handlePermissionChange(event) {
    //     const drawerId = event.target.dataset.id;
    //     const permissionName = event.target.name;
    //     const isChecked = event.target.checked;

    //     this.drawers1 = this.drawers1.map(drawer => {
    //         if (drawer.id === drawerId) {
    //             drawer.permissions[permissionName] = isChecked;
    //         }
    //         return drawer;
    //     });
    // }



   
    

    // Toggle drawer visibility for showing/hiding child permissions
    toggleDrawerVisibility(event) {
        const drawerId = event.currentTarget.dataset.id;
        this.drawers1 = this.drawers1.map(drawer => {
            if (drawer.id === drawerId) {
                drawer.isOpen = !drawer.isOpen;  // Toggle the isOpen property
                drawer.iconName = drawer.isOpen ? 'utility:chevrondown' : 'utility:chevronright';  // Update the icon
            }
            return drawer;
        });
    }

    toggleCheckboxes(event) {
        const drawerId = event.target.dataset.id;
        console.log('Toggling checkboxes for drawer ID:', drawerId);

        // Update the isOpen property for the selected drawer only
        this.drawers = this.drawers.map(drawer => {
            if (drawer.id === parseInt(drawerId, 10)) {
                return {
                    ...drawer,
                    isOpen: !drawer.isOpen // Toggle the open state
                };
            }
            return {
                ...drawer,
                isOpen: false // Ensure other drawers are closed
            };
        });

        // Log the updated drawers
        console.log('Updated drawers after toggle:', JSON.stringify(this.drawers));
    }

    // Fetch user list from Apex
    @wire(getUsers)
    wiredUsers({ error, data }) {
        console.log("Fetching drawer data...");
        if (data) {
            this.users = [...data]; // Initialize with all users
            this.filteredUsers = [...this.users]; // Initialize the filtered users list

            if (this.filteredUsers.length > 0) {
                this.userId = this.filteredUsers[0].id;
                this.selectedUser = this.filteredUsers[0];
                console.log("Selected User ID:", this.userId);

                // Add a delay before fetching user details by ID
                setTimeout(() => {
                    console.log("Fetching user details for ID:", this.userId);
                    this.fetchUserDetails();
                }, 3000); // Delay of 3 seconds to avoid API overload
            }
        } else if (error) {
            this.error = error;
            console.error('Error fetching drawers:', JSON.stringify(this.error));
        }
    }


    // Search Functionality: Filter Users
    handleSearchInput(event) {
        this.searchTerm = event.target.value.toLowerCase(); // Capture the search term
        this.debounceSearch(); // Call the debounce search method
    }

    debounceSearch() {
        clearTimeout(this.searchTimeout); // Clear the previous timeout
        this.searchTimeout = setTimeout(() => {
            this.filterUsers(); // Call the filtering method after a delay
        }, 300); // Adjust delay as needed (300 ms here)
    }

    // Filter the user list based on the search term
    filterUsers() {
        if (this.searchTerm) {
            this.filteredUsers = this.users.filter(user =>
                user.username.toLowerCase().includes(this.searchTerm) ||
                user.email.toLowerCase().includes(this.searchTerm)
            );

            // Check if any users were found
            this.noResultsFound = this.filteredUsers.length === 0;
        } else {
            this.filteredUsers = [...this.users]; // Show all users if search term is empty
            this.noResultsFound = false; // Reset no results status
        }
    }

    // Method to fetch user details by ID
    fetchUserDetails() {
        getDrawerById({ id: this.userId })
            .then((data) => {
                if (data.length > 0) {
                    this.userData = data[0];
                } else {
                    this.resetUserData();
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
                this.resetUserData();
            });
    }















    // Fetch drawer data from Apex
    // @wire(getDrawers)
    // wireddrawers(result) {
    //     const { data, error } = result;
    //     if (data) {
    //         this.drawers1 = data.map(drawer => ({ ...drawer, isOpen: false, isChecked: false }));
    //     } else if (error) {
    //         console.error('Error fetching drawers:', JSON.stringify(error));
    //     }
    // }
    // 
    // Wire the Apex method to fetch drawers
    // @wire(getDrawers)
    // wiredDrawers(result) {
    //     const { data, error } = result;

    //     // Log the result from the wire service
    //     console.log('Wired drawers result:', JSON.stringify(result));

    //     if (data) {
    //         // Initialize the drawers with an 'isOpen' property for toggle logic
    //         this.drawers = data.map(drawer => ({
    //             ...drawer,
    //             isOpen: false // Default to not open
    //         }));
    //         console.log('Fetched drawers:', JSON.stringify(this.drawers));
    //     } else if (error) {
    //         this.error = error;
    //         console.error('Error fetching drawers:', JSON.stringify(this.error));
    //     }
    // }



   
        // Update global checkbox based on individual drawer states
        handleParentCheckboxChange(event) {
            const isChecked = event.target.checked;  // Check if the parent checkbox is checked or not
        
            // Update all permissions across all drawers
            this.drawers1 = this.drawers1.map(drawer => {
                drawer.checked = isChecked; // If parent is checked, mark the drawer checked
                drawer.permissions.forEach(permission => {
                    permission.checked = isChecked; // Mark all permissions under the drawer
                });
                return drawer;
            });
        }
        

    handleChildPermissionChange(event) {
        const drawerId = event.target.closest('.drawer-row').dataset.id; // Get the drawer ID from closest element
        const permissionId = event.target.name; // Get the permission ID
        const isChecked = event.target.checked;

        this.drawers1 = this.drawers1.map(drawer => {
            if (drawer.id === drawerId) {
                const permission = drawer.permissions.find(p => p.id === permissionId);
                if (permission) {
                    permission.checked = isChecked; // Update the specific child permission
                }
            }
            return drawer;
        });

        // Update the parent checkbox based on the state of child permissions
        this.updateParentCheckboxState(drawerId);
        // Update global checkbox based on individual drawer states
        this.updateGlobalCheckboxState();
    }

    // handleGlobalCheckboxChange(event) {
    //     const isChecked = event.target.checked;

    //     // Update global permissions
    //     this.permissions.forEach(permission => {
    //         permission.checked = isChecked;
    //     });

    //     // Update all drawers and their child permissions
    //     this.drawers1 = this.drawers1.map(drawer => {
    //         drawer.checked = isChecked;
    //         drawer.permissions.forEach(permission => {
    //             permission.checked = isChecked; // Update child permissions
    //         });
    //         return drawer;
    //     });
    // }

    // Update the state of the global checkbox based on drawer checkboxes
    updateGlobalCheckboxState() {
        const allChecked = this.drawers1.every(drawer => drawer.checked);
        const someChecked = this.drawers1.some(drawer => drawer.checked);

        // Set global permissions checked state
        this.permissions.forEach(permission => {
            permission.checked = allChecked; // Set based on drawer checked states
        });
    }

    // Update the parent checkbox state based on child permissions
    updateParentCheckboxState(drawerId) {
        this.drawers1 = this.drawers1.map(drawer => {
            if (drawer.id === drawerId) {
                const allChecked = drawer.permissions.every(permission => permission.checked);
                const someChecked = drawer.permissions.some(permission => permission.checked);
                drawer.checked = allChecked; // Update parent checkbox based on child permissions
            }
            return drawer;
        });
    }


    

    // Toggle Drawer Dropdown
    // toggleDropdown(event) {
    //     const drawerId = event.currentTarget.dataset.id;
    //     const childCheckboxesDiv = this.template.querySelector(`.child-checkboxes[data-id="${drawerId}"]`);
    
    //     if (childCheckboxesDiv) {
    //         if (childCheckboxesDiv.classList.contains('hidden')) {
    //             childCheckboxesDiv.classList.remove('hidden');
    //         } else {
    //             childCheckboxesDiv.classList.add('hidden');
    //         }
    //     }
    // }
   
      

    // Handle Parent Checkbox Change
    // handleParentCheckboxChange(event) {
    //     const drawerId = event.target.dataset.id;
    //     const isChecked = event.target.checked;
    //     const drawer = this.drawers1.find(drawer => drawer.id === drawerId);
    //     if (drawer) {
    //         drawer.isChecked = isChecked; // Set parent checkbox state
    //         // Set child checkbox state
    //         const childCheckboxes = this.template.querySelectorAll(`input[data-id="${drawerId}"]`);
    //         childCheckboxes.forEach(checkbox => {
    //             checkbox.checked = isChecked; // Set child checkbox state
    //         });
    //     }
    // }

    handleChildCheckboxChange(event) {
        // Logic for child checkbox change can be implemented here if needed
    }

    // Method to fetch user details by ID
    fetchUserDetails() {
        console.log("Fetching user details for ID:", this.userId);
        getDrawerById({ id: this.userId })
            .then((data) => {
                if (data.length > 0) {
                    this.userData = data[0];
                    console.log('User Data:', this.userData);
                } else {
                    this.userData = {
                        username: 'N/A',
                        email: 'N/A',
                        description: 'N/A',
                        createdDate: 'N/A',
                        thumbnail: 'N/A',
                    };
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
                this.userData = {
                    username: 'N/A',
                    email: 'N/A',
                    description: 'N/A',
                    createdDate: 'N/A',
                    thumbnail: 'N/A',
                };
            });
    }

    // Handle User Click Event
    handleUserClick(event) {
        const userId = event.currentTarget.dataset.id;
        this.userId = userId;
        console.log("Selected User ID:", userId);
        this.loadUserData();
        this.selectedUserId = event.currentTarget.dataset.id;

        const clickedUser = this.filteredUsers.find(user => user.id === userId || user.id === parseInt(userId, 10));
        if (clickedUser) {
            this.selectedUser = clickedUser;
            this.userId = this.selectedUser.id;
            this.fetchUserDetails();
            this.fetchPermissions();
        } else {
            this.userData = {
                username: 'N/A',
                email: 'N/A',
                description: 'N/A',
                createdDate: 'N/A',
                thumbnail: 'N/A',
            };
        }
    }

    // fetchPermissions() {
    //     getPermissionsByUserId({ userId: this.userId })
    //         .then((result) => {
    //             // Check if result is empty
    //             if (result.length === 0) {
    //                 console.log('No permissions found for user ID:', this.userId);
    //             } else {
    //                 this.permissions = result;
    //                 console.log('Permissions for user ID ' + this.userId + ':', JSON.stringify(this.permissions));
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching permissions:', error);
    //         });
    // }

    @wire(getDrawers)
wiredDrawers({ error, data }) {
    if (data) {
        // Initialize drawers and permissions as before
        this.drawers = data.map(drawer => ({
            ...drawer,
            permissions: [],
            isOpen: false // Initialize isOpen for toggle functionality
        }));
        this.fetchPermissions(); // Fetch permissions
    } else if (error) {
        console.error('Error fetching drawers:', error);
    }
}

fetchPermissions() {
    getPermissionsByUserId({ userId: this.userId })
        .then((result) => {
            const drawerPermissionsMap = {};
            result.forEach(drawer => {
                drawer.permission.forEach(permission => {
                    if (!drawerPermissionsMap[drawer.id]) {
                        drawerPermissionsMap[drawer.id] = {};
                    }
                    drawerPermissionsMap[drawer.id][permission.id] = true;
                });
            });
            this.drawers = this.drawers.map(drawer => ({
                ...drawer,
                permissions: this.permissions.map(permission => ({
                    ...permission,
                    checked: drawerPermissionsMap[drawer.id]?.[permission.id] || false
                })),
                isOpen: false // Initialize isOpen for toggle functionality
            }));
        })
        .catch((error) => {
            console.error('Error fetching permissions:', error);
        });
}


    // Global checkbox handling
    handleGlobalCheckboxChange(event) {
        const isChecked = event.target.checked;

        // Update all drawer permissions when global checkbox is clicked
        this.drawers = this.drawers.map(drawer => ({
            ...drawer,
            permissions: drawer.permissions.map(permission => ({
                ...permission,
                checked: isChecked
            }))
        }));

        // Update the global permissions list (if it's separate)
        this.permissions = this.permissions.map(permission => ({
            ...permission,
            checked: isChecked
        }));
    }

    // Handle individual permission change in each drawer
    handlePermissionChange(event) {
        const permissionId = parseInt(event.target.name);
        const drawerId = event.target.closest('.drawer-container').dataset.id;

        const drawer = this.drawers.find(d => d.id == drawerId);
        if (drawer) {
            const permission = drawer.permissions.find(p => p.id === permissionId);
            if (permission) {
                permission.checked = event.target.checked;
            }
        }
    }

    toggleDrawer(event) {
        const drawerId = Number(event.target.dataset.id); // Convert to number
        console.log('drawerID:', drawerId);
        
        this.drawers = this.drawers.map(drawer => {
            if (drawer.id === drawerId) {
                // Update the isOpen state for the specific drawer
                return { ...drawer, isOpen: !drawer.isOpen };
            }
            return drawer; // Return unchanged drawer
        });
        console.log('Updated drawers:', JSON.stringify(this.drawers)); // Log the updated state
    }
    
    
    
    
    
    







    // Search Functionality: Filter Users
    handleSearchInput(event) {
        this.searchTerm = event.target.value.toLowerCase(); // Capture the search term
        this.filterUsers(); // Call the filtering method
    }

    // Filter the user list based on the search term
    filterUsers() {
        if (this.searchTerm) {
            this.filteredUsers = this.users.filter(user =>
                user.username.toLowerCase().includes(this.searchTerm) ||
                user.email.toLowerCase().includes(this.searchTerm)
            );
        } else {
            this.filteredUsers = [...this.users]; // Show all users if search term is empty
        }
    }

    // Handle Reset Password Click Event
    handleResetPassword() {
        this.isResetPasswordModalOpen =
        this.isResetPasswordModalOpen = true;
    }

    // Confirm Reset Password
    confirmResetPassword() {
        resetUserPassword({ userId: this.userId })
            .then(() => {
                this.showToast('Success', 'Password has been reset successfully to "P@ssw0rd".', 'success');
                this.closeResetPasswordModal();
            })
            .catch(error => {
                console.error('Error resetting password:', error);
                this.showToast('Error', error.body.message || 'Failed to reset password', 'error');
            });
    }

    // Close Reset Password Modal
    closeResetPasswordModal() {
        this.isResetPasswordModalOpen = false;
        this.userId = null;
    }

    // Handle Delete User Click Event
    handleDeleteUser(event) {
        console.log("handleDeleteUser", this.userId);
        this.isDeleteModalOpen = true;
    }

    // Confirm Delete User
    confirmDeleteUser() {
        console.log('after confirm', this.userId);
        deleteUserById({ userId: this.userId })
            .then(() => {
                console.log('User has been deleted successfully');
                this.showToast('Success', 'User has been deleted successfully.', 'success');
                this.closeDeleteModal();
                this.refreshUserList();
            })
            .catch(error => {
                console.log('Error deleting user:', error);
                this.showToast('Error', error.body.message || 'Failed to delete user', 'error');
            });
    }

    // Close Delete User Modal
    closeDeleteModal() {
        this.isDeleteModalOpen = false;
        this.userId = null;
    }

    // Helper Method to Show Toast Notifications
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }

    // Refresh User List after Deletion
    refreshUserList() {
        getUsers()
            .then((data) => {
                this.users = [...data];
                this.filteredUsers = [...data]; // Reset filtered users after refresh
                this.userId = null; // Clear userId after refresh
            })
            .catch((error) => {
                console.error('Error refreshing user list:', error);
            });
    }
}
