export default function HomePage({ onStart }) {
  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>MAGOS Risk Engine</h1>
      <p>구조 리스크 평가 시작 화면입니다.</p>

      <button
        onClick={onStart}
        style={{
          padding: "10px 20px",
          background: "#00c853",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        리스크 평가 시작
      </button>
    </div>
  );
}