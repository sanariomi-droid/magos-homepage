import { useMemo, useState } from "react";
import "./App.css";

const patentLayers = [
  {
    no: "01",
    eng: "Data Trust & Procedure Trace",
    title: "데이터 신뢰성 및 절차 추적 기반 인증",
    items: [
      "출처·작성주체·변경이력 검증",
      "검토·보완·승인 절차 추적",
      "인증상태·인증번호·등급 생성",
    ],
  },
  {
    no: "02",
    eng: "Structural Risk Certification Engine",
    title: "구조기술사 검토 연계 리스크 인증",
    items: [
      "PSI · DRI · BII · CLI 산정",
      "MRI 및 MRI_final 산정",
      "Kd · Ki 반영",
      "구조안전 리스크 인증서 생성",
    ],
  },
  {
    no: "03",
    eng: "Expert Pool Collaboration Platform",
    title: "전문가 풀 기반 구조안전 리스크 평가",
    items: [
      "전문가 자격·수행이력 관리",
      "총괄·분야별·보조 검토자 배정",
      "전문가 성과평가 및 재배정",
    ],
  },
  {
    no: "04",
    eng: "Judgment Quantification Layer",
    title: "전문가 판단 정량화 기반 리스크 보정",
    items: [
      "서술형 판단 정량화",
      "역할가중치·확신계수·감쇠계수 반영",
      "Je 통합 및 최종 보정 리스크 산정",
    ],
  },
  {
    no: "05",
    eng: "Construction Forensic Layer",
    title: "사전평가 연계형 건설포렌식",
    items: [
      "사고 전후 데이터 연계",
      "변화량·원인기여도 분석",
      "책임영향도 분석",
    ],
  },
  {
    no: "06",
    eng: "Judicial Evidence Package",
    title: "전자적 증거 패키지 생성 및 검증",
    items: [
      "자료별 메타데이터",
      "증거 신뢰도 정량화",
      "판단-근거 매핑",
      "개별·통합 해시값 생성",
    ],
  },
];

const magosRole = [
  "플랫폼 운영",
  "데이터 수집/정리",
  "MRI 산정",
  "Je 반영 로직",
  "보고서/인증서/전자증거 생성",
];

const kpeRole = [
  "전문가 풀 연결",
  "검토 절차 표준화",
  "검토 양식·윤리 기준 제시",
  "분야별 기술사 추천",
  "공학적 판단의 신뢰성 보강",
];

const serviceFlow = [
  "홈페이지 방문",
  "무료 자가 진단 또는 데모 신청",
  "회원가입 및 조직 생성",
  "프로젝트/구조물 등록",
  "문서 업로드 및 데이터 출처 태깅",
  "기초 리스크 산정",
  "전문가 매칭 및 검토 요청",
  "검토 의견 수집",
  "Je 반영 및 최종 리스크/등급 산정",
];

const serviceBranches = [
  {
    title: "인증서 발급 및 QR 검증 페이지 생성",
    desc: "최종 리스크와 검토 결과를 바탕으로 구조안전 리스크 인증서를 생성하고 외부 검증 페이지로 연결합니다.",
  },
  {
    title: "사고 발생 시 포렌식 모듈로 이동",
    desc: "사고 전후 비교, 원인기여도 분석, 책임영향도 산정, 전자 증거 패키지 생성까지 이어집니다.",
  },
  {
    title: "보험 API 또는 보험 시뮬레이션",
    desc: "리스크 결과를 바탕으로 인수 조건 검토, 추가 점검 제안, 보험 의사결정 지원으로 확장됩니다.",
  },
];

const subBranches = [
  "사고 전후 비교 및 원인기여도 분석",
  "인수 조건 / 추가 점검 제안",
];

const freeServices = [
  {
    title: "기본 MRI 자가진단",
    desc: "간단 입력값으로 PSI, DRI, BII, CLI 개념형 점수를 산출하고 참고용 위험등급을 제공합니다.",
  },
  {
    title: "데이터 체크리스트 진단",
    desc: "설계도서, 점검기록, 유지관리이력, 사고·손상 사진, 계측자료 보유 여부를 빠르게 점검합니다.",
  },
  {
    title: "서비스별 사전 적합도 확인",
    desc: "보험용, 유지관리용, 포렌식용, 법원감정용 중 어떤 경로가 적합한지 안내합니다.",
  },
  {
    title: "샘플 리포트 미리보기",
    desc: "표지, 결과 예시, 등급표 중심의 샘플 결과 화면을 먼저 확인할 수 있습니다.",
  },
];

const paidServices = [
  "기술사 검토 연계 리스크 인증",
  "전문가 참여형 정밀 평가",
  "포렌식 원인분석 보고서",
  "법원감정용 전자적 증거 패키지",
  "보험 API / 보험 시뮬레이션",
  "기관용 대시보드 / SaaS",
  "포트폴리오 리스크 우선순위 분석",
];

const metrics = [
  { label: "운영 주체", value: "MAGOS + 한국기술사회" },
  { label: "핵심 흐름", value: "자가진단 → 검토 → 인증 → 포렌식 → 보험" },
  { label: "서비스 구조", value: "Data → Risk → Expert → Decision → Evidence" },
  { label: "출력 결과", value: "인증서 · 포렌식 · 전자증거 · 보험지원" },
];

function clampScore(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.min(100, Math.max(0, num));
}

function getGrade(score) {
  if (score < 25) return "A";
  if (score < 50) return "B";
  if (score < 75) return "C";
  return "D";
}

function getGradeLabel(grade) {
  switch (grade) {
    case "A":
      return "안정";
    case "B":
      return "관리 필요";
    case "C":
      return "위험";
    case "D":
      return "긴급 대응 필요";
    default:
      return "-";
  }
}

function getRiskMessage(grade) {
  switch (grade) {
    case "A":
      return "현재 수준에서는 기본 모니터링과 정기점검 중심으로 관리 가능합니다.";
    case "B":
      return "관리 필요 단계입니다. 점검주기 조정과 주요 부재 추가 확인이 권장됩니다.";
    case "C":
      return "위험 단계입니다. 전문가 검토와 보수·보강 우선순위 검토가 필요합니다.";
    case "D":
      return "긴급 대응 단계입니다. 즉시 전문가 개입과 사용 제한 여부 검토가 필요합니다.";
    default:
      return "";
  }
}

function App() {
  const [psi, setPsi] = useState(35);
  const [dri, setDri] = useState(45);
  const [bii, setBii] = useState(30);
  const [cli, setCli] = useState(25);
  const [kd, setKd] = useState(1.05);
  const [ki, setKi] = useState(1.1);
  const [inquiryText, setInquiryText] = useState("");

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const result = useMemo(() => {
    const safePsi = clampScore(psi);
    const safeDri = clampScore(dri);
    const safeBii = clampScore(bii);
    const safeCli = clampScore(cli);

    const mri =
      safePsi * 0.3 +
      safeDri * 0.3 +
      safeBii * 0.2 +
      safeCli * 0.2;

    const mriFinal = 100 - (100 - mri) / (Number(kd) * Number(ki));
    const finalScore = Math.max(0, Math.min(100, mriFinal));
    const grade = getGrade(finalScore);

    return {
      psi: safePsi,
      dri: safeDri,
      bii: safeBii,
      cli: safeCli,
      mri,
      mriFinal: finalScore,
      grade,
      gradeLabel: getGradeLabel(grade),
      message: getRiskMessage(grade),
    };
  }, [psi, dri, bii, cli, kd, ki]);

  const buildReportText = () => {
    return [
      "[MAGOS MRI Lite Demo 결과]",
      `PSI: ${result.psi}`,
      `DRI: ${result.dri}`,
      `BII: ${result.bii}`,
      `CLI: ${result.cli}`,
      `Kd: ${Number(kd).toFixed(2)}`,
      `Ki: ${Number(ki).toFixed(2)}`,
      `MRI: ${result.mri.toFixed(2)}`,
      `MRI_final: ${result.mriFinal.toFixed(2)}`,
      `등급: ${result.grade} · ${result.gradeLabel}`,
      `자동 해석: ${result.message}`,
    ].join("\n");
  };

  const sendResultToContact = () => {
    setInquiryText(buildReportText());
    scrollToSection("contact");
  };

  const resetCalculator = () => {
    setPsi(35);
    setDri(45);
    setBii(30);
    setCli(25);
    setKd(1.05);
    setKi(1.1);
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
              <span className="brand-sub">MAGOS × 한국기술사회</span>
              <strong>Structural Risk Operating Platform</strong>
            </div>
          </button>

          <nav className="nav">
            <button onClick={() => scrollToSection("home")}>Home</button>
            <button onClick={() => scrollToSection("services")}>Services</button>
            <button onClick={() => scrollToSection("demo")}>Demo</button>
            <button onClick={() => scrollToSection("contact")}>Contact</button>
          </nav>

          <button
            className="btn btn-outline"
            onClick={() => scrollToSection("contact")}
          >
            상담 요청
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="container hero-grid">
            <div className="hero-left">
              <div className="eyebrow">
                구조 리스크를 수치로 예지·통합관리하는 운영체계
              </div>

              <h1 className="hero-title">
                MAGOS와 한국기술사회가 함께 운영하는
                <span> 구조 리스크 인증·전문가 협업·포렌식 플랫폼</span>
              </h1>

              <p className="hero-desc">
                홈페이지 방문부터 무료 자가진단, 프로젝트 등록, 데이터 출처 태깅,
                기초 리스크 산정, 전문가 검토, Je 반영, 인증서 발급, 포렌식,
                보험 연계까지 실제 서비스 흐름에 맞춘 운영형 홈페이지입니다.
              </p>

              <div className="hero-actions">
                <button
                  className="btn btn-solid"
                  onClick={() => scrollToSection("demo")}
                >
                  무료 진단 시작
                </button>
                <button
                  className="btn btn-glass"
                  onClick={() => scrollToSection("workflow")}
                >
                  서비스 흐름 보기
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => scrollToSection("contact")}
                >
                  Contact 열기
                </button>
              </div>

              <div className="metric-grid">
                {metrics.map((item) => (
                  <div className="metric-card" key={item.label}>
                    <div className="metric-label">{item.label}</div>
                    <div className="metric-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-right">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-sub">Platform Overview</div>
                    <h2>6개 특허 통합 구조</h2>
                  </div>
                  <div className="panel-badge">Patent Portfolio</div>
                </div>

                <div className="layer-list">
                  {patentLayers.map((item) => (
                    <article className="layer-card" key={item.no}>
                      <div className="layer-no">{item.no}</div>
                      <div className="layer-body">
                        <div className="layer-eng">{item.eng}</div>
                        <h3>{item.title}</h3>
                        <div className="tag-list">
                          {item.items.map((tag) => (
                            <span className="tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section compact-section">
          <div className="container role-grid">
            <div className="role-card role-card-cyan">
              <div className="role-label">MAGOS의 역할</div>
              <h2>플랫폼 운영과 기술 엔진</h2>
              <div className="role-list">
                {magosRole.map((item) => (
                  <div className="role-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="role-card role-card-green">
              <div className="role-label">한국기술사회의 역할</div>
              <h2>전문가 풀과 절차 신뢰성</h2>
              <div className="role-list">
                {kpeRole.map((item) => (
                  <div className="role-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="section">
          <div className="container">
            <div className="section-head">
              <div className="section-label">Service Workflow</div>
              <h2>실제 서비스가 이루어지는 구조</h2>
              <p>
                아래 흐름은 홈페이지 방문부터 자가진단, 프로젝트 등록, 리스크 산정,
                전문가 검토, Je 반영, 인증·포렌식·보험 연계까지 이어지는 실제 운영 구조입니다.
              </p>
            </div>

            <div className="workflow-center-wrap">
              <div className="workflow-vertical">
                {serviceFlow.map((step, idx) => (
                  <div key={step} className="workflow-center-item">
                    <div className="workflow-center-box">
                      <span className="workflow-center-index">{idx + 1}</span>
                      <span>{step}</span>
                    </div>
                    {idx !== serviceFlow.length - 1 && (
                      <div className="workflow-arrow">↓</div>
                    )}
                  </div>
                ))}

                <div className="workflow-branch-row">
                  {serviceBranches.map((branch) => (
                    <div className="workflow-branch-box" key={branch.title}>
                      <h3>{branch.title}</h3>
                      <p>{branch.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="workflow-sub-row">
                  {subBranches.map((item) => (
                    <div className="workflow-sub-box" key={item}>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>

                <div className="workflow-last-box">
                  <strong>전자 증거 패키지 생성</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <div className="section-head section-head-row">
              <div>
                <div className="section-label">Services</div>
                <h2>무료 서비스와 유료 서비스 분리 구조</h2>
                <p>
                  무료 진입 → 정식 분석 전환 구조를 반영하여, 초기 관심 고객과 실제
                  B2B 고객이 자연스럽게 이어지도록 설계했습니다.
                </p>
              </div>

              <button
                className="btn btn-outline"
                onClick={() => scrollToSection("contact")}
              >
                상담 요청
              </button>
            </div>

            <div className="services-grid">
              <div className="service-panel">
                <div className="service-panel-label green">무료 서비스 4개</div>
                <div className="free-list">
                  {freeServices.map((item, idx) => (
                    <article className="free-card" key={item.title}>
                      <div className="free-head">
                        <div className="free-no">{idx + 1}</div>
                        <h3>{item.title}</h3>
                      </div>
                      <p>{item.desc}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="service-panel">
                <div className="service-panel-label cyan">유료 서비스 7개</div>
                <div className="paid-grid">
                  {paidServices.map((item, idx) => (
                    <article className="paid-card" key={item}>
                      <div className="paid-top">Premium {idx + 1}</div>
                      <h3>{item}</h3>
                    </article>
                  ))}
                </div>

                <div className="notice-box">
                  유료 서비스는 기술사 검토, 전문가 협업, 포렌식 분석, 전자 증거 검증,
                  보험 연계가 필요한 실제 의사결정 조직을 위한 구조입니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="section">
          <div className="container">
            <div className="section-head">
              <div className="section-label">Demo</div>
              <h2>MRI 기본 계산기 데모</h2>
              <p>
                아래 계산기를 통해 구조 리스크 Lite Demo를 직접 체험할 수 있습니다.
                결과는 리포트 카드 형태로 확인할 수 있고 문의 폼으로 바로 전달할 수 있습니다.
              </p>
            </div>

            <div className="calculator-wrap">
              <div className="calculator-panel">
                <div className="calculator-head">
                  <div>
                    <div className="panel-sub">MRI Lite Calculator</div>
                    <h3>MRI 기본 계산기</h3>
                  </div>
                  <div className="panel-badge">Input → Result</div>
                </div>

                <div className="calculator-grid">
                  <div className="calc-inputs">
                    <div className="calc-field">
                      <label>PSI (사고확률 기반 리스크)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={psi}
                        onChange={(e) => setPsi(e.target.value)}
                      />
                      <div className="calc-value">{psi}</div>
                    </div>

                    <div className="calc-field">
                      <label>DRI (열화·상태 리스크)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={dri}
                        onChange={(e) => setDri(e.target.value)}
                      />
                      <div className="calc-value">{dri}</div>
                    </div>

                    <div className="calc-field">
                      <label>BII (비용·운영 영향 리스크)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bii}
                        onChange={(e) => setBii(e.target.value)}
                      />
                      <div className="calc-value">{bii}</div>
                    </div>

                    <div className="calc-field">
                      <label>CLI (계약·책임 노출 리스크)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cli}
                        onChange={(e) => setCli(e.target.value)}
                      />
                      <div className="calc-value">{cli}</div>
                    </div>

                    <div className="calc-select-grid">
                      <div className="calc-field">
                        <label>Kd (데이터 신뢰도 보정계수)</label>
                        <select value={kd} onChange={(e) => setKd(e.target.value)}>
                          <option value="1.0">A 등급 데이터 · 1.00</option>
                          <option value="1.05">B 등급 데이터 · 1.05</option>
                          <option value="1.1">C 등급 데이터 · 1.10</option>
                          <option value="1.15">D 등급 데이터 · 1.15</option>
                        </select>
                      </div>

                      <div className="calc-field">
                        <label>Ki (구조 중요도 보정계수)</label>
                        <select value={ki} onChange={(e) => setKi(e.target.value)}>
                          <option value="1.0">일반 구조물 · 1.00</option>
                          <option value="1.05">중요 구조물 · 1.05</option>
                          <option value="1.1">핵심 구조물 · 1.10</option>
                          <option value="1.15">국가 주요 시설 · 1.15</option>
                        </select>
                      </div>
                    </div>

                    <div className="calc-note">
                      본 계산기는 개념형 Lite Demo입니다. 실제 정식 분석에서는
                      데이터 신뢰성 검증, 전문가 검토, Je 반영, 인증 절차가 추가됩니다.
                    </div>
                  </div>

                  <div className="calc-result">
                    <div className="result-box">
                      <div className="result-label">MRI</div>
                      <div className="result-value">{result.mri.toFixed(2)}</div>
                    </div>

                    <div className="result-box result-box-strong">
                      <div className="result-label">MRI_final</div>
                      <div className="result-value">{result.mriFinal.toFixed(2)}</div>
                    </div>

                    <div className="result-box">
                      <div className="result-label">등급</div>
                      <div className={`grade-badge grade-${result.grade.toLowerCase()}`}>
                        {result.grade} · {result.gradeLabel}
                      </div>
                    </div>

                    <div className="result-summary">
                      <h4>자동 해석</h4>
                      <p>{result.message}</p>
                    </div>

                    <div className="result-actions">
                      <button className="btn btn-solid" onClick={sendResultToContact}>
                        문의하기
                      </button>
                      <button
                        className="btn btn-glass"
                        type="button"
                        onClick={() => window.print()}
                      >
                        PDF 카드처럼 출력
                      </button>
                      <button className="btn btn-outline" onClick={resetCalculator}>
                        초기값으로 되돌리기
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-card-wrap">
                <div className="report-card">
                  <div className="report-card-head">
                    <div>
                      <div className="panel-sub">PDF Report Preview</div>
                      <h3>구조 리스크 결과 리포트 카드</h3>
                    </div>
                    <div className={`grade-badge grade-${result.grade.toLowerCase()}`}>
                      {result.grade} · {result.gradeLabel}
                    </div>
                  </div>

                  <div className="report-card-body">
                    <div className="report-main-score">
                      <div className="report-score-box">
                        <span>MRI</span>
                        <strong>{result.mri.toFixed(2)}</strong>
                      </div>
                      <div className="report-score-box report-score-box-strong">
                        <span>MRI_final</span>
                        <strong>{result.mriFinal.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className="report-detail-grid">
                      <div className="report-detail-item">
                        <span>PSI</span>
                        <strong>{result.psi}</strong>
                      </div>
                      <div className="report-detail-item">
                        <span>DRI</span>
                        <strong>{result.dri}</strong>
                      </div>
                      <div className="report-detail-item">
                        <span>BII</span>
                        <strong>{result.bii}</strong>
                      </div>
                      <div className="report-detail-item">
                        <span>CLI</span>
                        <strong>{result.cli}</strong>
                      </div>
                      <div className="report-detail-item">
                        <span>Kd</span>
                        <strong>{Number(kd).toFixed(2)}</strong>
                      </div>
                      <div className="report-detail-item">
                        <span>Ki</span>
                        <strong>{Number(ki).toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className="report-interpretation">
                      <h4>자동 해석</h4>
                      <p>{result.message}</p>
                    </div>

                    <div className="report-footer-note">
                      본 결과는 Lite Demo 기준의 개념형 진단 결과이며, 정식 인증 결과는
                      데이터 신뢰성 검증, 전문가 검토, Je 반영, 인증 절차를 포함하여
                      재산정됩니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-grid">
            <div className="contact-info">
              <div className="section-label">Contact</div>
              <h2>문의 접수 · 상담 예약 · 견적 요청</h2>
              <p>
                구조 리스크 인증, 전문가 배정, 사고 포렌식, 법원감정용 전자 증거
                패키지, 보험 연계 검토까지 필요한 범위를 선택해 문의할 수 있도록 설계했습니다.
              </p>

              <div className="contact-points">
                <div className="contact-point">
                  문의 접수: 프로젝트 개요와 구조물 유형 입력
                </div>
                <div className="contact-point">
                  상담 예약: 온라인 미팅 또는 방문 상담 일정 조율
                </div>
                <div className="contact-point">
                  견적 요청: 인증, 정밀평가, 포렌식, 전자증거 범위 제안
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <form className="contact-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>기관명 / 회사명</label>
                    <input type="text" placeholder="기관 또는 회사명을 입력하세요" />
                  </div>
                  <div className="form-group">
                    <label>담당자명</label>
                    <input type="text" placeholder="담당자명을 입력하세요" />
                  </div>
                  <div className="form-group">
                    <label>이메일</label>
                    <input type="email" placeholder="example@company.com" />
                  </div>
                  <div className="form-group">
                    <label>연락처</label>
                    <input type="text" placeholder="연락처를 입력하세요" />
                  </div>
                </div>

                <div className="form-group">
                  <label>문의 유형</label>
                  <div className="chip-group">
                    {[
                      "문의 접수",
                      "상담 예약",
                      "견적 요청",
                      "포렌식 분석",
                      "보험 연계",
                      "전자 증거 패키지",
                    ].map((chip) => (
                      <button type="button" className="chip" key={chip}>
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>프로젝트 내용</label>
                  <textarea
                    rows="6"
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder="구조물 유형, 현재 상황, 필요한 서비스 범위를 자유롭게 입력하세요"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-solid">
                    문의 보내기
                  </button>
                  <button type="button" className="btn btn-outline">
                    상담 예약 요청
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;