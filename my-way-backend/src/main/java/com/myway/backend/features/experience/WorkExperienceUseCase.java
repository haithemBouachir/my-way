package com.myway.backend.features.experience;

import com.myway.backend.features.experience.dto.WorkExperienceRequest;
import com.myway.backend.features.experience.dto.WorkExperienceResponse;

import java.util.List;

public interface WorkExperienceUseCase {
    List<WorkExperienceResponse> findAll();

    WorkExperienceResponse create(WorkExperienceRequest request);

    WorkExperienceResponse update(Long id, WorkExperienceRequest request);

    void delete(Long id);
}
