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
    title: "합의·조정 우선 구조",
    desc: "문제가 발생한 뒤 바로 소송으로 가지 않고, 구조 리스크와 책임영향도를 수치화하여 먼저 합의 가능성을 판단하도록 설계했습니다.",
  },
  {
    title: "기술사 판단의 숫자화",
    desc: "구조기술사의 공학적 판단을 리스크 수치, 책임영향도, 협상 기준 자료로 연결하여 실무에서 바로 쓰일 수 있게 만듭니다.",
  },
  {
    title: "보험·법원 확장 가능",
    desc: "1차 목적은 합의이지만, 필요 시 보험 손해사정, 포렌식, 법원감정용 전자 증거 패키지까지 이어지는 확장 구조를 갖습니다.",
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
    title: "분쟁자료 보유 체크",
    desc: "설계도서, 점검기록, 유지관리이력, 손상 사진, 계측자료 보유 여부를 빠르게 점검합니다.",
  },
  {
    title: "합의 가능성 사전 진단",
    desc: "현재 상황이 합의·조정형인지, 보험 대응형인지, 법원 대응형인지 1차로 분류합니다.",
  },
  {
    title: "샘플 리포트 미리보기",
    desc: "표지 1장, 결과 예시 1장, 등급표 1장 수준의 샘플 결과를 제공합니다.",
  },
];

const PAID_SERVICES = [
  {
    title: "합의지원형 구조 리스크 평가",
    desc: "소송 전 합의 가능 수준을 빠르게 판단하는 구조 리스크 평가 서비스",
  },
  {
    title: "책임영향도 정량 분석",
    desc: "설계 / 시공 / 유지관리 요인을 분해하여 책임영향도를 수치로 정리합니다.",
  },
  {
    title: "합의협상 패키지",
    desc: "리스크, 책임, 전문가 의견을 통합하여 협상 테이블에 바로 올릴 수 있는 자료를 제공합니다.",
  },
  {
    title: "전자 증거 정리 패키지",
    desc: "자료 신뢰도 평가와 판단–근거 매핑을 통해 대응 논리를 구조화합니다.",
  },
  {
    title: "전문가 합의 조정",
    desc: "다수 전문가의 의견을 정량화·통합하여 합의 도출 가능성을 높이는 프리미엄 서비스입니다.",
  },
  {
    title: "보험 / 손해사정 대응 패키지",
    desc: "합의 실패 또는 보험 검토 단계에서 필요한 인수심사·손해사정 보조자료를 제공합니다.",
  },
  {
    title: "법원감정용 전자적 증거 패키지",
    desc: "최종적으로 법원 제출이 필요한 경우 메타데이터, 해시값, 제출용 전자문서를 생성합니다.",
  },
];

const SAMPLE_OUTPUTS = [
  {
    title: "합의 가능성 요약",
    desc: "MRI 계산 결과 / 리스크 등급 / 협상 우선 검토 포인트",
  },
  {
    title: "책임영향도 예시",
    desc: "설계 / 시공 / 유지관리 책임영향도 분해 화면 예시",
  },
  {
    title: "합의협상 보고서 예시",
    desc: "협상용 1페이지 요약 / 원인기여도 / 핵심 쟁점 정리",
  },
  {
    title: "확장 대응 패키지",
    desc: "보험 대응 자료 / 전자 증거 패키지 / 제출문서 구성",
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
    purpose: "합의지원형 구조 리스크 평가",
    message: "",
  });

  const getInquiryType = (purpose) => {
    if (purpose.includes("합의") || purpose.includes("책임") || purpose.includes("협상")) return "settlement";
    if (purpose.includes("법원") || purpose.includes("손해사정")) return "forensic";
    if (purpose.includes("보험")) return "insurance";
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
          inquiryType === "settlement"
            ? "합의·조정 서비스 문의가 접수되었습니다."
            : inquiryType === "insurance"
            ? "보험 / 손해사정 대응 문의가 접수되었습니다."
            : inquiryType === "forensic"
            ? "법원감정 / 전자 증거 패키지 문의가 접수되었습니다."
            : "문의가 정상 접수되었습니다.",
      });

      setContact({
        name: "",
        company: "",
        email: "",
        phone: "",
        purpose: "합의지원형 구조 리스크 평가",
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
              구조 분쟁을 소송 전에 <br />
              데이터로 합의합니다.
            </h1>

            <p className="hero-description">
              구조기술사의 공학적 판단을 정량화하여
              책임영향도와 구조 리스크를 수치로 제시하고,
              소송 이전 단계에서 합의·조정이 가능하도록 돕는
              실전형 구조 리스크 의사결정 플랫폼입니다.
            </p>

            <div className="hero-keywords">
              {HERO_POINTS.map((item) => (
                <span className="hero-keyword" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <button
                className="btn btn-primary"
                onClick={() => setOpenPanel("demo")}
              >
                무료 진단 시작
              </button>

              <button className="btn btn-secondary" onClick={() => setOpenPanel("services")}>
                합의 서비스 보기
              </button>

              <button className="btn btn-ghost" onClick={() => setOpenPanel("contact")}>
                지금 상담 요청
              </button>
            </div>

            <p style={{ marginTop: "12px", color: "#8fc3ff" }}>
              ※ 소송 전 합의·조정 판단을 위한 구조 리스크 분석 보고서 형식 제공
            </p>

            <p style={{ color: "#00ffa3", marginTop: "8px" }}>
              ✔ 합의 실패 시 보험·법원 대응 자료로 확장 가능한 구조
            </p>

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
              일반적인 구조검토 소개 페이지를 넘어, 구조 리스크를 정량화하고 책임영향도를
              구조화하여 합의·조정으로 먼저 연결하는 실전형 서비스 구조를 제시합니다.
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
              고객이 지금 필요한 것이 합의·조정인지, 보험 대응인지, 법원감정 대비인지
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
              <h2>무료 진단에서 합의·조정, 보험, 법원 대응까지 단계별로 확장합니다</h2>
              <p>
                가장 먼저 합의 가능성을 판단하고, 필요 시 보험 손해사정 자료와 법원감정용
                전자 증거 패키지까지 이어지는 실전형 서비스 흐름을 제공합니다.
              </p>
            </div>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={() => setOpenPanel("demo")}>
               무료 진단 시작
              </button>
              <button className="btn btn-secondary" onClick={() => setOpenPanel("services")}>
                합의 서비스 보기
              </button>
              <button className="btn btn-ghost" onClick={() => setOpenPanel("contact")}>
                지금 상담 요청
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

            <div className="footer-divider" />

            <p className="footer-section-title">[Engineering Office]</p>
            <p>마고스 구조기술사사무소 (MAGOS Structure Engineering Lab)</p>
            <p>대표: 김황준 (공학박사, 토목구조기술사)</p>

            <div className="footer-divider" />

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
            <h4>합의·조정 기반 유료 서비스</h4>
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
            지금 상담 요청
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
            <p className="demo-legal-note">
              본 결과는 개념형 참고자료이며, 정식 검토·감정·인수심사 결과를 대체하지 않습니다.
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
                정식 서비스에서는 합의지원형 구조 리스크 평가, 책임영향도 정량 분석,
                합의협상 패키지, 보험 대응 자료, 법원감정용 전자적 증거 패키지까지 확장됩니다.
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button className="btn btn-primary" onClick={() => setOpenPanel("contact")}>
                📩 합의 가능성 검토 요청 (유료)
              </button>
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
            <h3 style={{ margin: "0 0 10px" }}>📌 서비스 안내</h3>
            <p style={{ margin: "4px 0" }}>• 합의지원형 구조 리스크 평가: 100~300만원</p>
            <p style={{ margin: "4px 0" }}>• 책임영향도 분석 및 협상 패키지: 300~1,500만원</p>
            <p style={{ margin: "4px 0" }}>• 전문가 합의 조정 / 보험·법원 대응: 별도 협의</p>
            <p style={{ margin: "10px 0 0", color: "#9ec8ff", fontSize: "13px" }}>
              ※ 본 서비스는 소송 이전 단계에서 합의·조정을 지원하는 구조 분석 자료이며, 필요 시 보험·법원 대응 자료로 확장됩니다.
            </p>
          </div>


          <div className="contact-fast-track">
            <div className="fast-track-card">
              <strong>가장 빠른 시작 방법</strong>
              <p>도면, 사진, 점검자료 중 가능한 자료 1건만 보내주시면 합의 가능성부터 먼저 검토합니다.</p>
            </div>
            <div className="fast-track-card highlight">
              <strong>권장 의뢰 순서</strong>
              <p>합의·조정 → 보험 / 손해사정 → 법원감정 대응 순으로 진행하는 것이 가장 효율적입니다.</p>
            </div>
          </div>

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
                <option>합의지원형 구조 리스크 평가</option>
                <option>책임영향도 정량 분석</option>
                <option>합의협상 패키지</option>
                <option>상담 예약</option>
                <option>견적 요청</option>
                <option>보험 / 손해사정 대응 패키지</option>
                <option>법원감정용 전자적 증거 패키지</option>
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

          <div className="panel-cta contact-submit-row">
            <button type="submit" className="btn btn-primary" disabled={isSending}>
              {isSending ? "전송 중..." : "자료 보내고 상담 시작"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setOpenPanel("demo")}>
              먼저 무료 진단 보기
            </button>
          </div>
          <p className="contact-final-note">
            첫 상담에서는 “소송까지 가는지”보다 “지금 합의 가능한 구간인지”를 먼저 판단합니다.
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
              본 PDF는 MAGOS Demo에서 입력한 PSI, DRI, BII, CLI, Kd, Ki 값을 기반으로
              생성된 개념형 빠른 진단 결과입니다.
              <br />
              <br />
              정식 서비스에서는 구조기술사 검토 연계 인증, 전문가 판단 정량화 보정,
              포렌식 원인분석, 법원감정용 전자적 증거 패키지까지 확장될 수 있습니다.
              <br />
              <br />
              본 결과는 참고용 자료이며, 보험사·법원·공공기관의 최종 판단 또는 채택을 보장하지 않습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
