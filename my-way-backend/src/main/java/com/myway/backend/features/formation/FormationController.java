package com.myway.backend.features.formation;

import com.myway.backend.features.formation.dto.FormationRequest;
import com.myway.backend.features.formation.dto.FormationResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/formations")
public class FormationController {

    private final FormationUseCase formationUseCase;

    public FormationController(FormationUseCase formationUseCase) {
        this.formationUseCase = formationUseCase;
    }

    @GetMapping
    public List<FormationResponse> getAll() {
        return formationUseCase.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FormationResponse create(@Valid @RequestBody FormationRequest request) {
        return formationUseCase.create(request);
    }

    @PutMapping("/{id}")
    public FormationResponse update(@PathVariable Long id, @Valid @RequestBody FormationRequest request) {
        return formationUseCase.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        formationUseCase.delete(id);
    }
}
