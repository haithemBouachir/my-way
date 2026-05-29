package com.myway.backend.features.networking;

import com.myway.backend.features.networking.dto.JobSuggestionResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/networking/job-suggestions")
public class JobSuggestionController {

    private final JobSuggestionService jobSuggestionService;

    public JobSuggestionController(JobSuggestionService jobSuggestionService) {
        this.jobSuggestionService = jobSuggestionService;
    }

    @GetMapping
    public List<JobSuggestionResponse> getSuggestions(
            Authentication authentication,
            @RequestParam(required = false) String keywords
    ) {
        return jobSuggestionService.suggestJobs(authentication.getName(), keywords);
    }
}
