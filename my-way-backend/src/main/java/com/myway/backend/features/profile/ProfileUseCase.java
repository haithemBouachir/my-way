package com.myway.backend.features.profile;

import com.myway.backend.features.profile.dto.ProfileResponse;
import com.myway.backend.features.profile.dto.ProfileUpdateRequest;

public interface ProfileUseCase {
    ProfileResponse getCurrentProfile(String email);

    ProfileResponse updateCurrentProfile(String currentEmail, ProfileUpdateRequest request);
}
