package com.myway.backend.features.career;

import com.myway.backend.common.exception.ResourceNotFoundException;
import com.myway.backend.features.career.dto.CareerPlanRequest;
import com.myway.backend.features.career.dto.CareerPlanResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerPlanService implements CareerPlanUseCase {

    private final CareerPlanRepository repository;

    public CareerPlanService(CareerPlanRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<CareerPlanResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public CareerPlanResponse create(CareerPlanRequest request) {
        CareerPlan plan = new CareerPlan(
                null,
                request.targetRole(),
                request.targetCompany(),
                request.targetDate(),
                request.progress(),
                request.nextStep()
        );
        return toResponse(repository.save(plan));
    }

    @Override
    public CareerPlanResponse update(Long id, CareerPlanRequest request) {
        CareerPlan existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Career plan not found: " + id));

        existing.setTargetRole(request.targetRole());
        existing.setTargetCompany(request.targetCompany());
        existing.setTargetDate(request.targetDate());
        existing.setProgress(request.progress());
        existing.setNextStep(request.nextStep());

        return toResponse(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Career plan not found: " + id);
        }
        repository.deleteById(id);
    }

    private CareerPlanResponse toResponse(CareerPlan plan) {
        return new CareerPlanResponse(
                plan.getId(),
                plan.getTargetRole(),
                plan.getTargetCompany(),
                plan.getTargetDate(),
                plan.getProgress(),
                plan.getNextStep()
        );
    }
}
