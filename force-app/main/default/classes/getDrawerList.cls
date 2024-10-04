public class getDrawerList {

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getDrawersls() {
        List<Map<String, Object>> formattedDrawerList = new List<Map<String, Object>>();

        String apiUrl = 'https://43f7-113-161-65-206.ngrok-free.app/api/v1/drawer/list';
        // String tenantId = 'ahpEiUg0Sc'; 
        String tenantId=TokenManager.getTenantId();
        // String bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJlbWFpbCI6InN1cGVyYWRtaW5AdGVycmFsb2dpYy5jb20iLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJyb2xlcyI6WyJTQSJdfSwiaWF0IjoxNzI3MDg5OTE0LCJleHAiOjE3MjcxMzMxMTR9.RYcEvx3RQ0hndKuuAHiao0sfhc8DO6WrOyh_-f3n5iM';
        String bearerToken = TokenManager.getBearerToken(); // Retrieve the token from TokenManager
        Integer take = 100;
        Integer skip=0; 
        String requestUrl = apiUrl + '?skip=' + skip + '&take=' + take;

        HttpRequest req = new HttpRequest();
        req.setEndpoint(requestUrl);
        req.setMethod('GET');
        req.setHeader('Authorization', TokenManager.getBearerToken());
        req.setHeader('x-tenant-id', TokenManager.getTenantId());
        req.setHeader('Accept', 'application/json');

        Http http = new Http();
        HttpResponse res;

        try {
            res = http.send(req);
            System.debug('Request URL: ' + requestUrl);
            System.debug('Response Status Code: ' + res.getStatusCode());
            System.debug('Response Body: ' + res.getBody());

            // Parse the response body
            String responseBody = res.getBody();
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(responseBody);
            System.debug('Response Map: ' + responseMap);

            // Check for the 'payload' key and extract 'data'
            if (responseMap.containsKey('payload')) {
                Map<String, Object> payloadMap = (Map<String, Object>) responseMap.get('payload');
                if (payloadMap.containsKey('data') && payloadMap.get('data') instanceof List<Object>) {
                    List<Object> dataList = (List<Object>) payloadMap.get('data');

                    for (Object obj : dataList) {
                        if (obj instanceof Map<String, Object>) {
                            Map<String, Object> drawer = (Map<String, Object>) obj;
                            Map<String, Object> drawerMap = new Map<String, Object>();
                            drawerMap.put('id', (Integer) drawer.get('id'));
                            drawerMap.put('username', (String) drawer.get('name'));
                            drawerMap.put('email', ((Integer) drawer.get('created_by')).toString() + '@example.com');
                            drawerMap.put('description', drawer.get('description') != null ? (String) drawer.get('description') : 'No description');
                            drawerMap.put('createdDate', formatDate((String) drawer.get('created_at')));
                            drawerMap.put('isAdmin', (Integer) drawer.get('created_by') == 1);
                            formattedDrawerList.add(drawerMap);
                        }
                    }
                } else {
                    System.debug('Unexpected response structure: ' + payloadMap);
                }
            } else {
                System.debug('Unexpected response structure: ' + responseMap);
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
        }

        return formattedDrawerList;
    }

    private static String formatDate(String dateString) {
        if (String.isNotBlank(dateString)) {
            try {
                // Extract date part from the ISO 8601 format
                return dateString.substring(0, 10);
            } catch (Exception e) {
                System.debug('Error parsing date: ' + e.getMessage());
                return '';
            }
        }
        return '';
    }
}