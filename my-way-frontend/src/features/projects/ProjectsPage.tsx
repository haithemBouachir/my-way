import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import type { Project } from "../../shared/types/models";
import "./ProjectsPage.css";

const initialForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  technologies: "",
  projectUrl: "",
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(initialForm);

  const fetchProjects = async () => {
    const response = await apiClient.get<Project[]>("/projects");
    setProjects(response.data);
  };

  useEffect(() => {
    fetchProjects().catch(() => setProjects([]));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await apiClient.post("/projects", form);
    setForm(initialForm);
    await fetchProjects();
  };

  const remove = async (id: number) => {
    await apiClient.delete(`/projects/${id}`);
    await fetchProjects();
  };

  return (
    <section className="projects-layout">
      <article className="panel">
        <h2>Add project</h2>
        <form className="panel-form" onSubmit={onSubmit}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((v) => ({ ...v, title: event.target.value }))}
              required
            />
          </label>

          <div className="projects-dates-grid">
            <label>
              Start date
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm((v) => ({ ...v, startDate: event.target.value }))}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => setForm((v) => ({ ...v, endDate: event.target.value }))}
              />
            </label>
          </div>

          <label>
            Technologies
            <input
              value={form.technologies}
              onChange={(event) => setForm((v) => ({ ...v, technologies: event.target.value }))}
              placeholder="React, Spring Boot, MySQL"
            />
          </label>

          <label>
            Project URL
            <input
              type="url"
              value={form.projectUrl}
              onChange={(event) => setForm((v) => ({ ...v, projectUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>

          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm((v) => ({ ...v, description: event.target.value }))}
            />
          </label>

          <button type="submit">Save project</button>
        </form>
      </article>

      <article className="panel">
        <h2>Projects catalog</h2>
        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project.id}>
              <div>
                <strong>{project.title}</strong>
                <p>{project.description || "No description"}</p>
                <p>
                  {project.startDate || "?"} - {project.endDate || "Present"}
                </p>
                <p>{project.technologies || "No technologies listed"}</p>
                {project.projectUrl ? (
                  <a href={project.projectUrl} target="_blank" rel="noreferrer">
                    {project.projectUrl}
                  </a>
                ) : null}
              </div>
              <button type="button" className="danger" onClick={() => remove(project.id)}>
                Delete
              </button>
            </li>
          ))}
          {projects.length === 0 ? <li>No projects yet.</li> : null}
        </ul>
      </article>
    </section>
  );
}
