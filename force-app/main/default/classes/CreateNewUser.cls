public class CreateNewUser {
    @AuraEnabled
    public static String createUser(String username, String email, String description, String password) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://43f7-113-161-65-206.ngrok-free.app/api/v1/user');
        req.setMethod('POST');
        req.setHeader('accept', 'application/json');
        req.setHeader('x-tenant-id', 'ahpEiUg0Sc');
        req.setHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJlbWFpbCI6InN1cGVyYWRtaW5AdGVycmFsb2dpYy5jb20iLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJyb2xlcyI6WyJTQSJdfSwiaWF0IjoxNzI3MDg1MjQ1LCJleHAiOjE3MjcxMjg0NDV9.DB5FQBPv3IG4cL6l2K53no9Mr90KRqvC6W4azSoEr2g');
        req.setHeader('Content-Type', 'application/json');

        // Construct the request body with the provided details
        Map<String, Object> requestBody = new Map<String, Object>();
        requestBody.put('username', username);
        requestBody.put('email', email);
        requestBody.put('description', description);
        requestBody.put('password', password);

        req.setBody(JSON.serialize(requestBody));
		System.debug('Response Body: ' + JSON.serialize(requestBody));

        

        Http http = new Http();
        HttpResponse res = http.send(req);

        // Return the response body
        String responseBody = res.getBody();
        System.debug('Response Body: ' + responseBody);

        return responseBody;
    }
}