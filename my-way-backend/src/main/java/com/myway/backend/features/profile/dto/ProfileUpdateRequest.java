package com.myway.backend.features.profile.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Email @Size(max = 180) String email,
        @Size(max = 300000) String avatarUrl,
        @Size(max = 40) String phone,
        @Size(max = 255) String address,
        @Size(max = 20) String postalCode,
        @Size(max = 120) String city,
        @Size(max = 2000) String description
) {
}
