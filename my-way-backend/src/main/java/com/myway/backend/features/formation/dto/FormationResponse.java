package com.myway.backend.features.formation.dto;

import java.time.LocalDate;

public record FormationResponse(
        Long id,
        String institution,
        String degree,
        String fieldOfStudy,
        LocalDate startDate,
        LocalDate endDate,
        String description
) {
}
