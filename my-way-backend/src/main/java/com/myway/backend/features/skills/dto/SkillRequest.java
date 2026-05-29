package com.myway.backend.features.skills.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 80) String category,
        @Min(1) @Max(10) Integer level
) {
}
