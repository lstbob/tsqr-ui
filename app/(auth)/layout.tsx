import { Leaves, ConnectionLines } from "../_components/decorations";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-forest-950 px-4">
      <Leaves />
      <ConnectionLines />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="text-2xl font-bold text-forest-50">TownsSquare</a>
        </div>
        {children}
      </div>
    </div>
  );
}