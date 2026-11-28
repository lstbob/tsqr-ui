import Link from "next/link";

export default function ModuleCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="rounded-xl border border-ui-700 p-5 transition-colors hover:border-ui-500">
      <h3 className="font-semibold text-ui-50">{title}</h3>
      <p className="mt-1 text-sm text-ui-300">{description}</p>
    </Link>
  );
}
