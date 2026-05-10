import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Live Demo", href: "#demo" },
  { label: "AI Magic", href: "#ai" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
] as const;

export function HeroNav() {
  return (
    <header className="relative z-20 pt-6">
      <Container>
        <nav className="flex items-center justify-between rounded-full border border-white/8 bg-white/5 px-5 py-3 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-bold text-white select-none">
              P
            </span>
            <span className="text-sm font-semibold text-white tracking-tight">Pitik</span>
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Button size="sm">Try Booth</Button>
        </nav>
      </Container>
    </header>
  );
}
