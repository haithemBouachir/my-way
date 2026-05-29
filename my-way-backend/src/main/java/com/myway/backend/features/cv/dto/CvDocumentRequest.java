package com.myway.backend.features.cv.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CvDocumentRequest(
        @NotBlank @Size(max = 140) String title,
        @NotBlank @Size(max = 40) String template,
        @NotBlank @Size(max = 2000000) String blocksJson
) {
}
