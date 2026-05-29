package com.myway.backend.features.networking.dto;

public record JobSuggestionResponse(
        String title,
        String company,
        String location,
        String contractType,
        String url,
        String source
) {
}
