import { useState } from "react";

export default function Input({ onSubmit }) {
  const [psi, setPsi] = useState(50);
  const [dri, setDri] = useState(50);
  const [bii, setBii] = useState(50);
  const [cli, setCli] = useState(50);

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h2>리스크 입력</h2>

      <p>PSI (사고확률)</p>
      <input
        type="number"
        value={psi}
        onChange={(e) => setPsi(Number(e.target.value))}
      />

      <p>DRI (열화상태)</p>
      <input
        type="number"
        value={dri}
        onChange={(e) => setDri(Number(e.target.value))}
      />

      <p>BII (비용영향)</p>
      <input
        type="number"
        value={bii}
        onChange={(e) => setBii(Number(e.target.value))}
      />

      <p>CLI (책임리스크)</p>
      <input
        type="number"
        value={cli}
        onChange={(e) => setCli(Number(e.target.value))}
      />

      <br /><br />

      <button
        onClick={() => onSubmit({ psi, dri, bii, cli })}
        style={{ padding: 10, background: "#00c853", color: "white" }}
      >
        결과 계산
      </button>
    </div>
  );
}