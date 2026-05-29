package com.myway.backend.features.cv;

import com.myway.backend.features.cv.dto.CvDocumentRequest;
import com.myway.backend.features.cv.dto.CvDocumentResponse;

import java.util.List;

public interface CvDocumentUseCase {
    List<CvDocumentResponse> findAllByOwner(String ownerEmail);

    CvDocumentResponse create(String ownerEmail, CvDocumentRequest request);

    CvDocumentResponse update(String ownerEmail, Long id, CvDocumentRequest request);

    void delete(String ownerEmail, Long id);
}
