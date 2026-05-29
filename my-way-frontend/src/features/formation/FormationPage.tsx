import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import type { Formation } from "../../shared/types/models";
import "./FormationPage.css";

const initialForm = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  description: "",
};

export function FormationPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [form, setForm] = useState(initialForm);

  const fetchFormations = async () => {
    const response = await apiClient.get<Formation[]>("/formations");
    setFormations(response.data);
  };

  useEffect(() => {
    fetchFormations().catch(() => setFormations([]));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await apiClient.post("/formations", form);
    setForm(initialForm);
    await fetchFormations();
  };

  const remove = async (id: number) => {
    await apiClient.delete(`/formations/${id}`);
    await fetchFormations();
  };

  return (
    <section className="formation-layout">
      <article className="panel">
        <h2>Add formation</h2>
        <form className="panel-form" onSubmit={onSubmit}>
          <label>
            Institution
            <input
              value={form.institution}
              onChange={(event) => setForm((v) => ({ ...v, institution: event.target.value }))}
              required
            />
          </label>

          <label>
            Degree
            <input
              value={form.degree}
              onChange={(event) => setForm((v) => ({ ...v, degree: event.target.value }))}
              required
            />
          </label>

          <label>
            Field of study
            <input
              value={form.fieldOfStudy}
              onChange={(event) => setForm((v) => ({ ...v, fieldOfStudy: event.target.value }))}
            />
          </label>

          <div className="formation-dates-grid">
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
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm((v) => ({ ...v, description: event.target.value }))}
            />
          </label>

          <button type="submit">Save formation</button>
        </form>
      </article>

      <article className="panel">
        <h2>Academic path</h2>
        <ul className="formation-list">
          {formations.map((formation) => (
            <li key={formation.id}>
              <div>
                <strong>{formation.degree}</strong>
                <p>{formation.institution}</p>
                <p>{formation.fieldOfStudy || "No field specified"}</p>
                <p>
                  {formation.startDate || "?"} - {formation.endDate || "Present"}
                </p>
                <p>{formation.description || "No description"}</p>
              </div>
              <button type="button" className="danger" onClick={() => remove(formation.id)}>
                Delete
              </button>
            </li>
          ))}
          {formations.length === 0 ? <li>No formation yet.</li> : null}
        </ul>
      </article>
    </section>
  );
}
