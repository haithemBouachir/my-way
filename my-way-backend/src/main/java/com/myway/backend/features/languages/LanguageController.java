package com.myway.backend.features.languages;

import com.myway.backend.features.languages.dto.LanguageRequest;
import com.myway.backend.features.languages.dto.LanguageResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/languages")
public class LanguageController {

    private final LanguageUseCase languageUseCase;

    public LanguageController(LanguageUseCase languageUseCase) {
        this.languageUseCase = languageUseCase;
    }

    @GetMapping
    public List<LanguageResponse> getAll() {
        return languageUseCase.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LanguageResponse create(@Valid @RequestBody LanguageRequest request) {
        return languageUseCase.create(request);
    }

    @PutMapping("/{id}")
    public LanguageResponse update(@PathVariable Long id, @Valid @RequestBody LanguageRequest request) {
        return languageUseCase.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        languageUseCase.delete(id);
    }
}
