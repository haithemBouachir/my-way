package com.myway.backend.features.training;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingRepository extends JpaRepository<Training, Long> {
    List<Training> findBySkillCategoryIgnoreCase(String skillCategory);
}
