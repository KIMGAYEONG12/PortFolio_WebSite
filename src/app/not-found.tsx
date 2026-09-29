import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container notfound">
      <h1 className="notfound-title">페이지를 찾을 수 없어요</h1>
      <p className="muted">주소가 바뀌었거나 없는 페이지입니다. 홈에서 다시 찾아보세요.</p>
      <Link href="/" className="button">
        홈으로 돌아가기
      </Link>
    </section>
  );
}
