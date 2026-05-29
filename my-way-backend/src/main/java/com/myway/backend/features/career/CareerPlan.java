package com.myway.backend.features.career;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "career_plans")
public class CareerPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String targetRole;

    @Column(length = 120)
    private String targetCompany;

    private LocalDate targetDate;

    @Column(nullable = false)
    private Integer progress;

    @Column(length = 400)
    private String nextStep;

    public CareerPlan() {
    }

    public CareerPlan(Long id, String targetRole, String targetCompany, LocalDate targetDate, Integer progress, String nextStep) {
        this.id = id;
        this.targetRole = targetRole;
        this.targetCompany = targetCompany;
        this.targetDate = targetDate;
        this.progress = progress;
        this.nextStep = nextStep;
    }

    public Long getId() {
        return id;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public String getTargetCompany() {
        return targetCompany;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public Integer getProgress() {
        return progress;
    }

    public String getNextStep() {
        return nextStep;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public void setTargetCompany(String targetCompany) {
        this.targetCompany = targetCompany;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public void setNextStep(String nextStep) {
        this.nextStep = nextStep;
    }
}
