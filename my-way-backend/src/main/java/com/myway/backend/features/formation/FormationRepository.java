package com.myway.backend.features.formation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FormationRepository extends JpaRepository<FormationEntry, Long> {
}
