package com.myway.backend.features.languages.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LanguageRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 40) String level
) {
}
