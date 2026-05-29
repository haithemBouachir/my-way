package com.myway.backend.features.experience;

import com.myway.backend.features.experience.dto.WorkExperienceRequest;
import com.myway.backend.features.experience.dto.WorkExperienceResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/career-experiences")
public class WorkExperienceController {

    private final WorkExperienceUseCase workExperienceUseCase;

    public WorkExperienceController(WorkExperienceUseCase workExperienceUseCase) {
        this.workExperienceUseCase = workExperienceUseCase;
    }

    @GetMapping
    public List<WorkExperienceResponse> getAll() {
        return workExperienceUseCase.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkExperienceResponse create(@Valid @RequestBody WorkExperienceRequest request) {
        return workExperienceUseCase.create(request);
    }

    @PutMapping("/{id}")
    public WorkExperienceResponse update(@PathVariable Long id, @Valid @RequestBody WorkExperienceRequest request) {
        return workExperienceUseCase.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        workExperienceUseCase.delete(id);
    }
}
