package com.myway.backend.features.projects;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(length = 500)
    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 255)
    private String technologies;

    @Column(length = 255)
    private String projectUrl;

    public Project() {
    }

    public Project(Long id, String title, String description, LocalDate startDate, LocalDate endDate, String technologies, String projectUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.technologies = technologies;
        this.projectUrl = projectUrl;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getTechnologies() {
        return technologies;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }
}
