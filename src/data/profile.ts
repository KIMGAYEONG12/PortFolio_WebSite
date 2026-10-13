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
  /** 사진에서 보일 중심 위치(0~100, 가운데가 50)와 크기(%, 100이 기본) */
  photoX: number;
  photoY: number;
  photoZoom: number;
  about: string[];
  facts: Fact[];
  skills: SkillGroup[];
  navigation: NavItem[];
};

export const defaultProfile: Profile = {
  name: "김가영",
  nameEn: "Gayeong Kim",
  role: "개발자",
  roleEn: "Developer",
  // 비워 두면 화면에서 자동으로 숨겨집니다.
  tagline: "아이디어를 서비스로, **끝까지 만듭니다.**",
  intro:
    "개인 프로젝트로 Flutter와 Firebase를 사용해 공영도매시장 실시간 시세를 반영한 농장 게임 시세 농부를 개발하고 있습니다. 완성한 뒤 출시할 계획이 있습니다. Next.js와 TypeScript로 화면을 만들어 왔습니다.",
  description:
    "김가영의 프론트 및 웹 앱 개발 포트폴리오. Next.js, React, TypeScript로 만든 팀 프로젝트와 개인 프로젝트를 소개합니다.",

  // TODO: 이메일은 본인 주소로 교체 (GitHub 주소는 설정 완료)
  email: "kboy14@naver.com",
  github: "https://github.com/KIMGAYEONG12",

  // 비워 두면 이름 첫 글자 아바타가 나옵니다.
  // 사진을 쓰려면 public/profile.jpg 파일을 넣고 "/profile.jpg"로 바꾸세요.
  photo: "/profile.jpg",
  // public/profile.jpg 는 동그라미에 맞춰 만들어 둔 사진이라 그대로 보이게 100·50·50 입니다.
  // 원본 증명사진은 public/profile-original.jpg 입니다. 위치·크기를 다시 맞추려면 아래 숫자를 바꾸세요.
  photoX: 50, // 0(왼쪽) ~ 100(오른쪽)
  photoY: 50, // 0(위) ~ 100(아래)
  photoZoom: 100, // 70 ~ 250 (%) — 100이면 사진이 동그라미 폭에 꽉 참

  // 소개 글은 비우고, 경험·활동·교육을 리스트로 보여 줍니다.
  about: [],

  facts: [
    {
      label: "학력",
      value: "대구대학교 정보통신공학전공 졸업 (2021.03 ~ 2025.02) · 학점 3.04 / 4.5",
    },
    {
      label: "2026.03 ~ 2026.10",
      value: "대구 영진 직업 전문학교 · 생성형 AI 기반 UI/UX 디자인 웹 앱 개발 과정 수료 (교육)",
    },
    {
      label: "2024.06 ~ 2024.11",
      value: "대구대학교 졸업 작품 · 아두이노와 MATLAB을 활용한 수경 재배 시스템을 팀으로 제작, 시연·발표 (교내활동)",
    },
    {
      label: "2022.01 ~ 2025.12",
      value: "레뷰 도서 리뷰 · 제품 체험단 리뷰 활동 (사회활동)",
    },
    {
      label: "2021.07",
      value: "코드잇 1기 대학생 코딩 캠프(온라인) · Python, C 언어 학습, 수료 (교육)",
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
        "React Native",
        "Android",
        "CLI",
        "Tailwind CSS",
      ],
    },
    {
      group: "백엔드 · DB",
      items: ["PHP", "Laravel", "Java", "MYSQL", "phpMyAdmin", "Supabase"],
    },
    {
      group: "디자인 · 협업",
      items: ["Figma", "Git / GitHub", "Postman", "Vercel", "Jupyter", "Android Studio"],
    },
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
