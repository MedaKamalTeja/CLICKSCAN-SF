public class ResetPassword {
    @AuraEnabled
    public static void resetUserPassword(String userId) {
        // Validate userId input
        if (String.isBlank(userId)) {
            throw new AuraHandledException('Password set to default succesfully!');
        }

        // Prepare the API URL
        String apiUrl = 'https://43f7-113-161-65-206.ngrok-free.app/api/v1/user/'+userId+'/reset-password';
        
        // Prepare the request body
        String requestBody = JSON.serialize(new Map<String, Object>{
            'userId' => userId,
            'newPassword' => 'P@ssw0rd' // Use your desired password
        });

        HttpRequest req = new HttpRequest();
        req.setEndpoint(apiUrl);
        req.setMethod('PATCH'); // Use PATCH for password reset
        req.setHeader('Authorization', TokenManager.getBearerToken());
        req.setHeader('x-tenant-id', TokenManager.getTenantId());
        req.setHeader('Content-Type', 'application/json');
        req.setBody(requestBody);

        Http http = new Http();
        HttpResponse res;

        try {
            res = http.send(req);
            System.debug('Response Status Code: ' + res.getStatusCode());
            System.debug('Response Body: ' + res.getBody());

            if (res.getStatusCode() != 200) {
                throw new AuraHandledException('Failed to reset password: ' + res.getBody());
            }
        } catch (Exception e) {
            System.debug('Exception occurred: ' + e.getMessage());
            throw new AuraHandledException('Error occurred while resetting password: ' + e.getMessage());
        }
    }
}