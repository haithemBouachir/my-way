package com.myway.backend.features.formation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record FormationRequest(
        @NotBlank @Size(max = 140) String institution,
        @NotBlank @Size(max = 140) String degree,
        @Size(max = 140) String fieldOfStudy,
        LocalDate startDate,
        LocalDate endDate,
        @Size(max = 500) String description
) {
}
