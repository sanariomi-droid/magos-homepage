import { calculateMRI, getRiskGrade } from "../engine/riskEngine";

export default function Result({ data, onBack }) {
  if (!data) return null;

  const score = calculateMRI(data);
  const grade = getRiskGrade(score);

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h2>리스크 결과</h2>
      <p>MRI 점수: {score}</p>
      <p>등급: {grade}</p>
      <button onClick={onBack}>처음으로</button>
    </div>
  );
}