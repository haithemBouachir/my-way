package com.myway.backend.features.profile;

import com.myway.backend.features.profile.dto.ProfileResponse;
import com.myway.backend.features.profile.dto.ProfileUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileUseCase profileUseCase;

    public ProfileController(ProfileUseCase profileUseCase) {
        this.profileUseCase = profileUseCase;
    }

    @GetMapping
    public ProfileResponse getProfile(Authentication authentication) {
        return profileUseCase.getCurrentProfile(authentication.getName());
    }

    @PutMapping
    public ProfileResponse updateProfile(Authentication authentication, @Valid @RequestBody ProfileUpdateRequest request) {
        return profileUseCase.updateCurrentProfile(authentication.getName(), request);
    }
}
