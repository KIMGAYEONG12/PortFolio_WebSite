// ─────────────────────────────────────────────────────────────
// 여기만 수정하면 사이트 기본 내용이 바뀝니다.
// (사이트의 MY 화면에서 고친 내용은 브라우저에 저장되며, 이 파일의 값은 "기본값"으로 쓰입니다.)
// email / github 값은 본인 정보로 꼭 교체하세요.
// ─────────────────────────────────────────────────────────────

export type SkillGroup = { group: string; items: string[] };
export type Fact = { label: string; value: string };
export type NavItem = { label: string; href: string };

export type Profile = {
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  tagline: string;
  intro: string;
  description: string;
  email: string;
  github: string;
  /** 프로필 사진 (data URL). 빈 문자열이면 이니셜 아바타가 표시됩니다. */
  photo: string;
  about: string[];
  facts: Fact[];
  skills: SkillGroup[];
  navigation: NavItem[];
};

export const defaultProfile: Profile = {
  name: "김가영",
  nameEn: "Gayeong Kim",
  role: "Front-end & Web App Developer",
  roleEn: "Front-end & Web App Developer",
  tagline: "처음 쓰는 사람도 막히지 않는 화면을 만듭니다.",
  intro:
    "Next.js와 TypeScript로 화면을 만들고, 팀 프로젝트에서 API 연동과 반응형 UI를 맡아 왔습니다.",
  description:
    "김가영의 프론트 및 웹 앱 개발 포트폴리오. Next.js, React, TypeScript로 만든 팀 프로젝트와 개인 프로젝트를 소개합니다.",

  // TODO: 이메일은 본인 주소로 교체 (GitHub 주소는 설정 완료)
  email: "kboy14@naver.com",
  github: "https://github.com/KIMGAYEONG12",

  photo: "/profile.jpg",

  about: [
    "정보통신공학을 전공하고, Next.js·TypeScript로 사용자가 마주하는 화면을 만듭니다. PHP·MySQL 기반의 서버 코드와 Firebase까지 다루며 프런트와 백엔드 사이를 매끄럽게 잇습니다.",
    "졸업 작품으로 아두이노와 MATLAB을 활용한 수경 재배 시스템을 팀으로 만들어 데이터를 확인하고 오류를 고치며 시연·발표했습니다. 이후 웹·앱 개발 과정에서 팀 프로젝트의 API 연동과 반응형 UI를 맡았고, 지금은 Flutter로 개인 프로젝트를 만들고 있습니다.",
    "화려함보다 처음 쓰는 사람도 막히지 않는 사용성을 더 중요하게 생각합니다.",
  ],

  facts: [
    {
      label: "학력",
      value: "대구대학교 정보통신공학전공 졸업 (2021.03 ~ 2025.02) · 학점 4.1 / 4.5",
    },
    {
      label: "협업 방식",
      value:
        "Figma 와이어프레임을 기준으로 화면 단위를 나누고, 백엔드 API 명세를 함께 확인하며 작업합니다.",
    },
  ],

  skills: [
    {
      group: "프론트엔드",
      items: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Zustand",
        "Flutter",
        "Dart",
      ],
    },
    { group: "백엔드 · DB", items: ["PHP", "Laravel", "MySQL", "SQLite", "Firebase"] },
    {
      group: "디자인 · 협업",
      items: ["Figma", "Git / GitHub", "Postman", "Vercel"],
    },
    { group: "학습 중", items: ["React Native", "Java"] },
  ],

  navigation: [
    { label: "프로젝트", href: "/#projects" },
    { label: "소개", href: "/#about" },
    { label: "기술", href: "/#skills" },
    { label: "연락", href: "/#contact" },
  ],
};

// 기존 코드(layout.tsx 등)와의 호환용 별칭
export const profile = defaultProfile;
