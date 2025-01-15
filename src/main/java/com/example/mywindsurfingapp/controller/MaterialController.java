package com.example.mywindsurfingapp.controller;

import com.example.mywindsurfingapp.model.Material;
import com.example.mywindsurfingapp.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {
    @Autowired
    private MaterialService materialService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMaterials(@RequestParam String userEmail) {
        List<Material> materials = materialService.getMaterialsByEmail(userEmail);
        Map<String, Object> response = new HashMap<>();
        response.put("items", materials);
        response.put("total", materials.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Material> createMaterial(@RequestBody Material material) {
        Material savedMaterial = materialService.createMaterial(material);
        return ResponseEntity.ok(savedMaterial);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<Material> generateContent(@PathVariable Long id) {
        Material material = materialService.generateContent(id);
        return ResponseEntity.ok(material);
    }
}
