package com.myway.backend.features.experience.dto;

import java.time.LocalDate;
import java.util.List;

public record WorkExperienceResponse(
        Long id,
        String position,
        String company,
        LocalDate startDate,
        LocalDate endDate,
        String description,
        List<LinkedProjectResponse> projects
) {
}
