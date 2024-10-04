public with sharing class ExtractEmailFromResume {
    @InvocableMethod
    public static List<String> extractEmail(List<Id> documentIds) {
        List<String> emails = new List<String>();
        for (Id docId : documentIds) {
            // Placeholder logic for extracting email from a document
            String email = extractEmailFromDocument(docId);
            emails.add(email);
        }
        return emails;
    }
    
    private static String extractEmailFromDocument(Id documentId) {
        // Implement email extraction logic here
        // For simplicity, returning a placeholder email
        String email = 'kamalmeda0139@gmail.com'; // Placeholder
        return email;
    }
}