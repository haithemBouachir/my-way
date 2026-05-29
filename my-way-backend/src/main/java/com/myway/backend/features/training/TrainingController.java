package com.myway.backend.features.training;

import com.myway.backend.features.training.dto.TrainingResponse;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trainings")
@Validated
public class TrainingController {

    private final TrainingUseCase trainingUseCase;

    public TrainingController(TrainingUseCase trainingUseCase) {
        this.trainingUseCase = trainingUseCase;
    }

    @GetMapping
    public List<TrainingResponse> getAll() {
        return trainingUseCase.findAll();
    }

    @GetMapping("/recommendations")
    public List<TrainingResponse> recommendations(@RequestParam @NotBlank String category) {
        return trainingUseCase.recommendByCategory(category);
    }
}
