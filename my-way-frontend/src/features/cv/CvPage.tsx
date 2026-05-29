import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "../../shared/api/client";
import type {
  CvBlock,
  CvDocument,
  Formation,
  LanguageEntry,
  Project,
  Skill,
  UserProfile,
  WorkExperience,
} from "../../shared/types/models";
import "./CvPage.css";

type CvTemplate = "modern" | "classic" | "minimal";

type CvData = {
  profile: UserProfile | null;
  experiences: WorkExperience[];
  projects: Project[];
  formations: Formation[];
  skills: Skill[];
  languages: LanguageEntry[];
};

const templateOptions: Array<{ id: CvTemplate; label: string; description: string }> = [
  { id: "modern", label: "Modern", description: "Bold header, accent timeline blocks." },
  { id: "classic", label: "Classic", description: "Traditional serif style for formal applications." },
  { id: "minimal", label: "Minimal", description: "Clean monochrome layout with balanced spacing." },
];

function formatPeriod(startDate: string | null, endDate: string | null): string {
  const start = startDate || "Start";
  const end = endDate || "Present";
  return `${start} - ${end}`;
}

function createBlock(title: string, content: string, visible = true): CvBlock {
  return {
    id: `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    title,
    content,
    visible,
  };
}

function safeParseBlocks(raw: string): CvBlock[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: String(item.id ?? `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`),
        title: String(item.title ?? "Untitled block"),
        content: String(item.content ?? ""),
        visible: Boolean(item.visible ?? true),
      }));
  } catch {
    return [];
  }
}

function buildDefaultBlocks(data: CvData): CvBlock[] {
  const experienceText =
    data.experiences.length > 0
      ? data.experiences
          .map(
            (experience) =>
              `${experience.position} at ${experience.company}\n${formatPeriod(
                experience.startDate,
                experience.endDate,
              )}\n${experience.description || "No description."}`,
          )
          .join("\n\n")
      : "No experience entries.";

  const projectsText =
    data.projects.length > 0
      ? data.projects
          .map(
            (project) =>
              `${project.title}\nTech: ${project.technologies || "Not specified"}\n${project.description || "No description."}`,
          )
          .join("\n\n")
      : "No projects yet.";

  const educationText =
    data.formations.length > 0
      ? data.formations
          .map(
            (formation) =>
              `${formation.degree} - ${formation.institution}\n${formatPeriod(
                formation.startDate,
                formation.endDate,
              )}\n${formation.fieldOfStudy || "General studies"}`,
          )
          .join("\n\n")
      : "No education entries.";

  const skillsText =
    data.skills.length > 0
      ? data.skills
          .slice()
          .sort((left, right) => right.level - left.level)
          .map((skill) => `${skill.name} (${skill.level}/10)`)
          .join("\n")
      : "No skills yet.";

  const languagesText =
    data.languages.length > 0
      ? data.languages.map((language) => `${language.name} (${language.level})`).join("\n")
      : "No languages yet.";

  return [
    createBlock("Summary", data.profile?.description || "Professional summary is not filled yet."),
    createBlock("Experience", experienceText),
    createBlock("Projects", projectsText),
    createBlock("Education", educationText),
    createBlock("Skills", skillsText),
    createBlock("Languages", languagesText),
  ];
}

export function CvPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [template, setTemplate] = useState<CvTemplate>("modern");
  const [data, setData] = useState<CvData>({
    profile: null,
    experiences: [],
    projects: [],
    formations: [],
    skills: [],
    languages: [],
  });

  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [title, setTitle] = useState("My CV");
  const [blocks, setBlocks] = useState<CvBlock[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const requestedVersionId = Number(searchParams.get("versionId"));
  const hasRequestedVersion = Number.isFinite(requestedVersionId) && requestedVersionId > 0;

  const fetchAllData = async () => {
    const [profileRes, experiencesRes, projectsRes, formationsRes, skillsRes, languagesRes] =
      await Promise.all([
        apiClient.get<UserProfile>("/profile"),
        apiClient.get<WorkExperience[]>("/career-experiences"),
        apiClient.get<Project[]>("/projects"),
        apiClient.get<Formation[]>("/formations"),
        apiClient.get<Skill[]>("/skills"),
        apiClient.get<LanguageEntry[]>("/languages"),
      ]);

    return {
      profile: profileRes.data,
      experiences: experiencesRes.data,
      projects: projectsRes.data,
      formations: formationsRes.data,
      skills: skillsRes.data,
      languages: languagesRes.data,
    } satisfies CvData;
  };

  useEffect(() => {
    const init = async () => {
      const loadedData = await fetchAllData();
      setData(loadedData);
      setBlocks(buildDefaultBlocks(loadedData));
      const response = await apiClient.get<CvDocument[]>("/cv-documents");

      if (hasRequestedVersion) {
        const found = response.data.find((version) => version.id === requestedVersionId);
        if (found) {
          setSelectedVersionId(found.id);
          setTitle(found.title);
          setTemplate((found.template as CvTemplate) || "modern");
          const parsed = safeParseBlocks(found.blocksJson);
          setBlocks(parsed.length > 0 ? parsed : buildDefaultBlocks(loadedData));
          setFeedback(`Loaded version: ${found.title}`);
        }
      }
    };

    init().catch(() => {
      setData({
        profile: null,
        experiences: [],
        projects: [],
        formations: [],
        skills: [],
        languages: [],
      });
      setBlocks([]);
    });
  }, [hasRequestedVersion, requestedVersionId]);

  const visibleBlocks = useMemo(() => blocks.filter((block) => block.visible), [blocks]);

  const profileInitials = useMemo(() => {
    const source = data.profile?.fullName?.trim() || "Your Name";
    const parts = source.split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  }, [data.profile?.fullName]);

  const updateBlock = (id: string, partial: Partial<CvBlock>) => {
    setBlocks((current) =>
      current.map((block) => (block.id === id ? { ...block, ...partial } : block)),
    );
  };

  const moveBlock = (id: string, direction: -1 | 1) => {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const copy = current.slice();
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  };

  const addCustomBlock = () => {
    setBlocks((current) => [...current, createBlock("Custom block", "Add your content here")]);
  };

  const removeBlock = (id: string) => {
    setBlocks((current) => current.filter((block) => block.id !== id));
  };

  const saveCurrent = async (asNew: boolean) => {
    if (isSaving) {
      return;
    }

    const payload = {
      title: title.trim() || "Untitled CV",
      template,
      blocksJson: JSON.stringify(blocks),
    };

    setIsSaving(true);
    try {
      if (!asNew && selectedVersionId !== null) {
        await apiClient.put(`/cv-documents/${selectedVersionId}`, payload);
        setFeedback("CV version updated.");
      } else {
        const response = await apiClient.post<CvDocument>("/cv-documents", payload);
        setSelectedVersionId(response.data.id);
        setFeedback("New CV version saved.");
        navigate("/cv/history");
      }
    } catch {
      setFeedback("Saving failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetFromCurrentData = () => {
    setSelectedVersionId(null);
    setTitle("My CV");
    setBlocks(buildDefaultBlocks(data));
    setFeedback("Blocks reset from your latest profile data.");
  };

  return (
    <section className="cv-layout">
      <article className="panel cv-controls no-print">
        <h2>CV Builder</h2>
        <p>Create multiple CV versions, customize blocks, and print.</p>

        <label className="cv-field">
          CV title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>

        <div className="cv-templates-grid">
          {templateOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={template === option.id ? "cv-template-card active" : "cv-template-card"}
              onClick={() => setTemplate(option.id)}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className="cv-actions-grid">
          <button type="button" onClick={() => saveCurrent(false)} disabled={isSaving}>
            {isSaving ? "Saving..." : "Update current version"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => saveCurrent(true)}
            disabled={isSaving}
          >
            Save as new version
          </button>
          <button type="button" className="secondary" onClick={resetFromCurrentData}>
            Reset from profile data
          </button>
          <button type="button" className="secondary" onClick={() => navigate("/cv/history")}>
            View saved versions history
          </button>
          <button type="button" onClick={addCustomBlock}>
            Add custom block
          </button>
          <button type="button" className="cv-print-btn" onClick={() => window.print()}>
            Print / Download PDF
          </button>
        </div>

        {feedback ? <p className="cv-feedback">{feedback}</p> : null}

        <h3>Blocks editor</h3>
        <div className="cv-block-editor">
          {blocks.map((block, index) => (
            <article key={block.id} className="cv-block-card">
              <div className="cv-block-top">
                <input
                  value={block.title}
                  onChange={(event) => updateBlock(block.id, { title: event.target.value })}
                  placeholder="Block title"
                />
                <label className="cv-block-visible">
                  <input
                    type="checkbox"
                    checked={block.visible}
                    onChange={(event) => updateBlock(block.id, { visible: event.target.checked })}
                  />
                  Visible
                </label>
              </div>

              <textarea
                rows={5}
                value={block.content}
                onChange={(event) => updateBlock(block.id, { content: event.target.value })}
              />

              <div className="cv-block-actions">
                <button type="button" className="secondary" onClick={() => moveBlock(block.id, -1)}>
                  Up
                </button>
                <button type="button" className="secondary" onClick={() => moveBlock(block.id, 1)}>
                  Down
                </button>
                <button type="button" className="danger" onClick={() => removeBlock(block.id)}>
                  Remove
                </button>
                <span>#{index + 1}</span>
              </div>
            </article>
          ))}
          {blocks.length === 0 ? <p>No block left. Add a custom block.</p> : null}
        </div>
      </article>

      <article className={`cv-preview panel cv-${template}`}>
        <header className="cv-header">
          <div className="cv-avatar" aria-hidden="true">
            {data.profile?.avatarUrl ? (
              <img src={data.profile.avatarUrl} alt="" className="cv-avatar-image" />
            ) : (
              <span>{profileInitials}</span>
            )}
          </div>

          <div className="cv-identity">
            <h1>{data.profile?.fullName || "Your Name"}</h1>
            <p>{data.profile?.description || "Professional summary is not filled yet."}</p>
          </div>
          <div className="cv-contact">
            <p>{data.profile?.email || "email@example.com"}</p>
            <p>{data.profile?.phone || "No phone"}</p>
            <p>
              {data.profile?.address || "No address"}
              {data.profile?.postalCode || data.profile?.city
                ? `, ${data.profile?.postalCode || ""} ${data.profile?.city || ""}`
                : ""}
            </p>
          </div>
        </header>

        <div className="cv-section-list">
          {visibleBlocks.map((block) => (
            <section key={block.id}>
              <h3>{block.title}</h3>
              <article className="cv-item">
                {block.content.split("\n").map((line, index) => (
                  <p key={`${block.id}_${index}`}>{line || " "}</p>
                ))}
              </article>
            </section>
          ))}
          {visibleBlocks.length === 0 ? <p>No visible blocks to preview.</p> : null}
        </div>
      </article>
    </section>
  );
}
