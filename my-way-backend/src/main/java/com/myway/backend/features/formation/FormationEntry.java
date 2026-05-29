package com.myway.backend.features.formation;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "formations")
public class FormationEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 140)
    private String institution;

    @Column(nullable = false, length = 140)
    private String degree;

    @Column(length = 140)
    private String fieldOfStudy;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 500)
    private String description;

    public FormationEntry() {
    }

    public FormationEntry(Long id, String institution, String degree, String fieldOfStudy, LocalDate startDate, LocalDate endDate, String description) {
        this.id = id;
        this.institution = institution;
        this.degree = degree;
        this.fieldOfStudy = fieldOfStudy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getInstitution() {
        return institution;
    }

    public String getDegree() {
        return degree;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getDescription() {
        return description;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
