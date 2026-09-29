# 포트폴리오 (임시 이름: 홍길동)

Next.js 14 (App Router) + TypeScript로 만든 흰색 미니멀 포트폴리오 사이트입니다.
추가 UI 라이브러리 없이 순수 CSS로 작성되어 설정 오류가 생기기 어렵습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 배포용 빌드 확인
```

Node.js 18.17 이상이 필요합니다.

## MY 화면 (프로필 · 프로젝트 관리)

상단 메뉴의 **MY** 버튼(`/my`)에서 코드 수정 없이 바로 편집할 수 있습니다.

| 기능 | 방법 |
| --- | --- |
| 프로필 사진 추가/변경 | 사진 위 `+` 버튼 또는 `사진 추가/변경` (자동으로 정사각형 크롭·축소) |
| 프로필 사진 삭제 | `DEL` 버튼 → 이름 이니셜 아바타로 대체 |
| 이름 수정 | `이름 수정` 버튼 (Enter 저장 / Esc 취소) |
| 프로필 전체 수정 | `프로필 수정` — 직무, 소개, 이메일, GitHub, 소개 항목, 기술 스택 |
| 프로젝트 추가 | `+ 프로젝트 추가` |
| 프로젝트 수정 / 삭제 | 각 행의 `수정` / `DEL` 버튼 (홈의 프로젝트 목록 위에도 같은 버튼이 있음) |
| 백업 / 복원 | `내보내기(JSON)` / `가져오기` / `기본값으로 초기화` |

- 수정한 내용은 **브라우저 localStorage**에 저장됩니다. (서버·DB 없음)
- 다른 기기나 배포 사이트에서도 같은 내용을 쓰려면 `내보내기`로 JSON을 저장해 두고 `가져오기`로 불러오세요.
- 브라우저 탭 제목(메타데이터)과 검색 노출용 이름은 서버에서 만들어지므로, 영구 반영하려면 `src/data/profile.ts`의 `name`도 함께 바꿔 주세요.

## 꼭 수정할 곳

| 파일 | 수정 내용 |
| --- | --- |
| `src/data/profile.ts` | 이메일, GitHub 주소, 소개 문구, 기술 스택 |
| `src/data/projects.ts` | 프로젝트별 `live`(배포 주소), `github`(저장소 주소), 기간, 설명 |
| `public/projects/` | 스크린샷 이미지를 넣고 `projects.ts`의 `images`에 경로 추가 |

`live`, `github`가 빈 문자열이면 해당 링크는 화면에서 자동으로 숨겨집니다.

## 폴더 구조

```
src/
├─ app/
│  ├─ layout.tsx            공통 레이아웃, 메타데이터, 폰트
│  ├─ page.tsx              메인 페이지
│  ├─ globals.css           전체 스타일
│  ├─ icon.svg              파비콘
│  ├─ not-found.tsx         404 페이지
│  ├─ my/page.tsx           MY 화면
│  └─ projects/[slug]/page.tsx   프로젝트 상세 페이지
├─ components/              Header, Hero, About, ProjectList, Skills, Contact, Footer,
│                           PortfolioProvider(저장소), MyDashboard, ProfileEditor,
│                           ProjectEditor, ProjectDetail, Avatar, Modal, ConfirmDialog, Icons
├─ lib/                     normalize.ts(데이터 보정), image.ts(이미지 축소)
└─ data/                    profile.ts, projects.ts (기본값)
public/projects/            프로젝트 스크린샷
```

## GitHub에 올리기

```bash
git init
git add .
git commit -m "feat: 포트폴리오 사이트 초기 커밋"
git branch -M main
git remote add origin https://github.com/내아이디/portfolio.git
git push -u origin main
```

## Vercel 배포

1. https://vercel.com 에서 GitHub 계정으로 로그인
2. `Add New → Project`에서 이 저장소를 선택
3. 설정 변경 없이 `Deploy`

배포 주소가 나오면 사람인 이력서의 포트폴리오 URL 칸에 넣으세요.

## 다른 사람에게 공개하기 전 체크

- **MY 화면에서 고친 내용은 내 브라우저에만 저장**됩니다. 방문자에게 보이게 하려면 `src/data/profile.ts`, `src/data/projects.ts`의 값을 직접 수정한 뒤 다시 배포하세요.
- `email`, `github` 값을 본인 정보로 교체하세요.
- 배포 후 주소(예: `https://내프로젝트.vercel.app`)를 공유하면 누구나 볼 수 있습니다.
- Vercel에서 `Settings → Domains`로 내 도메인도 연결할 수 있습니다.
