package com.myway.backend.features.cv;

import com.myway.backend.features.cv.dto.CvDocumentRequest;
import com.myway.backend.features.cv.dto.CvDocumentResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cv-documents")
public class CvDocumentController {

    private final CvDocumentUseCase cvDocumentUseCase;

    public CvDocumentController(CvDocumentUseCase cvDocumentUseCase) {
        this.cvDocumentUseCase = cvDocumentUseCase;
    }

    @GetMapping
    public List<CvDocumentResponse> getAll(Authentication authentication) {
        return cvDocumentUseCase.findAllByOwner(authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CvDocumentResponse create(Authentication authentication, @Valid @RequestBody CvDocumentRequest request) {
        return cvDocumentUseCase.create(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    public CvDocumentResponse update(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CvDocumentRequest request
    ) {
        return cvDocumentUseCase.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        cvDocumentUseCase.delete(authentication.getName(), id);
    }
}
