import type { Metadata } from "next";
import { projects, getProject } from "@/data/projects";
import ProjectDetail from "@/components/ProjectDetail";

type Props = { params: { slug: string } };

// 기본 프로젝트는 미리 만들어 두고, MY에서 새로 추가한 프로젝트는 접속 시 브라우저 데이터로 그립니다.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "프로젝트" };
  return { title: project.title, description: project.summary };
}

export default function ProjectPage({ params }: Props) {
  return <ProjectDetail slug={params.slug} />;
}
