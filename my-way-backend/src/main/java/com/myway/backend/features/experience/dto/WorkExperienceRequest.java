package com.myway.backend.features.experience.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record WorkExperienceRequest(
        @NotBlank @Size(max = 120) String position,
        @NotBlank @Size(max = 120) String company,
        LocalDate startDate,
        LocalDate endDate,
        @Size(max = 500) String description,
        List<Long> projectIds
) {
}
