package com.myway.backend.features.formation;

import com.myway.backend.common.exception.ResourceNotFoundException;
import com.myway.backend.features.formation.dto.FormationRequest;
import com.myway.backend.features.formation.dto.FormationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormationService implements FormationUseCase {

    private final FormationRepository repository;

    public FormationService(FormationRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<FormationResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public FormationResponse create(FormationRequest request) {
        FormationEntry entry = new FormationEntry(
                null,
                request.institution(),
                request.degree(),
                request.fieldOfStudy(),
                request.startDate(),
                request.endDate(),
                request.description()
        );
        return toResponse(repository.save(entry));
    }

    @Override
    public FormationResponse update(Long id, FormationRequest request) {
        FormationEntry existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Formation not found: " + id));

        existing.setInstitution(request.institution());
        existing.setDegree(request.degree());
        existing.setFieldOfStudy(request.fieldOfStudy());
        existing.setStartDate(request.startDate());
        existing.setEndDate(request.endDate());
        existing.setDescription(request.description());

        return toResponse(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Formation not found: " + id);
        }
        repository.deleteById(id);
    }

    private FormationResponse toResponse(FormationEntry entry) {
        return new FormationResponse(
                entry.getId(),
                entry.getInstitution(),
                entry.getDegree(),
                entry.getFieldOfStudy(),
                entry.getStartDate(),
                entry.getEndDate(),
                entry.getDescription()
        );
    }
}
