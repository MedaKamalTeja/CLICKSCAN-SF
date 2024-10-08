public with sharing class UserManagement {

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> fetchUserData(String userId) {
        // Define the API endpoint and set the authorization token
        String apiUrl = 'https://43f7-113-161-65-206.ngrok-free.app/api/v1/user/' + userId;
        String bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJlbWFpbCI6InN1cGVyYWRtaW5AdGVycmFsb2dpYy5jb20iLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJyb2xlcyI6WyJTQSJdfSwiaWF0IjoxNzI4NDE1NzU1LCJleHAiOjE3Mjg0NTg5NTV9.ZHpYPPIXGTepkl6K_NJMgeN3rEd0M_gNNaSrjaL7cEY';
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(apiUrl);
        req.setMethod('GET');

        // Set headers
        req.setHeader('accept', 'application/json');
        req.setHeader('Authorization', 'Bearer ' + bearerToken);
        req.setHeader('tenantId', 'ahpEiUg0Sc'); // Set tenantId as a separate header

        Http http = new Http();
        HttpResponse res;

        try {
            res = http.send(req);
        } catch (Exception e) {
            throw new AuraHandledException('Failed to fetch user data: ' + e.getMessage());
        }

        if (res.getStatusCode() == 200) {
            // Parse the JSON response
            Map<String, Object> responseData = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            
            if (responseData.containsKey('payload')) {
                Map<String, Object> payload = (Map<String, Object>) responseData.get('payload');
                
                if (payload.containsKey('roles')) {
                    // Extract and return the 'roles' key data
                    List<Object> roles = (List<Object>) payload.get('roles');
                    List<Map<String, Object>> rolesData = new List<Map<String, Object>>();
                    
                    // Iterate and cast each role to Map<String, Object>
                    for (Object roleObj : roles) {
                        rolesData.add((Map<String, Object>) roleObj);
                    }
                    return rolesData;
                }
            }
            throw new AuraHandledException('Roles data not found in the response.');
        } else {
            throw new AuraHandledException('Failed to fetch user data. Status Code: ' + res.getStatusCode() + ' Response: ' + res.getBody());
        }
    }
}
