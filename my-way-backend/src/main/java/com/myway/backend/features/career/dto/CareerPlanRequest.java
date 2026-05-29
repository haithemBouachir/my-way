package com.myway.backend.features.career.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CareerPlanRequest(
        @NotBlank @Size(max = 120) String targetRole,
        @Size(max = 120) String targetCompany,
        LocalDate targetDate,
        @Min(0) @Max(100) Integer progress,
        @Size(max = 400) String nextStep
) {
}
