public class getDrawersList{

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getDrawers() {
        // Initialize the list to store the formatted drawer information
        List<Map<String, Object>> formattedDrawerList = new List<Map<String, Object>>();

        String apiUrl = TokenManager.getApiUrl() + '/api/v1/drawer/list';
        Integer take = 100;
        Integer skip = 0; 
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
            // Send the HTTP request and receive the response
            res = http.send(req);
            System.debug('Request URL: ' + requestUrl);
            System.debug('Response Status Code: ' + res.getStatusCode());
            System.debug('Response Body: ' + res.getBody());

            // Parse the response body
            String responseBody = res.getBody();
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(responseBody);

            // Check if the response contains the 'payload' key and extract the 'data'
            if (responseMap.containsKey('payload')) {
                Map<String, Object> payloadMap = (Map<String, Object>) responseMap.get('payload');
                
                if (payloadMap.containsKey('data') && payloadMap.get('data') instanceof List<Object>) {
                    List<Object> dataList = (List<Object>) payloadMap.get('data');

                    // Sort the list manually based on the 'created_at' field
                    dataList = sortByCreatedAt(dataList);

                    // Loop through each drawer and format the details
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

                            // Add the formatted drawer details to the list
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
            System.debug('Exception occurred: ' + e.getMessage());
        }

        // Return the list whether or not it was populated (empty in case of an exception)
        return formattedDrawerList;
    }

    // Helper method to format the date and return only the date part
    private static String formatDate(String dateString) {
        if (String.isNotBlank(dateString)) {
            try {
                // Extract and format the date part from the ISO 8601 format (YYYY-MM-DD)
                return dateString.substring(0, 10); // Only return the date
            } catch (Exception e) {
                System.debug('Error parsing date: ' + e.getMessage());
                return '';
            }
        }
        return '';
    }

    // Helper method to sort the data list based on 'created_at' in descending order
    private static List<Object> sortByCreatedAt(List<Object> dataList) {
        // Use a simple bubble sort or other sorting algorithm to sort by 'created_at'
        for (Integer i = 0; i < dataList.size(); i++) {
            for (Integer j = i + 1; j < dataList.size(); j++) {
                Map<String, Object> drawer1 = (Map<String, Object>) dataList.get(i);
                Map<String, Object> drawer2 = (Map<String, Object>) dataList.get(j);

                String createdAt1 = (String) drawer1.get('created_at');
                String createdAt2 = (String) drawer2.get('created_at');

                // Compare the created_at timestamps for descending order
                if (createdAt1.compareTo(createdAt2) < 0) {
                    // Swap the objects if they are in the wrong order
                    Object temp = dataList.get(i);
                    dataList.set(i, dataList.get(j));
                    dataList.set(j, temp);
                }
            }
        }
        return dataList;
    }
}
