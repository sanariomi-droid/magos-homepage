import { useEffect, useMemo, useState } from "react";

const CONTACT_EMAIL = "ceo@magos.ai.kr";
const CONTACT_PHONE = "010-7212-0342";
const CONTACT_PHONE_URI = "+821072120342";
const IS_LOCAL_BROWSER =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const CONFIGURED_LEDGERPROOF_URL = (import.meta.env.VITE_LEDGERPROOF_URL || "").trim();
const STALE_LEDGERPROOF_URLS = new Set([
  "https://app.magos.ai.kr",
  "https://app.magos.ai.kr/",
]);
const LEDGERPROOF_URL = IS_LOCAL_BROWSER
  ? CONFIGURED_LEDGERPROOF_URL || "http://localhost:8000"
  : CONFIGURED_LEDGERPROOF_URL && !STALE_LEDGERPROOF_URLS.has(CONFIGURED_LEDGERPROOF_URL)
    ? CONFIGURED_LEDGERPROOF_URL
    : "/documents/MAGOS_LedgerProof_PoC_v0.1.pdf";
const LEDGERPROOF_IS_DOCUMENT = /\.pdf(?:$|[?#])/i.test(LEDGERPROOF_URL);

// 상담메일은 브라우저에서 EmailJS로 직접 전송하지 않고,
// 동일 도메인의 Vercel Function(/api/contact)을 통해 전송합니다.
// 이 방식은 브라우저 CORS·확장프로그램·허용도메인 차이의 영향을 줄이고,
// 실패 사유를 서버 응답으로 정확히 표시합니다.
const CONTACT_API_URL = "/api/contact";
const EMAIL_REQUEST_TIMEOUT_MS = 15000;
const CONTACT_RELAY_VERSION = "3.3.0";

const navItems = [
  ["field", "현장 적용"],
  ["customer", "고객 요구"],
  ["comparison", "검토·판단"],
  ["services", "서비스"],
  ["samples", "샘플 결과"],
  ["poc", "PoC 신청"],
  ["patents", "특허 14건"],
  ["roadmap", "로드맵"],
  ["contact", "문의"],
];

const customerNeeds = [
  {
    no: "01",
    label: "RESPONSIBILITY",
    title: "책임범위를 명확히 하고 합리적 검토·조치를 입증할 자료",
    question: "당시 무엇을 알고, 어떤 자료와 절차로 결정했고, 어떤 조치를 했는가?",
    desc: "업무범위, 적용기준, 발주지시, 전제조건, 위험고지, 검토의견, 승인·불채택 사유와 조치이력을 연결합니다.",
    items: ["역할·검토범위·책임 매트릭스", "질의·답변·지시·승인 이력", "위험고지·대안검토·권고 기록"],
  },
  {
    no: "02",
    label: "VARIATION & COST",
    title: "설계변경·추가공사비의 정당성을 인정받을 자료",
    question: "왜 변경되었고, 수량·공기·비용에 어떤 영향이 생겼는가?",
    desc: "기준설계와 변경안을 비교하여 현장조건, 변경원인, 지시, 귀책요인, 수량·공법·공기·비용 영향의 연결근거를 만듭니다.",
    items: ["변경 전후 도면·계산·수량 비교", "현장조건·설계변경 원인 분석", "공사비·공기 영향과 산출근거"],
  },
  {
    no: "03",
    label: "ACCIDENT & DISPUTE",
    title: "사고 원인과 사전 위험관리·조치이력을 입증하는 자료",
    question: "사고 원인은 무엇이며, 사전에 어떤 위험관리와 조치를 했는가?",
    desc: "사고 전 위험징후와 조치, 사고 후 현장자료와 손상양상, 하중경로, 원인기여도, 재발방지 대책을 시간순으로 구성합니다.",
    items: ["사전 위험평가·경고·조치이력", "사고자료 보존·원인기여도 분석", "재발방지·보강·후속조치 기록"],
  },
];

const fieldApplications = [
  {
    title: "설계변경·추가공사비",
    desc: "변경 전후 도면·계산·수량·공법·공기·비용 영향을 구조화하여 정당성을 설명하는 자료를 만듭니다.",
    bullets: ["설계변경 사유 정리", "귀책·지시·승인 이력", "공사비·공기 영향 근거"],
    icon: "change",
  },
  {
    title: "BIM·3차원 스캔 연계",
    desc: "BIM 객체, 3차원 스캔 영역, 현장상태, 공학판단과 근거자료를 객체 단위 전자증거 패키지로 연결합니다.",
    bullets: ["객체단위 패키지 생성", "송신·수신 재봉인", "선택검증·장기검증"],
    icon: "package",
  },
  {
    title: "구조안전·유지관리",
    desc: "구조검토 결과를 위험도·우선순위·조치권고와 연결해 유지관리, 감사, 발주처 보고에 활용할 수 있도록 정리합니다.",
    bullets: ["구조리스크 평가", "조치 우선순위", "기술검토·승인 증빙"],
    icon: "shield",
  },
  {
    title: "사고·중대재해·분쟁 대응",
    desc: "사고 전 위험관리와 사고 후 원인·손상·책임영향 자료를 연결하여 중대재해, 분쟁, 보험, 법원감정 대응자료를 구성합니다.",
    bullets: ["원인기여도 분석", "조치이력 입증", "재발방지 자료"],
    icon: "forensic",
  },
];

const comparisonRows = [
  ["핵심 질문", "기준과 계산상 안전한가?", "여러 대안 중 무엇을 채택해야 하는가?"],
  ["성격", "분석·검증 문서", "의사결정·책임 문서"],
  ["주요 입력", "하중·재료·형상·지반조건·설계기준", "구조검토 결과 + 현장자료 + 시공성 + 위험 + 비용 + 불확실성"],
  ["주요 내용", "모델링·하중조합·단면력·응력·변위·안정검토", "쟁점·대안·위험·판단근거·선택안·조건·후속조치"],
  ["결론 형태", "안전·불안전, 적합·부적합, 보강 필요", "A안 채택, B안 배제, 특정 조건에서 승인"],
  ["대안 비교", "통상 제한적", "필수에 가까움"],
  ["불확실성 처리", "계산조건·가정으로 표시", "자료 부족과 잔여위험까지 판단"],
  ["책임대상", "계산과 구조적 적합성", "최종 권고·의사결정의 합리성"],
  ["활용처", "설계승인·보완·구조계산 증빙", "설계변경·책임추적·분쟁·감사·보험·사고 대응"],
  ["관계", "공학판단의 핵심 근거자료", "구조검토서를 포함해 최종 결론을 내리는 상위문서"],
];

const roadmap = [
  { year: "2026", status: "완료·진행", tone: "done", title: "특허 14건 출원 및 현장 적용체계 설계", desc: "공학판단·구조리스크·전자증거·BIM·3차원 스캔·장기검증 기반 포트폴리오 14건 구축" },
  { year: "2026 하반기", status: "준비", tone: "current", title: "현장 PoC 파트너 모집", desc: "BIM, 3차원 스캔, 설계변경, 사고대응 분야별 현장사례와 공동 실증 추진" },
  { year: "2027 상반기", status: "선정 목표", tone: "target", title: "정부과제 선정·현장실증", desc: "수요기관·협력기업과 표준 문서체계, 검증엔진, 적용서비스 실증" },
  { year: "2028", status: "신청·지정 목표", tone: "target", title: "NET 신기술 인증", desc: "성능·현장적용성·차별성 자료를 갖추어 신기술 인증 추진" },
  { year: "2029", status: "제품화 목표", tone: "target", title: "적용제품 출시·법인 전환", desc: "현장 적용제품과 서비스 출시, 수의계약 조건 확보 추진, 법인 전환 및 판매체계 구축" },
  { year: "2030", status: "지정 목표", tone: "target", title: "혁신제품 지정", desc: "법인 명의의 혁신제품 지정과 공공 실증·구매 연계 추진" },
  { year: "2031", status: "본격화 목표", tone: "target", title: "공공조달 본격 사업화", desc: "조달 등록, 공공기관 적용 확대, 민간·공공시장 본격 사업화" },
];

const evidenceSteps = [
  { no: "01", title: "구조검토", en: "Structural Review", desc: "설계도서·구조계산서·해석모델·현장자료와 적용기준을 검토합니다.", output: "제1권 구조검토서", icon: "review" },
  { no: "02", title: "공학판단", en: "Engineering Judgment", desc: "쟁점, 전제조건, 위험요인, 불확실성, 대안과 권고사항을 책임 있게 기록합니다.", output: "제2권 공학판단서", icon: "judgment" },
  { no: "03", title: "전자증거 패키지", en: "Evidence Package", desc: "근거자료·버전·생성·수령·검토 이력을 Manifest와 함께 하나로 묶습니다.", output: "제3권 무결성·절차이력 검증서", icon: "package" },
  { no: "04", title: "장기검증 보안봉투", en: "Long-Term Validation Envelope", desc: "해시·Merkle Root·Package Seal·전자서명·타임스탬프로 봉인하고 검증합니다.", output: "MAGOS Evidence Envelope", icon: "envelope" },
  { no: "05", title: "양자내성 전환 대응", en: "Post-Quantum Migration Ready", desc: "향후 키 갱신과 암호알고리즘 전환, 재봉인·선택복원 구조를 준비합니다.", output: "전환·재검증 이력", icon: "quantum" },
];

const services = [
  {
    tier: "기본형",
    en: "BASIC",
    title: "구조검토서",
    desc: "설계도서, 구조계산, 해석조건 및 현장자료에 대한 구조안전 검토 결과를 제공합니다.",
    uses: ["일반 구조검토", "설계도서·구조계산 검토", "보강·공법 기술자문", "검토의견서 작성"],
  },
  {
    tier: "고급형",
    en: "ADVANCED",
    title: "구조검토서 + 공학판단서",
    desc: "검토 결과에 판단근거, 위험요인, 전제조건, 대안 비교와 권고사항을 더합니다.",
    uses: ["설계변경·공법변경", "추가공사비 근거자료", "발주처 협의·승인자료", "대안별 위험·비용 비교"],
  },
  {
    tier: "프리미엄형",
    en: "PREMIUM",
    title: "공학판단 전자증거 패키지",
    desc: "구조검토서와 공학판단서에 자료목록·해시·절차이력 검증서를 결합합니다.",
    uses: ["책임범위·합리적 조치 입증", "공공기관 검토·감사 대응", "설계변경·추가공사비 입증", "중요 의사결정 기록"],
    featured: true,
  },
  {
    tier: "특수형",
    en: "FORENSIC",
    title: "사고·소송·보험·분쟁 대응",
    desc: "사고 전후 자료를 분석하고 원인·손상·책임 판단자료를 검증 가능한 증거체계로 구성합니다.",
    uses: ["중대재해 대응자료", "법원감정·건설분쟁", "보험·손해사정 지원", "사고원인·재발방지 분석"],
  },
];

const samplePackages = [
  {
    title: "설계변경·추가공사비 패키지",
    summary: "변경 전후 비교, 지시·승인 이력, 수량·공기·비용 근거를 하나로 정리합니다.",
    items: ["변경 전후 비교표", "공학판단서", "추가공사비 산출근거", "승인·전달 이력"],
  },
  {
    title: "BIM·3차원 스캔 객체증거 패키지",
    summary: "BIM 객체, 스캔영역, 공학판단과 검증정보를 객체 단위로 연결합니다.",
    items: ["객체 식별표", "BIM-스캔 비교표", "선택검증 결과", "송수신 재봉인 이력"],
  },
  {
    title: "사고·중대재해 대응 패키지",
    summary: "사고 전 위험관리와 사고 후 원인·조치·재발방지 자료를 시간순으로 정리합니다.",
    items: ["사전 위험관리 기록", "사고원인 분석", "책임영향 검토", "재발방지 조치계획"],
  },
];

const documents = [
  {
    vol: "제1권",
    title: "구조검토서",
    en: "Structural Review Report",
    items: ["검토 목적·범위", "대상 구조물 현황", "적용 기준", "입력자료·해석조건", "검토 결과", "결론·보완사항"],
  },
  {
    vol: "제2권",
    title: "공학판단서",
    en: "Engineering Judgment Report",
    items: ["주요 쟁점", "사실자료·전제조건", "판단 기준", "위험·불확실성", "대안 비교", "최종 판단·권고"],
  },
  {
    vol: "제3권",
    title: "전자자료 무결성·절차이력 검증서",
    en: "Integrity & Procedure Trace Report",
    items: ["전자자료 Manifest", "파일별 해시", "생성·수령·변경 이력", "Merkle Root", "Package Seal", "서명·타임스탬프"],
  },
];

const pocPrograms = [
  {
    title: "PoC 1 · 설계변경·추가공사비",
    desc: "옹벽, 교량, 지하구조물, 가시설, 구조보강, 시공방법 변경 현장에 적용",
    bullets: ["변경 원인", "현장조건", "수량·공기·비용 영향", "지시·협의·승인 이력"],
  },
  {
    title: "PoC 2 · BIM·3차원 스캔 객체증거",
    desc: "준공검사, 시공오차 비교, 설계모델 대비 현황 검토, 변형·보수 전후 비교에 적용",
    bullets: ["BIM 객체 식별", "스캔 증거영역", "객체별 판단·근거", "선택검증"],
  },
  {
    title: "PoC 3 · 사고·중대재해·분쟁 대응",
    desc: "붕괴, 균열, 침하, 변형, 시공 중 사고, 하자, 보험사고, 법원감정에 적용",
    bullets: ["사고 전 위험징후", "고지·조치·승인 이력", "원인기여도", "재발방지 조치"],
  },
];

const applications = [
  ["책임범위 입증", "검토범위·적용기준·지시·승인·위험고지·합리적 조치의 연결", "audit"],
  ["설계변경·추가공사비", "변경 전후 조건·수량·공법·공기·비용과 귀책원인의 구조화", "change"],
  ["사고원인·중대재해", "사전 위험관리와 사고 후 원인기여도·재발방지 조치의 입증", "forensic"],
  ["법원감정", "감정자료의 출처·버전·검토범위·판단근거를 검증 가능한 형태로 구성", "court"],
  ["보험·손해사정", "사고원인, 구조적 손상, 보수범위와 손해 판단에 필요한 공학자료 제공", "insurance"],
  ["공공기관 감사·분쟁", "불채택 사유, 의사결정과 절차이력을 보존하여 감사·분쟁 대응", "structure"],
];

const technologies = [
  ["Hash", "해시값", "파일의 동일성과 변경 여부를 확인하는 디지털 지문"],
  ["Manifest", "전자자료 목록", "패키지 구성, 출처, 작성자, 버전, 시점을 구조화"],
  ["Merkle Root", "통합 무결성", "다수 파일의 무결성을 하나의 대표값으로 검증"],
  ["Package Seal", "패키지 봉인", "자료 구성과 검증정보 전체의 봉인상태 확인"],
  ["E-Signature", "전자서명", "작성자·검토자와 승인행위의 확인을 지원"],
  ["Timestamp", "시점 증명", "특정 시점에 자료가 존재했음을 검증하도록 지원"],
  ["LTV", "장기검증", "시간이 지나도 무결성과 서명을 다시 확인하도록 구성"],
  ["PQC Ready", "양자내성 전환", "키·알고리즘 갱신과 재봉인에 대응하는 구조"],
];

const patentCategories = [
  ["all", "전체 14건"],
  ["core", "핵심"],
  ["extension", "확장"],
  ["followup", "후속"],
  ["security", "보안"],
  ["field", "현장연계"],
];

const rdPortfolio = [
  { category: "core", label: "핵심", title: "공학판단 데이터 신뢰성·절차 추적" },
  { category: "core", label: "핵심", title: "구조안전 리스크 인증" },
  { category: "extension", label: "확장", title: "전문가 풀 배정·운영" },
  { category: "core", label: "핵심", title: "전문가 판단 정량화" },
  { category: "extension", label: "확장", title: "사고 전후 건설포렌식" },
  { category: "core", label: "핵심", title: "법원감정 전자증거 패키지" },
  { category: "extension", label: "확장", title: "구조 리스크·보험 손해 데이터 연계" },
  { category: "core", label: "핵심", title: "구조 리스크 의사결정·제어 OS" },
  { category: "core", label: "핵심", title: "전문직 판단문서 다중 보안저장·복원·검증" },
  { category: "followup", label: "후속", title: "직교코드 기반 거래·회계 증빙 패키지" },
  { category: "extension", label: "확장", title: "지구공진 기반 미세진동 리스크 평가" },
  { category: "security", label: "보안", title: "양자내성 장기검증 전자증거 보안봉투" },
  { category: "security", label: "보안", title: "직교코드 기반 동적 셔플링 보안엔진" },
  { category: "field", label: "현장연계", title: "BIM·3차원 스캐닝 연계 객체단위 공학판단 전자증거 패키지" },
];

function Icon({ name, size = 24 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    review: <><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/></>,
    judgment: <><path d="M12 3v18M5 7h14M7 7l-3 6h6zM17 7l-3 6h6zM8 21h8"/></>,
    package: <><path d="m3 7 9-4 9 4-9 4z"/><path d="m3 12 9 4 9-4M3 17l9 4 9-4"/></>,
    envelope: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/><circle cx="17" cy="16" r="3"/></>,
    quantum: <><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(45 12 12)"/></>,
    structure: <><path d="M4 21 12 3l8 18M7 15h10M6 18h12M9 9h6"/></>,
    change: <><path d="M7 7h11l-3-3M17 17H6l3 3"/><path d="M18 7v5M6 17v-5"/></>,
    court: <><path d="M3 21h18M6 17h12M5 8h14L12 3zM8 8v9M12 8v9M16 8v9"/></>,
    insurance: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="m9 12 2 2 4-5"/></>,
    audit: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9zM8 11h8M8 15h5"/></>,
    forensic: <><circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5M8 8l4 4M12 8l-4 4"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    phone: <path d="M5 4h3l2 5-2 2c1.5 3 2 3.5 5 5l2-2 5 2v3c0 1-1 2-2 2C10 20 4 14 3 6c0-1 1-2 2-2z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6H5V6h6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="M9 12h6M12 9v6"/></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M18 10a7 7 0 0 0-12-3M6 14a7 7 0 0 0 12 3"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
    code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
    top: <><path d="m6 15 6-6 6 6"/></>,
  };
  return <svg {...common}>{paths[name] || paths.shield}</svg>;
}

function Logo({ compact = false }) {
  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="#top" aria-label="MAGOS 홈페이지 상단">
      <span className="brand-mark"><img src="/assets/magos-logo.png" alt="" /></span>
      <span className="brand-copy">
        <strong>마고스 <em>MAGOS</em></strong>
        {!compact && <small>Engineering Judgment · Evidence · Long-Term Validation</small>}
      </span>
    </a>
  );
}

function SectionHead({ label, title, desc, align = "left" }) {
  return (
    <div className={`section-head ${align === "center" ? "section-head-center" : ""}`}>
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

async function sha256(input) {
  if (!globalThis.crypto?.subtle) throw new Error("이 브라우저에서는 Web Crypto API를 사용할 수 없습니다.");
  const bytes = new TextEncoder().encode(input);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function shortHash(value) {
  if (!value) return "—";
  return `${value.slice(0, 12)}…${value.slice(-12)}`;
}

function createInquiryId() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value || "00";
  const stamp = `${get("year")}${get("month")}${get("day")}-${get("hour")}${get("minute")}${get("second")}`;
  return `MAGOS-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function describeEmailError(status, detail) {
  const normalized = String(detail || "").replace(/\s+/g, " ").trim();
  const messages = {
    400: "EmailJS 서비스·템플릿·공개키 또는 템플릿 변수 설정을 확인해 주세요.",
    401: "EmailJS 인증정보가 올바르지 않습니다.",
    403: "EmailJS 보안설정 또는 허용 도메인에 현재 홈페이지 주소를 추가해 주세요.",
    404: "EmailJS 서비스 ID 또는 템플릿 ID를 찾을 수 없습니다.",
    412: "EmailJS에 연결된 Gmail 계정을 다시 인증해 주세요.",
    408: "상담메일 서버 응답 시간이 초과되었습니다.",
    422: "EmailJS 템플릿의 필수 입력값을 확인해 주세요.",
    429: "전송 요청이 너무 빠르거나 월간 전송한도를 초과했습니다. 잠시 후 다시 시도해 주세요.",
    500: "Vercel 상담메일 환경변수 설정을 확인해 주세요.",
    502: "EmailJS가 요청을 거절했습니다. 상세 응답을 확인해 주세요.",
    503: "Vercel 상담메일 함수에서 EmailJS에 연결하지 못했습니다.",
    504: "EmailJS 응답 시간이 초과되었습니다.",
  };
  const guide = messages[Number(status)] || "EmailJS 서비스 연결과 네트워크 상태를 확인해 주세요.";
  return `${guide}${normalized ? ` 상세: ${normalized.slice(0, 240)}` : ""}`;
}

async function sendContactRequest(templateParams) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EMAIL_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(CONTACT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(templateParams),
      signal: controller.signal,
      credentials: "same-origin",
    });

    const responseText = (await response.text()).trim();
    let result = null;
    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
      result = null;
    }

    if (!response.ok || !result?.ok) {
      const error = new Error(
        result?.message || result?.detail || responseText || `상담메일 API HTTP ${response.status}`,
      );
      error.status = result?.status || response.status;
      error.text = result?.detail || result?.message || responseText;
      throw error;
    }

    return result;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("상담메일 서버 응답 시간이 15초를 초과했습니다.");
      timeoutError.status = 408;
      timeoutError.text = timeoutError.message;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [demo, setDemo] = useState({ document: "설계변경 구조검토 및 공학판단", amount: "12500000", approver: "김황준 구조기술사", version: "v1.0" });
  const [proof, setProof] = useState({ status: "idle", recordHash: "", merkleRoot: "", packageSeal: "", originalSeal: "", message: "샘플을 봉인하면 검증값이 생성됩니다." });
  const [contactType, setContactType] = useState("프리미엄형 · 공학판단 전자증거 패키지");
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const [submit, setSubmit] = useState({ loading: false, kind: "", message: "" });
  const [patentFilter, setPatentFilter] = useState("all");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setShowTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    const onKeyDown = (event) => { if (event.key === "Escape") close(); };
    document.body.style.overflow = menuOpen ? "hidden" : "";
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const canonicalDemo = useMemo(() => JSON.stringify({ ...demo, currency: "KRW", package_type: "MAGOS_EVIDENCE_ENVELOPE_DEMO" }), [demo]);
  const filteredPatents = useMemo(() => patentFilter === "all" ? rdPortfolio : rdPortfolio.filter((item) => item.category === patentFilter), [patentFilter]);

  const buildProof = async (source = canonicalDemo, originalSeal = "") => {
    try {
      const recordHash = await sha256(source);
      const merkleRoot = await sha256(`MERKLE:${recordHash}`);
      const packageSeal = await sha256(`MAGOS-SEAL:${merkleRoot}:LTV:PQC-READY`);
      const initial = originalSeal || packageSeal;
      const valid = packageSeal === initial;
      setProof({
        status: valid ? "valid" : "invalid",
        recordHash,
        merkleRoot,
        packageSeal,
        originalSeal: initial,
        message: valid ? "패키지 구성과 봉인값이 일치합니다." : "원본 봉인값과 현재 패키지가 다릅니다. 위변조가 탐지되었습니다.",
      });
      return { recordHash, merkleRoot, packageSeal, originalSeal: initial, valid };
    } catch (error) {
      setProof({ status: "error", recordHash: "", merkleRoot: "", packageSeal: "", originalSeal: originalSeal || "", message: error instanceof Error ? error.message : "검증값 생성 중 오류가 발생했습니다." });
      return null;
    }
  };

  const sealDemo = async () => buildProof(canonicalDemo);
  const verifyDemo = async () => !proof.originalSeal ? sealDemo() : buildProof(canonicalDemo, proof.originalSeal);
  const tamperDemo = async () => {
    let baseSeal = proof.originalSeal;
    if (!baseSeal) {
      const sealed = await buildProof(canonicalDemo);
      if (!sealed) return;
      baseSeal = sealed.packageSeal;
    }
    const changed = { ...demo, amount: String((Number(demo.amount) || 0) + 1000), version: `${demo.version}-modified` };
    setDemo(changed);
    const changedCanonical = JSON.stringify({ ...changed, currency: "KRW", package_type: "MAGOS_EVIDENCE_ENVELOPE_DEMO" });
    await buildProof(changedCanonical, baseSeal);
  };
  const resetDemo = () => {
    setDemo({ document: "설계변경 구조검토 및 공학판단", amount: "12500000", approver: "김황준 구조기술사", version: "v1.0" });
    setProof({ status: "idle", recordHash: "", merkleRoot: "", packageSeal: "", originalSeal: "", message: "샘플을 봉인하면 검증값이 생성됩니다." });
  };

  const openLedgerProof = () => window.open(LEDGERPROOF_URL, "_blank", "noopener,noreferrer");
  const goContact = (type) => {
    setContactType(type);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submit.loading) return;

    setSubmit({ loading: true, kind: "", message: "" });

    const normalizedForm = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );

    if (!normalizedForm.name || !normalizedForm.email || !normalizedForm.message) {
      setSubmit({
        loading: false,
        kind: "error",
        message: "성명, 이메일, 문의 내용을 입력해 주세요.",
      });
      return;
    }

    const inquiryId = createInquiryId();
    const submittedAt = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      dateStyle: "long",
      timeStyle: "medium",
    });

    const params = {
      inquiry_id: inquiryId,
      from_name: normalizedForm.name,
      name: normalizedForm.name,
      company: normalizedForm.company || "미입력",
      reply_to: normalizedForm.email,
      email: normalizedForm.email,
      phone: normalizedForm.phone || "미입력",
      inquiry_type: contactType,
      subject: `[MAGOS 상담] ${contactType} · ${normalizedForm.name}`,
      message: normalizedForm.message,
      to_email: CONTACT_EMAIL,
      submitted_at: submittedAt,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      site_domain: typeof window !== "undefined" ? window.location.hostname : "",
    };

    try {
      const response = await sendContactRequest(params);
      console.info("MAGOS 상담메일 릴레이 성공:", response);
      setSubmit({
        loading: false,
        kind: "success",
        message: `문의가 접수되었습니다. 접수번호 ${inquiryId} · 확인 후 연락드리겠습니다.`,
      });
      setForm({ name: "", company: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("MAGOS 상담메일 릴레이 오류:", error);
      const status = error && typeof error === "object" && "status" in error
        ? String(error.status)
        : "네트워크";
      const detail = error && typeof error === "object" && "text" in error
        ? String(error.text)
        : error instanceof Error
          ? error.message
          : "알 수 없는 오류";

      setSubmit({
        loading: false,
        kind: "error",
        message: `상담메일 접수 실패 (${status}). ${describeEmailError(status, detail)} · 직접 문의: ${CONTACT_EMAIL}`,
      });
    }
  };

  return (
    <div className="magos-site" id="top">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="shell header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="주요 메뉴">
            {navItems.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
          </nav>
          <div className="header-actions">
            <button className="btn btn-ghost desktop-cta" onClick={openLedgerProof}><Icon name="code" size={18} />{LEDGERPROOF_IS_DOCUMENT ? "PoC 자료" : "PoC 실행"}</button>
            <button className="btn btn-primary desktop-cta" onClick={() => goContact("현장 적용 상담")}>상담 문의</button>
            <button className="menu-button" type="button" aria-label={menuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}>
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-nav" id="mobile-navigation">
            <div className="shell">
              {navItems.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}<Icon name="arrow" size={17} /></a>)}
              <button className="btn btn-primary" onClick={() => { setMenuOpen(false); goContact("현장 적용 상담"); }}>상담 문의하기</button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-grid-overlay" />
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="shell hero-layout">
            <div className="hero-copy">
              <div className="hero-kicker"><span>MAGOS Evidence Envelope</span><i />공학판단 전자증거 보안봉투</div>
              <h1>책임은 <em>명확하게</em>,<br />추가공사비는 <em>정당하게</em>,<br />사고 대응은 <strong>증거로</strong> 준비합니다.</h1>
              <p className="hero-lead">MAGOS는 구조기술사의 공학판단과 업무 이력을 <strong>전자증거 패키지</strong>로 만들고, 현장 적용·PoC·샘플 결과물까지 연결합니다.</p>
              <div className="hero-actions-row hero-actions-row-3">
                <button className="btn btn-primary btn-large" onClick={() => document.getElementById("field")?.scrollIntoView({ behavior: "smooth" })}>현장 적용 보기<Icon name="arrow" size={19} /></button>
                <button className="btn btn-outline-light btn-large" onClick={() => document.getElementById("samples")?.scrollIntoView({ behavior: "smooth" })}>샘플 결과물<Icon name="arrow" size={18} /></button>
                <button className="btn btn-outline-light btn-large" onClick={() => document.getElementById("poc")?.scrollIntoView({ behavior: "smooth" })}>PoC 신청<Icon name="arrow" size={18} /></button>
              </div>
              <div className="hero-usecases"><span>책임범위</span><span>설계변경</span><span>추가공사비</span><span>BIM·3D 스캔</span><span>사고원인</span><span>중대재해</span></div>
              <p className="hero-note"><Icon name="shield" size={17} /> 판단의 결과뿐 아니라, 누가·어떤 자료로·어떤 절차를 거쳐 판단했는지까지 남깁니다.</p>
            </div>
            <div className="hero-visual" aria-label="MAGOS Evidence Envelope 구성 개념도">
              <div className="visual-orbit visual-orbit-a" />
              <div className="visual-orbit visual-orbit-b" />
              <div className="envelope-stage">
                <div className="document-stack doc-three"><span>Ⅲ</span><b>무결성·절차이력<br />검증서</b><small>Manifest · Hash · Seal</small></div>
                <div className="document-stack doc-two"><span>Ⅱ</span><b>공학판단서</b><small>근거 · 위험 · 권고</small></div>
                <div className="document-stack doc-one"><span>Ⅰ</span><b>구조검토서</b><small>자료 · 기준 · 해석</small></div>
                <div className="envelope-body">
                  <div className="envelope-flap" />
                  <div className="envelope-content"><img src="/assets/magos-logo.png" alt="MAGOS 로고" /><strong>MAGOS</strong><span>EVIDENCE ENVELOPE</span></div>
                  <div className="seal-mark"><Icon name="lock" size={21} /><span>SEALED</span></div>
                </div>
                <div className="security-chip chip-one"><Icon name="check" size={15} />Merkle Root</div>
                <div className="security-chip chip-two"><Icon name="check" size={15} />Timestamp</div>
                <div className="security-chip chip-three"><Icon name="check" size={15} />PQC Ready</div>
              </div>
            </div>
          </div>
          <div className="shell hero-stats">
            <div><strong>4</strong><span>현장 적용 분야</span></div>
            <div><strong>3</strong><span>샘플 결과물 패키지</span></div>
            <div><strong>14</strong><span>특허 포트폴리오</span></div>
            <div><strong>1</strong><span>통합 Evidence Envelope</span></div>
          </div>
        </section>

        <section id="field" className="section field-section">
          <div className="shell">
            <SectionHead align="center" label="FIELD APPLICATION" title={<>개발 소개를 넘어<br /><em>현장 적용형 홈페이지</em>로 전환합니다.</>} desc="방문자가 30초 안에 ‘무슨 문제를 해결하고, 무엇을 제출하면, 어떤 결과물을 받는지’를 이해할 수 있도록 구성했습니다." />
            <div className="field-grid">
              {fieldApplications.map((item) => (
                <article className="field-card" key={item.title}>
                  <span className="field-icon"><Icon name={item.icon} size={28} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <ul>{item.bullets.map((bullet) => <li key={bullet}><Icon name="check" size={15} />{bullet}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="customer" className="section customer-needs-section">
          <div className="shell">
            <SectionHead align="center" label="CUSTOMER NEEDS" title={<>고객이 원하는 것은<br /><em>나중에 설명하고 입증할 수 있는 자료</em>입니다.</>} desc="MAGOS는 책임범위, 설계변경·추가공사비, 사고원인·중대재해 대응에 필요한 자료를 하나의 검증 가능한 체계로 연결합니다." />
            <div className="customer-needs-grid">
              {customerNeeds.map((need) => (
                <article className="need-card" key={need.no}>
                  <div className="need-top"><span>{need.no}</span><small>{need.label}</small></div>
                  <h3>{need.title}</h3>
                  <p className="need-question">{need.question}</p>
                  <p>{need.desc}</p>
                  <ul>{need.items.map((item) => <li key={item}><Icon name="check" size={15} />{item}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="customer-answer">
              <Icon name="shield" size={34} />
              <div><strong>MAGOS는 구조검토서·공학판단서·전자증거 패키지를 통해 이 요구를 해결합니다.</strong><p>책임을 회피하는 자료가 아니라, 업무범위·인과관계·합리적인 검토와 조치를 객관적으로 설명하고 입증할 수 있는 자료를 만듭니다.</p></div>
            </div>
          </div>
        </section>

        <section id="evidence" className="section intro-section">
          <div className="shell">
            <SectionHead label="WHY MAGOS" title={<>공학판단은 문서 한 장이 아니라<br /><em>근거와 절차가 연결된 증거체계</em>여야 합니다.</>} desc="최종 의견만 남기는 구조검토에서 벗어나, 판단자료의 출처·버전·변경이력·검토절차와 봉인정보까지 함께 보존합니다." />
            <div className="problem-solution-grid">
              <article className="problem-card">
                <span className="card-label">기존 업무의 공백</span>
                <h3>결론은 남지만,<br />판단과정은 흩어집니다.</h3>
                <ul>
                  <li>설계도서·해석모델·질의답변이 여러 위치에 분산</li>
                  <li>어떤 버전을 검토했는지 사후 확인 곤란</li>
                  <li>판단의 전제와 불확실성, 대안 비교가 누락</li>
                  <li>감사·분쟁·사고 시 자료 원본성과 절차 설명 부담</li>
                </ul>
              </article>
              <div className="transform-arrow"><span><Icon name="arrow" size={26} /></span><small>Evidence Transformation</small></div>
              <article className="solution-card">
                <span className="card-label">MAGOS의 해결방식</span>
                <h3>검토·판단·증거를<br />하나의 봉투로 연결합니다.</h3>
                <ul>
                  <li>구조검토서와 공학판단서의 역할을 명확히 분리</li>
                  <li>Manifest·해시·절차이력으로 자료 신뢰성 보강</li>
                  <li>Package Seal·서명·타임스탬프로 통합 봉인</li>
                  <li>장기검증과 향후 양자내성 전환 대응 구조 확보</li>
                </ul>
              </article>
            </div>
            <div className="brand-definition">
              <div className="definition-logo"><img src="/assets/magos-logo.png" alt="" /></div>
              <div><span>핵심 서비스 브랜드</span><h3>MAGOS Evidence Envelope</h3><p>구조기술사의 공학판단을 전자증거 패키지로 만들고, 장기검증 가능한 보안봉투로 봉인·보존·검증하는 전문 서비스입니다.</p></div>
              <div className="definition-tags"><span>Engineering Judgment</span><span>Electronic Evidence</span><span>Long-Term Validation</span><span>Post-Quantum Ready</span></div>
            </div>
          </div>
        </section>

        <section id="comparison" className="section comparison-section">
          <div className="shell">
            <SectionHead label="STRUCTURAL REVIEW vs ENGINEERING JUDGMENT" title={<>구조검토서는 안전성을 검증하고,<br /><em>공학판단서는 최종 의사결정을 설명</em>합니다.</>} desc="공학판단서는 구조검토를 대체하지 않습니다. 구조검토를 핵심 근거자료로 포함하고 현장조건·대안·위험·비용·불확실성을 함께 판단하는 상위문서입니다." />
            <div className="comparison-table-wrap" role="table" aria-label="구조검토서와 공학판단서 비교">
              <div className="comparison-grid comparison-grid-head" role="row"><strong role="columnheader">구분</strong><strong role="columnheader">구조검토서</strong><strong role="columnheader">공학판단서</strong></div>
              {comparisonRows.map(([label, review, judgment]) => <div className="comparison-grid" role="row" key={label}><b role="rowheader">{label}</b><p>{review}</p><p>{judgment}</p></div>)}
            </div>
            <div className="comparison-note"><strong>관계 정리</strong><p>구조검토서는 공학판단의 핵심 근거자료이고, 공학판단서는 구조검토 결과를 포함하여 설계변경·추가공사비·책임추적·사고대응에 필요한 최종 결론을 내리는 상위문서입니다.</p></div>
          </div>
        </section>

        <section id="process" className="section process-section">
          <div className="shell">
            <SectionHead align="center" label="5-STEP EVIDENCE WORKFLOW" title={<>공학판단이 <em>장기검증 전자증거</em>가 되는 과정</>} desc="기술검토의 본질은 유지하면서, 판단 근거와 전자자료를 검증 가능한 구조로 확장합니다." />
            <div className="process-flow">
              {evidenceSteps.map((step, index) => (
                <article className="process-card" key={step.no}>
                  <div className="process-top"><span className="process-no">{step.no}</span><span className="process-icon"><Icon name={step.icon} size={27} /></span></div>
                  <small>{step.en}</small>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <div className="process-output"><Icon name="check" size={16} />{step.output}</div>
                  {index < evidenceSteps.length - 1 && <span className="process-connector"><Icon name="arrow" size={18} /></span>}
                </article>
              ))}
            </div>
            <div className="process-assurance"><Icon name="shield" size={36} /><div><strong>표현의 원칙</strong><p>MAGOS는 “위변조가 절대 불가능하다”거나 “법적 효력이 자동 보장된다”고 단정하지 않습니다. 자료의 무결성·변경 여부·판단절차의 검증과 설명 가능성을 높이는 체계를 제공합니다.</p></div></div>
          </div>
        </section>

        <section id="services" className="section service-section">
          <div className="shell">
            <SectionHead label="SERVICE PORTFOLIO" title={<>업무의 중요도와 책임수준에 맞춘<br /><em>4단계 전문 서비스</em></>} desc="일반 구조검토부터 사고·소송·보험·분쟁 대응까지 필요한 증거화 수준을 선택합니다." />
            <div className="service-grid">
              {services.map((service) => (
                <article className={`service-card ${service.featured ? "featured" : ""}`} key={service.tier}>
                  {service.featured && <span className="recommended">대표 서비스</span>}
                  <div className="service-tier"><span>{service.en}</span><strong>{service.tier}</strong></div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <div className="service-divider" />
                  <small>주요 적용 업무</small>
                  <ul>{service.uses.map((item) => <li key={item}><Icon name="check" size={15} />{item}</li>)}</ul>
                  <button className={`btn ${service.featured ? "btn-primary" : "btn-soft"}`} onClick={() => goContact(`${service.tier} · ${service.title}`)}>서비스 문의<Icon name="arrow" size={17} /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="samples" className="section samples-section">
          <div className="shell">
            <SectionHead align="center" label="SAMPLE OUTPUTS" title={<>고객이 실제로 받게 되는<br /><em>샘플 결과물 구조</em></>} desc="특허 자체보다 중요한 것은 현장에서 어떤 결과물이 나오는지입니다. 아래 구성은 상담과 PoC에서 설명할 대표 산출물입니다." />
            <div className="sample-grid">
              {samplePackages.map((sample) => (
                <article className="sample-card" key={sample.title}>
                  <h3>{sample.title}</h3>
                  <p>{sample.summary}</p>
                  <ul>{sample.items.map((item) => <li key={item}><Icon name="check" size={15} />{item}</li>)}</ul>
                  <button className="btn btn-soft" onClick={() => goContact(`${sample.title} 샘플 문의`)}>샘플 설명 요청</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="documents" className="section documents-section">
          <div className="shell documents-layout">
            <div className="documents-copy">
              <SectionHead label="STANDARD DOCUMENT SYSTEM v3.0" title={<>세 권의 전문문서가<br /><em>하나의 증거패키지</em>가 됩니다.</>} desc="기술검토, 공학적 판단, 전자자료 검증을 서로 섞지 않고 각각의 책임과 목적에 맞게 구성합니다." />
              <div className="document-equation"><span>제1권</span><b>+</b><span>제2권</span><b>+</b><span>제3권</span><b>=</b><strong>Evidence Envelope</strong></div>
              <button className="btn btn-navy" onClick={() => goContact("MAGOS 표준 문서체계 적용 문의")}>표준 문서체계 적용 문의<Icon name="arrow" size={18} /></button>
            </div>
            <div className="document-stack-list">
              {documents.map((doc, index) => (
                <article className="volume-card" key={doc.vol} style={{ "--index": index }}>
                  <div className="volume-spine"><span>VOL.</span><strong>0{index + 1}</strong></div>
                  <div className="volume-content"><div className="volume-meta"><span>{doc.vol}</span><small>{doc.en}</small></div><h3>{doc.title}</h3><ul>{doc.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </article>
              ))}
              <div className="volume-seal"><Icon name="lock" size={25} /><strong>Package Seal</strong><span>통합 봉인·보존·검증</span></div>
            </div>
          </div>
        </section>

        <section className="section applications-section">
          <div className="shell">
            <SectionHead align="center" label="APPLICATION AREAS" title={<>판단의 책임과 자료 신뢰성이 중요한<br /><em>고부가가치 업무에 적용</em>합니다.</>} />
            <div className="application-grid">
              {applications.map(([title, desc, icon]) => <article key={title}><span><Icon name={icon} size={27} /></span><h3>{title}</h3><p>{desc}</p><button onClick={() => goContact(`${title} 적용 문의`)} aria-label={`${title} 문의`}><Icon name="arrow" size={19} /></button></article>)}
            </div>
          </div>
        </section>

        <section id="poc" className="section poc-section">
          <div className="shell">
            <SectionHead align="center" label="POC PROGRAMS" title={<>협력기업·현장과 함께 진행할<br /><em>대표 PoC 3종</em></>} desc="BIM, 3차원 스캔, 설계변경, 사고대응 현장에 맞춰 PoC를 제안하고 샘플 패키지를 구성합니다." />
            <div className="poc-grid">
              {pocPrograms.map((item) => (
                <article className="poc-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <ul>{item.bullets.map((bullet) => <li key={bullet}><Icon name="check" size={15} />{bullet}</li>)}</ul>
                  <button className="btn btn-primary" onClick={() => goContact(`${item.title} 신청`)}>PoC 상담 신청</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ledgerproof" className="section ledger-section">
          <div className="ledger-bg-code" aria-hidden="true">01001101 01000001 01000111 01001111 01010011 · HASH · MERKLE · SEAL · LTV · PQC</div>
          <div className="shell ledger-layout">
            <div className="ledger-copy">
              <span className="eyebrow eyebrow-light">ORTHOGONAL-CODE SECURITY PoC</span>
              <h2>원문을 공개하지 않고도<br /><em>패키지의 위변조를 검증</em>합니다.</h2>
              <p>MAGOS LedgerProof는 거래·승인·정산·회계전표 또는 공학판단 자료를 하나로 봉인하고, 해시·Merkle Root·Package Seal과 직교코드 descriptor를 이용하여 외부검증과 선택복원 구조를 시연합니다.</p>
              <ul className="ledger-features">
                <li><Icon name="check" size={17} />민감정보 원문 대신 토큰·암호문·직교코드 descriptor 구성</li>
                <li><Icon name="check" size={17} />개별 레코드 해시와 전체 Merkle Root 검증</li>
                <li><Icon name="check" size={17} />금액·승인·정산 연결성 및 Package Seal 확인</li>
                <li><Icon name="check" size={17} />위변조 탐지, 내부 복원, PDF 검증 리포트 생성 PoC</li>
              </ul>
              <div className="ledger-actions"><button className="btn btn-gold btn-large" onClick={openLedgerProof}>{LEDGERPROOF_IS_DOCUMENT ? "LedgerProof PoC 자료 보기" : "정식 LedgerProof PoC 열기"}<Icon name="external" size={18} /></button><a className="btn btn-outline-light" href="/documents/MAGOS_LedgerProof_PoC_v0.1.pdf" target="_blank" rel="noreferrer">PoC 설계서 PDF<Icon name="external" size={17} /></a></div>
              <p className="poc-note">현재 페이지의 아래 시연은 브라우저용 개념 데모입니다. 실제 업로드 검증·선택복원·PDF 리포트 기능은 함께 제공된 FastAPI PoC에서 실행됩니다.</p>
            </div>
            <div className="proof-console">
              <div className="console-head"><div><span className="status-dot" />MAGOS Evidence Seal Demo</div><small>Browser-side SHA-256 concept demo</small></div>
              <div className="console-form">
                <label>판단 문서<input value={demo.document} onChange={(e) => setDemo({ ...demo, document: e.target.value })} /></label>
                <div className="console-row"><label>금액·수치 예시<input inputMode="numeric" value={demo.amount} onChange={(e) => setDemo({ ...demo, amount: e.target.value.replace(/\D/g, "") })} /></label><label>버전<input value={demo.version} onChange={(e) => setDemo({ ...demo, version: e.target.value })} /></label></div>
                <label>검토·승인자<input value={demo.approver} onChange={(e) => setDemo({ ...demo, approver: e.target.value })} /></label>
              </div>
              <div className="console-buttons"><button onClick={sealDemo}><Icon name="lock" size={16} />샘플 봉인</button><button onClick={verifyDemo}><Icon name="shield" size={16} />외부검증</button><button className="danger" onClick={tamperDemo}><Icon name="code" size={16} />위변조 시연</button><button onClick={resetDemo}><Icon name="refresh" size={16} />초기화</button></div>
              <div className={`verification-banner ${proof.status}`} role="status" aria-live="polite"><span>{proof.status === "valid" ? "VERIFIED" : proof.status === "invalid" ? "TAMPER DETECTED" : "READY"}</span><p>{proof.message}</p></div>
              <div className="hash-output"><div><span>Record Hash</span><code title={proof.recordHash}>{shortHash(proof.recordHash)}</code></div><div><span>Merkle Root</span><code title={proof.merkleRoot}>{shortHash(proof.merkleRoot)}</code></div><div><span>Current Package Seal</span><code title={proof.packageSeal}>{shortHash(proof.packageSeal)}</code></div><div><span>Original Package Seal</span><code title={proof.originalSeal}>{shortHash(proof.originalSeal)}</code></div></div>
            </div>
          </div>
        </section>

        <section id="technology" className="section technology-section">
          <div className="shell">
            <SectionHead label="TECHNOLOGY FOUNDATION" title={<>파일을 보관하는 것을 넘어<br /><em>미래에도 검증할 수 있도록</em> 설계합니다.</>} desc="기술용어를 나열하는 데 그치지 않고, 각각의 기술이 판단자료의 신뢰성과 장기검증에 어떤 역할을 하는지 설명합니다." />
            <div className="technology-grid">
              {technologies.map(([code, title, desc], index) => <article key={code}><div className="tech-code">{String(index + 1).padStart(2, "0")}<span>{code}</span></div><h3>{title}</h3><p>{desc}</p></article>)}
            </div>
            <div className="architecture-strip"><div className="architecture-step"><span>INPUT</span><strong>원본·메타데이터</strong></div><Icon name="arrow"/><div className="architecture-step"><span>PACKAGE</span><strong>Manifest·Hash</strong></div><Icon name="arrow"/><div className="architecture-step"><span>SEAL</span><strong>Merkle·Signature</strong></div><Icon name="arrow"/><div className="architecture-step"><span>LTV</span><strong>Timestamp·Renewal</strong></div><Icon name="arrow"/><div className="architecture-step architecture-final"><span>MIGRATION</span><strong>PQC 전환 대응</strong></div></div>
          </div>
        </section>

        <section id="patents" className="section rd-section">
          <div className="shell rd-layout">
            <div className="rd-copy">
              <span className="eyebrow">R&D · PATENT PORTFOLIO</span>
              <h2>공학판단에서 장기검증, BIM·3차원 스캔 연계까지<br /><em>14건 특허출원 포트폴리오</em>로 연결합니다.</h2>
              <p>2026년 현재 출원 완료된 기술 포트폴리오 14건을 고객가치와 현장적용 흐름에 맞춰 정리했습니다. 출원 완료는 특허권 등록을 의미하지 않으며 권리범위는 심사와 등록 청구항에 따라 확정됩니다.</p>
              <div className="rd-actions"><a className="btn btn-navy" href="/documents/MAGOS_LedgerProof_PoC_v0.1.pdf" target="_blank" rel="noreferrer">LedgerProof 설계서<Icon name="external" size={18} /></a><button className="btn btn-soft" onClick={() => goContact("공동 연구개발·PoC 협력 제안")}>공동 PoC 제안</button></div>
            </div>
            <div>
              <div className="patent-filter" aria-label="특허 분류 필터">{patentCategories.map(([key, label]) => <button type="button" className={patentFilter === key ? "active" : ""} onClick={() => setPatentFilter(key)} key={key}>{label}</button>)}</div>
              <div className="portfolio-list">{filteredPatents.map((item) => { const index = rdPortfolio.indexOf(item); return <div key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.title}</p><b className={`patent-badge ${item.category}`}>{item.label}</b></div>; })}</div>
            </div>
          </div>
          <div className="shell ip-disclaimer">※ 특허출원은 등록을 의미하지 않으며, 개별 기술의 권리범위는 향후 특허청 심사와 등록 청구항에 따라 확정됩니다.</div>
        </section>

        <section id="roadmap" className="section roadmap-section">
          <div className="shell">
            <SectionHead align="center" label="COMMERCIALIZATION ROADMAP" title={<>특허에서 실증·인증·제품화·공공조달로<br /><em>단계적으로 사업화</em>합니다.</>} desc="완료된 단계와 향후 목표를 구분합니다. 정부과제 선정, NET·혁신제품 지정과 조달성과는 관계기관 심사와 사업환경에 따라 달라질 수 있습니다." />
            <div className="roadmap-grid">{roadmap.map((item) => <article className={`roadmap-card ${item.tone}`} key={`${item.year}-${item.title}`}><div className="roadmap-year"><span>{item.year}</span><small>{item.status}</small></div><h3>{item.title}</h3><p>{item.desc}</p></article>)}</div>
            <div className="roadmap-disclaimer"><Icon name="shield" size={30} /><div><strong>목표 표시 원칙</strong><p>NET 인증 자체가 수의계약을 자동 보장하는 것은 아닙니다. 현장실증·제품화·혁신제품 지정 등 필요한 절차를 단계별로 추진하여 공공조달 진입조건을 확보하는 계획입니다.</p></div></div>
          </div>
        </section>

        <section id="profile" className="section profile-section">
          <div className="shell profile-layout">
            <div className="profile-emblem"><div className="profile-logo-ring"><img src="/assets/magos-logo.png" alt="MAGOS 로고" /></div><span>공학판단 전자증거 아키텍트</span><strong>Engineering Judgment<br />& Evidence Architect</strong></div>
            <div className="profile-copy">
              <span className="eyebrow">FOUNDER & PRINCIPAL ENGINEER</span>
              <h2>김황준 <small>공학박사 · 토목구조기술사</small></h2>
              <p className="profile-lead">30년 이상의 공공시설 설계·검토·유지관리 경험과 구조공학 전문성을 바탕으로, 구조기술사의 공학판단을 검증 가능한 전자증거로 전환하는 문서체계와 기술을 개발하고 있습니다.</p>
              <div className="profile-grid"><div><span>전문영역</span><strong>구조안전 · 공학판단 · 설계변경</strong></div><div><span>증거영역</span><strong>건설포렌식 · 법원감정 · 전자증거</strong></div><div><span>기술영역</span><strong>장기검증 · 양자내성 전환 · BIM·3D 스캔</strong></div><div><span>사무소</span><strong>마고스 구조기술사사무소</strong></div></div>
              <blockquote>“공학판단의 결과뿐 아니라, 판단에 이르는 과정까지 보존합니다.”</blockquote>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="shell contact-layout">
            <div className="contact-copy">
              <span className="eyebrow eyebrow-light">CONTACT MAGOS</span>
              <h2>보유한 자료만으로도 1차 상담이 가능합니다.<br />현장 상황에 맞는 적용방향을 함께 정리해 드립니다.</h2>
              <p>구조검토, 설계변경, BIM·3차원 스캔, 사고·분쟁, 법원감정, 보험·손해사정, 공공기관 검토 및 공동 PoC에 대해 문의해 주세요.</p>
              <div className="contact-details"><a href={`tel:${CONTACT_PHONE_URI}`}><span><Icon name="phone"/></span><div><small>전화</small><strong>{CONTACT_PHONE}</strong></div></a><a href={`mailto:${CONTACT_EMAIL}`}><span><Icon name="mail"/></span><div><small>이메일</small><strong>{CONTACT_EMAIL}</strong></div></a><div><span><Icon name="pin"/></span><div><small>주소</small><strong>경기도 광주시 초월읍 현산로 116, 101호</strong></div></div></div>
              <div className="contact-quick"><button onClick={() => setContactType("책임범위·합리적 조치 입증")}>책임범위</button><button onClick={() => setContactType("설계변경·추가공사비 입증")}>추가공사비</button><button onClick={() => setContactType("BIM·3차원 스캔 객체증거")}>BIM·3D 스캔</button><button onClick={() => setContactType("사고원인·중대재해 대응")}>사고대응</button><button onClick={() => setContactType("공동 PoC·정부과제 협력")}>공동 PoC</button></div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-heading"><span>INQUIRY FORM</span><h3>서비스 검토·견적 문의</h3></div>
              <label>문의 유형<select value={contactType} onChange={(e) => setContactType(e.target.value)}>{["프리미엄형 · 공학판단 전자증거 패키지", "책임범위·합리적 조치 입증", "설계변경·추가공사비 입증", "BIM·3차원 스캔 객체증거", "사고원인·중대재해 대응", "기본형 · 구조검토서", "고급형 · 구조검토서 + 공학판단서", "특수형 · 사고·소송·보험·분쟁 대응", "공동 PoC·정부과제 협력", "기타 문의"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <div className="form-row"><label>성명<input required autoComplete="name" maxLength={50} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="성명을 입력하세요" /></label><label>회사·기관<input autoComplete="organization" maxLength={100} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="회사 또는 기관명" /></label></div>
              <div className="form-row"><label>이메일<input required type="email" autoComplete="email" maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" /></label><label>연락처<input type="tel" autoComplete="tel" maxLength={30} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="010-0000-0000" /></label></div>
              <label>문의 내용<textarea required maxLength={3000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="대상 구조물, 현재 상황, 보유자료, 요청사항을 작성해 주세요." /></label>
              <button className="btn btn-gold btn-submit" disabled={submit.loading}>{submit.loading ? "전송 중…" : "문의 접수하기"}<Icon name="arrow" size={18} /></button>
              {submit.message && <p className={`submit-message ${submit.kind}`} role="status" aria-live="polite">{submit.message}</p>}
              <small className="privacy-note">입력한 정보는 문의 검토와 회신 목적으로만 사용됩니다.</small>
              <small className="privacy-note">Contact Relay v{CONTACT_RELAY_VERSION}</small>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-top"><Logo compact /><div className="footer-tagline">Engineering Judgment,<br /><strong>Preserved as Verifiable Evidence.</strong></div><div className="footer-links"><a href="#field">현장 적용</a><a href="#services">서비스</a><a href="#samples">샘플 결과</a><a href="#patents">특허 14건</a><a href="#roadmap">로드맵</a><a href="#contact">문의</a></div></div>
        <div className="shell footer-bottom"><p>© 2026 MAGOS Structure Engineering Office. All rights reserved.</p><p>본 홈페이지의 설명은 일반 안내이며, 개별 사건의 법적 판단·계약금액 인정·특허등록·정부과제 선정·NET·혁신제품 지정 또는 조달성과를 보장하지 않습니다.</p></div>
      </footer>

      {showTop && <button className="top-button" aria-label="페이지 상단으로" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="top" /></button>}
    </div>
  );
}
