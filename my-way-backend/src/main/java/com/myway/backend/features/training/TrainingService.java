package com.myway.backend.features.training;

import com.myway.backend.features.training.dto.TrainingResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingService implements TrainingUseCase {

    private final TrainingRepository repository;

    public TrainingService(TrainingRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<TrainingResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public List<TrainingResponse> recommendByCategory(String category) {
        return repository.findBySkillCategoryIgnoreCase(category).stream().map(this::toResponse).toList();
    }

    private TrainingResponse toResponse(Training training) {
        return new TrainingResponse(
                training.getId(),
                training.getTitle(),
                training.getProvider(),
                training.getUrl(),
                training.getSkillCategory(),
                training.getDifficulty()
        );
    }
}
