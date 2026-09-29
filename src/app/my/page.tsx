import type { Metadata } from "next";
import MyDashboard from "@/components/MyDashboard";

export const metadata: Metadata = {
  title: "MY",
  description: "프로필과 프로젝트를 관리하는 MY 화면",
};

export default function MyPage() {
  return <MyDashboard />;
}
