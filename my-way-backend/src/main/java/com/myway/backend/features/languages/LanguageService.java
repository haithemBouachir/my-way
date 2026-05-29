package com.myway.backend.features.languages;

import com.myway.backend.common.exception.ResourceNotFoundException;
import com.myway.backend.features.languages.dto.LanguageRequest;
import com.myway.backend.features.languages.dto.LanguageResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageService implements LanguageUseCase {

    private final LanguageRepository repository;

    public LanguageService(LanguageRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<LanguageResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public LanguageResponse create(LanguageRequest request) {
        LanguageEntry entry = new LanguageEntry(null, request.name(), request.level());
        return toResponse(repository.save(entry));
    }

    @Override
    public LanguageResponse update(Long id, LanguageRequest request) {
        LanguageEntry entry = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Language not found: " + id));

        entry.setName(request.name());
        entry.setLevel(request.level());

        return toResponse(repository.save(entry));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Language not found: " + id);
        }
        repository.deleteById(id);
    }

    private LanguageResponse toResponse(LanguageEntry entry) {
        return new LanguageResponse(entry.getId(), entry.getName(), entry.getLevel());
    }
}
