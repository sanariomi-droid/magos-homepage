import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import emailjs from "@emailjs/browser";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const LOGO_SRC = "/magos_logo.png";

/* =========================
   EmailJS 실제 값으로 교체
========================= */
const EMAILJS_SERVICE_ID = "service_grnbxc8";
const EMAILJS_TEMPLATE_ID = "template_ry142uj";
const EMAILJS_PUBLIC_KEY = "GvUELP6idsY4ppGNa";

/* =========================
   DATA
========================= */
const PATENT_LAYERS = [
  {
    id: "p1",
    no: "01",
    title: "데이터 신뢰성 및 절차 추적",
    subtitle: "Data Trust & Procedure Trace",
    desc: "입력데이터 수집, 출처·작성주체·변경이력·정합성 검증, 검토·보완·승인 절차 추적, 인증상태·인증번호·인증등급 생성을 수행하는 디지털 신뢰 레이어",
    items: [
      "입력데이터 수집",
      "출처 / 작성주체 / 변경이력 / 정합성 검증",
      "검토·보완·승인 절차 추적",
      "인증상태 / 인증번호 / 인증등급 생성",
      "QR / 전자문서 / 전자식별정보 출력",
    ],
  },
  {
    id: "p2",
    no: "02",
    title: "구조안전 리스크 인증 엔진",
    subtitle: "Structural Risk Certification Engine",
    desc: "PSI·DRI·BII·CLI를 기반으로 MRI와 MRI_final을 산정하고, 구조기술사 검토와 연계된 인증서를 생성하는 핵심 엔진",
    items: [
      "PSI / DRI / BII / CLI 산정",
      "MRI / MRI_final 산정",
      "Kd / Ki 보정",
      "구조기술사 검토 연계",
      "구조안전 리스크 인증서 생성",
    ],
  },
  {
    id: "p3",
    no: "03",
    title: "전문가 풀 협업 플랫폼",
    subtitle: "Expert Pool Collaboration Platform",
    desc: "프로젝트 접수, 전문가 자격·수행이력·신뢰도 관리, 총괄·분야별·보조 검토자 배정, 협업 검토, 성과평가 및 재배정 학습까지 연결하는 운영 플랫폼",
    items: [
      "프로젝트 접수",
      "전문가 자격 / 수행이력 / 신뢰도 관리",
      "총괄·분야별·보조 검토자 배정",
      "협업 검토 수행",
      "전문가 성과평가 및 재배정 학습",
    ],
  },
  {
    id: "p4",
    no: "04",
    title: "전문가 판단 정량화 레이어",
    subtitle: "Decision Intelligence Layer",
    desc: "서술형 전문가 판단을 위험증분·감소, 조건부 승인, 추가조사 필요성 등의 수치값으로 변환하고 복수 전문가 의견을 통합하여 최종 리스크를 보정하는 레이어",
    items: [
      "서술형 판단 정량화",
      "위험증분 / 위험감소 수치화",
      "조건부 승인 / 추가조사 반영",
      "역할가중치·확신계수·감쇠계수 반영",
      "복수 전문가 의견 통합(Je) / 최종 보정(Rf)",
    ],
  },
  {
    id: "p5",
    no: "05",
    title: "건설포렌식 및 원인분석",
    subtitle: "Construction Forensic & Cause Analysis",
    desc: "사전 리스크 평가와 사고 후 데이터를 연계하여 변화량, 원인기여도, 책임영향도를 분석하고 보험·손해사정·분쟁 대응으로 확장하는 포렌식 레이어",
    items: [
      "사전 리스크 평가와 사고 후 데이터 연계",
      "사고 전후 변화량 분석",
      "설계 / 시공 / 유지관리 요인별 원인기여도",
      "책임영향도 분석",
      "보험 / 손해사정 / 분쟁 대응 자료 생성",
    ],
  },
  {
    id: "p6",
    no: "06",
    title: "전자적 증거 패키지 검증",
    subtitle: "Judicial Evidence Package Verification",
    desc: "감정자료 통합, 메타데이터 생성, 증거 신뢰도 정량화, 판단–근거자료 매핑, 해시 기반 무결성 검증을 포함하는 전자적 증거 패키지 구조",
    items: [
      "감정자료 통합",
      "자료별 메타데이터 생성",
      "자료별 증거 신뢰도 정량화",
      "판단 항목–근거자료 매핑",
      "개별 해시값 / 통합 해시값 / 제출문서 생성",
    ],
  },
];

const FLOW_ITEMS = [
  "Input Layer",
  "Data Trust",
  "Risk Certification",
  "Expert Collaboration",
  "Decision Intelligence",
  "Construction Forensic",
  "Judicial Evidence",
  "Output Layer",
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

const OUTPUTS = [
  "구조안전 리스크 인증서",
  "보험 인수심사 보조지표",
  "유지관리 / 보수보강 우선순위",
  "포트폴리오 리스크 순위",
  "사고 원인기여도 및 책임영향도 분석서",
  "손해사정 / 분쟁 대응 자료",
  "법원감정용 전자적 증거 패키지",
  "검증코드 / 해시 / 전자서명 기반 제출문서",
];

/* =========================
   OVERLAY
========================= */
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState({ type: "", message: "" });

    if (!contactFormRef.current) return;

    try {
      setIsSending(true);

      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        contactFormRef.current,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setSubmitState({
        type: "success",
        message: "문의가 정상 접수되었습니다. 입력하신 이메일로 회신드릴 예정입니다.",
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
        message:
          "문의 전송에 실패했습니다. Service ID / Template ID / Public Key / 템플릿 변수명을 확인해 주세요.",
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
            <div className="eyebrow">PATENT-DRIVEN STRUCTURAL SAFETY PLATFORM</div>
            <h1>
              구조안전 리스크를
              <br />
              숫자와 판단과 증거로
              <br />
              연결하는 MAGOS
            </h1>
            <p className="hero-description">
              MAGOS는 입력데이터의 신뢰성 검증, MRI 기반 구조안전 리스크 인증,
              전문가 협업, 전문가 판단 정량화, 사고 원인분석, 법원감정용 전자적
              증거 패키지까지 하나의 통합 흐름으로 연결하는 구조안전 플랫폼입니다.
            </p>

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
                <strong>6 Core Layers</strong>
              </div>
              <div className="stat-card">
                <span>Risk Model</span>
                <strong>MRI / MRI_final</strong>
              </div>
              <div className="stat-card">
                <span>Applications</span>
                <strong>보험 · 유지관리 · 포렌식 · 법원감정</strong>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="flow-card card">
              <div className="flow-head">
                <span className="chip">Integrated Platform Flow</span>
                <p>Input에서 인증·판단·포렌식·증거 패키지까지 연결</p>
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
            <div className="section-kicker">PLATFORM OVERVIEW</div>
            <h2>플랫폼 개요</h2>
            <p>
              설계도서, 구조계산서, 시공기록, 점검결과, 계측데이터, 유지관리이력,
              보수보강이력, 손상/사고데이터, 전문가 의견을 입력으로 받아 6개 특허
              레이어를 통해 인증·평가·분석·증거화까지 연결합니다.
            </p>
          </div>

          <div className="overview-grid">
            <article className="card soft-card">
              <h3>Input Layer</h3>
              <p>
                Infrastructure / Project / Accident Data를 통합 수집하고 동일
                구조물 기준으로 정렬하여 평가 기반을 만듭니다.
              </p>
            </article>
            <article className="card soft-card">
              <h3>Core Platform Layer</h3>
              <p>
                Data Trust → Risk Certification → Expert Collaboration →
                Decision Intelligence → Forensic → Judicial Evidence의 흐름으로
                작동합니다.
              </p>
            </article>
            <article className="card soft-card">
              <h3>Output / Market Layer</h3>
              <p>
                인증서, 보험 보조지표, 유지관리 우선순위, 포렌식 보고서, 전자적
                증거 패키지를 제공합니다.
              </p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">FOUNDER</div>
            <h2>대표 소개</h2>
          </div>

          <div className="founder card">
            <div className="founder-left">
              <div className="founder-chip">MAGOS FOUNDER</div>
              <h3>김황준</h3>
              <div className="founder-role">공학박사 · 토목구조기술사</div>
            </div>
            <div className="founder-right">
              <p>
                구조설계, 유지관리, 안전평가, 리스크 정량화, 전문가 판단 구조화,
                건설포렌식, 법원감정 대응을 하나의 서비스 체계로 연결하는
                구조기술사 기반 플랫폼을 설계하고 있습니다.
              </p>
              <p>
                MAGOS는 구조안전 판단을 단순 보고서가 아니라 추적 가능하고,
                인증 가능하며, 분쟁 대응까지 확장 가능한 의사결정 체계로 만드는
                것을 목표로 합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">PATENT STACK</div>
            <h2>특허 6개 통합 구조</h2>
            <p>
              홈페이지에서는 6개 특허 레이어를 한 번에 이해할 수 있도록 정리하고,
              세부 서비스는 Services / Demo / Contact에서 열리도록 구성했습니다.
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
                  {layer.items.map((item) => (
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
              <div className="section-kicker">START</div>
              <h2>무료 진단부터 시작하고 정식 서비스로 확장합니다</h2>
              <p>
                Home에서는 핵심 구조를 선명하게 보여주고, Services / Demo /
                Contact는 버튼 클릭 시 고급 패널로 열리도록 설계했습니다.
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

        <section className="section">
          <div className="section-heading">
            <div className="section-kicker">OUTPUTS</div>
            <h2>주요 산출물</h2>
          </div>

          <div className="outputs-grid">
            {OUTPUTS.map((item) => (
              <div className="card output-card" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div>
            <strong>MAGOS Structure Engineering Lab</strong>
            <span>Structural Risk &amp; Engineering Decision Platform</span>
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
        subtitle="FREE / PREMIUM SERVICE LINES"
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
        subtitle="MRI QUICK DIAGNOSTIC"
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
                정식 서비스에서는 구조기술사 검토, 전문가 판단 정량화, 포렌식
                분석, 전자적 증거 패키지 생성까지 확장됩니다.
              </p>
            </div>
          </div>
        </div>
      </OverlayPanel>

      <OverlayPanel
        open={openPanel === "contact"}
        title="Contact"
        subtitle="INQUIRY / CONSULTING / QUOTATION"
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
              회사명
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
              문의 유형
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
                <option>기관용 API / SaaS 문의</option>
              </select>
            </label>

            <label className="full">
              문의 내용
              <textarea
                rows="6"
                name="message"
                value={contact.message}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="프로젝트 개요, 구조물 유형, 필요한 서비스, 일정 등을 입력하세요."
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

      {/* =========================
          PDF용 숨김 보고서
      ========================= */}
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