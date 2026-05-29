package com.myway.backend.features.training;

import jakarta.persistence.*;

@Entity
@Table(name = "trainings")
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, length = 120)
    private String provider;

    @Column(nullable = false, length = 255)
    private String url;

    @Column(nullable = false, length = 80)
    private String skillCategory;

    @Column(nullable = false, length = 40)
    private String difficulty;

    public Training() {
    }

    public Training(Long id, String title, String provider, String url, String skillCategory, String difficulty) {
        this.id = id;
        this.title = title;
        this.provider = provider;
        this.url = url;
        this.skillCategory = skillCategory;
        this.difficulty = difficulty;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getProvider() {
        return provider;
    }

    public String getUrl() {
        return url;
    }

    public String getSkillCategory() {
        return skillCategory;
    }

    public String getDifficulty() {
        return difficulty;
    }
}
