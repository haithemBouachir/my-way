package com.myway.backend.features.profile.dto;

public record ProfileResponse(
        Long id,
        String fullName,
        String email,
        String avatarUrl,
        String phone,
        String address,
        String postalCode,
        String city,
        String description,
        String token
) {
}
