public class FetchPermission {
    @AuraEnabled
    public static List<Map<String, Object>> getPermissionsByUserId(String userId) {
        List<Map<String, Object>> permissionsList = new List<Map<String, Object>>();
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        
        // API Endpoint
        String url = 'https://43f7-113-161-65-206.ngrok-free.app/api/v1/permission/list-by-user/' + userId;
        
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Authorization', TokenManager.getBearerToken());
        request.setHeader('x-tenant-id', TokenManager.getTenantId());
        request.setHeader('Accept', 'application/json');

        System.debug('URL: ' + url); // Debugging the URL
        System.debug('Authorization Token: ' + TokenManager.getBearerToken()); // Debugging the Authorization Token
        System.debug('Tenant ID: ' + TokenManager.getTenantId()); // Debugging the Tenant ID
        
        try {
            // Sending the request
            HttpResponse response = http.send(request);
            
            System.debug('Response Status Code: ' + response.getStatusCode()); // Debugging the status code
            System.debug('Response Body: ' + response.getBody()); // Debugging the full response body
            
            if (response.getStatusCode() == 200) {
                // Parse the JSON response
                String responseBody = response.getBody();
                Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(responseBody);
                
                // Check if 'payload' key exists in the response
                if (jsonResponse.containsKey('payload')) {
                    List<Object> payloadList = (List<Object>) jsonResponse.get('payload');
                    for (Object permission : payloadList) {
                        permissionsList.add((Map<String, Object>) permission);
                        System.debug('Permission Added: ' + (Map<String, Object>) permission); // Log each permission
                    }
                } else {
                    System.debug('No payload found. Returning an empty list.');
                }
            } else {
                System.debug('HTTP response error: ' + response.getStatusCode());
                System.debug('Response body: ' + response.getBody());
            }
        } catch (Exception e) {
            System.debug('Exception occurred: ' + e.getMessage());
        }
        
        return permissionsList; // Return the permissions list
    }
}
