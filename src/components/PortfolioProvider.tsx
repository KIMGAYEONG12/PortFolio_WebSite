"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultProfile, type Profile } from "@/data/profile";
import { projects as defaultProjects, type Project } from "@/data/projects";
import {
  DATA_VERSION,
  makeSlug,
  migrateProfile,
  normalizeProfile,
  normalizeProject,
} from "@/lib/normalize";

const STORAGE_KEY = "portfolio:v1";

type NewProject = Omit<Project, "slug">;

type PortfolioContextValue = {
  profile: Profile;
  projects: Project[];
  /** localStorage 불러오기가 끝났는지 */
  ready: boolean;
  /** 브라우저 저장 공간이 부족해 저장에 실패했는지 */
  saveError: boolean;
  updateProfile: (patch: Partial<Profile>) => void;
  addProject: (data: NewProject) => string;
  updateProject: (slug: string, data: Project) => void;
  deleteProject: (slug: string) => void;
  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => { ok: boolean; error?: string };
  toast: (message: string) => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio는 PortfolioProvider 안에서만 사용할 수 있어요.");
  return ctx;
}

export default function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1) 처음 한 번: 브라우저에 저장된 데이터 불러오기
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { v?: unknown; profile?: unknown; projects?: unknown };
        if (data.profile) {
          const loaded = normalizeProfile(data.profile);
          setProfile(typeof data.v === "number" && data.v >= DATA_VERSION ? loaded : migrateProfile(loaded));
        }
        if (Array.isArray(data.projects)) {
          setProjects(
            data.projects.map(normalizeProject).filter((p): p is Project => p !== null)
          );
        }
      }
    } catch {
      /* 저장된 데이터가 깨져 있으면 기본값을 그대로 씁니다 */
    }
    setReady(true);
  }, []);

  // 2) 바뀔 때마다 저장
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: DATA_VERSION, profile, projects }));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [profile, projects, ready]);

  const toast = useCallback((text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg({ id: Date.now(), text });
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const addProject = useCallback(
    (data: NewProject) => {
      const slug = makeSlug(data.title, projects.map((p) => p.slug));
      setProjects((prev) => [{ ...data, slug }, ...prev]);
      return slug;
    },
    [projects]
  );

  const updateProject = useCallback((slug: string, data: Project) => {
    setProjects((prev) => prev.map((p) => (p.slug === slug ? { ...data, slug } : p)));
  }, []);

  const deleteProject = useCallback((slug: string) => {
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const resetAll = useCallback(() => {
    setProfile(defaultProfile);
    setProjects(defaultProjects);
  }, []);

  const exportData = useCallback(
    () => JSON.stringify({ v: DATA_VERSION, profile, projects }, null, 2),
    [profile, projects]
  );

  const importData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json) as { v?: unknown; profile?: unknown; projects?: unknown };
      if (!data || typeof data !== "object" || !data.profile || !Array.isArray(data.projects)) {
        return { ok: false, error: "포트폴리오 데이터 형식이 아니에요." };
      }
      const seen = new Set<string>();
      const list = data.projects
        .map(normalizeProject)
        .filter((p): p is Project => p !== null)
        .filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)));
      const imported = normalizeProfile(data.profile);
      setProfile(typeof data.v === "number" && data.v >= DATA_VERSION ? imported : migrateProfile(imported));
      setProjects(list);
      return { ok: true };
    } catch {
      return { ok: false, error: "파일을 읽지 못했어요. JSON 파일이 맞는지 확인해 주세요." };
    }
  }, []);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      profile,
      projects,
      ready,
      saveError,
      updateProfile,
      addProject,
      updateProject,
      deleteProject,
      resetAll,
      exportData,
      importData,
      toast,
    }),
    [
      profile,
      projects,
      ready,
      saveError,
      updateProfile,
      addProject,
      updateProject,
      deleteProject,
      resetAll,
      exportData,
      importData,
      toast,
    ]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
      {toastMsg && (
        <div key={toastMsg.id} className="toast" role="status" aria-live="polite">
          {toastMsg.text}
        </div>
      )}
    </PortfolioContext.Provider>
  );
}
