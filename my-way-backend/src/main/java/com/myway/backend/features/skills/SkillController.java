package com.myway.backend.features.skills;

import com.myway.backend.features.skills.dto.SkillRequest;
import com.myway.backend.features.skills.dto.SkillResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillUseCase skillUseCase;

    public SkillController(SkillUseCase skillUseCase) {
        this.skillUseCase = skillUseCase;
    }

    @GetMapping
    public List<SkillResponse> getAll() {
        return skillUseCase.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse create(@Valid @RequestBody SkillRequest request) {
        return skillUseCase.create(request);
    }

    @PutMapping("/{id}")
    public SkillResponse update(@PathVariable Long id, @Valid @RequestBody SkillRequest request) {
        return skillUseCase.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        skillUseCase.delete(id);
    }
}
