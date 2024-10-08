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
        // request.setMethod('GET');
        // request.setHeader('Content-Type', 'application/json');
        // request.setHeader('accept', 'application/json');
        // request.setHeader('x-tenant-id', 'ahpEiUg0Sc');
        // request.setHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJlbWFpbCI6InN1cGVyYWRtaW5AdGVycmFsb2dpYy5jb20iLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJyb2xlcyI6WyJTQSJdfSwiaWF0IjoxNzI4Mjg2ODE0LCJleHAiOjE3MjgzMzAwMTR9.lgNLdAr6dB64zhlF_HaFrd9o-VxY5tmqR7LY2NesnsE');

        try {
            // Sending the request
            HttpResponse response = http.send(request);
            
            if (response.getStatusCode() == 200) {
                // Parse the JSON response
                String responseBody = response.getBody();
                Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(responseBody);
                
                // Check if 'payload' key exists in the response
                if (jsonResponse.containsKey('payload')) {
                    List<Object> payloadList = (List<Object>) jsonResponse.get('payload');
                    for (Object permission : payloadList) {
                        permissionsList.add((Map<String, Object>) permission);
                    }
                } else {
                    System.debug('No payload found. Returning an empty list.');
                }
            } else {
                System.debug('HTTP response error: ' + response.getStatus());
                System.debug('Response body: ' + response.getBody());
            }
        } catch (Exception e) {
            System.debug('Exception occurred: ' + e.getMessage());
        }
        
        return permissionsList; // Return only if payload is found
    }
}