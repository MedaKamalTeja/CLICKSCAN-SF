public class DeleteUser {
    @AuraEnabled
    public static void deleteUserById(String userId) {
        // Validate userId input
        if (String.isBlank(userId)) {
            throw new AuraHandledException('User ID cannot be null or empty.');
        }

        // Prepare the API URL for deleting the user
        String apiUrl = 'https://43f7-113-161-65-206.ngrok-free.app/api/v1/user/'+ userId;
        system.debug('passed'+ apiUrl);
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(apiUrl);
        req.setMethod('DELETE'); // Use DELETE for deleting the user
        req.setHeader('Authorization', TokenManager.getBearerToken());
        req.setHeader('x-tenant-id', TokenManager.getTenantId());
        req.setHeader('Content-Type', 'application/json');
        

        Http http = new Http();
        HttpResponse res;

        try {
            res = http.send(req);
            System.debug('Response Status Code: ' + res.getStatusCode());
            System.debug('Response Body: ' + res.getBody());

            if (res.getStatusCode() != 200) {
                throw new AuraHandledException('Failed to delete user: ' + res.getBody());
            }
        } catch (Exception e) {
            System.debug('Exception occurred: ' + e.getMessage());
            throw new AuraHandledException('Error occurred while deleting user: ' + e.getMessage());
        }
    }
}