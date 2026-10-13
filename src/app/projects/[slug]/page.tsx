import type { Metadata } from "next";
import { projects, getProject } from "@/data/projects";
import ProjectDetail from "@/components/ProjectDetail";
import { profile } from "@/data/profile";

type Props = { params: { slug: string } };

// 기본 프로젝트는 미리 만들어 두고, MY에서 새로 추가한 프로젝트는 접속 시 브라우저 데이터로 그립니다.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.slug);
  // 탭 제목은 어느 프로젝트를 봐도 "김가영 | 포트폴리오"로 통일합니다.
  const title = { absolute: `${profile.name} | 포트폴리오` };
  if (!project) return { title };
  return { title, description: project.summary };
}

export default function ProjectPage({ params }: Props) {
  return <ProjectDetail slug={params.slug} />;
}
