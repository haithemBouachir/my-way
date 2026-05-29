package com.myway.backend.auth.dto;

public record AuthResponse(
        String token,
        String email,
        String fullName,
        String avatarUrl
) {
}
