import { useEffect, useMemo, useState } from "react";
import { apiClient } from "../../shared/api/client";
import type { Formation, Project, Skill, WorkExperience } from "../../shared/types/models";
import "./DashboardPage.css";

type DashboardStats = {
  skillsCount: number;
  avgSkillLevel: number;
  experiencesCount: number;
  projectsCount: number;
  formationsCount: number;
};

export function DashboardPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [skillsRes, experiencesRes, projectsRes, formationsRes] = await Promise.all([
        apiClient.get<Skill[]>("/skills"),
        apiClient.get<WorkExperience[]>("/career-experiences"),
        apiClient.get<Project[]>("/projects"),
        apiClient.get<Formation[]>("/formations"),
      ]);

      setSkills(skillsRes.data);
      setExperiences(experiencesRes.data);
      setProjects(projectsRes.data);
      setFormations(formationsRes.data);
    };

    fetchData().catch(() => {
      setSkills([]);
      setExperiences([]);
      setProjects([]);
      setFormations([]);
    });
  }, []);

  const stats = useMemo<DashboardStats>(() => {
    const avgSkillLevel =
      skills.length > 0
        ? skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
        : 0;

    return {
      skillsCount: skills.length,
      avgSkillLevel,
      experiencesCount: experiences.length,
      projectsCount: projects.length,
      formationsCount: formations.length,
    };
  }, [experiences.length, formations.length, projects.length, skills]);

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-card-highlight">
        <h2>Professional Snapshot</h2>
        <p>
          Track your skills, work experiences, projects delivered, and education journey.
        </p>
      </article>

      <article className="dashboard-card">
        <h3>Skills tracked</h3>
        <strong>{stats.skillsCount}</strong>
        <p>Average level: {stats.avgSkillLevel.toFixed(1)} / 10</p>
      </article>

      <article className="dashboard-card">
        <h3>Work experiences</h3>
        <strong>{stats.experiencesCount}</strong>
        <p>Professional roles captured in your portfolio.</p>
      </article>

      <article className="dashboard-card">
        <h3>Projects</h3>
        <strong>{stats.projectsCount}</strong>
        <p>Projects that can be linked to each job experience.</p>
      </article>

      <article className="dashboard-card">
        <h3>Formations</h3>
        <strong>{stats.formationsCount}</strong>
        <p>Education and academic path entries.</p>
      </article>
    </section>
  );
}
