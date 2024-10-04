({
    handleSubmit : function(component, event, helper) {
        var firstName = component.get("v.firstName");
        var lastName = component.get("v.lastName");
        var email = component.get("v.email");
        var phone = component.get("v.phone");
        var dateOfJoining = component.get("v.dateOfJoining");

        var action = component.get("c.saveEmployeeData");
        action.setParams({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            dateOfJoining: dateOfJoining
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                alert("Employee " + firstName + " " + lastName + " registered successfully!");
                // Clear the form values
                component.set("v.firstName", "");
                component.set("v.lastName", "");
                component.set("v.email", "");
                component.set("v.phone", "");
                component.set("v.dateOfJoining", "");
            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                        alert("Error: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                    alert("Unknown error");
                }
            }
        });

        $A.enqueueAction(action);
    }
})