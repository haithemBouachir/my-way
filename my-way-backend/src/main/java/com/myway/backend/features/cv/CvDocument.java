package com.myway.backend.features.cv;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cv_documents")
public class CvDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(nullable = false, length = 40)
    private String template;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String blocksJson;

    @Column(nullable = false, length = 180)
    private String ownerEmail;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public CvDocument() {
    }

    public CvDocument(Long id, String title, String template, String blocksJson, String ownerEmail) {
        this.id = id;
        this.title = title;
        this.template = template;
        this.blocksJson = blocksJson;
        this.ownerEmail = ownerEmail;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getTemplate() {
        return template;
    }

    public String getBlocksJson() {
        return blocksJson;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public void setBlocksJson(String blocksJson) {
        this.blocksJson = blocksJson;
    }
}
