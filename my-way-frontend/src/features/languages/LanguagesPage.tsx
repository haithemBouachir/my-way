import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../shared/api/client";
import { SelectField } from "../../shared/components/inputs/SelectField";
import { LANGUAGE_LEVELS } from "../../shared/constants/languages";
import type { LanguageEntry } from "../../shared/types/models";
import "./LanguagesPage.css";

type LanguageForm = {
  name: string;
  level: string;
};

const initialForm: LanguageForm = {
  name: "",
  level: LANGUAGE_LEVELS[2],
};

export function LanguagesPage() {
  const [items, setItems] = useState<LanguageEntry[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchLanguages = async () => {
    const response = await apiClient.get<LanguageEntry[]>("/languages");
    setItems(response.data);
  };

  useEffect(() => {
    fetchLanguages().catch(() => setItems([]));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId === null) {
      await apiClient.post("/languages", form);
    } else {
      await apiClient.put(`/languages/${editingId}`, form);
    }

    setEditingId(null);
    setForm(initialForm);
    await fetchLanguages();
  };

  const onEdit = (entry: LanguageEntry) => {
    setEditingId(entry.id);
    setForm({ name: entry.name, level: entry.level });
  };

  const onDelete = async (id: number) => {
    await apiClient.delete(`/languages/${id}`);
    if (editingId === id) {
      setEditingId(null);
      setForm(initialForm);
    }
    await fetchLanguages();
  };

  const options = LANGUAGE_LEVELS.map((value) => ({ value, label: value }));

  return (
    <section className="languages-layout">
      <article className="panel">
        <h2>{editingId === null ? "Add language" : "Update language"}</h2>
        <form className="panel-form" onSubmit={onSubmit}>
          <label>
            Language
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>

          <label>
            Level
            <SelectField
              value={form.level}
              options={options}
              onChange={(value) => setForm((current) => ({ ...current, level: value }))}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit">{editingId === null ? "Save language" : "Update language"}</button>
            {editingId !== null ? (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="panel">
        <h2>Languages</h2>
        <ul className="languages-list">
          {items.map((entry) => (
            <li key={entry.id}>
              <div>
                <strong>{entry.name}</strong>
                <p>{entry.level}</p>
              </div>
              <div className="language-actions">
                <button type="button" className="secondary" onClick={() => onEdit(entry)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => onDelete(entry.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 ? <li>No languages yet.</li> : null}
        </ul>
      </article>
    </section>
  );
}
