package com.myway.backend.features.cv;

import com.myway.backend.common.exception.ResourceNotFoundException;
import com.myway.backend.features.cv.dto.CvDocumentRequest;
import com.myway.backend.features.cv.dto.CvDocumentResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CvDocumentService implements CvDocumentUseCase {

    private final CvDocumentRepository repository;

    public CvDocumentService(CvDocumentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<CvDocumentResponse> findAllByOwner(String ownerEmail) {
        return repository.findByOwnerEmailIgnoreCaseOrderByUpdatedAtDesc(ownerEmail)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public CvDocumentResponse create(String ownerEmail, CvDocumentRequest request) {
        CvDocument document = new CvDocument(
                null,
                request.title(),
                request.template(),
                request.blocksJson(),
                ownerEmail.toLowerCase()
        );
        return toResponse(repository.save(document));
    }

    @Override
    public CvDocumentResponse update(String ownerEmail, Long id, CvDocumentRequest request) {
        CvDocument existing = repository.findByIdAndOwnerEmailIgnoreCase(id, ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("CV version not found: " + id));

        existing.setTitle(request.title());
        existing.setTemplate(request.template());
        existing.setBlocksJson(request.blocksJson());

        return toResponse(repository.save(existing));
    }

    @Override
    public void delete(String ownerEmail, Long id) {
        CvDocument existing = repository.findByIdAndOwnerEmailIgnoreCase(id, ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("CV version not found: " + id));

        repository.delete(existing);
    }

    private CvDocumentResponse toResponse(CvDocument document) {
        return new CvDocumentResponse(
                document.getId(),
                document.getTitle(),
                document.getTemplate(),
                document.getBlocksJson(),
                document.getCreatedAt(),
                document.getUpdatedAt()
        );
    }
}
