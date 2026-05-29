package com.myway.backend;

import com.myway.backend.features.training.Training;
import com.myway.backend.features.training.TrainingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class MyWayBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyWayBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner seedTrainings(TrainingRepository trainingRepository) {
        return args -> {
            if (trainingRepository.count() == 0) {
                trainingRepository.saveAll(List.of(
                        new Training(null, "Spring Boot for Beginners", "Udemy", "https://www.udemy.com", "backend", "beginner"),
                        new Training(null, "React Advanced Patterns", "Coursera", "https://www.coursera.org", "frontend", "advanced"),
                        new Training(null, "Effective Communication", "LinkedIn Learning", "https://www.linkedin.com/learning", "soft-skills", "intermediate")
                ));
            }
        };
    }
}
