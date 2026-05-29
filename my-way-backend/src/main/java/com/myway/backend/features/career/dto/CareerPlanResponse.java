package com.myway.backend.features.career.dto;

import java.time.LocalDate;

public record CareerPlanResponse(
        Long id,
        String targetRole,
        String targetCompany,
        LocalDate targetDate,
        Integer progress,
        String nextStep
) {
}
