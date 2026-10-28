"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const grupos = [
  {
    titulo: "Operação",
    links: [
      { href: "/", rotulo: "Visão geral", icone: "grafico" },
      { href: "/escritorios", rotulo: "Escritórios", icone: "predio" },
      { href: "/usuarios", rotulo: "Usuários", icone: "pessoas" },
    ],
  },
  {
    titulo: "Sistema",
    links: [{ href: "/convites", rotulo: "Convites", icone: "lista" }],
  },
];

function Icone({ nome }: { nome: string }) {
  const props = {
    viewBox: "0 0 24 24",
    className: "size-[18px] shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (nome === "grafico") {
    return (
      <svg {...props}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-4" />
        <path d="M12 16V8" />
        <path d="M16 16v-6" />
      </svg>
    );
  }
  if (nome === "predio") {
    return (
      <svg {...props}>
        <path d="M4 20V6.5A1.5 1.5 0 0 1 5.5 5h7A1.5 1.5 0 0 1 14 6.5V20" />
        <path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5V20" />
        <path d="M4 20h16" />
        <path d="M8 8h2M8 12h2M8 16h2" />
      </svg>
    );
  }
  if (nome === "pessoas") {
    return (
      <svg {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a3 3 0 0 1 0 5.75" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

export function NavegacaoPainel() {
  const caminho = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:flex-1 md:overflow-y-auto md:px-3 md:py-2 md:pb-4">
      {grupos.map((grupo) => (
        <div key={grupo.titulo} className="flex shrink-0 gap-1 md:mb-1 md:block">
          <p className="hidden px-3 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 md:block">
            {grupo.titulo}
          </p>
          {grupo.links.map((link) => {
            const ativo = link.href === "/" ? caminho === "/" : caminho.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm md:mt-0.5 md:w-full md:py-2.5 ${
                  ativo ? "bg-white font-semibold text-panel shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icone nome={link.icone} />
                {link.rotulo}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
