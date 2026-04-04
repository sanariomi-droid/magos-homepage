export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight">MAGOS</div>
            <div className="text-xs text-slate-400">Structural Risk &amp; Engineering Decision</div>
          </div>
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#service" className="hover:text-white">서비스</a>
            <a href="#lite" className="hover:text-white">무료 진단</a>
            <a href="#premium" className="hover:text-white">전문가 검토</a>
            <a href="#contact" className="hover:text-white">문의</a>
          </nav>
          <div className="flex gap-3">
            <a href={import.meta?.env?.VITE_LITE_URL || process.env.NEXT_PUBLIC_LITE_URL || "/lite"} className="rounded-2xl border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10">무료 진단</a>
            <a href="#contact" className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300">전문가 검토</a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_25%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                MAGOS MRI Platform
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                구조기술사 판단을 정량화하여
                <span className="block text-cyan-300">보험 인수심사와 분쟁 대응</span>
                에 활용하는 구조안전 리스크 평가 서비스
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                PSI, DRI, MRI 기반 구조 리스크를 수치화하고 구조기술사 검토와 결합하여
                보험, 건설, 유지관리, 법원감정까지 연결합니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={import.meta?.env?.VITE_LITE_URL || process.env.NEXT_PUBLIC_LITE_URL || "/lite"} className="rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">무료 구조안전 진단 시작</a>
                <a href="#contact" className="rounded-2xl border border-white/15 px-6 py-3 font-medium text-white transition hover:bg-white/5">전문가 검토 요청</a>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-semibold text-white">PSI</div>
                  <div className="mt-1 text-slate-400">사고확률 기반 리스크</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-semibold text-white">DRI</div>
                  <div className="mt-1 text-slate-400">열화·상태 리스크</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-semibold text-white">MRI</div>
                  <div className="mt-1 text-slate-400">통합 구조 리스크 지수</div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Risk Summary</div>
                    <div className="text-xl font-semibold">MRI Dashboard</div>
                  </div>
                  <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">Live Demo</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["PSI", "58.0"],
                    ["DRI", "64.0"],
                    ["BII", "46.0"],
                    ["CLI", "52.0"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="text-sm text-slate-400">{label}</div>
                      <div className="mt-2 text-3xl font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-cyan-200">최종 MRI</div>
                      <div className="mt-1 text-4xl font-semibold text-white">61.8</div>
                    </div>
                    <div className="rounded-2xl bg-amber-400 px-4 py-2 font-semibold text-slate-950">C / 고위험 진입</div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-cyan-50/90">
                    데이터 신뢰도와 구조 중요도를 함께 반영한 결과이며, 전문가 검토 시 Je 보정값이 추가됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="service" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <div className="text-sm font-medium text-cyan-300">서비스 소개</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">구조안전 판단을 숫자로 바꾸는 시스템</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              MAGOS는 구조물의 상태, 열화, 하중, 환경, 데이터 신뢰도를 통합해 구조 리스크를 정량화하고,
              이를 구조기술사 검토와 결합하여 실제 의사결정에 활용 가능한 형태로 제공합니다.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["PSI", "사고 발생 가능성을 반영한 구조 리스크"],
              ["DRI", "균열, 부식, 열화 상태 기반 리스크"],
              ["BII", "운영 중단, 비용, 영향도 평가"],
              ["CLI", "계약 및 책임 노출 리스크"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <div className="text-2xl font-semibold text-cyan-300">{title}</div>
                <p className="mt-3 leading-7 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="lite" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.1fr,0.9fr]">
            <div>
              <div className="text-sm font-medium text-cyan-300">무료 진단</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">무료 구조안전 리스크 진단</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                기본 자동 분석을 통해 PSI, DRI, MRI 점수와 등급을 확인할 수 있습니다.
                간단한 입력만으로 현재 구조물의 위험 수준을 빠르게 확인해 보세요.
              </p>
              <div className="mt-8 rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-50">
                본 결과는 자동 분석 기반 참고용입니다. 보험 제출용 보고서, 구조기술사 검토, 분쟁 대응 결과는 별도 제공됩니다.
              </div>
              <div className="mt-8">
                <a href={import.meta?.env?.VITE_LITE_URL || process.env.NEXT_PUBLIC_LITE_URL || "/lite"} className="rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">무료 진단 시작</a>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
              <div className="text-sm text-slate-400">Lite Workflow</div>
              <div className="mt-6 space-y-4">
                {[
                  ["01", "기본 정보 입력"],
                  ["02", "손상 및 환경 수준 선택"],
                  ["03", "PSI / DRI 자동 계산"],
                  ["04", "MRI 점수 및 등급 확인"],
                  ["05", "전문가 검토 요청"],
                ].map(([num, label]) => (
                  <div key={num} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-sm font-semibold text-slate-950">{num}</div>
                    <div className="text-slate-200">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="premium" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <div className="text-sm font-medium text-cyan-300">전문가 검토 서비스</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">무료 결과를 실무 제출용 결과서로 확장합니다</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["보험 인수심사형", "구조안전 리스크를 점수와 등급으로 정리하여 조건부 인수, 할증, 추가점검 필요성 판단을 지원합니다."],
              ["구조기술사 검토형", "자동 분석 결과에 구조기술사 판단을 결합하여 실무 제출용 검토 보고서를 제공합니다."],
              ["법원감정 / 포렌식형", "사전 리스크 평가와 사고 데이터를 연결하여 원인기여도 및 책임영향도 분석에 활용합니다."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[26px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{desc}</p>
                <a href="#contact" className="mt-6 inline-flex rounded-2xl border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10">상담 요청</a>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-3xl">
              <div className="text-sm font-medium text-cyan-300">활용 분야</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">보험, 건설, 유지관리, 분쟁 대응까지 연결됩니다</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["보험사", "건설공사보험 인수심사 및 손해율 관리"],
                ["건설사 / 엔지니어링", "구조검토 및 리스크 평가"],
                ["유지관리 기관", "시설물 상태 평가 및 우선순위 결정"],
                ["손해사정 / 법원감정", "사고 원인 분석 및 책임 판단"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-[24px] border border-white/10 bg-slate-900/60 p-6">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <div className="text-sm font-medium text-cyan-300">왜 MAGOS인가</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">구조기술사 판단, 정량화, 보험/법원 연계를 하나로</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              ["구조기술사 기반 판단", "실제 구조설계 및 유지관리 경험 기반"],
              ["리스크 정량화", "정성적 판단을 수치로 변환"],
              ["보험 / 법원 연계", "인수심사 및 분쟁 대응까지 확장"],
              ["데이터 + 전문가 결합", "AI 자동 분석과 전문가 판단의 통합 구조"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 pb-24">
          <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="text-sm font-medium text-cyan-300">전문가 검토 요청</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">무료 진단 결과만으로 판단이 어려우신가요?</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                구조기술사 검토를 통해 보다 정확한 결과를 제공합니다. 보험사, 건설사, 손해사정, 법원감정 관련 문의를 받습니다.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="mailto:contact@magos.co.kr" className="rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">이메일 문의</a>
              <a href="https://open.kakao.com/" className="rounded-2xl border border-white/15 px-6 py-3 font-medium text-white transition hover:bg-white/5">카카오 상담</a>
              <a href={import.meta?.env?.VITE_LITE_URL || process.env.NEXT_PUBLIC_LITE_URL || "/lite"} className="rounded-2xl border border-cyan-400/30 px-6 py-3 font-medium text-cyan-300 transition hover:bg-cyan-400/10">무료 진단 다시 하기</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-medium text-white">MAGOS Structure Engineering Lab</div>
            <div className="mt-1">김황준 | 토목구조기술사 | 구조안전 리스크 정량화 · 보험 · 분쟁 대응</div>
          </div>
          <div>© MAGOS. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
