package com.myway.backend.features.networking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myway.backend.auth.AppUser;
import com.myway.backend.auth.AppUserRepository;
import com.myway.backend.features.networking.dto.JobSuggestionResponse;
import com.myway.backend.features.skills.Skill;
import com.myway.backend.features.skills.SkillRepository;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JobSuggestionService {

    private static final String REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs";
    private static final String ARBEITNOW_API_URL = "https://www.arbeitnow.com/api/job-board-api";
    private static final String FALLBACK_SEARCH = "software engineer";

    private final AppUserRepository appUserRepository;
    private final SkillRepository skillRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public JobSuggestionService(
            AppUserRepository appUserRepository,
            SkillRepository skillRepository,
            ObjectMapper objectMapper
    ) {
        this.appUserRepository = appUserRepository;
        this.skillRepository = skillRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(6))
                .build();
    }

    public List<JobSuggestionResponse> suggestJobs(String email, String keywords) {
        String searchQuery = buildSearchQuery(email, keywords);
        List<String> terms = tokenizeSearch(searchQuery);

        List<JobSuggestionResponse> remotiveJobs = fetchRemotiveJobs(searchQuery);
        List<JobSuggestionResponse> arbeitnowJobs = fetchArbeitnowJobs(terms);

        Map<String, JobSuggestionResponse> deduplicated = new LinkedHashMap<>();
        remotiveJobs.forEach(job -> deduplicated.putIfAbsent(buildDedupKey(job), job));
        arbeitnowJobs.forEach(job -> deduplicated.putIfAbsent(buildDedupKey(job), job));

        return deduplicated.values().stream()
            .limit(40)
            .toList();
        }

        private List<JobSuggestionResponse> fetchRemotiveJobs(String searchQuery) {
        String encodedSearch = URLEncoder.encode(searchQuery, StandardCharsets.UTF_8);
        URI uri = URI.create(REMOTIVE_API_URL + "?search=" + encodedSearch + "&limit=20");

        HttpRequest request = HttpRequest.newBuilder(uri)
                .GET()
                .timeout(Duration.ofSeconds(12))
                .header("Accept", "application/json")
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return List.of();
            }

            JsonNode jobsNode = objectMapper.readTree(response.body()).path("jobs");
            if (!jobsNode.isArray()) {
                return List.of();
            }

            List<JobSuggestionResponse> suggestions = new ArrayList<>();
            for (JsonNode job : jobsNode) {
                String title = cleanText(job.path("title").asText(null));
                String company = cleanText(job.path("company_name").asText(null));
                String location = cleanText(job.path("candidate_required_location").asText(null));
                String contractType = cleanText(job.path("job_type").asText(null));
                String url = cleanText(job.path("url").asText(null));

                if (title == null || url == null) {
                    continue;
                }

                suggestions.add(new JobSuggestionResponse(
                        title,
                        company != null ? company : "Unknown company",
                        location != null ? location : "Remote",
                        contractType != null ? contractType : "Not specified",
                        url,
                        "Remotive"
                ));
            }

            return suggestions;
        } catch (Exception ignored) {
            return List.of();
        }
    }

    private List<JobSuggestionResponse> fetchArbeitnowJobs(List<String> terms) {
        URI uri = URI.create(ARBEITNOW_API_URL + "?page=1");
        HttpRequest request = HttpRequest.newBuilder(uri)
                .GET()
                .timeout(Duration.ofSeconds(12))
                .header("Accept", "application/json")
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return List.of();
            }

            JsonNode jobsNode = objectMapper.readTree(response.body()).path("data");
            if (!jobsNode.isArray()) {
                return List.of();
            }

            List<JobSuggestionResponse> suggestions = new ArrayList<>();
            for (JsonNode job : jobsNode) {
                String title = cleanText(job.path("title").asText(null));
                String company = cleanText(job.path("company_name").asText(null));
                String location = cleanText(job.path("location").asText(null));
                String url = cleanText(job.path("url").asText(null));

                if (title == null || url == null) {
                    continue;
                }

                boolean isRemote = job.path("remote").asBoolean(false);
                String searchable = String.join(" ",
                        title,
                        company != null ? company : "",
                        cleanText(job.path("description").asText("")) != null
                                ? cleanText(job.path("description").asText(""))
                                : ""
                ).toLowerCase(Locale.ROOT);

                boolean matches = terms.isEmpty()
                        || terms.stream().anyMatch(term -> searchable.contains(term.toLowerCase(Locale.ROOT)));
                if (!matches) {
                    continue;
                }

                suggestions.add(new JobSuggestionResponse(
                        title,
                        company != null ? company : "Unknown company",
                        location != null ? location : "Not specified",
                        isRemote ? "Remote" : "On-site / Hybrid",
                        url,
                        "Arbeitnow"
                ));
            }

            return suggestions.stream()
                    .limit(20)
                    .toList();
        } catch (Exception ignored) {
            return List.of();
        }
    }

    private String buildSearchQuery(String email, String keywords) {
        if (keywords != null && !keywords.isBlank()) {
            return keywords.trim();
        }

        List<String> parts = new ArrayList<>();

        appUserRepository.findByEmailIgnoreCase(email)
                .map(AppUser::getDescription)
                .map(this::cleanText)
                .ifPresent(parts::add);

        skillRepository.findAll().stream()
                .sorted(Comparator.comparing(Skill::getLevel, Comparator.nullsLast(Integer::compareTo)).reversed())
                .limit(5)
                .map(Skill::getName)
                .map(this::cleanText)
                .filter(value -> value != null && !value.isBlank())
                .forEach(parts::add);

        String built = String.join(" ", parts).trim();
        if (built.isBlank()) {
            return FALLBACK_SEARCH;
        }

        return built.length() <= 160 ? built : built.substring(0, 160);
    }

    private List<String> tokenizeSearch(String searchQuery) {
        if (searchQuery == null || searchQuery.isBlank()) {
            return List.of();
        }

        return List.of(searchQuery.split("\\s+"))
                .stream()
                .map(token -> token.toLowerCase(Locale.ROOT).trim())
                .filter(token -> token.length() >= 3)
                .distinct()
                .limit(8)
                .collect(Collectors.toList());
    }

    private String buildDedupKey(JobSuggestionResponse suggestion) {
        String title = suggestion.title() != null ? suggestion.title().toLowerCase(Locale.ROOT) : "";
        String company = suggestion.company() != null ? suggestion.company().toLowerCase(Locale.ROOT) : "";
        String url = suggestion.url() != null ? suggestion.url().toLowerCase(Locale.ROOT) : "";
        if (!url.isBlank()) {
            return url;
        }
        return title + "|" + company;
    }

    private String cleanText(String value) {
        if (value == null) {
            return null;
        }

        String compact = value.replaceAll("\\s+", " ").trim();
        return compact.isEmpty() ? null : compact;
    }
}
