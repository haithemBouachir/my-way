package com.myway.backend.features.career;

import com.myway.backend.features.career.dto.CareerPlanRequest;
import com.myway.backend.features.career.dto.CareerPlanResponse;

import java.util.List;

public interface CareerPlanUseCase {
    List<CareerPlanResponse> findAll();

    CareerPlanResponse create(CareerPlanRequest request);

    CareerPlanResponse update(Long id, CareerPlanRequest request);

    void delete(Long id);
}
