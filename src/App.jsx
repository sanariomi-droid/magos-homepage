import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [projectName, setProjectName] = useState("MAGOS Structural Risk Review");
  const [clientName, setClientName] = useState("의뢰기관명");
  const [reviewId, setReviewId] = useState("MAGOS-2026-001");

  const [psi, setPsi] = useState(50);
  const [dri, setDri] = useState(50);
  const [bii, setBii] = useState(50);
  const [cli, setCli] = useState(50);

  const [wP, setWP] = useState(0.3);
  const [wD, setWD] = useState(0.3);
  const [wB, setWB] = useState(0.2);
  const [wC, setWC] = useState(0.2);

  const [kd, setKd] = useState(1.0);
  const [ki, setKi] = useState(1.0);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const today = new Date();
  const issuedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const clamp = (value, min, max) => {
    const num = Number(value);
    if (Number.isNaN(num)) return min;
    return Math.min(Math.max(num, min), max);
  };

  const getRiskGrade = (score) => {
    if (score >= 85) return "매우 높음";
    if (score >= 70) return "높음";
    if (score >= 55) return "보통";
    if (score >= 40) return "낮음";
    return "매우 낮음";
  };

  const getDecisionText = (score) => {
    if (score >= 85) {
      return "즉시 정밀검토, 사용제한 검토 및 긴급 대응계획 수립이 필요한 수준입니다.";
    }
    if (score >= 70) {
      return "우선관리 대상이며, 정밀점검 및 보강·보수 계획 수립이 권장됩니다.";
    }
    if (score >= 55) {
      return "지속관찰 대상이며, 정기점검 강화 및 상태변화 모니터링이 필요합니다.";
    }
    if (score >= 40) {
      return "기본 관리수준에서 정기 모니터링을 유지할 필요가 있습니다.";
    }
    return "현재 기준으로 상대적으로 안정적인 수준으로 판단됩니다.";
  };

  const getGradeColor = (grade) => {
    if (grade === "매우 높음") return "#ff5f57";
    if (grade === "높음") return "#ff9f43";
    if (grade === "보통") return "#ffd166";
    if (grade === "낮음") return "#7bd389";
    return "#6ecbff";
  };

  const calculateMRI = () => {
    setError("");

    const p = clamp(psi, 0, 100);
    const d = clamp(dri, 0, 100);
    const b = clamp(bii, 0, 100);
    const c = clamp(cli, 0, 100);

    const wp = Number(wP);
    const wd = Number(wD);
    const wb = Number(wB);
    const wc = Number(wC);

    const kdValue = clamp(kd, 1.0, 1.2);
    const kiValue = clamp(ki, 1.0, 1.15);

    const weightSum = wp + wd + wb + wc;

    if (Math.abs(weightSum - 1.0) > 0.001) {
      setResult(null);
      setError("가중치 합은 반드시 1.00이어야 합니다.");
      return;
    }

    const mriBase = wp * p + wd * d + wb * b + wc * c;
    const mriFinal = 100 - (100 - mriBase) / (kdValue * kiValue);
    const mriFinalClamped = Math.min(Math.max(mriFinal, 0), 100);

    const grade = getRiskGrade(mriFinalClamped);
    const decision = getDecisionText(mriFinalClamped);

    setResult({
      psi: p.toFixed(1),
      dri: d.toFixed(1),
      bii: b.toFixed(1),
      cli: c.toFixed(1),
      wP: wp.toFixed(2),
      wD: wd.toFixed(2),
      wB: wb.toFixed(2),
      wC: wc.toFixed(2),
      kd: kdValue.toFixed(2),
      ki: kiValue.toFixed(2),
      weightSum: weightSum.toFixed(2),
      mriBase: mriBase.toFixed(2),
      mriFinal: mriFinalClamped.toFixed(2),
      grade,
      decision,
      gradeColor: getGradeColor(grade),
    });
  };

  const downloadPDF = async () => {
    const element = document.getElementById("certificate-area");

    if (!result || !element) {
      alert("결과를 먼저 계산하세요.");
      return;
    }

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    let renderHeight = imgHeight;
    if (renderHeight > pageHeight - margin * 2) {
      renderHeight = pageHeight - margin * 2;
    }

    pdf.addImage(imgData, "PNG", margin, margin, usableWidth, renderHeight);
    pdf.save(`MAGOS_Certificate_${reviewId}.pdf`);
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#020b2d",
    color: "white",
    fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 36px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    position: "sticky",
    top: 0,
    backgroundColor: "#020b2d",
    zIndex: 20,
  };

  const navLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const logoTextStyle = {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "0.4px",
  };

  const navMenuStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  };

  const getNavButtonStyle = (tab) => ({
    backgroundColor: activeTab === tab ? "#2748a6" : "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
  });

  const sectionWrapStyle = {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "48px 36px 84px 36px",
  };

  const sectionTitleStyle = {
    fontSize: "34px",
    fontWeight: "800",
    margin: "0 0 18px 0",
  };

  const sectionDescStyle = {
    fontSize: "17px",
    color: "#d7ddff",
    lineHeight: 1.8,
    marginBottom: "26px",
  };

  const heroStyle = {
    display: "grid",
    gridTemplateColumns: "1.25fr 1fr",
    gap: "28px",
    alignItems: "center",
    marginTop: "8px",
  };

  const heroCardStyle = {
    backgroundColor: "#0d173f",
    borderRadius: "20px",
    padding: "38px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  };

  const titleStyle = {
    fontSize: "54px",
    fontWeight: "900",
    lineHeight: 1.15,
    margin: "0 0 18px 0",
  };

  const subTextStyle = {
    fontSize: "19px",
    lineHeight: 1.8,
    color: "#d7ddff",
    marginBottom: "26px",
  };

  const buttonRowStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px",
  };

  const primaryButtonStyle = {
    backgroundColor: "#82c76b",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    backgroundColor: "#78a9ff",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  };

  const statBoxStyle = {
    backgroundColor: "#111d52",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "16px",
  };

  const cardGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  };

  const serviceCardStyle = {
    backgroundColor: "#0d173f",
    borderRadius: "16px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const serviceTitleStyle = {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "10px",
  };

  const serviceTextStyle = {
    fontSize: "15px",
    lineHeight: 1.8,
    color: "#d7ddff",
  };

  const aboutGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  };

  const aboutCardStyle = {
    backgroundColor: "#0d173f",
    borderRadius: "16px",
    padding: "26px",
  };

  const contactBoxStyle = {
    backgroundColor: "#0d173f",
    borderRadius: "18px",
    padding: "28px",
    lineHeight: 1.9,
  };

  const footerStyle = {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    padding: "24px 40px",
    color: "#b8c4ff",
    textAlign: "center",
    fontSize: "14px",
  };

  const demoGridStyle = {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "24px",
    alignItems: "start",
  };

  const inputPanelStyle = {
    backgroundColor: "#0d173f",
    borderRadius: "18px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const demoLabelStyle = {
    display: "block",
    marginTop: "10px",
    marginBottom: "6px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#ffffff",
  };

  const demoInputStyle = {
    width: "100%",
    height: "38px",
    fontSize: "15px",
    padding: "4px 10px",
    marginBottom: "12px",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid #d6ddee",
  };

  const renderHome = () => (
    <div style={sectionWrapStyle}>
      <div style={heroStyle}>
        <div style={heroCardStyle}>
          <div style={{ fontSize: "15px", color: "#9fb4ff", marginBottom: "14px", fontWeight: "700" }}>
            MAGOS STRUCTURE ENGINEERING LAB
          </div>

          <h1 style={titleStyle}>
            Structural Risk
            <br />
            & Engineering Decision
          </h1>

          <div style={subTextStyle}>
            MAGOS는 구조기술사의 공학적 판단을 데이터와 리스크 정량화로 연결하여,
            구조안전 검토·의사결정·인증서 발행까지 이어지는 실무형 플랫폼을 지향합니다.
          </div>

          <div style={buttonRowStyle}>
            <button style={primaryButtonStyle} onClick={() => setActiveTab("demo")}>
              데모 보기
            </button>
            <button style={secondaryButtonStyle} onClick={() => setActiveTab("services")}>
              서비스 보기
            </button>
          </div>
        </div>

        <div>
          <div style={statBoxStyle}>
            <div style={{ fontSize: "14px", color: "#9fb4ff", marginBottom: "8px" }}>핵심 기능</div>
            <div style={{ fontSize: "26px", fontWeight: "800", marginBottom: "10px" }}>
              MRI 기반 구조 리스크 정량평가
            </div>
            <div style={{ color: "#d7ddff", lineHeight: 1.8 }}>
              PSI, DRI, BII, CLI 기반 MRI 산정과 보정계수 적용을 통해
              구조 리스크를 수치와 등급으로 제시합니다.
            </div>
          </div>

          <div style={statBoxStyle}>
            <div style={{ fontSize: "14px", color: "#9fb4ff", marginBottom: "8px" }}>활용 분야</div>
            <div style={{ color: "#d7ddff", lineHeight: 1.9 }}>
              보험 인수심사 / 구조 검토 / 유지관리 / 법원 감정 / 건설 포렌식 / 공학 판단 기록
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "56px" }}>
        <h2 style={sectionTitleStyle}>왜 MAGOS인가</h2>
        <div style={sectionDescStyle}>
          경험 중심 판단에만 의존하던 구조 검토를, 정량화된 리스크 점수와 문서화된 인증서로 연결합니다.
        </div>

        <div style={cardGridStyle}>
          <div style={serviceCardStyle}>
            <div style={serviceTitleStyle}>정량화</div>
            <div style={serviceTextStyle}>
              구조 리스크를 점수와 등급으로 제시하여 의사결정의 객관성을 높입니다.
            </div>
          </div>

          <div style={serviceCardStyle}>
            <div style={serviceTitleStyle}>기술사 판단</div>
            <div style={serviceTextStyle}>
              구조기술사의 검토 경험과 공학 판단을 문서화 가능한 형태로 정리합니다.
            </div>
          </div>

          <div style={serviceCardStyle}>
            <div style={serviceTitleStyle}>인증서 발행</div>
            <div style={serviceTextStyle}>
              PDF 인증서 형태로 결과를 정리하여 실무 제출 문서로 활용할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div style={sectionWrapStyle}>
      <h2 style={sectionTitleStyle}>서비스</h2>
      <div style={sectionDescStyle}>
        MAGOS는 구조기술사의 전문성을 기반으로 아래와 같은 서비스 패키지를 제공합니다.
      </div>

      <div style={cardGridStyle}>
        <div style={serviceCardStyle}>
          <div style={serviceTitleStyle}>보험사용 리스크 평가</div>
          <div style={serviceTextStyle}>
            보험 인수심사를 위한 구조 리스크 정량평가와 인증서 제공
          </div>
        </div>

        <div style={serviceCardStyle}>
          <div style={serviceTitleStyle}>설계 검토 지원</div>
          <div style={serviceTextStyle}>
            설계안의 구조 안전성 및 위험요소를 정리한 검토 문서 제공
          </div>
        </div>

        <div style={serviceCardStyle}>
          <div style={serviceTitleStyle}>시공·감리 리스크 검토</div>
          <div style={serviceTextStyle}>
            시공 중 구조적 리스크와 책임 노출 요소를 점검하는 실무형 검토
          </div>
        </div>

        <div style={serviceCardStyle}>
          <div style={serviceTitleStyle}>유지관리용 평가</div>
          <div style={serviceTextStyle}>
            시설물 열화 상태와 유지관리 우선순위 판단을 위한 정량 평가
          </div>
        </div>

        <div style={serviceCardStyle}>
          <div style={serviceTitleStyle}>법원 감정 보조</div>
          <div style={serviceTextStyle}>
            구조기술사의 공학 판단을 수치화하여 감정 보조자료로 정리
          </div>
        </div>

        <div style={serviceCardStyle}>
          <div style={serviceTitleStyle}>건설 포렌식</div>
          <div style={serviceTextStyle}>
            사고 전후 리스크 비교, 책임 및 원인 분석을 위한 정리 문서 제공
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemo = () => (
    <div style={sectionWrapStyle}>
      <h2 style={sectionTitleStyle}>데모</h2>
      <div style={sectionDescStyle}>
        MRI 계산기와 구조안전 리스크 인증서 발행 기능을 체험할 수 있습니다.
      </div>

      <div style={demoGridStyle}>
        <div style={inputPanelStyle}>
          <div style={{ fontSize: "22px", fontWeight: "800", marginBottom: "16px" }}>
            입력 패널
          </div>

          <div style={{ fontSize: "16px", fontWeight: "800", marginBottom: "8px", color: "#9fb4ff" }}>
            기본 정보
          </div>

          <label style={demoLabelStyle}>프로젝트명</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={demoInputStyle}
          />

          <label style={demoLabelStyle}>의뢰기관</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={demoInputStyle}
          />

          <label style={demoLabelStyle}>문서번호</label>
          <input
            value={reviewId}
            onChange={(e) => setReviewId(e.target.value)}
            style={demoInputStyle}
          />

          <div style={{ fontSize: "16px", fontWeight: "800", margin: "10px 0 8px 0", color: "#9fb4ff" }}>
            리스크 점수
          </div>

          <label style={demoLabelStyle}>PSI</label>
          <input type="number" value={psi} onChange={(e) => setPsi(e.target.value)} style={demoInputStyle} />

          <label style={demoLabelStyle}>DRI</label>
          <input type="number" value={dri} onChange={(e) => setDri(e.target.value)} style={demoInputStyle} />

          <label style={demoLabelStyle}>BII</label>
          <input type="number" value={bii} onChange={(e) => setBii(e.target.value)} style={demoInputStyle} />

          <label style={demoLabelStyle}>CLI</label>
          <input type="number" value={cli} onChange={(e) => setCli(e.target.value)} style={demoInputStyle} />

          <div style={{ fontSize: "16px", fontWeight: "800", margin: "10px 0 8px 0", color: "#9fb4ff" }}>
            가중치
          </div>

          <label style={demoLabelStyle}>wP</label>
          <input type="number" step="0.01" value={wP} onChange={(e) => setWP(e.target.value)} style={demoInputStyle} />

          <label style={demoLabelStyle}>wD</label>
          <input type="number" step="0.01" value={wD} onChange={(e) => setWD(e.target.value)} style={demoInputStyle} />

          <label style={demoLabelStyle}>wB</label>
          <input type="number" step="0.01" value={wB} onChange={(e) => setWB(e.target.value)} style={demoInputStyle} />

          <label style={demoLabelStyle}>wC</label>
          <input type="number" step="0.01" value={wC} onChange={(e) => setWC(e.target.value)} style={demoInputStyle} />

          <div style={{ fontSize: "16px", fontWeight: "800", margin: "10px 0 8px 0", color: "#9fb4ff" }}>
            보정계수
          </div>

          <label style={demoLabelStyle}>Kd</label>
          <input type="number" step="0.01" value={kd} onChange={(e) => setKd(e.target.value)} style={demoInputStyle} />

          <label style={demoLabelStyle}>Ki</label>
          <input type="number" step="0.01" value={ki} onChange={(e) => setKi(e.target.value)} style={demoInputStyle} />

          <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={primaryButtonStyle} onClick={calculateMRI}>
              결과 계산
            </button>
            <button style={secondaryButtonStyle} onClick={downloadPDF}>
              인증서 PDF 다운로드
            </button>
          </div>

          {error && (
            <div style={{ marginTop: "14px", color: "#ffaaaa", fontWeight: "700" }}>
              {error}
            </div>
          )}
        </div>

        <div>
          {!result && (
            <div style={inputPanelStyle}>
              <div style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>
                인증서 미리보기
              </div>
              <div style={{ color: "#d7ddff", lineHeight: 1.9 }}>
                좌측 입력값을 넣고 <strong>결과 계산</strong>을 누르면 이 영역에 구조안전 리스크 인증서가 표시됩니다.
              </div>
            </div>
          )}

          {result && (
            <div
              id="certificate-area"
              style={{
                backgroundColor: "#ffffff",
                color: "#111111",
                width: "100%",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                border: "1px solid #d9deea",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #0b1d58 0%, #1c3f9f 100%)",
                  color: "white",
                  padding: "24px 34px 22px 34px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "84px",
                      height: "84px",
                      backgroundColor: "white",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src="/magos_logo.png"
                      alt="MAGOS 로고"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: "16px", letterSpacing: "1px", opacity: 0.9 }}>
                      MAGOS STRUCTURE ENGINEERING LAB
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>
                      STRUCTURAL RISK CERTIFICATE
                    </div>
                    <div style={{ fontSize: "18px", marginTop: "6px", opacity: 0.95 }}>
                      구조안전 리스크 정량평가 인증서
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "30px 34px 34px 34px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "26px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", color: "#5d6b8a", marginBottom: "4px" }}>프로젝트명</div>
                    <div style={{ fontSize: "24px", fontWeight: "700" }}>{projectName}</div>
                  </div>

                  <div style={{ minWidth: "240px" }}>
                    <div style={{ fontSize: "14px", color: "#5d6b8a", marginBottom: "4px" }}>문서번호</div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>{reviewId}</div>

                    <div style={{ fontSize: "14px", color: "#5d6b8a", marginTop: "10px", marginBottom: "4px" }}>발행일</div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>{issuedDate}</div>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #d9deea",
                    borderRadius: "14px",
                    padding: "18px 22px",
                    marginBottom: "24px",
                    backgroundColor: "#f7f9fc",
                  }}
                >
                  <div style={{ fontSize: "14px", color: "#5d6b8a", marginBottom: "6px" }}>의뢰기관</div>
                  <div style={{ fontSize: "20px", fontWeight: "700" }}>{clientName}</div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 1fr",
                    gap: "22px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #d9deea",
                      borderRadius: "16px",
                      padding: "22px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div style={{ fontSize: "16px", color: "#5d6b8a", marginBottom: "14px", fontWeight: "700" }}>
                      평가 결과
                    </div>

                    <div style={{ fontSize: "14px", color: "#5d6b8a" }}>최종 MRI</div>
                    <div style={{ fontSize: "52px", fontWeight: "800", lineHeight: 1.1, margin: "6px 0 14px 0" }}>
                      {result.mriFinal}
                    </div>

                    <div style={{ fontSize: "14px", color: "#5d6b8a" }}>위험 등급</div>
                    <div
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        backgroundColor: result.gradeColor,
                        color: "#132033",
                        fontWeight: "800",
                        fontSize: "20px",
                        padding: "10px 18px",
                        borderRadius: "999px",
                      }}
                    >
                      {result.grade}
                    </div>

                    <div style={{ marginTop: "22px", fontSize: "14px", color: "#5d6b8a" }}>판단 의견</div>
                    <div style={{ marginTop: "8px", fontSize: "18px", fontWeight: "700", lineHeight: 1.6 }}>
                      {result.decision}
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #d9deea",
                      borderRadius: "16px",
                      padding: "22px",
                      backgroundColor: "#f9fbff",
                    }}
                  >
                    <div style={{ fontSize: "16px", color: "#5d6b8a", marginBottom: "14px", fontWeight: "700" }}>
                      입력 및 보정 정보
                    </div>

                    <div style={{ fontSize: "15px", lineHeight: 1.9 }}>
                      <div>PSI : {result.psi}</div>
                      <div>DRI : {result.dri}</div>
                      <div>BII : {result.bii}</div>
                      <div>CLI : {result.cli}</div>

                      <hr style={{ margin: "14px 0", borderColor: "#d9deea" }} />

                      <div>wP : {result.wP}</div>
                      <div>wD : {result.wD}</div>
                      <div>wB : {result.wB}</div>
                      <div>wC : {result.wC}</div>
                      <div>가중치 합 : {result.weightSum}</div>

                      <hr style={{ margin: "14px 0", borderColor: "#d9deea" }} />

                      <div>Kd : {result.kd}</div>
                      <div>Ki : {result.ki}</div>
                      <div>기본 MRI : {result.mriBase}</div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #d9deea",
                    borderRadius: "16px",
                    padding: "20px 22px",
                    marginBottom: "24px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div style={{ fontSize: "16px", color: "#5d6b8a", marginBottom: "10px", fontWeight: "700" }}>
                    적용식 및 검토 기준
                  </div>
                  <div style={{ fontSize: "15px", lineHeight: 1.9 }}>
                    <div>적용식 1 : MRI = wP×PSI + wD×DRI + wB×BII + wC×CLI</div>
                    <div>적용식 2 : MRI_final = 100 - (100 - MRI) / (Kd × Ki)</div>
                    <div style={{ marginTop: "8px", color: "#4e5c79" }}>
                      본 결과는 입력된 자료, 가중치 및 보정계수에 기초한 정량평가 결과이며, 최종 설계·보수·보강
                      의사결정 시에는 현장조사, 도면검토, 구조검토 및 기술사 판단이 함께 반영되어야 합니다.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #d9deea",
                      borderRadius: "16px",
                      minHeight: "110px",
                      padding: "18px 20px",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#5d6b8a", marginBottom: "12px" }}>검토 책임자</div>
                    <div style={{ fontSize: "22px", fontWeight: "800" }}>김황준</div>
                    <div style={{ marginTop: "6px", fontSize: "16px" }}>토목구조기술사</div>
                    <div style={{ marginTop: "18px", fontSize: "14px", color: "#5d6b8a" }}>서명 / 날인</div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #d9deea",
                      borderRadius: "16px",
                      minHeight: "110px",
                      padding: "18px 20px",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#5d6b8a", marginBottom: "12px" }}>발행 기관</div>
                    <div style={{ fontSize: "22px", fontWeight: "800" }}>MAGOS Structure Engineering Lab</div>
                    <div style={{ marginTop: "6px", fontSize: "16px" }}>Structural Risk & Engineering Decision</div>
                    <div style={{ marginTop: "18px", fontSize: "14px", color: "#5d6b8a" }}>공식 검토 문서</div>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    borderTop: "2px solid #10307a",
                    paddingTop: "16px",
                    color: "#233659",
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "800" }}>MAGOS Structure Engineering Lab</div>
                  <div style={{ marginTop: "6px", fontSize: "14px" }}>
                    건강한 파동과 기술을 연결하는 구조설계 전문가
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div style={sectionWrapStyle}>
      <h2 style={sectionTitleStyle}>회사 소개</h2>

      <div style={aboutGridStyle}>
        <div style={aboutCardStyle}>
          <div style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>
            MAGOS Structure Engineering Lab
          </div>
          <div style={serviceTextStyle}>
            구조안전, 리스크, 데이터 신뢰성, 공학적 의사결정을 연결하는 실무형 구조기술사 사무소입니다.
            구조기술사의 판단을 문서화·정량화·인증서화하는 방향으로 서비스를 확장하고 있습니다.
          </div>
        </div>

        <div style={aboutCardStyle}>
          <div style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>
            대표 소개
          </div>
          <div style={serviceTextStyle}>
            김황준
            <br />
            토목구조기술사
            <br />
            구조안전 검토, 유지관리, 리스크 평가, 구조기술 기반 서비스 개발
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <div style={aboutCardStyle}>
          <div style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>
            브랜드 철학
          </div>
          <div style={serviceTextStyle}>
            건강한 파동과 기술을 연결하는 구조설계 전문가
            <br />
            MAGOS는 구조기술사의 전문성과 데이터 기반 판단을 결합하여,
            구조안전 의사결정을 보다 명확하고 신뢰성 있게 만드는 것을 목표로 합니다.
          </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div style={sectionWrapStyle}>
      <h2 style={sectionTitleStyle}>문의</h2>
      <div style={sectionDescStyle}>
        구조 검토, 리스크 평가, 인증서 발행, 협업 및 제안 문의를 받습니다.
      </div>

      <div style={contactBoxStyle}>
        <div style={{ fontSize: "22px", fontWeight: "800", marginBottom: "10px" }}>
          MAGOS Structure Engineering Lab
        </div>
        <div>대표: 김황준</div>
        <div>자격: 토목구조기술사</div>
        <div>문의 이메일: contact@magos.co.kr</div>
        <div>홈페이지 도메인: magos.co.kr</div>
        <div style={{ marginTop: "14px", color: "#d7ddff" }}>
          문의 폼, 의뢰서 업로드, 상담 예약 기능은 다음 단계에서 추가할 수 있습니다.
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (activeTab === "home") return renderHome();
    if (activeTab === "services") return renderServices();
    if (activeTab === "demo") return renderDemo();
    if (activeTab === "about") return renderAbout();
    if (activeTab === "contact") return renderContact();
    return renderHome();
  };

  return (
    <div style={pageStyle}>
      <header style={navStyle}>
        <div style={navLeftStyle}>
          <div
            style={{
              width: "42px",
              height: "42px",
              backgroundColor: "white",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <img
              src="/magos_logo.png"
              alt="MAGOS 로고"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={logoTextStyle}>MAGOS</div>
        </div>

        <div style={navMenuStyle}>
          <button style={getNavButtonStyle("home")} onClick={() => setActiveTab("home")}>
            Home
          </button>
          <button style={getNavButtonStyle("services")} onClick={() => setActiveTab("services")}>
            Services
          </button>
          <button style={getNavButtonStyle("demo")} onClick={() => setActiveTab("demo")}>
            Demo
          </button>
          <button style={getNavButtonStyle("about")} onClick={() => setActiveTab("about")}>
            About
          </button>
          <button style={getNavButtonStyle("contact")} onClick={() => setActiveTab("contact")}>
            Contact
          </button>
        </div>
      </header>

      {renderPage()}

      <footer style={footerStyle}>
        MAGOS Structure Engineering Lab · Structural Risk & Engineering Decision
      </footer>
    </div>
  );
}