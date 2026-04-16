import React, { useMemo, useState } from "react";
import "./App.css";

const patents = [
  {
    no: "01",
    title: "데이터 신뢰성 및 절차 추적 인증",
    desc: "입력데이터의 출처, 변경 이력, 검증 상태와 기술사 판단 절차를 추적하여 인증 상태와 인증번호를 생성하는 기반 레이어입니다.",
    tags: ["Data Trust", "Procedure Trace", "Certification"],
  },
  {
    no: "02",
    title: "구조안전 리스크 인증 엔진",
    desc: "사고확률, 열화·상태, 비용·운영, 계약·책임 노출 리스크를 통합해 MRI와 판단등급을 산정하고 인증 결과로 연결합니다.",
    tags: ["MRI", "Risk Grade", "Certificate"],
  },
  {
    no: "03",
    title: "전문가 풀 기반 평가 플랫폼",
    desc: "총괄·분야별·보조 검토자 배정, 수행 이력, 신뢰도, 협업 검토 흐름을 포함하는 전문가 운영 플랫폼입니다.",
    tags: ["Expert Pool", "Assignment", "Collaboration"],
  },
  {
    no: "04",
    title: "전문가 판단 정량화 및 Je 보정",
    desc: "서술형 전문가 판단을 정량화 요소로 변환하고 역할 가중치와 확신도를 반영하여 최종 보정 리스크를 산정합니다.",
    tags: ["Je", "Quantification", "Rf"],
  },
  {
    no: "05",
    title: "사전평가 연계 건설포렌식",
    desc: "사고 전 리스크와 사고 후 손상 데이터를 비교하여 변화량, 원인기여도, 책임영향도를 구조적으로 분석합니다.",
    tags: ["Forensic", "Cause", "Responsibility"],
  },
  {
    no: "06",
    title: "전자적 증거 패키지",
    desc: "감정자료, 메타데이터, 증거 신뢰도, 판단-근거 매핑, 무결성 검증을 묶어 법원감정 제출형 전자 패키지로 만듭니다.",
    tags: ["Evidence Package", "Hash", "Judicial Appraisal"],
  },
  {
    no: "07",
    title: "보험 인수심사 및 의사결정 지원",
    desc: "구조 리스크와 보험 손해 데이터를 결합해 통합 리스크 지수를 만들고 보험료, 인수 여부, 조건부 승인 판단을 지원합니다.",
    tags: ["Insurance", "Underwriting", "Decision"],
  },
  {
    no: "08",
    title: "구조 리스크 기반 의사결정 운영체계",
    desc: "리스크 산정, 전문가 판단, 보험 의사결정, 포렌식, 증거 생성, 피드백 학습을 하나의 OS 구조로 통합한 상위 아키텍처입니다.",
    tags: ["Decision OS", "Control", "Closed Loop"],
  },
];

const services = [
  {
    title: "Structural Risk Assessment",
    desc: "MRI, MRI_final, Je, Rf를 기반으로 구조물 위험도를 정량화하고 기술사 검토와 연결합니다.",
  },
  {
    title: "Engineering Decision Support",
    desc: "사용 제한, 보수·보강, 점검주기, 유지관리 우선순위를 데이터 기반으로 도출합니다.",
  },
  {
    title: "Construction Forensic",
    desc: "사고 전후 비교와 원인기여도·책임영향도 분석으로 분쟁과 손해사정 대응력을 높입니다.",
  },
  {
    title: "Electronic Evidence Package",
    desc: "감정 판단과 근거자료를 연결하고 해시 기반 검증까지 포함하는 전자적 증거 구조를 제공합니다.",
  },
  {
    title: "Insurance Underwriting Support",
    desc: "구조 리스크와 보험 손해 데이터를 연동하여 인수심사와 조건 설정을 지원합니다.",
  },
  {
    title: "Platform / SaaS / API",
    desc: "기관 시스템 연계를 전제로 한 SaaS형 대시보드와 API 구조로 확장 가능합니다.",
  },
];

const audiences = [
  {
    title: "보험사 · 손해사정",
    body: "사전 구조 리스크와 사고 데이터를 연결하여 인수심사, 조건부 승인, 추가 조사 필요성 판단을 돕습니다.",
  },
  {
    title: "건설사 · 감리단 · 엔지니어링사",
    body: "설계·시공·유지관리 단계의 리스크와 책임영향도를 정리하여 비용 리스크와 분쟁 리스크를 낮춥니다.",
  },
  {
    title: "공공기관 · 시설물 관리자",
    body: "복수 구조물의 리스크 순위, 보수 우선순위, 점검주기 조정, 계약 연계 판단까지 지원합니다.",
  },
  {
    title: "법원감정 · 분쟁 대응",
    body: "원인기여도, 판단-근거 매핑, 무결성 검증 자료를 통해 설명 가능성과 증거 활용성을 강화합니다.",
  },
];

const metrics = [
  { label: "Patent Modules", value: "8" },
  { label: "Platform Direction", value: "Decision OS" },
  { label: "Core Outputs", value: "Risk · Forensic · Evidence" },
  { label: "Expansion", value: "SaaS · API · Dashboard" },
];

const navs = ["Home", "Platform", "Services", "Patents", "Contact"];

function SectionTitle({ kicker, title, desc }) {
  return (
    <div className="section-heading">
      <div className="section-kicker">{kicker}</div>
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("Home");
  const [selectedPatent, setSelectedPatent] = useState(null);

  const heroTags = useMemo(
    () => [
      "Structural Risk",
      "Engineering Decision",
      "Construction Forensic",
      "Electronic Evidence",
      "Insurance",
      "SaaS",
    ],
    []
  );

  return (
    <div className="app">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="grid-noise" />

      <header className="site-header">
        <div className="brand">
          <div className="brand-copy">
            <strong>MAGOS</strong>
            <span>Structural Risk &amp; Engineering Decision</span>
          </div>
        </div>

        <nav className="site-nav">
          {navs.map((item) => (
            <button
              key={item}
              className={`nav-link ${active === item ? "active" : ""}`}
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main className="page-shell">
        {active === "Home" && (
          <div className="section">
            <section className="hero">
              <div className="hero-main card">
                <div className="eyebrow">MAGOS STRUCTURAL RISK OS</div>

                <h1>
                  구조 리스크를
                  <br />
                  <span className="accent">의사결정과 실행</span>으로
                  <br />
                  연결하는 플랫폼
                </h1>

                <p className="hero-description">
                  MAGOS는 구조기술사의 공학적 판단, 리스크 인증, 건설포렌식,
                  전자적 증거 패키지, 보험 의사결정을 하나의 흐름으로 연결하는
                  AI 기반 구조안전 리스크 플랫폼입니다.
                </p>

                <div className="hero-keywords">
                  {heroTags.map((tag) => (
                    <span key={tag} className="hero-keyword">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="hero-actions">
                  <button className="btn btn-primary" onClick={() => setActive("Contact")}>
                    문의하기
                  </button>
                  <button className="btn btn-ghost" onClick={() => setActive("Patents")}>
                    특허 구조 보기
                  </button>
                </div>

                <div className="hero-stats">
                  {metrics.map((item) => (
                    <div key={item.label} className="stat-card">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flow-card card">
                <div className="flow-head">
                  <div className="chip">Platform Flow</div>
                  <p>
                    데이터 신뢰성에서 시작해 리스크, 전문가 판단, 포렌식,
                    전자적 증거, 피드백 학습까지 이어지는 MAGOS의 핵심 흐름입니다.
                  </p>
                </div>

                <div className="flow-list">
                  {[
                    "Data Trust & Input",
                    "MRI / MRI_final Calculation",
                    "Expert Judgment Quantification (Je)",
                    "Decision Engine & Insurance Link",
                    "Construction Forensic",
                    "Electronic Evidence Package",
                    "Feedback Learning Loop",
                  ].map((step, idx) => (
                    <div key={step} className="flow-row">
                      <div className="flow-index">{idx + 1}</div>
                      <div className="flow-box">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section">
              <SectionTitle
                kicker="Who it serves"
                title="보험, 건설, 공공, 법원감정까지 이어지는 구조"
                desc="MAGOS는 단순 홍보형 홈페이지가 아니라, 각 고객군이 왜 이 플랫폼을 써야 하는지 한눈에 이해하도록 설계되어야 합니다."
              />
              <div className="client-grid">
                {audiences.map((item) => (
                  <div key={item.title} className="client-card card">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {active === "Platform" && (
          <div className="section">
            <SectionTitle
              kicker="Platform Architecture"
              title="8개 특허를 하나의 운영체계로 보여주는 화면"
              desc="홈페이지에서는 특허를 나열하지 말고, 데이터에서 시작해 리스크, 전문가 판단, 포렌식, 증거, 피드백 학습으로 이어지는 단일 운영 흐름으로 보여주는 것이 가장 강합니다."
            />

            <div className="overview-grid">
              <div className="soft-card card">
                <h3>Input &amp; Trust Layer</h3>
                <p>
                  설계도서, 시공기록, 점검 결과, 계측데이터, 사고 데이터의
                  출처와 변경 이력을 검증하고 신뢰 가능한 입력으로 정리합니다.
                </p>
              </div>
              <div className="soft-card card">
                <h3>Risk &amp; Decision Layer</h3>
                <p>
                  MRI, MRI_final, Je, Rf를 계산하고 사용 제한, 보수·보강,
                  보험 인수조건, 유지관리 정책으로 연결합니다.
                </p>
              </div>
              <div className="soft-card card">
                <h3>Forensic &amp; Evidence Layer</h3>
                <p>
                  사고 전후 비교, 원인기여도, 책임영향도, 판단-근거 매핑,
                  전자적 증거 패키지, 피드백 학습까지 닫힌 루프로 묶습니다.
                </p>
              </div>
            </div>

            <div className="section">
              <div className="cta-banner card">
                <div>
                  <h2>Data Trust → Risk → Decision → Insurance → Forensic → Evidence</h2>
                  <p>
                    MAGOS는 개별 기능의 합이 아니라, 데이터 신뢰성부터
                    의사결정 실행, 사고 분석, 증거 생성, 학습 루프까지 이어지는
                    구조 리스크 운영체계입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {active === "Services" && (
          <div className="section">
            <SectionTitle
              kicker="Services"
              title="서비스는 기능보다 결과물이 먼저 보이게 구성했습니다"
              desc="서비스 카드, 고객군 카드, 핵심 결과물 카드를 분리하면 방문자가 이해하기 쉽고 문의 전환도 훨씬 좋아집니다."
            />

            <div className="overview-grid">
              {services.map((item) => (
                <div key={item.title} className="soft-card card">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="section services-panel-grid">
              <div className="service-column card">
                <h3>핵심 산출물</h3>
                <div className="bullet-tags">
                  {[
                    "리스크 진단서 / 인증서",
                    "보험 인수심사 참고자료",
                    "보수·보강 우선순위 보고서",
                    "포렌식 원인분석 보고서",
                    "전자적 증거 패키지",
                  ].map((item) => (
                    <span key={item} className="bullet-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="service-column card">
                <h3>법적 안내 문구</h3>
                <p>
                  본 서비스는 구조기술사의 전문적 공학 분석 및 기술자료 제공 서비스이며,
                  법률상담, 소송대리, 합의대행 등 법률사무를 수행하지 않습니다.
                  법률적 판단이 필요한 경우에는 별도의 법률 전문가와 협업하여 진행됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {active === "Patents" && (
          <div className="section">
            <SectionTitle
              kicker="Patent Portfolio"
              title="특허는 목록이 아니라 계층 구조로 보여야 강합니다"
              desc="각 특허를 카테고리와 결과물 중심으로 정리하고, 클릭 시 상세 내용을 보는 방식이 홈페이지에서 가장 설득력이 좋습니다."
            />

            <div className="patent-grid patent-grid-4">
              {patents.map((item) => (
                <button
                  key={item.no}
                  className="patent-card card"
                  onClick={() => setSelectedPatent(item)}
                  style={{ textAlign: "left" }}
                >
                  <div className="patent-top">
                    <div className="patent-no">{item.no}</div>
                    <div className="patent-title-wrap">
                      <span>PATENT MODULE</span>
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                  <p className="patent-desc">{item.desc}</p>
                  <div className="bullet-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="bullet-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {active === "Contact" && (
          <div className="section">
            <SectionTitle
              kicker="Contact"
              title="문의 전환율이 높게 설계된 프리미엄 컨택트 섹션"
              desc="문의 폼은 길게 설명하는 방식보다, 고객 유형과 필요 결과물을 빠르게 적을 수 있게 설계하는 편이 더 좋습니다."
            />

            <div className="contact-grid">
              <div className="info-panel">
                <div className="section-kicker">MAGOS CONTACT</div>
                <h3>빠른 문의</h3>
                <p className="contact-note">
                  구조안전 리스크 검토, 포렌식 분석, 전자적 증거 패키지,
                  보험 인수심사 보조자료, 기관용 플랫폼 구축 문의를 접수합니다.
                </p>

                <div className="contact-note">
                  <p><strong>Admin</strong><br />ceo@magos.ai.kr</p>
                  <p><strong>Official Website</strong><br />magos.ai.kr</p>
                  <p><strong>Main Domain</strong><br />magos.co.kr</p>
                </div>

                <div className="contact-note">
                  <p>
                    대표: 김황준 (공학박사, 토목구조기술사)
                    <br />
                    MAGOS Structure Engineering Lab / MAGOS Co., Ltd.
                  </p>
                </div>
              </div>

              <div className="contact-panel">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">이름</label>
                    <input className="form-input" placeholder="성함 또는 회사명" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">이메일</label>
                    <input className="form-input" placeholder="example@company.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">고객 유형</label>
                    <input className="form-input" placeholder="보험사 / 건설사 / 공공기관 / 법원감정 등" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">필요 서비스</label>
                    <input className="form-input" placeholder="리스크 인증 / 포렌식 / 증거 패키지" />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">문의 내용</label>
                    <textarea
                      className="form-textarea"
                      placeholder="구조물 유형, 현재 상황, 원하는 결과물을 간단히 적어주세요."
                    />
                  </div>
                </div>

                <div className="hero-actions" style={{ marginTop: 24 }}>
                  <button className="btn btn-primary">문의 접수</button>
                  <button className="btn btn-ghost">소개자료 요청</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="section">
          <div className="cta-banner card">
            <div>
              <div className="section-kicker">Premium CTA</div>
              <h2>홈페이지는 이제 ‘회사 소개’가 아니라 ‘시장 구조 설명서’여야 합니다</h2>
              <p>
                이 버전은 MAGOS를 단순 구조기술사 사무소가 아니라
                데이터·판단·포렌식·증거·보험을 잇는 플랫폼 회사로 보이게 만듭니다.
              </p>
            </div>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={() => setActive("Contact")}>
                프로젝트 문의
              </button>
              <button className="btn btn-ghost" onClick={() => setActive("Platform")}>
                플랫폼 보기
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-office">
            <strong>MAGOS</strong>
            <span>마고스 유한회사 · 마고스 구조기술사사무소</span>

            <div className="footer-section-title">PLATFORM COMPANY</div>
            <p>마고스 유한회사 (MAGOS Co., Ltd.)</p>
            <p>AI 기반 구조안전 리스크 플랫폼 · 데이터 · SaaS</p>

            <div className="footer-divider" />

            <div className="footer-section-title">ENGINEERING OFFICE</div>
            <p>마고스 구조기술사사무소 (MAGOS Structure Engineering Lab)</p>
            <p>대표: 김황준 (공학박사, 토목구조기술사)</p>

            <div className="footer-divider" />

            <div className="footer-section-title">STRUCTURAL RISK & ENGINEERING DECISION</div>
            <p>구조안전 리스크 평가 · 구조기술사 검토 · 리스크 인증 · 건설포렌식 · 전자적 증거 자료</p>
            <p>Admin: ceo@magos.ai.kr</p>
            <p>Official Website: magos.ai.kr</p>
            <p>Main Domain: magos.co.kr</p>
            <p>© 2026 MAGOS. All rights reserved.</p>
          </div>

          <div className="footer-nav">
            {navs.map((item) => (
              <button key={item} onClick={() => setActive(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {selectedPatent && (
        <div className="overlay" onClick={() => setSelectedPatent(null)}>
          <div className="overlay-panel" onClick={(e) => e.stopPropagation()}>
            <div className="overlay-header">
              <div>
                <div className="overlay-kicker">PATENT {selectedPatent.no}</div>
                <h3>{selectedPatent.title}</h3>
              </div>
              <button className="overlay-close" onClick={() => setSelectedPatent(null)}>
                ×
              </button>
            </div>

            <div className="overlay-body">
              <p className="hero-description" style={{ maxWidth: "100%" }}>
                {selectedPatent.desc}
              </p>
              <div className="bullet-tags">
                {selectedPatent.tags.map((tag) => (
                  <span key={tag} className="bullet-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}