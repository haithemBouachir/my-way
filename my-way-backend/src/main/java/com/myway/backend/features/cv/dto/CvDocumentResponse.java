package com.myway.backend.features.cv.dto;

import java.time.LocalDateTime;

public record CvDocumentResponse(
        Long id,
        String title,
        String template,
        String blocksJson,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
