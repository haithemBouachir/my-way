package com.myway.backend.features.career;

import com.myway.backend.features.career.dto.CareerPlanRequest;
import com.myway.backend.features.career.dto.CareerPlanResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/career-plans")
public class CareerPlanController {

    private final CareerPlanUseCase careerPlanUseCase;

    public CareerPlanController(CareerPlanUseCase careerPlanUseCase) {
        this.careerPlanUseCase = careerPlanUseCase;
    }

    @GetMapping
    public List<CareerPlanResponse> getAll() {
        return careerPlanUseCase.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CareerPlanResponse create(@Valid @RequestBody CareerPlanRequest request) {
        return careerPlanUseCase.create(request);
    }

    @PutMapping("/{id}")
    public CareerPlanResponse update(@PathVariable Long id, @Valid @RequestBody CareerPlanRequest request) {
        return careerPlanUseCase.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        careerPlanUseCase.delete(id);
    }
}
