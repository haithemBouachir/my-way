package com.myway.backend.features.projects.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ProjectRequest(
        @NotBlank @Size(max = 140) String title,
        @Size(max = 500) String description,
        LocalDate startDate,
        LocalDate endDate,
        @Size(max = 255) String technologies,
        @Size(max = 255) String projectUrl
) {
}
