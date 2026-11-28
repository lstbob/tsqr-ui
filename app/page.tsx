export default function LandingPage() {
  return (
    <div className="landing relative min-h-screen text-zinc-900 dark:text-zinc-100">
      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-10">
        <section className="flex flex-col gap-6">
          <div style={{ animation: "fadeIn 1.2s ease-out 0.3s forwards", opacity: 0 }}>
            <div className="rotate-graph h-12 w-12 text-zinc-400 dark:text-zinc-600">
              <svg viewBox="0 0 100 100">
                <line className="edge" x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="85" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="90" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="70" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="30" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="10" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <line className="edge" x1="50" y1="50" x2="15" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <circle cx="50" cy="50" r="5" className="fill-zinc-900 dark:fill-zinc-100" />
                <circle cx="50" cy="10" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="85" cy="30" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="90" cy="65" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="70" cy="90" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="30" cy="90" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="10" cy="65" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
                <circle cx="15" cy="30" r="3.5" className="fill-zinc-400 dark:fill-zinc-500" />
              </svg>
            </div>
          </div>
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ animation: "fadeIn 1.2s ease-out 0.6s forwards", opacity: 0 }}
          >
            TownsSquare
          </h1>
          <p
            className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400"
            style={{ animation: "fadeIn 1.2s ease-out 0.9s forwards", opacity: 0 }}
          >
            Community &middot; Sustainability &middot; Collaboration
          </p>
          <p
            className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
            style={{ animation: "fadeIn 1.2s ease-out 0.8s forwards", opacity: 0 }}
          >
            A neighbourhood toolkit for sharing and mutual aid. Borrow what you need, share what you have, and help the people around you.
          </p>
          <p
            className="pt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400"
            style={{ animation: "fadeIn 1.2s ease-out 1.1s forwards", opacity: 0 }}
          >
            Coming soon <span className="pulse-text">(probably not)</span>
          </p>
        </section>
      </main>
    </div>
  );
}
