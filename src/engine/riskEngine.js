export function calculateMRI({ psi, dri, bii, cli }) {
  const MRI = 0.25 * psi + 0.25 * dri + 0.25 * bii + 0.25 * cli;
  return Math.round(MRI);
}

export function getRiskGrade(score) {
  if (score >= 80) return "A (안전)";
  if (score >= 60) return "B (보통)";
  if (score >= 40) return "C (주의)";
  return "D (위험)";
}