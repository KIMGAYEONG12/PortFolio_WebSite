// ─────────────────────────────────────────────────────────────
// 프로젝트 데이터. 배포 링크와 GitHub 주소는 빈 문자열이면 화면에서 자동으로 숨겨집니다.
// 스크린샷은 public/projects/ 폴더에 넣고 images 배열에 경로를 추가하세요.
//   예) images: [{ src: "/projects/cafeon-1.png", alt: "사장님 대시보드 화면" }]
// ─────────────────────────────────────────────────────────────

export type ProjectImage = { src: string; alt: string };

export type Project = {
  slug: string;
  title: string;
  period: string;
  type: string;
  summary: string;
  role: string;
  stack: string[];
  overview: string;
  responsibilities: string[];
  problems: { title: string; problem: string; solution: string }[];
  retrospective: string[];
  live: string;
  github: string;
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "cafeon",
    title: "cafeOn",
    period: "2026.08 ~ 진행 중",
    type: "팀 프로젝트 · 프론트엔드",
    summary:
      "혼잡도를 보고 찾아가는 카페 지도 앱과, 사장님을 위한 매장 운영 화면을 함께 만든 카페 운영·고객 적립 서비스입니다.",
    role: "프론트엔드 — 고객용 화면과 사장님 관리 화면의 Next.js 구현",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma", "REST API"],
    overview:
      "개인 카페 사장님은 좌석·예약·메뉴·매출을 한 곳에서 관리하고, 고객은 지도에서 주변 카페의 혼잡도를 확인해 찾아갈 수 있는 서비스입니다. 팀 안에서 프론트엔드를 맡아 Figma 와이어프레임을 실제 동작하는 화면으로 옮겼습니다.",
    responsibilities: [
      "Figma 와이어프레임을 모바일·태블릿·PC 반응형 Next.js 화면으로 구현",
      "사장님 관리 화면: 좌석, 예약, 메뉴, 매출, 리뷰, 멤버십 등 운영 페이지",
      "고객 화면: 지도 중심 홈, 혼잡도 필터, 매장 상세 팝업, 길찾기 화면",
      "백엔드(Laravel) API와 연동해 예약·주문·쿠폰·포인트 화면 구현",
    ],
    problems: [
      {
        title: "입력한 좌석 수와 화면에 보이는 숫자가 달랐던 문제",
        problem:
          "좌석 관리 화면에서 전체 좌석 수를 입력해도 다른 숫자가 표시되고, 변경 사항이 고객 화면에 늦게 반영됐습니다.",
        solution:
          "입력 값이 저장되고 다시 화면에 그려지기까지의 상태 흐름을 따라가며 원인을 찾아 수정하고, 반영 속도도 함께 개선했습니다.",
      },
      {
        title: "기능이 많아 복잡해진 화면 구조",
        problem:
          "초기 기획은 기능이 너무 많고 복잡하다는 피드백을 받았습니다.",
        solution:
          "고객 화면은 지도를 중심에 두고 찜, 예약, 혜택, MY 메뉴로 단순화하고, 사장님 화면도 꼭 필요한 기능 위주로 다시 정리했습니다.",
      },
      {
        title: "화면 오류인지 서버 오류인지 구분하기",
        problem:
          "주문 취소 시 오류 문구가 뜨는 문제가 발생했습니다.",
        solution:
          "프론트 코드에는 없는 문구임을 확인하고 서버 API의 취소 가능 상태 조건에서 발생한다는 점을 찾아 팀원과 공유했습니다.",
      },
    ],
    retrospective: [
      "초기에 기능을 넓게 잡아 화면이 무거워졌고, 핵심 흐름만 남기는 데 시간이 들었습니다.",
      "다음에는 핵심 사용자 흐름 하나를 먼저 완성한 뒤 기능을 넓혀 갈 계획입니다.",
    ],
    live: "",
    github: "",
    images: [],
  },
  {
    slug: "path",
    title: "PATH",
    period: "2026.08 ~ 2026.09",
    type: "팀 프로젝트 · 4인 · 프론트엔드",
    summary:
      "일본을 자유여행하는 한국인을 위해 한국어 화면으로 도쿄 대중교통 경로와 여행 일정을 안내하는 AI Agent 웹앱입니다.",
    role: "프론트엔드 — Next.js 프로젝트 구조, 공통 컴포넌트, 지도·경로·일정 결과 페이지",
    stack: ["Next.js", "React", "Google Maps", "Gemini API", "LangChain", "MySQL"],
    overview:
      "출발지와 도착지를 입력하면 여러 API의 정보를 AI Agent가 종합·검증해 경로를 알려주는 서비스입니다. 1차 MVP 범위는 도쿄이며, 저는 사용자가 직접 만나는 화면 전체를 맡았습니다.",
    responsibilities: [
      "Next.js 프로젝트 구조 설계와 공통 컴포넌트 제작",
      "지도, 경로 안내, 여행 일정 결과 페이지 구현",
      "스플래시 화면과 모바일 사용성 개선",
      "2차 중간발표 진행 현황 발표",
    ],
    problems: [
      {
        title: "AI 응답을 기다리는 동안의 불안감",
        problem:
          "경로와 일정을 만드는 데 시간이 걸려서 사용자가 지금 무슨 일이 일어나는지 알기 어려웠습니다.",
        solution:
          "고정된 시간이 아니라 실제 서버 처리 신호에 맞춰 진행 상태를 보여주는 로딩 화면으로 바꿨습니다.",
      },
      {
        title: "여러 API 결과를 한 화면에 이해하기 쉽게 담기",
        problem:
          "교차 검증을 거친 경로 정보가 많아서 한 번에 보여주면 읽기 어려웠습니다.",
        solution:
          "지도와 단계별 경로, 일정 결과를 나누어 보여주는 결과 페이지로 구성했습니다.",
      },
      {
        title: "모바일 브라우저에서 화면 높이가 어긋나는 문제",
        problem:
          "모바일에서 주소창 때문에 화면 높이가 달라져 레이아웃이 어긋났습니다.",
        solution:
          "뷰포트 높이 단위를 svh 기준으로 조정했고, 실기기에서 다시 확인하며 다듬고 있습니다.",
      },
    ],
    retrospective: [
      "도부 노선 등 일부 사업자 데이터는 MVP 범위에서 제외했습니다.",
      "모바일 실기기 점검과 지원 노선 확장이 남은 과제입니다.",
    ],
    live: "",
    github: "",
    images: [],
  },
  {
    slug: "movie-site",
    title: "영화 소개 사이트",
    period: "2026.07.20 ~ 2026.07.22",
    type: "개인 프로젝트 · 과제",
    summary:
      "TMDB API로 영화 목록, 검색, 상세 정보를 보여주는 Next.js + TypeScript 영화 소개 사이트입니다.",
    role: "기획부터 구현, 배포까지 혼자 진행",
    stack: ["Next.js", "TypeScript", "TMDB API", "Postman", "Vercel"],
    overview:
      "TMDB의 여러 API를 활용해 홈, 검색, 상세 페이지를 만든 과제입니다. 벤치마킹 사이트를 참고해 헤더, 히어로, 영화 카드, 평점 게이지까지 화면을 직접 스타일링했습니다.",
    responsibilities: [
      "홈 · 검색 · 상세 페이지와 공통 UI 구현",
      "Route Handler(API 라우트)와 동적 라우팅([id])으로 상세 페이지 구성",
      "Postman으로 API 응답 구조를 확인하고 types 폴더에 타입 정의",
      "Vercel 배포",
    ],
    problems: [
      {
        title: "여러 API를 화면마다 다르게 호출하기",
        problem:
          "전체 목록, 검색, 상세 정보가 각각 다른 API라 응답 구조를 먼저 파악해야 했습니다.",
        solution:
          "Postman으로 응답을 확인한 뒤 TypeScript 타입으로 정리해 화면 코드에서 실수를 줄였습니다.",
      },
      {
        title: "짧은 기간 안에 코드 구조 잡기",
        problem:
          "3일 안에 완성해야 해서 처음부터 구조를 정해두지 않으면 코드가 뒤엉킬 수 있었습니다.",
        solution:
          "app 폴더 안에 about, components, data, movies, types로 역할을 나누어 시작했습니다.",
      },
    ],
    retrospective: [
      "짧은 과제 기간이라 핵심 화면 위주로 구현했습니다.",
      "로딩·오류 상태 처리와 무한 스크롤을 추가하는 것이 개선 계획입니다.",
    ],
    live: "",
    github: "",
    images: [],
  },
  {
    slug: "joinus",
    title: "Joinus",
    period: "2026",
    type: "개인 프로젝트",
    summary:
      "네이버 블로그를 벤치마킹해 만든 블로그 플랫폼으로, 포인트·뱃지, 잔디 캘린더, 테마 설정 같은 참여 기능을 담았습니다.",
    role: "UI 디자인 개편과 기능 구현 (PHP + MySQL)",
    stack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    overview:
      "주간 핫토픽, 최신글·이웃글 탭, 개인 블로그, 관리자 페이지까지 갖춘 블로그 서비스입니다. 다른 서비스에 비해 디자인이 오래된 느낌이라 전체 UI를 새로 바꾸는 작업을 진행했습니다.",
    responsibilities: [
      "메인, 개인 블로그, 마이페이지 화면 설계와 구현",
      "포인트 · 뱃지 시스템과 잔디 캘린더(연속 작성 기록)",
      "관리자 페이지: 회원, 게시글, 댓글, 카테고리, 포인트 설정 관리",
      "블로그 테마 설정 기능",
    ],
    problems: [
      {
        title: "블로그마다 다른 분위기를 고를 수 있게 하기",
        problem:
          "모든 블로그가 같은 모습이면 개성이 드러나지 않았습니다.",
        solution:
          "미니멀 화이트, 다크, 웜톤, 네이비 등 테마별 CSS를 분리해 사용자가 직접 고를 수 있게 했습니다.",
      },
      {
        title: "꾸준히 글을 쓰게 만드는 장치",
        problem:
          "글쓰기는 시작보다 이어가기가 어렵습니다.",
        solution:
          "연속 작성 기록을 보여주는 잔디 캘린더와 포인트·뱃지 보상 시스템을 넣었습니다.",
      },
    ],
    retrospective: [
      "참고한 서비스의 기능을 넓게 담다 보니 UI 일관성을 정리하는 것이 과제였습니다.",
      "다음 개인 블로그 프로젝트에서는 핵심 기능부터 다시 설계할 계획입니다.",
    ],
    live: "",
    github: "",
    images: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
