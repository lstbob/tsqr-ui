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

export function ConnectionLines() {
  return (
    <div className="connection-lines">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <line x1="200" y1="200" x2="600" y2="400" />
        <line x1="600" y1="400" x2="1000" y2="300" />
        <line x1="1000" y1="300" x2="1400" y2="500" />
        <line x1="1400" y1="500" x2="1700" y2="200" />
        <line x1="600" y1="400" x2="800" y2="700" />
        <line x1="800" y1="700" x2="1200" y2="800" />
        <line x1="1200" y1="800" x2="1400" y2="500" />
        <line x1="200" y1="200" x2="800" y2="700" />
      </svg>
    </div>
  );
}
