import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import type { JobSuggestion } from "../../shared/types/models";
import "./NetworkingPage.css";

export function NetworkingPage() {
  const [jobSuggestions, setJobSuggestions] = useState<JobSuggestion[]>([]);
  const [keywords, setKeywords] = useState("");
  const [jobsFeedback, setJobsFeedback] = useState<string | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const fetchJobSuggestions = async (searchKeywords: string) => {
    setIsLoadingJobs(true);
    setJobsFeedback(null);

    try {
      const response = await apiClient.get<JobSuggestion[]>("/networking/job-suggestions", {
        params: searchKeywords.trim() ? { keywords: searchKeywords.trim() } : {},
      });

      setJobSuggestions(response.data);
      if (response.data.length === 0) {
        setJobsFeedback("No job suggestion found for this search.");
      }
    } catch {
      setJobSuggestions([]);
      setJobsFeedback("Unable to load job suggestions now.");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobSuggestions("").catch(() => {
      setJobSuggestions([]);
      setJobsFeedback("Unable to load job suggestions now.");
    });
  }, []);

  const onSearchJobs = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetchJobSuggestions(keywords);
  };

  const loadProfileBasedSuggestions = async () => {
    setKeywords("");
    await fetchJobSuggestions("");
  };

  return (
    <section className="networking-layout">
      <article className="panel networking-jobs-panel">
        <h2>Suggested job positions</h2>
        <p className="networking-jobs-hint">
          Suggestions are generated from your profile by default, or from keywords you enter.
        </p>

        <form className="networking-jobs-search" onSubmit={onSearchJobs}>
          <input
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            placeholder="Try: Java Spring, React, Product Manager..."
          />
          <button type="submit" className="secondary" disabled={isLoadingJobs}>
            Search jobs
          </button>
          <button type="button" onClick={loadProfileBasedSuggestions} disabled={isLoadingJobs}>
            Use my profile
          </button>
        </form>

        {jobsFeedback ? <p className="networking-jobs-feedback">{jobsFeedback}</p> : null}
        {isLoadingJobs ? <p className="networking-jobs-feedback">Loading suggestions...</p> : null}

        <ul className="networking-jobs-list">
          {jobSuggestions.map((job) => (
            <li key={`${job.url}_${job.title}`}>
              <div>
                <strong>{job.title}</strong>
                <p>{job.company}</p>
                <p>
                  {job.location} - {job.contractType}
                </p>
                <p>Source: {job.source}</p>
              </div>

              <a href={job.url} target="_blank" rel="noreferrer">
                View offer
              </a>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
