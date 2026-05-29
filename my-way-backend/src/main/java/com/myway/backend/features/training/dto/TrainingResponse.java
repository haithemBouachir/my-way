package com.myway.backend.features.training.dto;

public record TrainingResponse(
        Long id,
        String title,
        String provider,
        String url,
        String skillCategory,
        String difficulty
) {
}
