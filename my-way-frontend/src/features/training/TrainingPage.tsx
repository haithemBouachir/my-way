import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import type { Training } from "../../shared/types/models";
import "./TrainingPage.css";

export function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [category, setCategory] = useState("backend");

  const fetchTrainings = async () => {
    const response = await apiClient.get<Training[]>("/trainings");
    setTrainings(response.data);
  };

  useEffect(() => {
    fetchTrainings().catch(() => setTrainings([]));
  }, []);

  const fetchRecommendations = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await apiClient.get<Training[]>("/trainings/recommendations", {
      params: { category },
    });
    setTrainings(response.data);
  };

  return (
    <section className="training-layout">
      <article className="panel training-filter">
        <h2>Find recommendations</h2>
        <form className="panel-form" onSubmit={fetchRecommendations}>
          <label>
            Skill category
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="backend, frontend, soft-skills"
            />
          </label>
          <button type="submit">Get recommendations</button>
          <button type="button" onClick={() => fetchTrainings()}>
            Reset catalog
          </button>
        </form>
      </article>

      <article className="panel">
        <h2>Training list</h2>
        <ul className="training-list">
          {trainings.map((training) => (
            <li key={training.id}>
              <div>
                <h3>{training.title}</h3>
                <p>
                  {training.provider} | {training.skillCategory} | {training.difficulty}
                </p>
              </div>
              <a href={training.url} target="_blank" rel="noreferrer">
                Open
              </a>
            </li>
          ))}
          {trainings.length === 0 ? <li>No trainings found for this category.</li> : null}
        </ul>
      </article>
    </section>
  );
}
