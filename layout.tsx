import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAGOS | Structural Risk & Engineering Decision",
  description: "구조기술사 판단을 정량화하여 보험 인수심사와 분쟁 대응에 활용하는 구조안전 리스크 평가 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
