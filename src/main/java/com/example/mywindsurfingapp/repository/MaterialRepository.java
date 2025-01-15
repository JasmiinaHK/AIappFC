package com.example.mywindsurfingapp.repository;

import com.example.mywindsurfingapp.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByUserEmail(String userEmail);
}
