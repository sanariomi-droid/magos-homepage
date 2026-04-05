import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

const BRAND = {
  name: "MAGOS",
  subtitle: "MAGOS STRUCTURE ENGINEERING LAB",
  headline: "Structural Risk & Engineering Decision",
  description:
    "MAGOS는 구조기술사의 공학적 판단을 데이터와 리스크 정량화로 연결하여, 구조안전 검토·의사결정·인증서 발행까지 이어지는 실무형 플랫폼을 지향합니다.",
};

const SERVICES = [
  {
    title: "보험 인수심사 지원",
    desc: "구조 리스크를 정량화하여 보험 인수심사와 위험도 평가의 객관성을 높입니다.",
  },
  {
    title: "구조 검토 지원",
    desc: "설계안, 시공안, 가설구조, 유지관리 안건의 리스크를 수치와 등급으로 제시합니다.",
  },
  {
    title: "유지관리 평가",
    desc: "노후화, 열화, 운영 영향 요소를 반영하여 유지관리 우선순위 판단에 활용합니다.",
  },
  {
    title: "법원 감정 · 포렌식",
    desc: "기술사 판단 근거와 리스크 기록을 정리하여 분쟁·감정 대응 자료로 연결합니다.",
  },
  {
    title: "기술사 판단 기록",
    desc: "전문가 의견과 보정 구조를 문서화하여 공학적 판단의 추적성과 설명가능성을 높입니다.",
  },
  {
    title: "PDF 인증서 발행",
    desc: "평가 결과를 제출용 문서로 정리하여 실무 제출, 내부 보고, 상담 자료로 활용합니다.",
  },
];

const DEFAULT_EXPERTS = [
  {
    name: "전문가 1",
    role: "lead",
    judgementType: "conditional",
    confidence: 1.0,
    damping: 1.0,
  },
  {
    name: "전문가 2",
    role: "field",
    judgementType: "investigate",
    confidence: 1.0,
    damping: 1.0,
  },
  {
    name: "전문가 3",
    role: "assistant",
    judgementType: "normal",
    confidence: 0.9,
    damping: 1.0,
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getGrade(score) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "E";
}

function getGradeLabel(grade) {
  switch (grade) {
    case "A":
      return "안정";
    case "B":
      return "관찰";
    case "C":
      return "주의";
    case "D":
      return "경고";
    default:
      return "위험";
  }
}

function getGradeColor(grade) {
  switch (grade) {
    case "A":
      return "#67d17a";
    case "B":
      return "#9fc66b";
    case "C":
      return "#f0c35f";
    case "D":
      return "#ff9d57";
    default:
      return "#ff6b6b";
  }
}

function getJudgementMeta(type) {
  switch (type) {
    case "critical":
      return { label: "즉시 조치", weight: 12 };
    case "conditional":
      return { label: "조건부 보정", weight: 7 };
    case "investigate":
      return { label: "추가조사 권고", weight: 4 };
    case "normal":
    default:
      return { label: "일반 판단", weight: 0 };
  }
}

function calculateBaseMRI(calc) {
  const wP = Number(calc.wP);
  const wD = Number(calc.wD);
  const wB = Number(calc.wB);
  const wC = Number(calc.wC);

  const totalWeight = wP + wD + wB + wC || 1;

  const psi = clamp(Number(calc.psi), 0, 100);
  const dri = clamp(Number(calc.dri), 0, 100);
  const bii = clamp(Number(calc.bii), 0, 100);
  const cli = clamp(Number(calc.cli), 0, 100);

  return (psi * wP + dri * wD + bii * wB + cli * wC) / totalWeight;
}

function calculateExpertAdjustment(experts) {
  const logs = [];
  let score = 0;

  experts.forEach((expert) => {
    const meta = getJudgementMeta(expert.judgementType);
    const confidence = clamp(Number(expert.confidence || 0), 0, 1.2);
    const damping = clamp(Number(expert.damping || 0), 0, 1.2);

    const contribution = meta.weight * confidence * damping;
    score += contribution;

    logs.push({
      name: expert.name,
      role: expert.role,
      typeLabel: meta.label,
      contribution,
    });
  });

  return {
    adjustmentScore: score,
    logs,
  };
}

function calculateFinalMRI(base, adjustment, calc) {
  const kd = clamp(Number(calc.kd), 1.0, 1.2);
  const ki = clamp(Number(calc.ki), 1.0, 1.15);
  const correctionMode = calc.correctionMode;

  let correctedByExpert = base;
  if (correctionMode === "add") {
    correctedByExpert = clamp(base + adjustment.adjustmentScore, 0, 100);
  } else if (correctionMode === "blend") {
    correctedByExpert = clamp(base + adjustment.adjustmentScore * 0.6, 0, 100);
  }

  const finalScore = 100 - (100 - correctedByExpert) / (kd * ki);
  return clamp(finalScore, 0, 100);
}

function buildSummary({ projectName, finalRisk, finalGrade, calc, expertResult }) {
  const gradeLabel = getGradeLabel(finalGrade);

  const topExpertLog = [...expertResult.logs].sort(
    (a, b) => b.contribution - a.contribution
  )[0];

  const expertText = topExpertLog
    ? `${topExpertLog.name}(${topExpertLog.role})의 '${topExpertLog.typeLabel}' 판단이 보정에 가장 크게 반영되었습니다.`
    : "전문가 판단 보정은 반영되지 않았습니다.";

  return `${projectName || "대상 구조물"}에 대한 예비 구조 리스크 평가 결과, 최종 MRI는 ${finalRisk.toFixed(
    1
  )}점으로 ${finalGrade}등급(${gradeLabel}) 수준으로 판단됩니다. 입력 지표는 PSI ${Number(
    calc.psi
  ).toFixed(1)}, DRI ${Number(calc.dri).toFixed(1)}, BII ${Number(
    calc.bii
  ).toFixed(1)}, CLI ${Number(calc.cli).toFixed(
    1
  )}이며, 데이터 신뢰도 보정계수 Kd ${Number(calc.kd).toFixed(
    2
  )} 및 구조 중요도 계수 Ki ${Number(calc.ki).toFixed(
    2
  )}가 적용되었습니다. ${expertText} 본 결과는 기술사 검토를 보조하는 예비 평가 결과이며, 대외 제출 시에는 근거자료와 기술사 책임 구조를 함께 검토하는 것이 바람직합니다.`;
}

export default function App() {
  const [calc, setCalc] = useState({
    psi: 62,
    dri: 58,
    bii: 54,
    cli: 61,
    wP: 0.35,
    wD: 0.3,
    wB: 0.2,
    wC: 0.15,
    kd: 1.08,
    ki: 1.05,
    correctionMode: "blend",
  });

  const [projectName, setProjectName] = useState("MAGOS Demo Project");
  const [experts, setExperts] = useState(DEFAULT_EXPERTS);

  const [contact, setContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    project: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [mailStatus, setMailStatus] = useState("");

  const baseResult = useMemo(() => calculateBaseMRI(calc), [calc]);
  const expertResult = useMemo(() => calculateExpertAdjustment(experts), [experts]);
  const finalRisk = useMemo(
    () => calculateFinalMRI(baseResult, expertResult, calc),
    [baseResult, expertResult, calc]
  );
  const finalGrade = useMemo(() => getGrade(finalRisk), [finalRisk]);

  const summaryText = useMemo(
    () =>
      buildSummary({
        projectName,
        finalRisk,
        finalGrade,
        calc,
        expertResult,
      }),
    [projectName, finalRisk, finalGrade, calc, expertResult]
  );

  const updateCalc = (key, value) => {
    setCalc((prev) => ({ ...prev, [key]: value }));
  };

  const updateExpert = (index, key, value) => {
    setExperts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setMailStatus("");

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const toEmail =
      import.meta.env.VITE_CONTACT_TO_EMAIL || "ceo@magos.ai.kr";

    if (!serviceId || !templateId || !publicKey) {
      setMailStatus(
        "환경변수 설정이 누락되었습니다. .env 파일의 VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY를 확인해 주세요."
      );
      return;
    }

    if (!contact.name || !contact.email || !contact.message) {
      setMailStatus("이름, 이메일, 문의 내용은 필수입니다.");
      return;
    }

    setSending(true);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: contact.name,
          company: contact.company || "-",
          reply_to: contact.email,
          phone: contact.phone || "-",
          project_name: contact.project || projectName || "-",
          message: contact.message,
          to_email: toEmail,
          mri_score: finalRisk.toFixed(1),
          mri_grade: `${finalGrade} / ${getGradeLabel(finalGrade)}`,
          summary_text: summaryText,
        },
        {
          publicKey,
        }
      );

      setMailStatus(
        `문의가 정상 접수되었습니다. ${toEmail} 로 전송되었습니다.`
      );

      setContact({
        name: "",
        company: "",
        email: "",
        phone: "",
        project: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS send error:", error);
      setMailStatus(
        "메일 전송에 실패했습니다. Service ID, Template ID, Public Key, 템플릿 변수명을 다시 확인해 주세요."
      );
    } finally {
      setSending(false);
    }
  };

  const gradeColor = getGradeColor(finalGrade);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoWrap} onClick={() => scrollToSection("home")}>
          <div style={styles.logoBox}>△</div>
          <div style={styles.logoText}>{BRAND.name}</div>
        </div>

        <nav style={styles.nav}>
          <button style={styles.navBtnPrimary} onClick={() => scrollToSection("home")}>
            Home
          </button>
          <button style={styles.navBtn} onClick={() => scrollToSection("services")}>
            Services
          </button>
          <button style={styles.navBtn} onClick={() => scrollToSection("demo")}>
            Demo
          </button>
          <button style={styles.navBtn} onClick={() => scrollToSection("about")}>
            About
          </button>
          <button style={styles.navBtn} onClick={() => scrollToSection("contact")}>
            Contact
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        <section id="home" style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <div style={styles.kicker}>{BRAND.subtitle}</div>
            <h1 style={styles.heroTitle}>{BRAND.headline}</h1>
            <p style={styles.heroDesc}>{BRAND.description}</p>

            <div style={styles.heroButtonRow}>
              <button style={styles.ctaGreen} onClick={() => scrollToSection("demo")}>
                데모 보기
              </button>
              <button style={styles.ctaBlue} onClick={() => scrollToSection("services")}>
                서비스 보기
              </button>
            </div>

            <div style={styles.heroMiniInfo}>
              <div style={styles.heroMiniCard}>
                <div style={styles.heroMiniLabel}>핵심 기능</div>
                <div style={styles.heroMiniTitle}>MRI 기반 구조 리스크 정량평가</div>
                <div style={styles.heroMiniText}>
                  PSI, DRI, BII, CLI 기반 MRI 산정과 보정계수 적용을 통해 구조
                  리스크를 수치와 등급으로 제시합니다.
                </div>
              </div>

              <div style={styles.heroMiniCard}>
                <div style={styles.heroMiniLabel}>활용 분야</div>
                <div style={styles.heroMiniText}>
                  보험 인수심사 / 구조 검토 / 유지관리 / 법원 감정 / 건설 포렌식 /
                  공학 판단 기록
                </div>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.scoreCard}>
              <div style={styles.scoreHead}>
                <div>
                  <div style={styles.cardLabel}>LIVE PREVIEW</div>
                  <div style={styles.cardTitle}>MAGOS MRI Preview</div>
                </div>
                <div
                  style={{
                    ...styles.gradeBadge,
                    background: gradeColor,
                    color: "#06133a",
                  }}
                >
                  {finalGrade}
                </div>
              </div>

              <div style={styles.bigScore}>{finalRisk.toFixed(1)}</div>
              <div style={styles.bigScoreLabel}>
                최종 MRI / {getGradeLabel(finalGrade)}
              </div>

              <div style={styles.metricGrid}>
                <div style={styles.metricBox}>
                  <span style={styles.metricName}>Base MRI</span>
                  <strong>{baseResult.toFixed(1)}</strong>
                </div>
                <div style={styles.metricBox}>
                  <span style={styles.metricName}>Expert Adj.</span>
                  <strong>{expertResult.adjustmentScore.toFixed(1)}</strong>
                </div>
                <div style={styles.metricBox}>
                  <span style={styles.metricName}>Kd</span>
                  <strong>{Number(calc.kd).toFixed(2)}</strong>
                </div>
                <div style={styles.metricBox}>
                  <span style={styles.metricName}>Ki</span>
                  <strong>{Number(calc.ki).toFixed(2)}</strong>
                </div>
              </div>

              <div style={styles.previewText}>{summaryText}</div>
            </div>
          </div>
        </section>

        <section id="services" style={styles.section}>
          <h2 style={styles.sectionTitle}>왜 MAGOS인가</h2>
          <p style={styles.sectionDesc}>
            경험 중심 판단에 의존하던 구조 검토를, 정량화된 리스크 점수와 문서화된
            인증 구조로 연결합니다.
          </p>

          <div style={styles.cardGrid}>
            {SERVICES.map((item) => (
              <div key={item.title} style={styles.infoCard}>
                <div style={styles.infoCardTitle}>{item.title}</div>
                <div style={styles.infoCardDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="demo" style={styles.section}>
          <h2 style={styles.sectionTitle}>MRI Demo</h2>
          <p style={styles.sectionDesc}>
            입력 → 계산 → 전문가 판단 보정 → 결과 요약 → 인쇄/PDF 저장까지 한 번에
            확인할 수 있습니다.
          </p>

          <div style={styles.demoGrid}>
            <div style={styles.panel}>
              <div style={styles.panelTitle}>입력 정보</div>

              <label style={styles.label}>프로젝트명</label>
              <input
                style={styles.input}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="예: 교량 상부구조 예비평가"
              />

              <div style={styles.twoCol}>
                <div>
                  <label style={styles.label}>PSI</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    max="100"
                    value={calc.psi}
                    onChange={(e) => updateCalc("psi", e.target.value)}
                  />
                </div>
                <div>
                  <label style={styles.label}>DRI</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    max="100"
                    value={calc.dri}
                    onChange={(e) => updateCalc("dri", e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.twoCol}>
                <div>
                  <label style={styles.label}>BII</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    max="100"
                    value={calc.bii}
                    onChange={(e) => updateCalc("bii", e.target.value)}
                  />
                </div>
                <div>
                  <label style={styles.label}>CLI</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    max="100"
                    value={calc.cli}
                    onChange={(e) => updateCalc("cli", e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.subSectionTitle}>가중치 설정</div>
              <div style={styles.twoCol}>
                <div>
                  <label style={styles.label}>wP</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    value={calc.wP}
                    onChange={(e) => updateCalc("wP", e.target.value)}
                  />
                </div>
                <div>
                  <label style={styles.label}>wD</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    value={calc.wD}
                    onChange={(e) => updateCalc("wD", e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.twoCol}>
                <div>
                  <label style={styles.label}>wB</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    value={calc.wB}
                    onChange={(e) => updateCalc("wB", e.target.value)}
                  />
                </div>
                <div>
                  <label style={styles.label}>wC</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    value={calc.wC}
                    onChange={(e) => updateCalc("wC", e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.subSectionTitle}>보정계수</div>
              <div style={styles.twoCol}>
                <div>
                  <label style={styles.label}>Kd (데이터 신뢰도)</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    min="1"
                    max="1.2"
                    value={calc.kd}
                    onChange={(e) => updateCalc("kd", e.target.value)}
                  />
                </div>
                <div>
                  <label style={styles.label}>Ki (구조 중요도)</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    min="1"
                    max="1.15"
                    value={calc.ki}
                    onChange={(e) => updateCalc("ki", e.target.value)}
                  />
                </div>
              </div>

              <label style={styles.label}>전문가 보정 방식</label>
              <select
                style={styles.select}
                value={calc.correctionMode}
                onChange={(e) => updateCalc("correctionMode", e.target.value)}
              >
                <option value="blend">Blend (권장)</option>
                <option value="add">Add</option>
                <option value="none">None</option>
              </select>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelTitle}>전문가 판단 보정</div>

              {experts.map((expert, index) => (
                <div key={index} style={styles.expertCard}>
                  <div style={styles.expertHeader}>{expert.name}</div>

                  <div style={styles.twoCol}>
                    <div>
                      <label style={styles.label}>역할</label>
                      <select
                        style={styles.select}
                        value={expert.role}
                        onChange={(e) => updateExpert(index, "role", e.target.value)}
                      >
                        <option value="lead">lead</option>
                        <option value="field">field</option>
                        <option value="assistant">assistant</option>
                      </select>
                    </div>

                    <div>
                      <label style={styles.label}>판단유형</label>
                      <select
                        style={styles.select}
                        value={expert.judgementType}
                        onChange={(e) =>
                          updateExpert(index, "judgementType", e.target.value)
                        }
                      >
                        <option value="normal">normal</option>
                        <option value="investigate">investigate</option>
                        <option value="conditional">conditional</option>
                        <option value="critical">critical</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.twoCol}>
                    <div>
                      <label style={styles.label}>confidence</label>
                      <input
                        style={styles.input}
                        type="number"
                        step="0.1"
                        value={expert.confidence}
                        onChange={(e) =>
                          updateExpert(index, "confidence", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label style={styles.label}>damping</label>
                      <input
                        style={styles.input}
                        type="number"
                        step="0.1"
                        value={expert.damping}
                        onChange={(e) =>
                          updateExpert(index, "damping", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.resultWrap}>
            <div style={styles.resultLeft}>
              <div style={styles.resultCard}>
                <div style={styles.resultHeader}>
                  <div>
                    <div style={styles.cardLabel}>EVALUATION RESULT</div>
                    <div style={styles.cardTitle}>{projectName || "Unnamed Project"}</div>
                  </div>
                  <div
                    style={{
                      ...styles.resultGrade,
                      background: gradeColor,
                      color: "#06133a",
                    }}
                  >
                    {finalGrade} / {getGradeLabel(finalGrade)}
                  </div>
                </div>

                <div style={styles.resultScore}>{finalRisk.toFixed(1)}</div>
                <div style={styles.resultScoreSub}>최종 MRI 점수</div>

                <div style={styles.resultMetrics}>
                  <div style={styles.resultMetricItem}>
                    <span>Base MRI</span>
                    <strong>{baseResult.toFixed(1)}</strong>
                  </div>
                  <div style={styles.resultMetricItem}>
                    <span>Expert Adjustment</span>
                    <strong>{expertResult.adjustmentScore.toFixed(1)}</strong>
                  </div>
                  <div style={styles.resultMetricItem}>
                    <span>Kd × Ki</span>
                    <strong>
                      {(Number(calc.kd) * Number(calc.ki)).toFixed(3)}
                    </strong>
                  </div>
                </div>

                <div style={styles.summaryBox}>
                  <div style={styles.summaryTitle}>자동 요약</div>
                  <div style={styles.summaryText}>{summaryText}</div>
                </div>

                <div style={styles.buttonRow}>
                  <button style={styles.ctaBlue} onClick={handlePrint}>
                    인쇄 / PDF 저장
                  </button>
                  <button style={styles.ctaGreen} onClick={() => scrollToSection("contact")}>
                    상담 문의
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.resultRight}>
              <div style={styles.sideCard}>
                <div style={styles.sideCardTitle}>전문가 판단 로그</div>
                {expertResult.logs.map((log, idx) => (
                  <div key={idx} style={styles.logItem}>
                    <div style={styles.logTitle}>
                      {log.name} / {log.role}
                    </div>
                    <div style={styles.logText}>
                      {log.typeLabel} · 보정기여 {log.contribution.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.sideCard}>
                <div style={styles.sideCardTitle}>실무 활용 포인트</div>
                <ul style={styles.bulletList}>
                  <li>초기 구조안전 검토 자료</li>
                  <li>보험 인수심사 보조자료</li>
                  <li>유지관리 우선순위 판단</li>
                  <li>기술사 판단 기록 초안</li>
                  <li>법원 감정/포렌식 설명자료</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="about" style={styles.section}>
          <h2 style={styles.sectionTitle}>About MAGOS</h2>
          <p style={styles.sectionDesc}>
            MAGOS는 구조 리스크를 수치화하고, 기술사 판단을 문서화하며, 최종적으로
            의사결정과 인증 구조로 연결하는 실무형 엔지니어링 플랫폼을 목표로 합니다.
          </p>

          <div style={styles.aboutGrid}>
            <div style={styles.aboutCard}>
              <div style={styles.aboutTitle}>정량화</div>
              <div style={styles.aboutText}>
                구조 리스크를 점수와 등급으로 제시하여 의사결정의 객관성을 높입니다.
              </div>
            </div>
            <div style={styles.aboutCard}>
              <div style={styles.aboutTitle}>기술사 판단</div>
              <div style={styles.aboutText}>
                구조기술사의 검토 경험과 공학 판단을 문서화 가능한 형태로 정리합니다.
              </div>
            </div>
            <div style={styles.aboutCard}>
              <div style={styles.aboutTitle}>인증서 발행</div>
              <div style={styles.aboutText}>
                PDF 인증서 형태로 결과를 정리하여 실무 제출 문서로 활용할 수 있습니다.
              </div>
            </div>
          </div>
        </section>

        <section id="contact" style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact</h2>
          <p style={styles.sectionDesc}>
            프로젝트 개요를 남겨주시면 MAGOS가 적용 가능성과 예상 산출물 범위를
            검토해드립니다.
          </p>

          <div style={styles.contactWrap}>
            <form style={styles.contactForm} onSubmit={handleContactSubmit}>
              <div style={styles.twoCol}>
                <div>
                  <label style={styles.label}>이름 *</label>
                  <input
                    style={styles.input}
                    value={contact.name}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label style={styles.label}>회사명</label>
                  <input
                    style={styles.input}
                    value={contact.company}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, company: e.target.value }))
                    }
                    placeholder="MAGOS / 발주처 / 보험사"
                  />
                </div>
              </div>

              <div style={styles.twoCol}>
                <div>
                  <label style={styles.label}>이메일 *</label>
                  <input
                    style={styles.input}
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label style={styles.label}>연락처</label>
                  <input
                    style={styles.input}
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <label style={styles.label}>프로젝트명</label>
              <input
                style={styles.input}
                value={contact.project}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, project: e.target.value }))
                }
                placeholder="예: 교량 보수보강 사전 검토"
              />

              <label style={styles.label}>문의 내용 *</label>
              <textarea
                style={styles.textarea}
                rows={6}
                value={contact.message}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="검토 대상, 필요 산출물, 일정 등을 입력해 주세요."
              />

              <div style={styles.buttonRow}>
                <button type="submit" style={styles.ctaBlue} disabled={sending}>
                  {sending ? "전송 중..." : "문의 접수"}
                </button>
              </div>

              {mailStatus ? <div style={styles.statusBox}>{mailStatus}</div> : null}
            </form>

            <div style={styles.contactSide}>
              <div style={styles.sideCard}>
                <div style={styles.sideCardTitle}>제공 가능 산출물</div>
                <ul style={styles.bulletList}>
                  <li>MRI 예비 평가표</li>
                  <li>구조 리스크 요약 보고서</li>
                  <li>기술사 판단 기록 초안</li>
                  <li>PDF 인증서</li>
                  <li>보험/법원/유지관리용 설명자료</li>
                </ul>
              </div>

              <div style={styles.sideCard}>
                <div style={styles.sideCardTitle}>현재 문의 수신 주소</div>
                <div style={styles.aboutText}>
                  {import.meta.env.VITE_CONTACT_TO_EMAIL || "ceo@magos.ai.kr"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #02113f 0%, #01103a 45%, #020c2d 100%)",
    color: "#f5f7ff",
    fontFamily:
      '"Pretendard","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif',
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 22px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(2, 10, 45, 0.92)",
    backdropFilter: "blur(10px)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#ffffff",
    color: "#02113f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 18,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: -0.5,
  },
  nav: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  navBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
  },
  navBtnPrimary: {
    background: "#3f6fda",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
  },
  main: {
    maxWidth: 1220,
    margin: "0 auto",
    padding: "34px 22px 80px",
  },
  heroSection: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 26,
    alignItems: "stretch",
  },
  heroLeft: {
    background: "rgba(17, 34, 103, 0.88)",
    borderRadius: 28,
    padding: 36,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
  },
  kicker: {
    fontSize: 14,
    fontWeight: 800,
    color: "#c9d5ff",
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 68,
    lineHeight: 1.02,
    margin: "0 0 24px",
    letterSpacing: -2.2,
    fontWeight: 900,
  },
  heroDesc: {
    fontSize: 17,
    lineHeight: 1.8,
    color: "#e5ebff",
    marginBottom: 28,
    maxWidth: 760,
  },
  heroButtonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 28,
  },
  ctaGreen: {
    background: "#8bcf69",
    color: "#08204e",
    border: "none",
    padding: "16px 24px",
    borderRadius: 14,
    fontWeight: 800,
    fontSize: 18,
    cursor: "pointer",
  },
  ctaBlue: {
    background: "#7ea9f2",
    color: "#08204e",
    border: "none",
    padding: "16px 24px",
    borderRadius: 14,
    fontWeight: 800,
    fontSize: 18,
    cursor: "pointer",
  },
  heroMiniInfo: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
  },
  heroMiniCard: {
    background: "rgba(18, 31, 100, 0.9)",
    borderRadius: 22,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  heroMiniLabel: {
    fontSize: 14,
    color: "#bfd0ff",
    marginBottom: 10,
    fontWeight: 700,
  },
  heroMiniTitle: {
    fontSize: 21,
    fontWeight: 800,
    marginBottom: 12,
  },
  heroMiniText: {
    fontSize: 16,
    lineHeight: 1.75,
    color: "#e6ecff",
  },
  heroRight: {
    display: "flex",
  },
  scoreCard: {
    width: "100%",
    background: "rgba(18, 31, 100, 0.9)",
    borderRadius: 28,
    padding: 28,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
  },
  scoreHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  cardLabel: {
    fontSize: 12,
    color: "#b8c8ff",
    fontWeight: 800,
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginTop: 6,
  },
  gradeBadge: {
    minWidth: 58,
    height: 58,
    borderRadius: 16,
    fontWeight: 900,
    fontSize: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bigScore: {
    fontSize: 72,
    fontWeight: 900,
    lineHeight: 1,
    marginTop: 8,
  },
  bigScoreLabel: {
    marginTop: 10,
    fontSize: 18,
    color: "#d7e2ff",
    marginBottom: 22,
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20,
  },
  metricBox: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  metricName: {
    color: "#bcd0ff",
    fontSize: 13,
  },
  previewText: {
    fontSize: 15,
    lineHeight: 1.75,
    color: "#edf2ff",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 18,
  },
  section: {
    marginTop: 64,
  },
  sectionTitle: {
    fontSize: 42,
    margin: "0 0 14px",
    fontWeight: 900,
    letterSpacing: -1.2,
  },
  sectionDesc: {
    fontSize: 18,
    lineHeight: 1.75,
    color: "#e0e9ff",
    marginBottom: 24,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },
  infoCard: {
    background: "rgba(16, 27, 88, 0.88)",
    borderRadius: 22,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.07)",
    minHeight: 180,
  },
  infoCardTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 14,
  },
  infoCardDesc: {
    fontSize: 17,
    lineHeight: 1.75,
    color: "#e6ecff",
  },
  demoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
  },
  panel: {
    background: "rgba(16, 27, 88, 0.88)",
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.07)",
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 14,
    color: "#c6d5ff",
    marginBottom: 8,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 16,
    outline: "none",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 16,
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 16,
    outline: "none",
    resize: "vertical",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    margin: "6px 0 12px",
    color: "#f2f5ff",
  },
  expertCard: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  expertHeader: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 12,
  },
  resultWrap: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 18,
  },
  resultLeft: {
    display: "flex",
  },
  resultRight: {
    display: "grid",
    gap: 18,
  },
  resultCard: {
    width: "100%",
    background: "rgba(16, 27, 88, 0.88)",
    borderRadius: 24,
    padding: 26,
    border: "1px solid rgba(255,255,255,0.07)",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  resultGrade: {
    padding: "12px 16px",
    borderRadius: 14,
    fontWeight: 900,
    fontSize: 18,
  },
  resultScore: {
    fontSize: 86,
    fontWeight: 900,
    lineHeight: 1,
  },
  resultScoreSub: {
    marginTop: 10,
    fontSize: 18,
    color: "#dbe6ff",
    marginBottom: 18,
  },
  resultMetrics: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 18,
  },
  resultMetricItem: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  summaryBox: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#eef3ff",
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  sideCard: {
    background: "rgba(16, 27, 88, 0.88)",
    borderRadius: 24,
    padding: 22,
    border: "1px solid rgba(255,255,255,0.07)",
  },
  sideCardTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 14,
  },
  logItem: {
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 6,
  },
  logText: {
    fontSize: 15,
    color: "#d8e5ff",
  },
  bulletList: {
    margin: 0,
    paddingLeft: 20,
    color: "#edf3ff",
    lineHeight: 1.9,
    fontSize: 16,
  },
  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },
  aboutCard: {
    background: "rgba(16, 27, 88, 0.88)",
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.07)",
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 17,
    lineHeight: 1.75,
    color: "#e7eeff",
  },
  contactWrap: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 18,
  },
  contactForm: {
    background: "rgba(16, 27, 88, 0.88)",
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.07)",
  },
  contactSide: {
    display: "grid",
    gap: 18,
  },
  statusBox: {
    marginTop: 8,
    background: "rgba(139, 207, 105, 0.15)",
    color: "#dff5d2",
    border: "1px solid rgba(139, 207, 105, 0.35)",
    borderRadius: 14,
    padding: 14,
    lineHeight: 1.6,
  },
};