public class TokenManager {
    private static final String TENANT_ID = 'ahpEiUg0Sc';
    private static final String BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJlbWFpbCI6InN1cGVyYWRtaW5AdGVycmFsb2dpYy5jb20iLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJyb2xlcyI6WyJTQSJdfSwiaWF0IjoxNzI4NDE1NzU1LCJleHAiOjE3Mjg0NTg5NTV9.ZHpYPPIXGTepkl6K_NJMgeN3rEd0M_gNNaSrjaL7cEY';
    private static final String API_URL = 'https://43f7-113-161-65-206.ngrok-free.app';

    // Method to get tenant ID
    public static String getTenantId() {
        return TENANT_ID;
    }

    // Method to get bearer token
    public static String getBearerToken() {
        return BEARER_TOKEN;
    }
 
    public static String getApiUrl(){
        return API_URL;
    }
    // Any other common config methods or values can go here
}