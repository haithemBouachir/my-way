import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../shared/api/client";
import type { CvDocument } from "../../shared/types/models";
import "./CvHistoryPage.css";

export function CvHistoryPage() {
  const navigate = useNavigate();
  const [versions, setVersions] = useState<CvDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<CvDocument[]>("/cv-documents");
      setVersions(response.data);
    } catch {
      setFeedback("Could not load saved versions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions().catch(() => {
      setFeedback("Could not load saved versions.");
    });
  }, []);

  const openInBuilder = (versionId: number) => {
    navigate(`/cv?versionId=${versionId}`);
  };

  const deleteVersion = async (id: number) => {
    try {
      await apiClient.delete(`/cv-documents/${id}`);
      setFeedback("Saved version deleted.");
      await fetchVersions();
    } catch {
      setFeedback("Delete failed. Please try again.");
    }
  };

  return (
    <section className="cv-history-layout">
      <article className="panel cv-history-panel">
        <div className="cv-history-header">
          <div>
            <h2>CV History</h2>
            <p>Review all saved versions and reopen them in the builder.</p>
          </div>
          <button type="button" className="secondary" onClick={() => navigate("/cv")}>
            Back to CV builder
          </button>
        </div>

        {feedback ? <p className="cv-history-feedback">{feedback}</p> : null}

        <ul className="cv-history-list">
          {versions.map((version) => (
            <li key={version.id} className="cv-history-item">
              <div>
                <strong>{version.title}</strong>
                <p>Template: {version.template}</p>
                <p>Updated: {new Date(version.updatedAt).toLocaleString()}</p>
                <p>Created: {new Date(version.createdAt).toLocaleString()}</p>
              </div>
              <div className="cv-history-actions">
                <button type="button" onClick={() => openInBuilder(version.id)}>
                  Open in builder
                </button>
                <button type="button" className="danger" onClick={() => deleteVersion(version.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {!isLoading && versions.length === 0 ? (
          <p className="cv-history-empty">No saved version yet. Save a CV first.</p>
        ) : null}
        {isLoading ? <p className="cv-history-empty">Loading saved versions...</p> : null}
      </article>
    </section>
  );
}
