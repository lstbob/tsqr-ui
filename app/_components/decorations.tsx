export function Leaves() {
  const leaves = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="leaf">
      <div className="leaf-inner">
        <svg viewBox="0 0 24 24">
          <path d="M12 2C8 6 6 12 12 22C18 12 16 6 12 2Z" />
        </svg>
      </div>
    </div>
  ));
  return <div className="leaves">{leaves}</div>;
}

