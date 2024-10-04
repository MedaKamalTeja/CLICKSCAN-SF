({
    handleSubmit : function(component, event, helper) {
        var firstName = component.get("v.firstName");
        var lastName = component.get("v.lastName");
        var email = component.get("v.email");
        var phone = component.get("v.phone");
        var department = component.get("v.department");
        var dateOfJoining = component.get("v.dateOfJoining");

        // Basic console log to verify data (this can be expanded as needed)
        console.log("Employee Details:", firstName, lastName, email, phone, department, dateOfJoining);

        // Example: Showing an alert
        alert("Employee " + firstName + " " + lastName + " registered successfully!");
    }
})