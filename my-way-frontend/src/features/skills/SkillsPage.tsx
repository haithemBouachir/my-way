import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import type { Skill } from "../../shared/types/models";
import { SKILL_CATEGORIES } from "../../shared/constants/skills";
import { SelectField } from "../../shared/components/inputs/SelectField";
import "./SkillsPage.css";

type SkillForm = {
  name: string;
  category: string;
  level: number;
};

const initialForm: SkillForm = {
  name: "",
  category: SKILL_CATEGORIES[0],
  level: 5,
};

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSkills = async () => {
    const response = await apiClient.get<Skill[]>("/skills");
    setSkills(response.data);
  };

  useEffect(() => {
    fetchSkills().catch(() => setSkills([]));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId === null) {
      await apiClient.post("/skills", form);
    } else {
      await apiClient.put(`/skills/${editingId}`, form);
    }

    setEditingId(null);
    setForm(initialForm);
    await fetchSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id: number) => {
    await apiClient.delete(`/skills/${id}`);
    if (editingId === id) {
      handleCancelEdit();
    }
    await fetchSkills();
  };

  const categoryOptions = SKILL_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <section className="skills-layout">
      <article className="panel">
        <h2>{editingId === null ? "Add skill" : "Update skill"}</h2>
        <form className="panel-form" onSubmit={handleSubmit}>
          <label>
            Skill name
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>

          <label>
            Category
            <SelectField
              value={form.category}
              options={categoryOptions}
              onChange={(value) => setForm((current) => ({ ...current, category: value }))}
              required
            />
          </label>

          <label className="level-label">
            <span>Level (1 to 10)</span>
            <strong>{form.level}/10</strong>
            <input
              className="level-range"
              type="range"
              min={1}
              max={10}
              value={form.level}
              onChange={(event) =>
                setForm((current) => ({ ...current, level: Number(event.target.value) }))
              }
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit">{editingId === null ? "Save skill" : "Update skill"}</button>
            {editingId !== null ? (
              <button type="button" className="secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="panel">
        <h2>Current skills</h2>
        <ul className="skills-list">
          {skills.map((skill) => (
            <li key={skill.id}>
              <div>
                <strong>{skill.name}</strong>
                <p>
                  {skill.category} | level {skill.level}/10
                </p>
              </div>
              <div className="skill-actions">
                <button type="button" className="secondary" onClick={() => handleEdit(skill)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => handleDelete(skill.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
          {skills.length === 0 ? <li>No skills yet.</li> : null}
        </ul>
      </article>
    </section>
  );
}
