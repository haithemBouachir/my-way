package com.myway.backend.features.cv;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CvDocumentRepository extends JpaRepository<CvDocument, Long> {
    List<CvDocument> findByOwnerEmailIgnoreCaseOrderByUpdatedAtDesc(String ownerEmail);

    Optional<CvDocument> findByIdAndOwnerEmailIgnoreCase(Long id, String ownerEmail);
}
