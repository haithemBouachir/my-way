package com.myway.backend.features.projects;

import com.myway.backend.common.exception.ResourceNotFoundException;
import com.myway.backend.features.projects.dto.ProjectRequest;
import com.myway.backend.features.projects.dto.ProjectResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService implements ProjectUseCase {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ProjectResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public ProjectResponse create(ProjectRequest request) {
        Project project = new Project(
                null,
                request.title(),
                request.description(),
                request.startDate(),
                request.endDate(),
                request.technologies(),
                request.projectUrl()
        );
        return toResponse(repository.save(project));
    }

    @Override
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));

        existing.setTitle(request.title());
        existing.setDescription(request.description());
        existing.setStartDate(request.startDate());
        existing.setEndDate(request.endDate());
        existing.setTechnologies(request.technologies());
        existing.setProjectUrl(request.projectUrl());

        return toResponse(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found: " + id);
        }
        repository.deleteById(id);
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                project.getTechnologies(),
                project.getProjectUrl()
        );
    }
}
