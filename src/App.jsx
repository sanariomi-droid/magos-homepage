import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import emailjs from "@emailjs/browser";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const LOGO_SRC = "/magos_logo.png";

/* =========================
   EmailJS 실제 값
========================= */
const EMAILJS_SERVICE_ID = "service_grnbxc8";
const EMAILJS_TEMPLATE_ID = "template_c36d68cj";
const EMAILJS_PUBLIC_KEY = "GvUELP6idsY4ppGNa";

/* =========================
   DATA
========================= */
const HERO_POINTS = [
  "구조안전 리스크 평가",
  "구조기술사 검토",
  "리스크 인증",
  "건설포렌식",
  "법원감정용 전자증거 패키지",
];

const DIFFERENTIATORS = [
  {
    title: "특허 기반 플랫폼",
    desc: "6개 특허 축을 기반으로 데이터 신뢰성, 리스크 인증, 전문가 협업, 포렌식, 전자적 증거 패키지를 하나로 연결합니다.",
  },
  {
    title: "기술사 검토 연계",
    desc: "구조기술사의 공학적 판단을 리스크 수치, 인증, 절차 추적, 최종 산출물과 연결합니다.",
  },
  {
    title: "인증·보험·포렌식 확장",
    desc: "구조안전 평가에 그치지 않고 보험, 유지관리, 분쟁 대응, 법원감정까지 확장 가능한 구조를 지향합니다.",
  },
];

const CLIENT_SERVICES = [
  {
    title: "설계 발주처 / 공공기관",
    desc: "구조안전 리스크 평가, 기술사 검토, 우선순위 판단, 공공 의사결정 보조",
  },
  {
    title: "건설사 / 감리단",
    desc: "시공단계 위험 검토, 보수·보강 판단, 조건부 승인 및 협업 검토",
  },
  {
    title: "유지관리 기관 / 시설물 관리자",
    desc: "점검 이력 기반 MRI 평가, 관리 우선순위, 자산군 리스크 비교",
  },
  {
    title: "보험사 / 손해사정",
    desc: "리스크 인증, 인수심사 보조지표, 사고 원인기여도 및 책임영향도 분석",
  },
  {
    title: "분쟁 대응 / 포렌식",
    desc: "사고 전후 비교, 설계·시공·유지관리 요인별 기여도, 포렌식 분석 보고서",
  },
  {
    title: "법원감정 / 전자증거",
    desc: "감정자료 구조화, 메타데이터, 증거 신뢰도, 해시 기반 전자적 증거 패키지",
  },
];

const PATENT_LAYERS = [
  {
    id: "p1",
    no: "01",
    title: "데이터 신뢰성 및 절차 추적",
    subtitle: "Data Trust & Procedure Trace",
    desc: "입력데이터 수집, 출처·작성주체·변경이력·정합성 검증, 검토·보완·승인 절차 추적, 인증상태·인증번호·인증등급 생성을 수행하는 디지털 신뢰 레이어",
    outputs: ["데이터 신뢰성 검토", "절차 추적 기록", "인증상태 / 인증번호"],
  },
  {
    id: "p2",
    no: "02",
    title: "구조안전 리스크 인증 엔진",
    subtitle: "Structural Risk Certification Engine",
    desc: "PSI·DRI·BII·CLI를 기반으로 MRI와 MRI_final을 산정하고, 구조기술사 검토와 연계된 인증서를 생성하는 핵심 엔진",
    outputs: ["MRI / MRI_final", "구조안전 리스크 인증서", "검토연계 결과물"],
  },
  {
    id: "p3",
    no: "03",
    title: "전문가 풀 협업 플랫폼",
    subtitle: "Expert Pool Collaboration Platform",
    desc: "프로젝트 접수, 전문가 자격·수행이력·신뢰도 관리, 총괄·분야별·보조 검토자 배정, 협업 검토, 성과평가 및 재배정 학습까지 연결하는 운영 플랫폼",
    outputs: ["전문가 배정", "협업 검토 결과", "프로젝트 수행 이력"],
  },
  {
    id: "p4",
    no: "04",
    title: "전문가 판단 정량화 레이어",
    subtitle: "Decision Intelligence Layer",
    desc: "서술형 전문가 판단을 위험증분·감소, 조건부 승인, 추가조사 필요성 등의 수치값으로 변환하고 복수 전문가 의견을 통합하여 최종 리스크를 보정하는 레이어",
    outputs: ["전문가 판단 수치화", "복수 의견 통합", "최종 리스크 보정"],
  },
  {
    id: "p5",
    no: "05",
    title: "건설포렌식 및 원인분석",
    subtitle: "Construction Forensic & Cause Analysis",
    desc: "사전 리스크 평가와 사고 후 데이터를 연계하여 변화량, 원인기여도, 책임영향도를 분석하고 보험·손해사정·분쟁 대응으로 확장하는 포렌식 레이어",
    outputs: ["포렌식 보고서", "원인기여도 분석", "책임영향도 분석"],
  },
  {
    id: "p6",
    no: "06",
    title: "전자적 증거 패키지 검증",
    subtitle: "Judicial Evidence Package Verification",
    desc: "감정자료 통합, 메타데이터 생성, 증거 신뢰도 정량화, 판단–근거자료 매핑, 해시 기반 무결성 검증을 포함하는 전자적 증거 패키지 구조",
    outputs: ["전자적 증거 패키지", "해시 / 검증정보", "제출용 전자문서"],
  },
];

const FLOW_ITEMS = [
  "자료 접수",
  "데이터 신뢰성 확인",
  "MRI / 리스크 산정",
  "기술사 검토",
  "전문가 협업 / 정량화",
  "인증 또는 포렌식 분석",
  "보고서 / 증거 패키지 제공",
];

const FREE_SERVICES = [
  {
    title: "기본 MRI 자가진단",
    desc: "PSI, DRI, BII, CLI의 개념형 점수와 총점, 위험등급을 빠르게 확인합니다.",
  },
  {
    title: "데이터 체크리스트 진단",
    desc: "설계도서, 점검기록, 유지관리이력, 손상 사진, 계측자료 보유 여부를 빠르게 점검합니다.",
  },
  {
    title: "서비스별 사전 적합도 확인",
    desc: "보험용 / 유지관리용 / 포렌식용 / 법원감정용 중 적합한 서비스를 미리 분류합니다.",
  },
  {
    title: "샘플 리포트 미리보기",
    desc: "표지 1장, 결과 예시 1장, 등급표 1장 수준의 샘플 결과를 제공합니다.",
  },
];

const PAID_SERVICES = [
  {
    title: "기술사 검토 연계 리스크 인증",
    desc: "구조기술사 검토의견, Kd·Ki 보정, MRI_final, 인증번호 및 인증등급이 포함된 정식 인증",
  },
  {
    title: "전문가 참여형 정밀 평가",
    desc: "총괄 검토자·분야별 검토자·보조 검토자 배정과 협업 검토 수행",
  },
  {
    title: "전문가 판단 정량화 평가",
    desc: "서술형 전문가 판단을 수치화하고 복수 전문가 의견을 통합하여 리스크를 정밀 보정",
  },
  {
    title: "포렌식 원인분석 보고서",
    desc: "사고 전후 변화량, 설계/시공/유지관리 요인별 기여도, 책임영향도 분석",
  },
  {
    title: "보험 / 손해사정 대응 패키지",
    desc: "보험 인수심사, 손해사정, 책임비율 검토를 위한 구조화 자료 제공",
  },
  {
    title: "법원감정용 전자적 증거 패키지",
    desc: "메타데이터, 증거 신뢰도, 판단–근거 매핑, 해시값, 제출용 전자문서 생성",
  },
  {
    title: "API / SaaS / 기관용 대시보드",
    desc: "보험사, 공공기관, 시설물 관리자, 건설사/감리단을 위한 기관형 서비스",
  },
];

const SAMPLE_OUTPUTS = [
  {
    title: "샘플 결과 1",
    desc: "MRI 계산 결과 / 리스크 등급 / 권고사항 요약",
  },
  {
    title: "샘플 결과 2",
    desc: "정식 인증서 예시 / 검토정보 / 등급 / 발급 형식",
  },
  {
    title: "샘플 결과 3",
    desc: "포렌식 분석 1페이지 예시 / 원인기여도 / 책임영향도",
  },
  {
    title: "샘플 결과 4",
    desc: "전자적 증거 패키지 구조 / 해시 / 제출문서 구성",
  },
];

function OverlayPanel({ open, title, subtitle, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-panel" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <div>
            <div className="overlay-kicker">{subtitle}</div>
            <h3>{title}</h3>
          </div>
          <button className="overlay-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <div className="overlay-body">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [openPanel, setOpenPanel] = useState(null);

  const [psi, setPsi] = useState(54);
  const [dri, setDri] = useState(58);
  const [bii, setBii] = useState(46);
  const [cli, setCli] = useState(38);
  const [kd, setKd] = useState(1.05);
  const [ki, setKi] = useState(1.04);

  const [contact, setContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    purpose: "기술사 검토 연계 리스크 인증",
    message: "",
  });

  const getInquiryType = (purpose) => {
    if (purpose.includes("인증") || purpose.includes("검토")) return "cert";
    if (
      purpose.includes("포렌식") ||
      purpose.includes("법원") ||
      purpose.includes("손해사정")
    ) return "forensic";
    return "info";
  };

  const [isSending, setIsSending] = useState(false);
  const [submitState, setSubmitState] = useState({
    type: "",
    message: "",
  });

  const contactFormRef = useRef(null);
  const pdfReportRef = useRef(null);

  const diagnosis = useMemo(() => {
    const mri = psi * 0.35 + dri * 0.3 + bii * 0.2 + cli * 0.15;
    const final = 100 - (100 - mri) / (kd * ki);

    let grade = "A";
    let label = "안정";
    let comment = "현재는 비교적 안정적인 상태로 해석됩니다.";

    if (final >= 80) {
      grade = "D";
      label = "긴급 대응 필요";
      comment = "즉시 점검, 제한조치, 보수·보강 검토가 요구되는 수준입니다.";
    } else if (final >= 65) {
      grade = "C";
      label = "위험";
      comment = "기술사 검토와 정밀 분석 연계가 권장되는 수준입니다.";
    } else if (final >= 50) {
      grade = "B";
      label = "관리 필요";
      comment = "점검주기 조정과 관리 우선순위 검토가 필요한 수준입니다.";
    }

    return {
      mri: mri.toFixed(1),
      final: final.toFixed(1),
      grade,
      label,
      comment,
    };
  }, [psi, dri, bii, cli, kd, ki]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState({ type: "", message: "" });

    if (!contactFormRef.current) return;

    const inquiryType = getInquiryType(contact.purpose);

    try {
      setIsSending(true);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: contact.name,
          company: contact.company,
          reply_to: contact.email,
          phone: contact.phone,
          purpose: contact.purpose,
          message: contact.message,
          inquiry_type: inquiryType,
          subject_tag:
            inquiryType === "cert"
              ? "[인증 문의]"
              : inquiryType === "forensic"
              ? "[포렌식 / 법원감정]"
              : "[일반 문의]",
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setSubmitState({
        type: "success",
        message:
          inquiryType === "cert"
            ? "구조안전 인증 문의가 접수되었습니다."
            : inquiryType === "forensic"
            ? "포렌식 / 법원감정 문의가 접수되었습니다."
            : "문의가 정상 접수되었습니다.",
      });

      setContact({
        name: "",
        company: "",
        email: "",
        phone: "",
        purpose: "기술사 검토 연계 리스크 인증",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS 전송 오류:", error);
      setSubmitState({
        type: "error",
        message: "문의 전송 실패 (설정 확인 필요)",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!pdfReportRef.current) return;

    try {
      const canvas = await html2canvas(pdfReportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const usableWidth = pdfWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
      heightLeft -= pdfHeight - margin * 2;

      while (heightLeft > 0) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
        heightLeft -= pdfHeight - margin * 2;
      }

      pdf.save(`MAGOS_MRI_Report_${diagnosis.final}.pdf`);
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="app">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="grid-noise" />

      <header className="site-header">
        <a href="#home" className="brand">
          <div className="brand-logo-shell">
            <img
              src={LOGO_SRC}
              alt="MAGOS"
              className="brand-logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="brand-copy">
            <strong>MAGOS</strong>
            <span>Structural Risk &amp; Engineering Decision</span>
          </div>
        </a>

        <nav className="site-nav">
          <a href="#home" className="nav-link active">
            Home
          </a>
          <button className="nav-link" onClick={() => setOpenPanel("services")}>
            Services
          </button>
          <button className="nav-link" onClick={() => setOpenPanel("demo")}>
            Demo
          </button>
          <button className="nav-link" onClick={() => setOpenPanel("contact")}>
            Contact
          </button>
        </nav>
      </header>

      <main className="page-shell" id="home">
        <section className="hero">
          <div className="hero-main card">
            <div className="eyebrow">OFFICIAL STRUCTURAL RISK PLATFORM</div>

            <h1>
              구조안전 리스크 평가 ·
              <br />
              기술사 검토 · 리스크 인증 ·
              <br />
              포렌식까지 연결하는 MAGOS
            </h1>

            <p className="hero-description">
              MAGOS Structure Engineering Lab은 구조안전 리스크를 정량화하고,
              구조기술사의 공학적 판단을 데이터 기반으로 연결하여 인증, 의사결정,
              보험 및 포렌식까지 확장하는 구조안전 리스크 플랫폼입니다.
            </p>

            <div className="hero-keywords">
              {HERO_POINTS.map((item) => (
                <span className="hero-keyword" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setOpenPanel("demo")}>
                무료 진단 시작
              </button>
              <button className="btn btn-secondary" onClick={() => setOpenPanel("services")}>
                Services 열기
              </button>
              <button className="btn btn-ghost" onClick={() => setOpenPanel("contact")}>
                Contact 열기
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <span>Patent Stack</span>
                <strong>6 Core Patents</strong>
              </div>
              <div className="stat-card">
                <span>Core Engine</span>
                <strong>MRI / MRI_final</strong>
              </div>
              <div className="stat-card">
                <span>Applications</span>
                <strong>인증 · 보험 · 유지관리 · 포렌식 · 법원감정</strong>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="flow-card card">
              <div className="flow-head">
                <span className="chip">PROJECT FLOW</span>
                <p>실제 의뢰가 접수되어 결과물이 제공되는 절차를 한 화면으로 정리했습니다.</p>
              </div>

              <div className="flow-list">
                {FLOW_ITEMS.map((item, index) => (
                  <div className="flow-row" key={item}>
                    <div className="flow-index">{index + 1}</div>
                    <div className="flow-box">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">WHY MAGOS</div>
            <h2>왜 MAGOS인가</h2>
            <p>
              일반적인 구조검토 소개 페이지를 넘어, 구조안전 리스크를 데이터와 기술사
              판단, 인증, 분쟁 대응까지 연결하는 플랫폼형 구조를 명확히 제시합니다.
            </p>
          </div>

          <div className="overview-grid">
            {DIFFERENTIATORS.map((item) => (
              <article className="card soft-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">OFFICE</div>
            <h2>사무소 소개</h2>
          </div>

          <div className="founder card">
            <div className="founder-left">
              <div className="founder-chip">MAGOS STRUCTURE ENGINEERING LAB</div>
              <h3>김황준</h3>
              <div className="founder-role">공학박사 · 토목구조기술사</div>
            </div>
            <div className="founder-right">
              <p>
                마고스 구조기술사사무소는 구조안전 리스크 평가, 구조기술사 검토,
                리스크 인증, 건설포렌식 및 법원감정 대응을 하나의 서비스 체계로
                연결하는 구조기술사 기반 플랫폼을 지향합니다.
              </p>
              <p>
                구조안전 판단을 단순 보고서가 아니라 추적 가능하고, 인증 가능하며,
                분쟁 대응까지 확장 가능한 의사결정 체계로 만들고자 합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">CLIENT-ORIENTED SERVICES</div>
            <h2>고객 기준 서비스 구조</h2>
            <p>
              고객이 자신의 상황에 맞는 의뢰 유형을 빠르게 찾을 수 있도록 서비스
              대상을 기준으로 정리했습니다.
            </p>
          </div>

          <div className="client-grid">
            {CLIENT_SERVICES.map((item) => (
              <article className="card client-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">PATENT STACK</div>
            <h2>특허 6개 통합 구조</h2>
            <p>
              특허를 단순 나열하지 않고, 각 특허가 실제 고객 산출물과 어떻게 연결되는지
              함께 보여주도록 재구성했습니다.
            </p>
          </div>

          <div className="patent-grid">
            {PATENT_LAYERS.map((layer) => (
              <article className="card patent-card" key={layer.id}>
                <div className="patent-top">
                  <div className="patent-no">{layer.no}</div>
                  <div className="patent-title-wrap">
                    <span>{layer.subtitle}</span>
                    <h3>{layer.title}</h3>
                  </div>
                </div>

                <p className="patent-desc">{layer.desc}</p>

                <div className="bullet-tags">
                  {layer.outputs.map((item) => (
                    <span className="bullet-tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="cta-banner card">
            <div>
              <div className="section-kicker">GET STARTED</div>
              <h2>무료 진단부터 정식 인증 · 포렌식 · 증거 패키지까지 확장합니다</h2>
              <p>
                Home에서는 공식성과 핵심 구조를 선명하게 보여주고, Services / Demo /
                Contact에서는 실제 의뢰와 연결되는 상세 화면을 열어봅니다.
              </p>
            </div>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={() => setOpenPanel("demo")}>
                무료 진단 시작
              </button>
              <button className="btn btn-secondary" onClick={() => setOpenPanel("services")}>
                Services
              </button>
              <button className="btn btn-ghost" onClick={() => setOpenPanel("contact")}>
                Contact
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer official-footer">
        <div className="site-footer-inner official-footer-inner">
          <div className="footer-office">
            <strong>MAGOS</strong>
            <span>마고스 유한회사 · 마고스 구조기술사사무소</span>

            <p className="footer-section-title">[Platform Company]</p>
            <p>마고스 유한회사 (MAGOS Co., Ltd.)</p>
            <p>AI 기반 구조안전 리스크 플랫폼 · 데이터 · SaaS</p>

            <p className="footer-section-title">[Engineering Office]</p>
            <p>마고스 구조기술사사무소 (MAGOS Structure Engineering Lab)</p>
            <p>대표: 김황준 (공학박사, 토목구조기술사)</p>

            <p className="footer-section-title">Structural Risk &amp; Engineering Decision</p>
            <p>
              구조안전 리스크 평가 · 구조기술사 검토 · 리스크 인증 · 건설포렌식 · 법원감정
            </p>

            <p>Email: info@magos.ai.kr (Official Inquiries)</p>
            <p>Admin: ceo@magos.ai.kr</p>
            <p>Official Website: magos.ai.kr</p>
            <p>Future Main Domain: magos.co.kr</p>

            <p className="footer-copyright">© 2026 MAGOS. All rights reserved.</p>
          </div>

          <div className="footer-nav">
            <button onClick={() => setOpenPanel("services")}>Services</button>
            <button onClick={() => setOpenPanel("demo")}>Demo</button>
            <button onClick={() => setOpenPanel("contact")}>Contact</button>
          </div>
        </div>
      </footer>

      <OverlayPanel
        open={openPanel === "services"}
        title="Services"
        subtitle="FREE / PREMIUM / CLIENT-ORIENTED"
        onClose={() => setOpenPanel(null)}
      >
        <div className="services-panel-grid">
          <div className="service-column free">
            <div className="service-badge free">FREE</div>
            <h4>무료 서비스 4개</h4>
            <div className="service-items">
              {FREE_SERVICES.map((item) => (
                <div className="service-item" key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="service-column premium">
            <div className="service-badge premium">PREMIUM</div>
            <h4>유료 서비스 7개</h4>
            <div className="service-items">
              {PAID_SERVICES.map((item) => (
                <div className="service-item" key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-cta">
          <button className="btn btn-primary" onClick={() => setOpenPanel("contact")}>
            상담 요청
          </button>
        </div>
      </OverlayPanel>

      <OverlayPanel
        open={openPanel === "demo"}
        title="Demo"
        subtitle="MRI QUICK DIAGNOSTIC / SAMPLE OUTPUTS"
        onClose={() => setOpenPanel(null)}
      >
        <div className="demo-panel-grid">
          <div className="card demo-box">
            <h4>MRI 기본 계산기</h4>

            <label>
              PSI (사고확률 리스크)
              <input
                type="range"
                min="0"
                max="100"
                value={psi}
                onChange={(e) => setPsi(Number(e.target.value))}
              />
              <span>{psi}</span>
            </label>

            <label>
              DRI (열화·상태 리스크)
              <input
                type="range"
                min="0"
                max="100"
                value={dri}
                onChange={(e) => setDri(Number(e.target.value))}
              />
              <span>{dri}</span>
            </label>

            <label>
              BII (비용·운영 영향 리스크)
              <input
                type="range"
                min="0"
                max="100"
                value={bii}
                onChange={(e) => setBii(Number(e.target.value))}
              />
              <span>{bii}</span>
            </label>

            <label>
              CLI (계약·책임 노출 리스크)
              <input
                type="range"
                min="0"
                max="100"
                value={cli}
                onChange={(e) => setCli(Number(e.target.value))}
              />
              <span>{cli}</span>
            </label>

            <label>
              Kd (데이터 신뢰도 보정계수)
              <input
                type="range"
                min="1"
                max="1.2"
                step="0.01"
                value={kd}
                onChange={(e) => setKd(Number(e.target.value))}
              />
              <span>{kd.toFixed(2)}</span>
            </label>

            <label>
              Ki (구조 중요도 보정계수)
              <input
                type="range"
                min="1"
                max="1.15"
                step="0.01"
                value={ki}
                onChange={(e) => setKi(Number(e.target.value))}
              />
              <span>{ki.toFixed(2)}</span>
            </label>

            <div className="panel-cta demo-download-row">
              <button className="btn btn-primary" onClick={handleDownloadPdf} type="button">
                PDF 다운로드
              </button>
            </div>
          </div>

          <div className="card demo-result">
            <h4>샘플 결과 화면</h4>
            <div className="score">{diagnosis.final}</div>
            <div className="grade-chip">
              {diagnosis.grade} 등급 / {diagnosis.label}
            </div>

            <div className="score-table">
              <div>
                <span>MRI</span>
                <strong>{diagnosis.mri}</strong>
              </div>
              <div>
                <span>MRI_final</span>
                <strong>{diagnosis.final}</strong>
              </div>
              <div>
                <span>판단</span>
                <strong>{diagnosis.label}</strong>
              </div>
            </div>

            <p className="commentary">{diagnosis.comment}</p>

            <div className="premium-guide">
              <strong>유료 고급분석 안내</strong>
              <p>
                정식 서비스에서는 구조기술사 검토 연계 인증, 전문가 판단 정량화 보정,
                포렌식 원인분석, 법원감정용 전자적 증거 패키지까지 확장됩니다.
              </p>
            </div>
          </div>
        </div>

        <div className="sample-output-grid">
          {SAMPLE_OUTPUTS.map((item) => (
            <div className="card sample-output-card" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </OverlayPanel>

      <OverlayPanel
        open={openPanel === "contact"}
        title="Contact"
        subtitle="INQUIRY / CONSULTING / QUOTATION REQUEST"
        onClose={() => setOpenPanel(null)}
      >
        <form ref={contactFormRef} className="contact-form-wrap" onSubmit={handleSubmit}>
          <div className="contact-grid">
            <label>
              문의자명
              <input
                name="from_name"
                value={contact.name}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="성함을 입력하세요"
              />
            </label>

            <label>
              회사명 / 기관명
              <input
                name="company"
                value={contact.company}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="회사 또는 기관명"
              />
            </label>

            <label>
              이메일
              <input
                name="reply_to"
                value={contact.email}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="example@email.com"
              />
            </label>

            <label>
              연락처
              <input
                name="phone"
                value={contact.phone}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="010-0000-0000"
              />
            </label>

            <label className="full">
              의뢰 유형
              <select
                name="purpose"
                value={contact.purpose}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, purpose: e.target.value }))
                }
              >
                <option>기술사 검토 연계 리스크 인증</option>
                <option>상담 예약</option>
                <option>견적 요청</option>
                <option>포렌식 원인분석 보고서</option>
                <option>법원감정용 전자적 증거 패키지</option>
                <option>보험 / 손해사정 대응 패키지</option>
                <option>기관용 API / SaaS 문의</option>
              </select>
            </label>

            <div className="contact-hint">
              선택한 유형에 따라 담당 서비스로 자동 분류됩니다.
            </div>

            <label className="full">
              문의 내용
              <textarea
                rows="6"
                name="message"
                value={contact.message}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="프로젝트 개요, 구조물 유형, 필요한 서비스, 일정, 목적을 입력하세요."
              />
            </label>
          </div>

          {submitState.message && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                border:
                  submitState.type === "success"
                    ? "1px solid rgba(85, 226, 201, 0.35)"
                    : "1px solid rgba(255, 120, 120, 0.35)",
                background:
                  submitState.type === "success"
                    ? "rgba(85, 226, 201, 0.08)"
                    : "rgba(255, 120, 120, 0.08)",
                color: "#eaf4ff",
                lineHeight: 1.7,
              }}
            >
              {submitState.message}
            </div>
          )}

          <div className="panel-cta">
            <button type="submit" className="btn btn-primary" disabled={isSending}>
              {isSending ? "전송 중..." : "문의 접수"}
            </button>
          </div>
        </form>
      </OverlayPanel>

      <div
        style={{
          position: "fixed",
          left: "-99999px",
          top: 0,
          width: "900px",
          background: "#ffffff",
          color: "#111111",
          padding: "32px",
          fontFamily:
            '"Pretendard","Noto Sans KR","Malgun Gothic","Apple SD Gothic Neo",sans-serif',
          boxSizing: "border-box",
        }}
      >
        <div ref={pdfReportRef}>
          <div style={{ borderBottom: "2px solid #0f4c81", paddingBottom: "14px" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>
              MAGOS MRI Quick Diagnostic Report
            </div>
            <div style={{ fontSize: "14px", color: "#555" }}>
              생성일시: {new Date().toLocaleString("ko-KR")}
            </div>
          </div>

          <div
            style={{
              marginTop: "22px",
              border: "2px solid #a7c3e8",
              borderRadius: "18px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "10px" }}>
              MRI_final: {diagnosis.final}
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>
              Grade: {diagnosis.grade} / {diagnosis.label}
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.8 }}>{diagnosis.comment}</div>
          </div>

          <div
            style={{
              marginTop: "22px",
              border: "2px solid #a7c3e8",
              borderRadius: "18px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>
              Input Parameters
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                fontSize: "15px",
              }}
            >
              <div>PSI: {psi}</div>
              <div>DRI: {dri}</div>
              <div>BII: {bii}</div>
              <div>CLI: {cli}</div>
              <div>Kd: {kd.toFixed(2)}</div>
              <div>Ki: {ki.toFixed(2)}</div>
              <div>MRI: {diagnosis.mri}</div>
              <div>MRI_final: {diagnosis.final}</div>
            </div>
          </div>

          <div
            style={{
              marginTop: "22px",
              border: "2px solid #a7c3e8",
              borderRadius: "18px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 800, marginBottom: "14px" }}>
              Interpretation
            </div>

            <div style={{ fontSize: "15px", lineHeight: 1.9 }}>
              본 PDF는 MAGOS Demo에서 입력한 PSI, DRI, BII, CLI, Kd, Ki 값을 기반으로
              생성된 개념형 빠른 진단 결과입니다.
              <br />
              <br />
              정식 서비스에서는 구조기술사 검토 연계 인증, 전문가 판단 정량화 보정,
              포렌식 원인분석, 법원감정용 전자적 증거 패키지까지 확장될 수 있습니다.
              <br />
              <br />
              본 결과는 참고용이며 정식 인증서가 아닙니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}