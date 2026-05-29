package com.myway.backend.features.profile;

import com.myway.backend.auth.AppUser;
import com.myway.backend.auth.AppUserRepository;
import com.myway.backend.features.profile.dto.ProfileResponse;
import com.myway.backend.features.profile.dto.ProfileUpdateRequest;
import com.myway.backend.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ProfileService implements ProfileUseCase {

    private final AppUserRepository appUserRepository;
    private final JwtService jwtService;

    public ProfileService(AppUserRepository appUserRepository, JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.jwtService = jwtService;
    }

    @Override
    public ProfileResponse getCurrentProfile(String email) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        return toResponse(user, null);
    }

    @Override
    public ProfileResponse updateCurrentProfile(String currentEmail, ProfileUpdateRequest request) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(currentEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        String normalizedEmail = request.email().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(normalizedEmail)
                && appUserRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(BAD_REQUEST, "Email already in use");
        }

        user.setFullName(request.fullName());
        user.setEmail(normalizedEmail);
        user.setAvatarUrl(request.avatarUrl());
        user.setPhone(normalizePhone(request.phone()));
        user.setAddress(request.address());
        user.setPostalCode(request.postalCode());
        user.setCity(request.city());
        user.setDescription(request.description());

        AppUser updated = appUserRepository.save(user);
        String refreshedToken = jwtService.generateToken(updated.getEmail());
        return toResponse(updated, refreshedToken);
    }

    private ProfileResponse toResponse(AppUser user, String token) {
        return new ProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getPhone(),
                user.getAddress(),
                user.getPostalCode(),
                user.getCity(),
                user.getDescription(),
                token
        );
    }

    private String normalizePhone(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) {
            return null;
        }

        String compact = rawPhone.replaceAll("[\\s()-]", "");

        if (compact.startsWith("00")) {
            compact = "+" + compact.substring(2);
        }

        if (compact.startsWith("+")) {
            return compact;
        }

        if (compact.startsWith("216")) {
            return "+" + compact;
        }

        if (compact.matches("\\d{8}")) {
            return "+216" + compact;
        }

        return compact;
    }
}
