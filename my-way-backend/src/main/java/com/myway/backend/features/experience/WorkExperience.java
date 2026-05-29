package com.myway.backend.features.experience;

import com.myway.backend.features.projects.Project;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "work_experiences")
public class WorkExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String position;

    @Column(nullable = false, length = 120)
    private String company;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 500)
    private String description;

    @ManyToMany
    @JoinTable(
            name = "work_experience_projects",
            joinColumns = @JoinColumn(name = "work_experience_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private List<Project> projects = new ArrayList<>();

    public WorkExperience() {
    }

    public WorkExperience(Long id, String position, String company, LocalDate startDate, LocalDate endDate, String description) {
        this.id = id;
        this.position = position;
        this.company = company;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getPosition() {
        return position;
    }

    public String getCompany() {
        return company;
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

    public List<Project> getProjects() {
        return projects;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setCompany(String company) {
        this.company = company;
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

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
}
