import React, { useEffect, useMemo, useState } from "react";

const platformLayers = [
  {
    no: "01",
    eng: "Data Trust & Procedure Trace",
    title: "데이터 신뢰성 및 절차 추적",
    desc: "입력데이터의 출처, 작성주체, 변경이력, 정합성을 검증하고 기술사 검토 절차를 추적합니다.",
    tags: ["입력데이터 수집", "출처·변경이력 검증", "절차 추적", "인증상태 생성", "전자문서 출력"],
  },
  {
    no: "02",
    eng: "Structural Risk Certification Engine",
    title: "MRI 기반 구조안전 리스크 인증",
    desc: "PSI, DRI, BII, CLI를 통합하여 MRI와 MRI_final을 산정하고 기술사 검토를 연계합니다.",
    tags: ["PSI·DRI·BII·CLI", "MRI", "MRI_final", "Kd·Ki 보정", "리스크 인증서"],
  },
  {
    no: "03",
    eng: "Expert Pool Collaboration Platform",
    title: "전문가 풀 기반 협업 평가",
    desc: "총괄, 분야별, 보조 검토자를 배정하고 협업 검토와 성과 학습 구조를 운영합니다.",
    tags: ["전문가 풀", "총괄 검토자", "분야별 검토", "재배정 학습", "연계 이력 관리"],
  },
  {
    no: "04",
    eng: "Decision Intelligence / Je",
    title: "전문가 판단 정량화 및 보정",
    desc: "서술형 판단을 수치화하고 역할가중치, 확신계수, 감쇠계수를 반영해 Je를 통합합니다.",
    tags: ["서술형 판단 정량화", "Je 통합", "확신계수", "감쇠계수", "최종 보정 리스크"],
  },
  {
    no: "05",
    eng: "Construction Forensic & Cause Analysis",
    title: "사전평가 연계형 건설포렌식",
    desc: "사전 리스크 평가와 사고 후 데이터를 연결하여 변화량, 원인기여도, 책임영향도를 분석합니다.",
    tags: ["사전-사후 비교", "변화량 분석", "원인기여도", "책임영향도", "분쟁 대응"],
  },
  {
    no: "06",
    eng: "Judicial Evidence Package Verification",
    title: "법원감정용 전자적 증거 패키지",
    desc: "감정자료, 메타데이터, 증거 신뢰도, 해시 검증정보를 구조화하여 제출용 전자문서를 생성합니다.",
    tags: ["메타데이터", "증거 신뢰도", "판단-근거 매핑", "개별·통합 해시", "제출용 전자문서"],
  },
];

const freeServices = [
  {
    no: "01",
    title: "기본 MRI 자가진단",
    desc: "간단 입력값으로 PSI, DRI, BII, CLI의 개념형 점수를 산출하고 위험등급을 표시합니다.",
  },
  {
    no: "02",
    title: "데이터 체크리스트 진단",
    desc: "설계도서, 점검기록, 유지관리이력, 손상 사진, 계측자료 보유 여부를 빠르게 점검합니다.",
  },
  {
    no: "03",
    title: "서비스별 사전 적합도 확인",
    desc: "보험용, 유지관리용, 포렌식용, 법원감정용 중 어떤 서비스가 적합한지 안내합니다.",
  },
  {
    no: "04",
    title: "샘플 리포트 미리보기",
    desc: "정식 보고서 전체가 아닌 표지, 결과 예시, 등급표 중심의 미리보기 화면을 제공합니다.",
  },
];

const paidServices = [
  {
    top: "PAID 01",
    title: "기술사 검토 연계 리스크 인증",
    desc: "구조기술사 검토의견, Kd·Ki 보정, 인증번호·인증등급, 전자문서 출력을 포함합니다.",
  },
  {
    top: "PAID 02",
    title: "전문가 참여형 정밀 평가",
    desc: "총괄 검토자와 분야별 검토자를 배정하고 협업 검토 및 Je 정량화를 반영합니다.",
  },
  {
    top: "PAID 03",
    title: "포렌식 원인분석 보고서",
    desc: "사고 전후 변화량, 설계·시공·유지관리 요인별 기여도와 책임영향도를 분석합니다.",
  },
  {
    top: "PAID 04",
    title: "법원감정용 전자적 증거 패키지",
    desc: "자료별 메타데이터, 증거 신뢰도, 판단-근거 매핑, 해시 검증정보를 구성합니다.",
  },
  {
    top: "PAID 05",
    title: "보험 인수심사 연계 리스크 평가",
    desc: "보험 인수심사, 조건부 승인, 추가점검 판단을 위한 보조지표를 제공합니다.",
  },
  {
    top: "PAID 06",
    title: "유지관리·보수보강 우선순위 분석",
    desc: "점검주기, 보수보강 우선순위, 포트폴리오 리스크 순위 도출을 지원합니다.",
  },
  {
    top: "PAID 07",
    title: "API / SaaS / 기관용 대시보드",
    desc: "보험사, 공공기관, 시설물 관리자, 건설사 및 감리단과 연동 가능한 구조입니다.",
  },
];

const publicPartners = [
  {
    title: "지방자치단체",
    desc: "공공시설물 현황, 점검자료, 사고·민원자료, 유지관리 이력을 제공하고 예방 중심 안전관리 의사결정에 활용합니다.",
  },
  {
    title: "한국지방재정공제회",
    desc: "영조물배상공제 운영 관점에서 사고유형, 배상 리스크, 공제 운영 개선 가능성을 검토할 수 있습니다.",
  },
  {
    title: "한국기술사회",
    desc: "기술사 전문가 풀, 공학적 검토 절차, 리스크 평가보고서의 전문성과 신뢰성을 보강합니다.",
  },
  {
    title: "MAGOS",
    desc: "MRI 기반 구조 리스크 산정, 데이터 신뢰성 관리, 전문가 검토 리포트, 리스크 인증서, 의사결정 대시보드를 제공합니다.",
  },
  {
    title: "손해보험사 및 관련 기관",
    desc: "사고조사, 손해율 관리, 배상 리스크 분석, 향후 보험·공제 운영 개선 자료로 활용할 수 있습니다.",
  },
];

const publicSteps = [
  "공공시설물 현황·점검·사고·민원·보수이력 데이터 수집",
  "데이터 출처·작성주체·변경이력·정합성 검증",
  "MAGOS Risk Index(MRI) 기반 사전 리스크 산정",
  "구조기술사 등 전문가 검토 및 리스크 평가보고서 생성",
  "고위험 시설물 선별, 보수·보강 우선순위, 예산 배분 의사결정",
  "영조물배상 리스크 분석 및 공제·보험 운영 개선 자료화",
];

const publicOutcomes = [
  "고위험 공공시설물 우선 선별",
  "보수·보강 우선순위 및 예산 배분 근거",
  "사고예방 조치 및 점검주기 조정 자료",
  "영조물배상 리스크 절감 가능성 분석",
  "사고 발생 시 포렌식·전자적 증거 패키지 연계",
  "공공 인프라 리스크 의사결정 대시보드",
];

const govStrategy = [
  {
    step: "1단계",
    title: "공공영조물 안전관리 시범사업",
    desc: "행정안전부, 한국지방재정공제회, 지방자치단체, 한국기술사회를 중심으로 협력 가능성을 검토하고, 사고위험이 높은 공공시설물을 대상으로 MRI 기반 사전 리스크 평가 모델을 제안합니다.",
  },
  {
    step: "2단계",
    title: "AI·IoT·센서·데이터 기반 R&D 고도화",
    desc: "시범사업을 통해 축적된 점검자료, 사고유형, 보상자료, 유지관리 이력, 리스크 평가 결과를 기반으로 플랫폼을 고도화합니다.",
  },
  {
    step: "최종",
    title: "공공 인프라 리스크 의사결정 운영체계",
    desc: "공공시설물 안전관리, 영조물배상 리스크 관리, 보험·공제 의사결정, 사고 원인분석, 전자적 증거 생성을 하나로 연결합니다.",
  },
];

const insuranceRiskItems = [
  {
    title: "공제·보험 리스크 분석",
    desc: "시설물 상태와 사고 가능성을 사전에 수치화하여 공제·보험 운영 개선 자료로 활용할 수 있습니다.",
  },
  {
    title: "손해율 관리 보조자료",
    desc: "사고이력, 보수이력, 점검자료, 구조 리스크 등급을 결합하여 손해율 관리의 참고지표를 구성합니다.",
  },
  {
    title: "사고예방 데이터",
    desc: "사후 보상 중심 구조 앞단에 사전 위험 선별과 예방 조치 판단자료를 붙이는 방식입니다.",
  },
  {
    title: "포렌식·손해사정 연계",
    desc: "사고 발생 후에는 사전 평가 결과와 사고 후 데이터를 비교하여 원인기여도와 책임영향도 분석으로 확장합니다.",
  },
];


const compensationProcedure = [
  {
    no: "1",
    title: "배상금 청구",
    from: "피해자",
    to: "지방자치단체",
    desc: "공공영조물의 설치·관리 하자로 피해가 발생하면 피해자가 해당 지자체에 배상금 청구를 접수합니다.",
    icon: "👤",
  },
  {
    no: "2",
    title: "배상금 신청",
    from: "지방자치단체",
    to: "공제회·손해보험사",
    desc: "지자체는 사고 내용을 정리해 공제회 및 손해보험사 절차로 배상금 신청을 진행합니다.",
    icon: "🏛️",
  },
  {
    no: "3",
    title: "사고처리 협의",
    from: "공제회",
    to: "손해보험사",
    desc: "공제회와 손해보험사는 사고조사, 책임범위, 보상 가능성, 지급 절차를 협의합니다.",
    icon: "🔶",
  },
  {
    no: "4",
    title: "배상금 지급",
    from: "손해보험사",
    to: "피해자",
    desc: "협의 및 손해사정 결과에 따라 손해보험사를 통해 피해자에게 배상금이 지급됩니다.",
    icon: "🏦",
  },
];

const registrationProcedure = [
  {
    no: "1",
    title: "공제 안내",
    from: "공제회",
    to: "지방자치단체",
    desc: "공제회가 지자체에 영조물배상공제 가입·등록 절차와 대상시설 기준을 안내합니다.",
  },
  {
    no: "2",
    title: "공제 가입",
    from: "지방자치단체",
    to: "공제회",
    desc: "지자체는 관리 중인 공공시설물 현황을 기준으로 공제 가입 또는 등록 절차를 진행합니다.",
  },
  {
    no: "3",
    title: "공제업무 체결",
    from: "손해보험사",
    to: "공제회",
    desc: "공제회와 손해보험사는 사고처리 및 보상 운영을 위한 업무 체계를 구성합니다.",
  },
  {
    no: "4",
    title: "보험계약 일괄체결",
    from: "공제회",
    to: "손해보험사",
    desc: "공제회는 지자체 가입 정보를 바탕으로 손해보험사와 일괄 계약 및 운영 구조를 연결합니다.",
  },
];

const magosAttachPoints = [
  {
    label: "가입·갱신 전",
    title: "시설군별 사전 리스크 평가",
    desc: "공제 가입 또는 갱신 전에 도로, 교량, 보도, 공원시설, 공공건축물의 점검·사고·보수이력을 기반으로 MRI를 산정합니다.",
  },
  {
    label: "운영 중",
    title: "고위험 시설물 우선 선별",
    desc: "민원, 사고위험, 시설 상태, 환경조건을 결합해 보수·보강 우선순위와 예산 배분 판단자료를 제공합니다.",
  },
  {
    label: "사고 후",
    title: "포렌식·증거자료 연계",
    desc: "사전 평가 결과와 사고 후 조사자료를 비교하여 원인기여도, 책임영향도, 전자적 증거 패키지로 확장합니다.",
  },
];

const pocRoadmap = [
  "한국기술사회와 기술사 검토체계 및 전문가 풀 연계 구조 협의",
  "한국지방재정공제회에 공공 리스크 관리형 시범사업 모델 제안",
  "1개 지자체 또는 1개 시설군을 대상으로 10~30개 시설물 PoC 선정",
  "MRI 산정, 위험등급화, 전문가 검토, 예방조치 권고 리포트 생성",
  "사고위험, 민원, 보수우선순위, 배상 리스크 절감 가능성을 분석",
];

function getGrade(score) {
  if (score < 20) return { label: "A", className: "grade-a", text: "안정" };
  if (score < 40) return { label: "B", className: "grade-b", text: "관리 필요" };
  if (score < 60) return { label: "C", className: "grade-c", text: "위험" };
  return { label: "D", className: "grade-d", text: "긴급 대응 필요" };
}

export default function App() {
  const [calc, setCalc] = useState({
    psi: 45,
    dri: 40,
    bii: 30,
    cli: 25,
    kd: "A",
    ki: "보통",
  });

  const [contactType, setContactType] = useState("정식 리스크 인증");
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const kdMap = { A: 1.0, B: 1.05, C: 1.1, D: 1.15 };
  const kiMap = { 보통: 1.0, 중요: 1.08, 중대: 1.15 };

  const result = useMemo(() => {
    const mri = 0.35 * calc.psi + 0.3 * calc.dri + 0.2 * calc.bii + 0.15 * calc.cli;
    const kd = kdMap[calc.kd];
    const ki = kiMap[calc.ki];
    const mriFinal = 100 - (100 - mri) / (kd * ki);
    const grade = getGrade(mriFinal);

    let summary = "기본 유지관리 중심의 대응이 가능한 수준입니다.";
    if (grade.label === "B") summary = "점검주기 조정과 핵심 부재 상태 확인이 필요한 수준입니다.";
    if (grade.label === "C") summary = "정밀 검토, 추가 계측, 기술사 검토 연계가 필요한 수준입니다.";
    if (grade.label === "D") summary = "긴급 대응, 사용 제한 검토, 전문가 참여형 정밀평가가 필요한 수준입니다.";

    return {
      mri: mri.toFixed(1),
      mriFinal: mriFinal.toFixed(1),
      grade,
      summary,
      kd,
      ki,
    };
  }, [calc]);

  const sectionPathMap = {
    home: "/",
    platform: "/#platform",
    "public-sector": "/public-sector",
    "insurance-risk": "/#insurance-risk",
    services: "/#services",
    demo: "/#demo",
    contact: "/#contact",
  };

  const scrollToSection = (id, updatePath = true) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

    if (updatePath && typeof window !== "undefined") {
      const nextPath = sectionPathMap[id] || `/#${id}`;
      const currentPath = `${window.location.pathname}${window.location.hash}`;
      if (currentPath !== nextPath) {
        window.history.pushState(null, "", nextPath);
      }
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash.replace("#", "");
    const target = path === "/public-sector" ? "public-sector" : hash;
    if (target) {
      window.setTimeout(() => scrollToSection(target, false), 80);
    }
  }, []);

  const handleCalcChange = (key, value) => {
    setCalc((prev) => ({ ...prev, [key]: value }));
  };

  const handleContactChange = (key, value) => {
    setContactForm((prev) => ({ ...prev, [key]: value }));
  };

  const setInquiryTemplate = (type) => {
    setContactType(type);
    setContactForm((prev) => ({
      ...prev,
      message: `[문의유형] ${type}\n[대상 구조물]\n[현재 상황]\n[보유 데이터]\n[요청 사항]\n`,
    }));
    scrollToSection("contact");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("현재는 시연용 문의 폼입니다. 다음 단계에서 EmailJS 또는 서버 연동을 연결하면 실제 전송됩니다.");
  };

  return (
    <div className="site">
      <div className="site-bg site-bg-1" />
      <div className="site-bg site-bg-2" />
      <div className="site-bg site-bg-3" />

      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => scrollToSection("home")}>
            <div className="brand-mark">M</div>
            <div className="brand-text">
              <div className="brand-sub">Structure Risk OS</div>
              <strong>MAGOS</strong>
            </div>
          </button>

          <nav className="nav">
            <button onClick={() => scrollToSection("home")}>Home</button>
            <button onClick={() => scrollToSection("platform")}>Platform</button>
            <button onClick={() => scrollToSection("public-sector")}>Public Sector</button>
            <button onClick={() => scrollToSection("insurance-risk")}>Insurance & Risk</button>
            <button onClick={() => scrollToSection("demo")}>Demo</button>
            <button onClick={() => scrollToSection("contact")}>Contact</button>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="section hero">
          <div className="container hero-grid">
            <div className="hero-left">
              <div className="eyebrow">
                Open Standard · Risk Quantification · Engineering Decision Platform
              </div>

              <h1 className="hero-title">
                구조 리스크를 수치로 
                <br />
                예지하고
                <span>공학적 판단을 디지털로 
                  <br />
                  표준화하는 OS</span>
              </h1> 

              <p className="hero-desc">
                본 홈페이지의 내용은 사업 방향, 기술 구상, 협력 모델 및 실증 계획에 대한 안내 목적으로 하며, 개별 프로젝트 적용 여부는 별도 검토 및 계약에 따릅니다.
                <br />
                본 플랫폼은 한국기술사회가 정립하는 공학적 판단 기준 및 절차 표준을 디지털로 구현하는 기술 플랫폼입니다. 
                <br />
                특정 기업의 독점 구조가 아닌 개방형 생태계를 지향하며, MAGOS는 데이터 신뢰성, MRI, 전문가 판단, 포렌식, 전자적 증거 생성 기술을 구현합니다.
              </p>

              <div className="hero-actions">
                <button className="btn btn-solid" onClick={() => scrollToSection("demo")}>
                  무료 진단 시작
                </button>
                <button className="btn btn-glass" onClick={() => scrollToSection("public-sector")}>
                  공공영조물 전용 페이지
                </button>
                <button className="btn btn-outline" onClick={() => scrollToSection("services")}>
                  Services 보기
                </button>
                <button className="btn btn-glass" onClick={() => scrollToSection("contact")}>
                  상담 요청
                </button>
              </div>

              <div className="metric-grid">
                <div className="metric-card">
                  <div className="metric-label">Structure</div>
                  <div className="metric-value">표준은 공공, 
                    <br />
                    기술은 개방, 
                    <br />
                    시장은 다수 
                    <br />
                    참여</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Core Value</div>
                  <div className="metric-value">데이터 신뢰성 
                    <br />
                    + MRI 
                    <br />
                    + 전문가 판단 
                    <br />
                    + 포렌식</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Business</div>
                  <div className="metric-value">운영 독점이 
                    <br />
                    아닌 
                    <br />
                    특허 기반
                    <br />
                    로열티 구조</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Output</div>
                  <div className="metric-value">인증서, 
                    <br />
                    보고서, 
                    <br />
                    보험지표, 
                    <br />
                    증거 패키지</div>
                </div>
              </div>
            </div>

            <div className="hero-right">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-sub">PLATFORM OVERVIEW</div>
                    <h2>개방형 구조 리스크 
                      <br />
                      의사결정 운영체계</h2>
                  </div>
                  <div className="panel-badge">6 Patents Integrated</div>
                </div>

                <div className="layer-list">
                  <div className="layer-card">
                    <div className="layer-no">A</div>
                    <div className="layer-body">
                      <div className="layer-eng">Authority</div>
                      <h3>한국기술사회가 공학적 판단 기준과 
                        <br />
                        절차 표준을 정립</h3>
                    </div>
                  </div>

                  <div className="layer-card">
                    <div className="layer-no">T</div>
                    <div className="layer-body">
                      <div className="layer-eng">Technology</div>
                      <h3>MAGOS가 정량화 엔진, 절차 추적, 
                        <br />
                        포렌식, 증거 패키지를 구현</h3>
                    </div>
                  </div>

                  <div className="layer-card">
                    <div className="layer-no">M</div>
                    <div className="layer-body">
                      <div className="layer-eng">Market</div>
                      <h3>보험사·공공기관·시설물 관리자
                        <br />
                        ·엔지니어링사가 함께 쓰는 개방형 구조</h3>
                    </div>
                  </div>
                </div>

                <div className="notice-box">
                  본 시스템은 특정 기업의 독점 운영 모델이 아니라, 
                  <br />
                  표준 기반 개방형 구조로 다양한 사업자가 참여하는 생태계를 지향합니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section compact-section">
          <div className="container">
            <div className="section-head">
              <div className="section-label">FOUNDER</div>
              <h2>대표 소개</h2>
              <p>
                김황준 공학박사 · 토목구조기술사. 구조 리스크를 수치화하고, 
                공학적 판단을 디지털 의사결정 체계로 연결하는 구조 리스크 운영체계를 설계하고 있습니다.
                <br />
                플랫폼을 직접 독점 운영하기보다, 
                특허 기반 핵심 기술을 제공하는
                Core Technology Provider 구조를 지향합니다.
              </p>
            </div>
          </div>
        </section>

        <section id="platform" className="section">
          <div className="container">
            <div className="section-head">
              <div className="section-label">PLATFORM</div>
              <h2>공공성 + 기술 + 시장을 분리한 구조</h2>
              <p>
                기술사 판단의 공공성은 유지하고, 기술은 민간에 개방하며, 시장은 다양한
                사업자가 참여하는 구조를 목표로 합니다.
              </p>
            </div>

            <div className="role-grid">
              <div className="role-card role-card-cyan">
                <div className="role-label">AUTHORITY LAYER</div>
                <h2>한국기술사회</h2>
                <div className="role-list">
                  <div className="role-item">공학적 판단 기준 정립</div>
                  <div className="role-item">검토 절차 및 윤리 기준</div>
                  <div className="role-item">전문가 풀 공신력</div>
                  <div className="role-item">표준의 제도화</div>
                </div>
              </div>

              <div className="role-card role-card-green">
                <div className="role-label">TECHNOLOGY LAYER</div>
                <h2>MAGOS</h2>
                <div className="role-list">
                  <div className="role-item">데이터 신뢰성 검증</div>
                  <div className="role-item">MRI 리스크 정량화</div>
                  <div className="role-item">전문가 판단 정량화(Je)</div>
                  <div className="role-item">포렌식·전자적 증거 생성</div>
                </div>
              </div>
            </div>

            <div className="role-grid" style={{ marginTop: "20px" }}>
              <div className="role-card">
                <div className="role-label">MARKET LAYER</div>
                <h2>다수 사업자 참여 구조</h2>
                <div className="role-list">
                  <div className="role-item">보험사 / 재보험사</div>
                  <div className="role-item">공공기관 / 시설물 관리자</div>
                  <div className="role-item">엔지니어링사 / 감리단</div>
                  <div className="role-item">API / SaaS / 기관용 대시보드</div>
                </div>
              </div>

              <div className="role-card">
                <div className="role-label">POSITIONING</div>
                <h2>Core Technology Provider</h2>
                <div className="role-list">
                  <div className="role-item">운영 독점 지향 아님</div>
                  <div className="role-item">특허 기반 핵심 기술 제공</div>
                  <div className="role-item">로열티 기반 확산</div>
                  <div className="role-item">개방형 생태계 구축</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div className="section-label">PATENT INTEGRATION</div>
              <h2>특허출원 6개 통합 구조</h2>
              <p>
                입력 데이터부터 리스크 인증, 전문가 협업, 포렌식, 법원감정용 전자적
                증거 패키지까지 하나의 흐름으로 통합합니다.
              </p>
            </div>

            <div className="panel">
              <div className="layer-list">
                {platformLayers.map((layer) => (
                  <div className="layer-card" key={layer.no}>
                    <div className="layer-no">{layer.no}</div>
                    <div className="layer-body">
                      <div className="layer-eng">{layer.eng}</div>
                      <h3>{layer.title}</h3>
                      <p style={{ marginTop: "10px", color: "#b7c3d4", lineHeight: 1.8 }}>
                        {layer.desc}
                      </p>
                      <div className="tag-list">
                        {layer.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head section-head-row">
              <div>
                <div className="section-label">OPERATING FLOW</div>
                <h2>구조 리스크를 수치로 예지·통합관리하는 OS</h2>
                <p>
                  데이터 → 리스크 → 전문가 → 의사결정 → 포렌식 → 증거 생성까지
                  연결되는 실행형 구조입니다.
                </p>
              </div>

              <button className="btn btn-glass" onClick={() => scrollToSection("demo")}>
                데모 보기
              </button>
            </div>

            <div className="workflow-center-wrap">
              <div className="workflow-vertical">
                {[
                  "Input Layer : 설계·시공·점검·계측·유지관리·사고 데이터 입력",
                  "Data Trust : 출처·작성주체·변경이력·정합성 검증",
                  "MRI Engine : PSI·DRI·BII·CLI 기반 리스크 산정",
                  "Expert Layer : 전문가 배정, 검토, Je 정량화",
                  "Decision Layer : 인증, 보험·유지관리·조달 판단",
                ].map((item, index) => (
                  <React.Fragment key={item}>
                    <div className="workflow-center-item">
                      <div className="workflow-center-box">
                        <div className="workflow-center-index">{index + 1}</div>
                        <div>{item}</div>
                      </div>
                    </div>
                    {index !== 4 && <div className="workflow-arrow">↓</div>}
                  </React.Fragment>
                ))}

                <div className="workflow-branch-row">
                  <div className="workflow-branch-box">
                    <h3>Insurance</h3>
                    <p>보험 인수심사 보조지표, 조건부 승인, 
                      <br />
                      추가점검 판단자료 생성</p>
                  </div>
                  <div className="workflow-branch-box">
                    <h3>Maintenance</h3>
                    <p>점검주기, 보수보강 우선순위, 
                      <br />
                      포트폴리오 리스크 순위 제공</p>
                  </div>
                  <div className="workflow-branch-box">
                    <h3>Forensic & Evidence</h3>
                    <p>원인기여도, 책임영향도, 
                      <br />
                      전자적 증거 패키지 생성</p>
                  </div>
                </div>

                <div className="workflow-sub-row">
                  <div className="workflow-sub-box">
                    구조안전 리스크 인증서 / 전자문서 / 검증정보
                  </div>
                  <div className="workflow-sub-box">
                    포렌식 분석서 / 법원감정용 증거 패키지
                  </div>
                </div>

                <div className="workflow-last-box">
                  무료 진단 → 정식 인증 → 전문가 참여형 정밀평가 
                  <br />
                  → 포렌식 / 법원감정용
                  증거 패키지로 확장되는 사업 구조
                </div>
              </div>
            </div>
          </div>
        </section>


        <section id="public-sector" className="section public-section public-sector-v2">
          <div className="container">
            <div className="public-hero-card">
              <div className="public-hero-content">
                <div className="public-badge">PUBLIC SECTOR LANDING</div>
                <h2>공공영조물 안전관리 및<br />영조물배상 리스크 관리 플랫폼</h2>
                <p>
                  MAGOS는 공공시설물의 구조 리스크를 사고 발생 전에 수치화하고,
                  기술사 검토와 영조물배상 리스크 관리를 연계하여 지자체의 예방 중심 안전관리와
                  공제·보험 의사결정을 지원하는 공공 인프라 리스크 운영체계입니다.
                </p>
                <div className="public-actions">
                  <button className="btn btn-solid" onClick={() => scrollToSection("public-procedure")}>현행 배상·등록 절차 보기</button>
                  <button className="btn btn-outline" onClick={() => setInquiryTemplate("공공영조물 안전관리 시범사업")}>시범사업 문의</button>
                </div>
              </div>

              <div className="public-hero-panel">
                <strong>사후 보상 중심에서<br />사전예방 중심으로</strong>
                <span>
                  피해 발생 후 배상금을 지급하는 절차 앞단에 MRI 기반 사전 위험평가,
                  전문가 검토, 예방조치 우선순위, 리스크 인증서를 연결합니다.
                </span>
                <div className="public-mini-stack">
                  <div>대상: 도로 · 교량 · 보도 · 공원시설 · 공공건축물</div>
                  <div>출력: MRI 리포트 · 인증서 · 대시보드 · 포렌식 자료</div>
                </div>
              </div>
            </div>

            <div className="public-grid public-grid-3">
              {["도로", "교량", "보도", "공원시설", "공공건축물", "옹벽·사면"].map((item) => (
                <div className="public-mini-card" key={item}>{item}</div>
              ))}
            </div>

            <div id="public-procedure" className="public-subhead section-head">
              <div className="section-label">CURRENT PROCESS</div>
              <h2>현행 절차를 이해하면 MAGOS의 위치가 명확해집니다</h2>
              <p>
                영조물배상은 피해자, 지방자치단체, 공제회, 손해보험사가 함께 움직이는 절차입니다.
                MAGOS는 이 절차를 대체하지 않고, 사고 발생 전 단계에 사전 리스크 평가와 예방관리 자료를 붙입니다.
              </p>
            </div>

            <div className="procedure-grid">
              <div className="procedure-panel">
                <div className="procedure-head">
                  <span>01</span>
                  <h3>배상금 지급절차</h3>
                </div>
                <div className="procedure-flow procedure-flow-4">
                  {compensationProcedure.map((step, index) => (
                    <React.Fragment key={step.no}>
                      <div className="procedure-step">
                        <div className="procedure-no">{step.no}</div>
                        <div className="procedure-icon">{step.icon}</div>
                        <strong>{step.title}</strong>
                        <p>{step.from} → {step.to}</p>
                      </div>
                      {index !== compensationProcedure.length - 1 && <div className="procedure-arrow">→</div>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="procedure-detail-list">
                  {compensationProcedure.map((step) => (
                    <div className="procedure-detail" key={step.no}>
                      <b>{step.no}. {step.title}</b>
                      <span>{step.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="procedure-panel">
                <div className="procedure-head">
                  <span>02</span>
                  <h3>공제 등록·계약 절차</h3>
                </div>
                <div className="registration-map">
                  <div className="reg-actor">🏛️<strong>지방자치단체</strong></div>
                  <div className="reg-center">🔶<strong>공제회</strong></div>
                  <div className="reg-actor">🏦<strong>손해보험사</strong></div>
                </div>
                <div className="procedure-detail-list">
                  {registrationProcedure.map((step) => (
                    <div className="procedure-detail" key={step.no}>
                      <b>{step.no}. {step.title}</b>
                      <span>{step.from} → {step.to} · {step.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="public-subhead section-head">
              <div className="section-label">MAGOS ATTACH POINT</div>
              <h2>MAGOS는 절차의 앞단과 뒤단을 동시에 보강합니다</h2>
              <p>
                핵심은 “배상금 지급 이후”가 아니라 “배상 사고 발생 이전”입니다.
                공공시설물의 데이터를 먼저 정리하고, 위험도를 수치화하며, 기술사 검토를 통해 예방 의사결정 자료를 만듭니다.
              </p>
            </div>

            <div className="attach-grid">
              {magosAttachPoints.map((item) => (
                <div className="attach-card" key={item.label}>
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="public-columns">
              <div className="public-panel">
                <h3>공공기관 협력모델</h3>
                <div className="public-partner-list">
                  {publicPartners.map((partner) => (
                    <div className="public-partner" key={partner.title}>
                      <strong>{partner.title}</strong>
                      <p>{partner.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="public-panel public-panel-accent">
                <h3>지자체가 얻는 판단자료</h3>
                <div className="public-outcome-grid">
                  {publicOutcomes.map((outcome) => (
                    <div className="public-outcome" key={outcome}>{outcome}</div>
                  ))}
                </div>
                <div className="safe-notice">
                  홈페이지에서는 “보험료를 절감해드립니다”가 아니라 “배상 리스크 절감 가능성을 분석합니다”,
                  “공공시설물 사고예방 의사결정을 지원합니다”로 표현하는 것이 안전합니다.
                </div>
              </div>
            </div>

            <div className="strategy-wrap">
              <div className="section-head">
                <div className="section-label">POC ROADMAP</div>
                <h2>시범사업 추진 순서</h2>
                <p>
                  MAGOS 단독 제안이 아니라, 기술사회 연계형 공공 리스크 관리 제안으로 접근하는 구조입니다.
                </p>
              </div>
              <div className="poc-timeline">
                {pocRoadmap.map((step, index) => (
                  <div className="poc-step" key={step}>
                    <div className="poc-no">{index + 1}</div>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="strategy-wrap">
              <div className="section-head">
                <div className="section-label">GOVERNMENT PROJECT STRATEGY</div>
                <h2>단계별 정부과제 추진전략</h2>
              </div>
              <div className="strategy-grid">
                {govStrategy.map((item) => (
                  <div className="strategy-card" key={item.step}>
                    <span>{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="insurance-risk" className="section insurance-section">
          <div className="container">
            <div className="section-head section-head-row">
              <div>
                <div className="section-label">INSURANCE & PUBLIC RISK</div>
                <h2>공제·보험 절차와 연결되는 리스크 분석</h2>
                <p>
                  영조물배상 리스크는 단순 보험 문제가 아니라 지자체의 안전관리, 민원, 소송,
                  재정 부담과 연결되는 공공 리스크입니다. MAGOS는 현행 공제·보험 절차에 필요한
                  사전 예방 데이터와 사후 분석 자료를 제공합니다.
                </p>
              </div>
              <button className="btn btn-solid" onClick={() => setInquiryTemplate("공제·보험 리스크 분석")}>공제·보험 협력 문의</button>
            </div>

            <div className="insurance-grid">
              {insuranceRiskItems.map((item) => (
                <div className="insurance-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="insurance-link-panel">
              <div>
                <strong>절감효과는 보장 문구가 아니라 ‘가정 기반 분석’으로 제시합니다.</strong>
                <p>
                  예: 연간 배상 리스크 절감 가능성 = 기존 사고건수 × 평균 손해액 × 사고율 감소 가정.
                  실제 적용 시에는 지자체별 사고이력, 시설물 현황, 공제·보험 운영자료, 보수이력을 기반으로 별도 산정합니다.
                </p>
              </div>
              <button className="btn btn-outline" onClick={() => setInquiryTemplate("영조물배상 리스크 절감 가능성 분석")}>분석 문의</button>
            </div>
          </div>
        </section>

        <section id="demo" className="section">
          <div className="container">
            <div className="section-head section-head-row">
              <div>
                <div className="section-label">DEMO</div>
                <h2>MRI 기본 계산기 + 샘플 결과 화면</h2>
                <p>
                  본 계산기는 개념형 무료 데모입니다. 정식 서비스에서는 구조기술사 검토,
                  전문가 판단, 포렌식, 전자적 증거 구조가 결합됩니다.
                </p>
              </div>

              <button className="btn btn-outline" onClick={() => setInquiryTemplate("전문가 참여형 정밀 평가")}>
                유료 고급분석 문의
              </button>
            </div>

            <div className="calculator-wrap">
              <div className="calculator-panel">
                <div className="calculator-head">
                  <div>
                    <div className="panel-sub">BASIC MRI CALCULATOR</div>
                    <h3>구조 리스크 기본 진단</h3>
                  </div>
                  <div className="panel-badge">참고용 결과</div>
                </div>

                <div className="calculator-grid">
                  <div className="calc-inputs">
                    <div className="calc-field">
                      <label>PSI · 사고확률 기반 리스크</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={calc.psi}
                        onChange={(e) => handleCalcChange("psi", Number(e.target.value))}
                      />
                      <div className="calc-value">{calc.psi}</div>
                    </div>

                    <div className="calc-field">
                      <label>DRI · 열화 및 상태 리스크</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={calc.dri}
                        onChange={(e) => handleCalcChange("dri", Number(e.target.value))}
                      />
                      <div className="calc-value">{calc.dri}</div>
                    </div>

                    <div className="calc-field">
                      <label>BII · 비용 및 운영 영향 리스크</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={calc.bii}
                        onChange={(e) => handleCalcChange("bii", Number(e.target.value))}
                      />
                      <div className="calc-value">{calc.bii}</div>
                    </div>

                    <div className="calc-field">
                      <label>CLI · 계약 및 책임 노출 리스크</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={calc.cli}
                        onChange={(e) => handleCalcChange("cli", Number(e.target.value))}
                      />
                      <div className="calc-value">{calc.cli}</div>
                    </div>

                    <div className="calc-select-grid">
                      <div className="calc-field">
                        <label>Kd · 데이터 신뢰도 보정</label>
                        <select value={calc.kd} onChange={(e) => handleCalcChange("kd", e.target.value)}>
                          <option value="A">A (높음)</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D (낮음)</option>
                        </select>
                      </div>

                      <div className="calc-field">
                        <label>Ki · 구조 중요도 보정</label>
                        <select value={calc.ki} onChange={(e) => handleCalcChange("ki", e.target.value)}>
                          <option value="보통">보통</option>
                          <option value="중요">중요</option>
                          <option value="중대">중대</option>
                        </select>
                      </div>
                    </div>

                    <div className="calc-note">
                      본 계산기는 개념형 무료 진단입니다. 정식 결과에는 기술사 검토,
                      Kd·Ki 보정, 전문가 판단 정량화, 인증정보 및 보고서 구조가 반영됩니다.
                    </div>
                  </div>

                  <div className="calc-result">
                    <div className="result-box">
                      <div className="result-label">MRI</div>
                      <div className="result-value">{result.mri}</div>
                    </div>

                    <div className="result-box result-box-strong">
                      <div className="result-label">MRI FINAL</div>
                      <div className="result-value">{result.mriFinal}</div>
                    </div>

                    <div className="result-box">
                      <div className="result-label">RISK GRADE</div>
                      <div className={`grade-badge ${result.grade.className}`}>
                        {result.grade.label} · {result.grade.text}
                      </div>
                    </div>

                    <div className="result-summary">
                      <h4>해석 요약</h4>
                      <p>{result.summary}</p>
                    </div>

                    <div className="result-actions">
                      <button className="btn btn-glass" onClick={() => window.print()}>
                        샘플 결과 출력
                      </button>
                      <button className="btn btn-outline" onClick={() => setInquiryTemplate("기술사 검토 연계 리스크 인증")}>
                        정식 인증 문의
                      </button>
                    </div>
                  </div>
                </div>

                <div className="report-card-wrap">
                  <div className="report-card">
                    <div className="report-card-head">
                      <div>
                        <div className="panel-sub">SAMPLE RESULT</div>
                        <h3>샘플 결과 화면</h3>
                      </div>
                      <div className="panel-badge">Preview Report</div>
                    </div>

                    <div className="report-card-body">
                      <div className="report-main-score">
                        <div className="report-score-box">
                          <span>Final MRI</span>
                          <strong>{result.mriFinal}</strong>
                        </div>
                        <div className="report-score-box report-score-box-strong">
                          <span>Grade</span>
                          <strong>{result.grade.label}</strong>
                        </div>
                      </div>

                      <div className="report-detail-grid">
                        <div className="report-detail-item">
                          <span>PSI</span>
                          <strong>{calc.psi}</strong>
                        </div>
                        <div className="report-detail-item">
                          <span>DRI</span>
                          <strong>{calc.dri}</strong>
                        </div>
                        <div className="report-detail-item">
                          <span>BII</span>
                          <strong>{calc.bii}</strong>
                        </div>
                        <div className="report-detail-item">
                          <span>CLI</span>
                          <strong>{calc.cli}</strong>
                        </div>
                        <div className="report-detail-item">
                          <span>Kd</span>
                          <strong>{result.kd}</strong>
                        </div>
                        <div className="report-detail-item">
                          <span>Ki</span>
                          <strong>{result.ki}</strong>
                        </div>
                      </div>

                      <div className="report-interpretation">
                        <h4>유료 고급분석 안내</h4>
                        <p>
                          정식 서비스에서는 구조기술사 검토 연계 인증, 전문가 참여형 정밀평가,
                          사고 원인분석, 법원감정용 전자적 증거 패키지까지 확장 가능합니다.
                        </p>
                      </div>

                      <div className="report-footer-note">
                        본 화면은 샘플입니다. 정식 결과물에는 인증번호, 검토이력, 근거자료,
                        검증정보, 포렌식 및 증거 연계 구조가 포함될 수 있습니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <div className="section-label">CONTACT</div>
                <h2>문의 접수 · 상담 예약 · 견적 요청</h2>
                <p>
                  공공영조물 안전관리, 영조물배상 리스크 관리, 정식 리스크 인증,
                  전문가 참여형 정밀평가, 포렌식 분석, 기관용 SaaS 연동이 필요한 경우
                  상담을 통해 맞춤형 서비스를 설계합니다.
                </p>

                <div className="contact-points">
                  <div className="contact-point">
                    <strong>문의 접수</strong>
                    <br />
                    구조 리스크 평가, 보험 연계, 유지관리, 포렌식, 감정자료 구성 관련 기본 문의
                  </div>
                  <div className="contact-point">
                    <strong>상담 예약</strong>
                    <br />
                    프로젝트 개요와 보유 데이터 수준을 검토하여 적합한 서비스 구조를 제안
                  </div>
                  <div className="contact-point">
                    <strong>견적 요청</strong>
                    <br />
                    인증, 정밀평가, 보고서, 대시보드, API 연동 범위에 따른 맞춤 견적 제공
                  </div>
                </div>
              </div>

              <div className="contact-form-card">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="chip-group">
                    {[
                      "공공영조물 시범사업 협력 문의",
                      "공제·보험 리스크 분석 문의",
                      "기술사 검토 연계 리스크 인증",
                      "전문가 참여형 정밀 평가",
                      "포렌식 원인분석 보고서",
                      "법원감정용 전자적 증거 패키지",
                      "API / SaaS / 기관용 대시보드",
                    ].map((item) => (
                      <button
                        type="button"
                        className="chip"
                        key={item}
                        onClick={() => setInquiryTemplate(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>성명</label>
                      <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={contactForm.name}
                        onChange={(e) => handleContactChange("name", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>회사명 / 기관명</label>
                      <input
                        type="text"
                        placeholder="회사 또는 기관명을 입력하세요"
                        value={contactForm.company}
                        onChange={(e) => handleContactChange("company", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>이메일</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={contactForm.email}
                        onChange={(e) => handleContactChange("email", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>연락처</label>
                      <input
                        type="text"
                        placeholder="연락 가능한 번호"
                        value={contactForm.phone}
                        onChange={(e) => handleContactChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>문의 유형</label>
                    <input type="text" value={contactType} readOnly />
                  </div>

                  <div className="form-group">
                    <label>상담 내용</label>
                    <textarea
                      placeholder="프로젝트 개요, 구조물 종류, 현재 상황, 보유 데이터, 요청사항 등을 입력하세요."
                      value={contactForm.message}
                      onChange={(e) => handleContactChange("message", e.target.value)}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-solid">
                      문의 접수
                    </button>
                    <button
                      type="button"
                      className="btn btn-glass"
                      onClick={() => setInquiryTemplate("상담 예약")}
                    >
                      상담 예약
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setInquiryTemplate("견적 요청")}
                    >
                      견적 요청
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}