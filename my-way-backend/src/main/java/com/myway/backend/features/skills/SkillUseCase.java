package com.myway.backend.features.skills;

import com.myway.backend.features.skills.dto.SkillRequest;
import com.myway.backend.features.skills.dto.SkillResponse;

import java.util.List;

public interface SkillUseCase {
    List<SkillResponse> findAll();

    SkillResponse create(SkillRequest request);

    SkillResponse update(Long id, SkillRequest request);

    void delete(Long id);
}
