package com.example.mywindsurfingapp.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class EnvConfig {
    
    @Autowired
    private Environment springEnv;

    @PostConstruct
    public void init() {
        // Load .env file
        Dotenv dotenv = Dotenv.configure().load();
        
        // Set OpenAI API key as system environment variable if not already set
        if (System.getenv("OPENAI_SECRET") == null) {
            String openaiKey = dotenv.get("OPENAI_SECRET");
            if (openaiKey != null && !openaiKey.isEmpty()) {
                System.setProperty("OPENAI_SECRET", openaiKey);
            }
        }
    }
}
