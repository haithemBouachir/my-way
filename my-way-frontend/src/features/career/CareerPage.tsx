import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import type { Project, WorkExperience } from "../../shared/types/models";
import "./CareerPage.css";

const initialForm = {
  position: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
  projectIds: [] as number[],
};

export function CareerPage() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(initialForm);

  const fetchExperiences = async () => {
    const response = await apiClient.get<WorkExperience[]>("/career-experiences");
    setExperiences(response.data);
  };

  const fetchProjects = async () => {
    const response = await apiClient.get<Project[]>("/projects");
    setProjects(response.data);
  };

  useEffect(() => {
    Promise.all([fetchExperiences(), fetchProjects()]).catch(() => {
      setExperiences([]);
      setProjects([]);
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await apiClient.post("/career-experiences", form);
    setForm(initialForm);
    await fetchExperiences();
  };

  const handleDelete = async (id: number) => {
    await apiClient.delete(`/career-experiences/${id}`);
    await fetchExperiences();
  };

  const toggleProject = (projectId: number) => {
    setForm((current) => {
      if (current.projectIds.includes(projectId)) {
        return {
          ...current,
          projectIds: current.projectIds.filter((id) => id !== projectId),
        };
      }

      return {
        ...current,
        projectIds: [...current.projectIds, projectId],
      };
    });
  };

  return (
    <section className="career-layout">
      <article className="panel">
        <h2>Add professional experience</h2>
        <form className="panel-form" onSubmit={handleSubmit}>
          <label>
            Position
            <input
              value={form.position}
              onChange={(event) =>
                setForm((current) => ({ ...current, position: event.target.value }))
              }
              required
            />
          </label>

          <label>
            Company
            <input
              value={form.company}
              onChange={(event) =>
                setForm((current) => ({ ...current, company: event.target.value }))
              }
              required
            />
          </label>

          <div className="career-dates-grid">
            <label>
              Start date
              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, startDate: event.target.value }))
                }
              />
            </label>

            <label>
              End date
              <input
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, endDate: event.target.value }))
                }
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>

          <fieldset className="career-projects-picker">
            <legend>Link delivered projects</legend>
            {projects.length > 0 ? (
              <div className="career-projects-list">
                {projects.map((project) => (
                  <label key={project.id} className="career-project-option">
                    <input
                      type="checkbox"
                      checked={form.projectIds.includes(project.id)}
                      onChange={() => toggleProject(project.id)}
                    />
                    <span>{project.title}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p>No project available yet. Create projects first in the Projects page.</p>
            )}
          </fieldset>

          <button type="submit">Save experience</button>
        </form>
      </article>

      <article className="panel">
        <h2>Experience timeline</h2>
        <ul className="career-list">
          {experiences.map((experience) => (
            <li key={experience.id}>
              <h3>{experience.position}</h3>
              <p>{experience.company}</p>
              <p>
                {experience.startDate || "?"} - {experience.endDate || "Present"}
              </p>
              <p>{experience.description || "No description"}</p>
              <p>
                Linked projects: {" "}
                {experience.projects.length > 0
                  ? experience.projects.map((project) => project.title).join(", ")
                  : "None"}
              </p>
              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(experience.id)}
              >
                Delete
              </button>
            </li>
          ))}
          {experiences.length === 0 ? <li>No experience yet.</li> : null}
        </ul>
      </article>
    </section>
  );
}
