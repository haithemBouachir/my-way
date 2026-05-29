package com.myway.backend.features.projects.dto;

import java.time.LocalDate;

public record ProjectResponse(
        Long id,
        String title,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        String technologies,
        String projectUrl
) {
}
