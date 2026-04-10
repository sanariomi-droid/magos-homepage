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
const EMAILJS_TEMPLATE_ID = "template_c36d68c";
const EMAILJS_PUBLIC_KEY = "GvUELP6idsY4ppGNa";

/* =========================
   DATA
========================= */
const HERO_POINTS = [
  "데이터 신뢰성 검토",
  "MRI / MRI_final 산정",
  "구조기술사 검토 연계",
  "전문가 협업 평가",
  "포렌식 / 전자적 증거 자료 구성",
];

const DIFFERENTIATORS = [
  {
    title: "데이터 기반 구조 리스크 정리",
    desc: "설계도서, 시공기록, 점검결과, 계측데이터, 유지관리이력 등 구조 관련 자료를 통합하여 리스크를 정량적으로 정리합니다.",
  },
  {
    title: "구조기술사 검토 연계 인증 구조",
    desc: "PSI, DRI, BII, CLI 기반 MRI와 보정 리스크에 구조기술사 검토를 반영하여 인증서 및 기술자료 형태로 제공합니다.",
  },
  {
    title: "포렌식 및 전자적 증거 확장",
    desc: "필요 시 사고 전후 비교, 원인기여도, 책임영향도, 전자적 증거 자료 구성까지 이어지는 확장 구조를 갖습니다.",
  },
];

const CLIENT_SERVICES = [
  {
    title: "설계 발주처 / 공공기관",
    desc: "구조안전 리스크 평가, 기술사 검토, 우선순위 판단, 공공 의사결정 참고자료 제공",
  },
  {
    title: "건설사 / 감리단",
    desc: "시공단계 위험 검토, 보수·보강 판단, 조건부 검토 및 전문가 협업 평가",
  },
  {
    title: "유지관리 기관 / 시설물 관리자",
    desc: "점검 이력 기반 MRI 평가, 관리 우선순위, 자산군 리스크 비교 및 추적",
  },
  {
    title: "보험사 / 손해사정",
    desc: "리스크 인증서, 인수심사 보조지표, 사고 원인기여도 및 책임영향도 분석 자료",
  },
  {
    title: "포렌식 분석 / 분쟁 참고자료",
    desc: "사고 전후 비교, 설계·시공·유지관리 요인별 기여도, 포렌식 분석 보고서",
  },
  {
    title: "감정 지원 / 전자증거 자료",
    desc: "감정자료 구조화, 메타데이터, 증거 신뢰도, 해시 기반 전자적 증거 자료 구성",
  },
];

const PATENT_LAYERS = [
  {
    id: "p1",
    no: "01",
    title: "데이터 신뢰성 및 절차 추적",
    subtitle: "Data Trust & Procedure Trace",
    desc: "입력데이터 수집, 출처·작성주체·변경이력·정합성 검증, 검토·보완·승인 절차 추적, 인증상태·인증번호·인증등급 생성을 수행하는 디지털 신뢰 레이어",
    outputs: ["데이터 신뢰성 평가", "판단 절차 추적", "인증상태 / 인증번호 / 인증등급"],
  },
  {
    id: "p2",
    no: "02",
    title: "구조안전 리스크 인증 엔진",
    subtitle: "Structural Risk Certification Engine",
    desc: "PSI·DRI·BII·CLI를 기반으로 MRI와 MRI_final을 산정하고, Kd·Ki 및 구조기술사 검토를 반영한 인증 구조를 제공합니다.",
    outputs: ["MRI / MRI_final", "구조안전 리스크 인증서", "보험·유지관리 참고자료"],
  },
  {
    id: "p3",
    no: "03",
    title: "전문가 풀 협업 플랫폼",
    subtitle: "Expert Pool Collaboration Platform",
    desc: "프로젝트 접수, 전문가 자격·수행이력·신뢰도 관리, 총괄·분야별·보조 검토자 배정, 협업 검토, 성과평가 및 재배정 학습까지 연결합니다.",
    outputs: ["전문가 배정", "협업 검토 결과", "구조물-전문가 연계 이력"],
  },
  {
    id: "p4",
    no: "04",
    title: "전문가 판단 정량화 레이어",
    subtitle: "Decision Intelligence Layer",
    desc: "서술형 전문가 판단을 위험증분·감소, 조건부 승인, 추가조사 필요성 등의 정량 요소로 변환하고 통합 전문가 판단값을 산정합니다.",
    outputs: ["전문가 판단 수치화", "복수 의견 통합", "최종 보정 리스크"],
  },
  {
    id: "p5",
    no: "05",
    title: "건설포렌식 및 원인분석",
    subtitle: "Construction Forensic & Cause Analysis",
    desc: "사전 리스크 평가와 사고 후 데이터를 연계하여 변화량, 원인기여도, 책임영향도를 분석하고 보험·손해사정·기술검토 자료로 확장합니다.",
    outputs: ["포렌식 보고서", "원인기여도 분석", "책임영향도 분석"],
  },
  {
    id: "p6",
    no: "06",
    title: "전자적 증거 자료 검증",
    subtitle: "Judicial Evidence Package Verification",
    desc: "감정자료 통합, 메타데이터 생성, 증거 신뢰도 정량화, 판단–근거자료 매핑, 해시 기반 무결성 검증을 포함하는 전자적 증거 자료 구조입니다.",
    outputs: ["전자적 증거 자료", "개별 / 통합 해시", "제출 참고용 전자문서"],
  },
];

const FLOW_ITEMS = [
  "자료 접수",
  "데이터 신뢰성 확인",
  "MRI / 리스크 산정",
  "구조기술사 검토",
  "전문가 협업 / 판단 정량화",
  "인증 또는 포렌식 분석",
  "보고서 / 전자적 증거 자료 제공",
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
    desc: "보험 참고자료형, 유지관리형, 포렌식형, 감정 지원형 중 적합한 방향을 1차로 확인합니다.",
  },
  {
    title: "샘플 리포트 미리보기",
    desc: "표지 1장, 결과 예시 1장, 등급표 1장 수준의 샘플 결과를 제공합니다.",
  },
];

const PAID_SERVICES = [
  {
    title: "구조기술사 검토 연계 리스크 인증",
    desc: "구조기술사 검토의견, Kd·Ki 보정, MRI_final, 인증번호와 인증등급을 반영한 인증 서비스",
  },
  {
    title: "전문가 참여형 정밀 평가",
    desc: "총괄·분야별·보조 검토자 협업 구조로 프로젝트 난이도에 맞는 정밀 평가를 수행합니다.",
  },
  {
    title: "전문가 판단 보정 리스크 분석",
    desc: "서술형 전문가 판단을 정량화하여 통합 전문가 판단값과 최종 보정 리스크를 산정합니다.",
  },
  {
    title: "포렌식 원인분석 보고서",
    desc: "사고 전후 변화량, 설계·시공·유지관리 요인별 원인기여도를 정량적으로 분석합니다.",
  },
  {
    title: "책임영향도 분석 자료",
    desc: "보험, 손해사정, 기술검토 및 의사결정 참고에 활용할 수 있는 책임영향도 자료를 제공합니다.",
  },
  {
    title: "전자적 증거 자료 구성",
    desc: "메타데이터, 증거 신뢰도, 판단-근거 매핑, 개별 해시 / 통합 해시를 포함한 전자문서를 구성합니다.",
  },
  {
    title: "기관용 API / SaaS / 대시보드",
    desc: "보험사, 공공기관, 시설물 관리자, 건설사·감리단을 위한 확장형 플랫폼 서비스입니다.",
  },
];

const SAMPLE_OUTPUTS = [
  {
    title: "리스크 진단 요약",
    desc: "MRI 계산 결과 / 리스크 등급 / 관리 참고 포인트",
  },
  {
    title: "책임영향도 예시",
    desc: "설계 / 시공 / 유지관리 책임영향도 분해 화면 예시",
  },
  {
    title: "포렌식 분석 보고서 예시",
    desc: "전후 비교 / 원인기여도 / 핵심 쟁점 정리",
  },
  {
    title: "전자적 증거 자료 예시",
    desc: "메타데이터 / 증거 신뢰도 / 해시 검증 / 제출 참고용 문서 구성",
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

function LegalNotice() {
  return (
    <div
      style={{
        marginTop: "18px",
        padding: "16px 18px",
        borderRadius: "18px",
        border: "1px solid rgba(255, 196, 107, 0.22)",
        background: "rgba(255, 196, 107, 0.08)",
        color: "#fff0cf",
        lineHeight: 1.8,
        fontSize: "14px",
      }}
    >
      본 서비스는 구조기술사의 전문적 공학 분석 및 기술자료 제공 서비스입니다. <br />
      법률상담, 소송대리, 합의대행 등 「변호사법」상 법률사무는 제공하지 않습니다. <br />
      법률적 판단이 필요한 경우, 이용자는 별도의 법률 전문가(변호사 등)를 통해 진행하여야 합니다.
    </div>
  );
}

function PremiumButton({ className = "", icon, text, onClick, type = "button", disabled = false }) {
  return (
    <button type={type} className={`btn btn-premium ${className}`.trim()} onClick={onClick} disabled={disabled}>
      <span className="btn-icon">{icon}</span>
      <span className="btn-text">{text}</span>
      <span className="btn-arrow">→</span>
    </button>
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
    purpose: "구조기술사 검토 연계 리스크 인증",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [submitState, setSubmitState] = useState({
    type: "",
    message: "",
  });

  const contactFormRef = useRef(null);
  const pdfReportRef = useRef(null);

  const openContactPanel = () => {
    setOpenPanel("contact");
    setTimeout(() => {
      const el = document.getElementById("contact-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const firstInput = el.querySelector("input, select, textarea");
        if (firstInput) firstInput.focus();
      }
    }, 140);
  };

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
      comment = "구조기술사 검토 및 정밀 분석 연계가 권장되는 수준입니다.";
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

  const getInquiryType = (purpose) => {
    if (purpose.includes("인증")) return "cert";
    if (purpose.includes("포렌식") || purpose.includes("증거")) return "forensic";
    if (purpose.includes("보험")) return "insurance";
    if (purpose.includes("전문가")) return "expert";
    return "info";
  };

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
              ? "[리스크 인증 문의]"
              : inquiryType === "forensic"
              ? "[포렌식 / 전자증거 문의]"
              : inquiryType === "insurance"
              ? "[보험 참고자료 문의]"
              : inquiryType === "expert"
              ? "[전문가 협업 문의]"
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
            ? "구조안전 리스크 인증 문의가 접수되었습니다."
            : inquiryType === "insurance"
            ? "보험 참고자료 문의가 접수되었습니다."
            : inquiryType === "forensic"
            ? "포렌식 / 전자적 증거 자료 문의가 접수되었습니다."
            : inquiryType === "expert"
            ? "전문가 협업 분석 문의가 접수되었습니다."
            : "문의가 정상 접수되었습니다.",
      });

      setContact({
        name: "",
        company: "",
        email: "",
        phone: "",
        purpose: "구조기술사 검토 연계 리스크 인증",
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
          <button className="nav-link" onClick={openContactPanel}>
            Contact
          </button>
        </nav>
      </header>

      <main className="page-shell" id="home">
        <section className="hero">
          <div className="hero-main card">
            <div className="eyebrow">OFFICIAL STRUCTURAL RISK PLATFORM</div>

            <h1>
              구조 리스크를 수치(MRI)로 정량화하여 <br />
              “책임·의사결정”까지 연결합니다. <br />
              구조기술사 검토 기반 “인증서 형태 기술자료” 제공
            </h1>

            <p className="hero-description">
              설계·시공·유지관리 데이터를 기반으로 구조물의 위험도를 분석하고, <br />
              구조기술사 검토를 반영한 인증서 형태의 기술자료를 제공합니다. <br />
              필요 시 포렌식 분석과 전자적 증거 자료 구성까지 확장할 수 있습니다.
            </p>

            <div className="hero-keywords">
              {HERO_POINTS.map((item) => (
                <span className="hero-keyword" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <PremiumButton
                className="btn-primary"
                icon="⚙️"
                text="MRI 무료 진단 시작"
                onClick={() => setOpenPanel("demo")}
              />

              <PremiumButton
                className="btn-secondary"
                icon="📐"
                text="서비스 구조 보기"
                onClick={() => setOpenPanel("services")}
              />

              <PremiumButton
                className="btn-ghost contact-focus"
                icon="📩"
                text="기술 상담 요청"
                onClick={openContactPanel}
              />
            </div>

            <p style={{ marginTop: "12px", color: "#8fc3ff" }}>
              ※ 구조 리스크 정량화 + 인증서 기반 기술자료 제공
            </p>

            <p style={{ color: "#00ffa3", marginTop: "8px" }}>
              ✔ 보험 인수심사 · 분쟁 대응 · 발주 의사결정에 직접 활용
            </p>

            <LegalNotice />

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
                <strong>인증 · 보험 · 유지관리 · 포렌식 · 전자증거</strong>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="flow-card card">
              <div className="flow-head">
                <span className="chip">PROJECT FLOW</span>
                <p>실제 의뢰가 접수되어 기술자료가 제공되는 절차를 한 화면으로 정리했습니다.</p>
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
              구조 리스크를 수치로 정량화하고, 구조기술사 판단과 전문가 협업을 연결합니다. <br />
              이를 “숫자 + 등급 + 인증서” 형태로 제공하여 실제 의사결정에 바로 활용할 수 있습니다. <br />
              필요 시 포렌식 분석 및 전자적 증거 자료까지 확장됩니다.
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
                마고스 구조기술사사무소는 <br />
                구조안전 리스크 평가, 구조기술사 검토, 리스크 인증, <br />
                건설포렌식 및 전자적 증거 자료 구성을 하나의 서비스 체계로 <br />
                연결하는 구조기술사 기반 플랫폼을 지향합니다.
              </p>
              <p>
                구조안전 판단을 단순 보고서가 아니라 추적 가능하고, 인증 가능하며,
                <br />
                보험·유지관리·감정 참고자료로 확장 가능한 의사결정 체계로 만들고자 합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">CLIENT-ORIENTED SERVICES</div>
            <h2>고객 기준 서비스 구조</h2>
            <p>
              고객이 지금 필요한 것이 <br />
              인증인지, 보험 참고자료인지, 유지관리 판단인지, 포렌식 분석인지 <br />
              빠르게 선택할 수 있도록 실제 의뢰 흐름 기준으로 정리했습니다.
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
              각 특허가 실제 고객 산출물과 어떻게 연결되는지 <br />
              한 화면에서 볼 수 있도록 <br />
              입력층 → 코어 플랫폼층 → 산출층 기준으로 정리했습니다.
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
              <h2>
                무료 리스크 평가 → 구조기술사 검토 → 인증서 발급까지  <br />
                실제 프로젝트에 바로 적용됩니다.
              </h2>
              <p>
                가장 먼저 구조 리스크를 수치로 정량화하고, <br />
                필요 시 구조기술사 검토, 보험 참고자료, 포렌식 분석, 전자적 증거 자료 구성까지 이어지는 <br />
                실전형 서비스 흐름을 제공합니다.
              </p>
            </div>
            <div className="cta-buttons">
              <PremiumButton
                className="btn-primary"
                icon="⚙️"
                text="무료 구조 리스크 평가 받기"
                onClick={() => setOpenPanel("demo")}
              />
              <PremiumButton
                className="btn-secondary"
                icon="📐"
                text="서비스 구조 보기"
                onClick={() => setOpenPanel("services")}
              />
              <PremiumButton
                className="btn-ghost contact-focus"
                icon="📩"
                text="구조안전 검토 상담 요청"
                onClick={openContactPanel}
              />
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

            <div className="footer-divider" />

            <p className="footer-section-title">[Engineering Office]</p>
            <p>마고스 구조기술사사무소 (MAGOS Structure Engineering Lab)</p>
            <p>대표: 김황준 (공학박사, 토목구조기술사)</p>

            <div className="footer-divider" />

            <p className="footer-section-title">Structural Risk &amp; Engineering Decision</p>
            <p>
              구조안전 리스크 평가 · 구조기술사 검토 · 리스크 인증 · 건설포렌식 · 전자적 증거 자료
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
            <button onClick={openContactPanel}>Contact</button>
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

        <LegalNotice />

        <div className="panel-cta">
          <PremiumButton
            className="btn-primary"
            icon="📩"
            text="지금 상담 요청"
            onClick={openContactPanel}
          />
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
            <p className="demo-legal-note">
             ※ 본 결과는 간이 진단이며, 정식 구조기술사 검토 시 인증서 형태로 제공됩니다.
            </p>

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
              <PremiumButton
                className="btn-primary"
                icon="📄"
                text="PDF 다운로드"
                onClick={handleDownloadPdf}
              />
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
                정식 서비스에서는 구조기술사 검토 연계 리스크 인증, 전문가 참여형 정밀 평가,
                <br />
                전문가 판단 보정 리스크 분석, 포렌식 원인분석, 전자적 증거 자료 구성까지 확장됩니다.
              </p>
            </div>

            <LegalNotice />

            <div style={{ marginTop: "20px" }}>
              <PremiumButton
                className="btn-primary"
                icon="🚀"
                text="정밀 분석 요청"
                onClick={openContactPanel}
              />
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
        <form id="contact-form" ref={contactFormRef} className="contact-form-wrap" onSubmit={handleSubmit}>
          <div className="contact-quick-badges">
            <span>문의 접수</span>
            <span>상담 예약</span>
            <span>견적 요청</span>
          </div>

          <div
            style={{
              marginBottom: "18px",
              padding: "18px 20px",
              borderRadius: "18px",
              border: "1px solid rgba(129, 175, 255, 0.18)",
              background: "rgba(255,255,255,0.03)",
              lineHeight: 1.8,
            }}
          >
            <h3 style={{ margin: "0 0 10px" }}>서비스 안내</h3>
            <p style={{ margin: "4px 0" }}>• 구조기술사 검토 연계 리스크 인증: 별도 협의</p>
            <p style={{ margin: "4px 0" }}>• 포렌식 원인분석 및 책임영향도 자료: 별도 협의</p>
            <p style={{ margin: "4px 0" }}>• 전자적 증거 자료 구성 / 기관용 서비스: 별도 협의</p>
            <p style={{ margin: "10px 0 0", color: "#9ec8ff", fontSize: "13px" }}>
              ※ 구조 관련 데이터, 현재 상황, 필요한 기술자료 유형을 알려주시면 적합한 분석 방향을 먼저 제안드립니다.
            </p>
          </div>

          <LegalNotice />

          <div className="contact-fast-track">
            <div className="fast-track-card">
              <strong>가장 빠른 시작 방법</strong>
              <p>도면, 사진, 점검자료 중 가능한 자료 1건만 보내주시면 서비스 방향부터 먼저 검토합니다.</p>
            </div>
            <div className="fast-track-card highlight">
              <strong>권장 의뢰 흐름</strong>
              <p>기본 진단 → 구조기술사 검토 / 정밀 평가 → 포렌식 / 전자적 증거 자료 구성 순으로 진행하는 것이 가장 효율적입니다.</p>
            </div>
          </div>

          <div className="contact-grid">
            <label>
              문의자명
              <input
                name="from_name"
                value={contact.name}
                onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="성함을 입력하세요"
              />
            </label>

            <label>
              회사명 / 기관명
              <input
                name="company"
                value={contact.company}
                onChange={(e) => setContact((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="회사 또는 기관명"
              />
            </label>

            <label>
              이메일
              <input
                name="reply_to"
                value={contact.email}
                onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
              />
            </label>

            <label>
              연락처
              <input
                name="phone"
                value={contact.phone}
                onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="010-0000-0000"
              />
            </label>

            <label className="full">
              의뢰 유형
              <select
                name="purpose"
                value={contact.purpose}
                onChange={(e) => setContact((prev) => ({ ...prev, purpose: e.target.value }))}
              >
                <option>구조기술사 검토 연계 리스크 인증</option>
                <option>전문가 참여형 정밀 평가</option>
                <option>전문가 판단 보정 리스크 분석</option>
                <option>포렌식 원인분석 보고서</option>
                <option>책임영향도 분석 자료</option>
                <option>보험 참고자료</option>
                <option>전자적 증거 자료 구성</option>
                <option>기관용 API / SaaS / 대시보드</option>
                <option>상담 예약</option>
                <option>견적 요청</option>
              </select>
            </label>

            <div className="contact-hint">
              선택한 유형에 따라 리스크 인증, 보험 참고자료, 포렌식, 전자적 증거 자료 등으로 자동 분류됩니다.
            </div>

            <label className="full">
              문의 내용
              <textarea
                rows="6"
                name="message"
                value={contact.message}
                onChange={(e) => setContact((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="프로젝트 개요, 구조물 유형, 현재 상황, 필요한 기술자료, 일정 등을 입력하세요."
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

          <div className="panel-cta contact-submit-row">
            <PremiumButton
              type="submit"
              className="btn-primary"
              icon="🚀"
              text={isSending ? "전송 중..." : "자료 보내고 상담 시작"}
              disabled={isSending}
            />
            <PremiumButton
              className="btn-secondary"
              icon="⚙️"
              text="먼저 무료 진단 보기"
              onClick={() => setOpenPanel("demo")}
            />
          </div>

          <p className="contact-final-note">
            첫 상담에서는 현재 데이터 상태와 필요한 기술자료 유형을 먼저 확인합니다.
          </p>
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
              본 PDF는 MAGOS Demo에서 입력한 <br />
              PSI, DRI, BII, CLI, Kd, Ki 값을 기반으로 <br />
              생성된 개념형 빠른 진단 결과입니다.
              <br />
              <br />
              정식 서비스에서는 구조기술사 검토 연계 인증, <br />
              전문가 판단 정량화 보정, 포렌식 원인분석, <br />
              전자적 증거 자료 구성까지 확장될 수 있습니다.
              <br />
              <br />
              본 결과는 참고용 자료이며, 보험사·법원·공공기관의 최종 판단을 대체하지 않습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}