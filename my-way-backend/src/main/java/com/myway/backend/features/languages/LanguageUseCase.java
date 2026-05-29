package com.myway.backend.features.languages;

import com.myway.backend.features.languages.dto.LanguageRequest;
import com.myway.backend.features.languages.dto.LanguageResponse;

import java.util.List;

public interface LanguageUseCase {
    List<LanguageResponse> findAll();

    LanguageResponse create(LanguageRequest request);

    LanguageResponse update(Long id, LanguageRequest request);

    void delete(Long id);
}
