package com.example.mywindsurfingapp.service;

import com.example.mywindsurfingapp.model.Material;
import com.example.mywindsurfingapp.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Service
public class MaterialService {
    @Autowired
    private MaterialRepository materialRepository;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    public List<Material> getMaterialsByEmail(String userEmail) {
        return materialRepository.findByUserEmail(userEmail);
    }

    public Material createMaterial(Material material) {
        return materialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }

    public Material generateContent(Long id) {
        Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found"));

        try {
            // Debug log for API key
            System.out.println("Using OpenAI API Key: " + openaiApiKey.substring(0, 10) + "...");
            
            // Prepare headers with API key
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            // Prepare the prompt
            String prompt = String.format(
                "Create a %s educational content for %s grade students about %s in %s language. " +
                "Make it engaging and appropriate for the grade level.",
                material.getMaterialType(),
                material.getGrade(),
                material.getLessonUnit(),
                material.getLanguage()
            );

            // Debug log for prompt
            System.out.println("Generated prompt: " + prompt);

            // Prepare the request body
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.putArray("messages")
                .add(mapper.createObjectNode()
                    .put("role", "system")
                    .put("content", "You are an educational content creator specializing in creating engaging content for students."))
                .add(mapper.createObjectNode()
                    .put("role", "user")
                    .put("content", prompt));

            // Debug log for request body
            System.out.println("Request body: " + requestBody.toString());

            // Make the API call
            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(OPENAI_API_URL, request, JsonNode.class);

            // Debug log for response
            System.out.println("OpenAI API Response: " + response.getBody());

            // Extract the generated content
            String generatedContent = response.getBody()
                .get("choices")
                .get(0)
                .get("message")
                .get("content")
                .asText();

            // Update and save the material
            material.setGeneratedContent(generatedContent);
            return materialRepository.save(material);

        } catch (Exception e) {
            System.err.println("Error details: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate content: " + e.getMessage(), e);
        }
    }
}
