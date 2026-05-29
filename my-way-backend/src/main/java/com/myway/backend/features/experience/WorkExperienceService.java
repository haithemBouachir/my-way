package com.myway.backend.features.experience;

import com.myway.backend.common.exception.ResourceNotFoundException;
import com.myway.backend.features.experience.dto.LinkedProjectResponse;
import com.myway.backend.features.experience.dto.WorkExperienceRequest;
import com.myway.backend.features.experience.dto.WorkExperienceResponse;
import com.myway.backend.features.projects.Project;
import com.myway.backend.features.projects.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
public class WorkExperienceService implements WorkExperienceUseCase {

    private final WorkExperienceRepository repository;
    private final ProjectRepository projectRepository;

    public WorkExperienceService(WorkExperienceRepository repository, ProjectRepository projectRepository) {
        this.repository = repository;
        this.projectRepository = projectRepository;
    }

    @Override
    public List<WorkExperienceResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public WorkExperienceResponse create(WorkExperienceRequest request) {
        WorkExperience experience = new WorkExperience(
                null,
                request.position(),
                request.company(),
                request.startDate(),
                request.endDate(),
                request.description()
        );
        experience.setProjects(resolveProjects(request.projectIds()));
        return toResponse(repository.save(experience));
    }

    @Override
    public WorkExperienceResponse update(Long id, WorkExperienceRequest request) {
        WorkExperience existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found: " + id));

        existing.setPosition(request.position());
        existing.setCompany(request.company());
        existing.setStartDate(request.startDate());
        existing.setEndDate(request.endDate());
        existing.setDescription(request.description());
        existing.setProjects(resolveProjects(request.projectIds()));

        return toResponse(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Work experience not found: " + id);
        }
        repository.deleteById(id);
    }

    private List<Project> resolveProjects(List<Long> projectIds) {
        if (projectIds == null || projectIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> uniqueIds = projectIds.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (uniqueIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Project> projects = projectRepository.findAllById(uniqueIds);
        if (projects.size() != uniqueIds.size()) {
            throw new ResourceNotFoundException("One or more linked projects do not exist");
        }
        return projects;
    }

    private WorkExperienceResponse toResponse(WorkExperience experience) {
        return new WorkExperienceResponse(
                experience.getId(),
                experience.getPosition(),
                experience.getCompany(),
                experience.getStartDate(),
                experience.getEndDate(),
                experience.getDescription(),
                experience.getProjects().stream()
                        .map(project -> new LinkedProjectResponse(project.getId(), project.getTitle()))
                        .toList()
        );
    }
}
