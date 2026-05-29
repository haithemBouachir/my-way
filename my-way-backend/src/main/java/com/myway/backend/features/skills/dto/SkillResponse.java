package com.myway.backend.features.skills.dto;

public record SkillResponse(
        Long id,
        String name,
        String category,
        Integer level
) {
}
