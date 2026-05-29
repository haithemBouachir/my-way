package com.myway.backend.features.training;

import com.myway.backend.features.training.dto.TrainingResponse;

import java.util.List;

public interface TrainingUseCase {
    List<TrainingResponse> findAll();

    List<TrainingResponse> recommendByCategory(String category);
}
