package com.windsurfing.api.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class OpenAIService {
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String apiUrl = "https://api.openai.com/v1/chat/completions";
    private final ObjectMapper objectMapper;

    public OpenAIService(
            RestTemplate restTemplate,
            @Value("${openai.api.key}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
    }

    public String generateTaskContent(String subject, String skillLevel, String lessonUnit, String materialType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.putArray("messages")
                    .add(objectMapper.createObjectNode()
                            .put("role", "system")
                            .put("content", "You are a professional windsurfing instructor."))
                    .add(objectMapper.createObjectNode()
                            .put("role", "user")
                            .put("content", String.format(
                                    "Create a %s about %s for %s level, focusing on %s. Make it engaging and educational.",
                                    materialType, subject, skillLevel, lessonUnit)));

            HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
            String response = restTemplate.postForObject(apiUrl, request, String.class);
            JsonNode responseNode = objectMapper.readTree(response);

            return responseNode.path("choices")
                    .path(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate content: " + e.getMessage(), e);
        }
    }
}
