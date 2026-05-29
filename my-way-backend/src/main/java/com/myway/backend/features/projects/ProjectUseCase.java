package com.myway.backend.features.projects;

import com.myway.backend.features.projects.dto.ProjectRequest;
import com.myway.backend.features.projects.dto.ProjectResponse;

import java.util.List;

public interface ProjectUseCase {
    List<ProjectResponse> findAll();

    ProjectResponse create(ProjectRequest request);

    ProjectResponse update(Long id, ProjectRequest request);

    void delete(Long id);
}
