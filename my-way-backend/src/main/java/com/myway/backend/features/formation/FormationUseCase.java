package com.myway.backend.features.formation;

import com.myway.backend.features.formation.dto.FormationRequest;
import com.myway.backend.features.formation.dto.FormationResponse;

import java.util.List;

public interface FormationUseCase {
    List<FormationResponse> findAll();

    FormationResponse create(FormationRequest request);

    FormationResponse update(Long id, FormationRequest request);

    void delete(Long id);
}
