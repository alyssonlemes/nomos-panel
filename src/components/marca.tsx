/** Monograma do Nomos. `clara` deixa o desenho claro, para fundo escuro. */
export function Marca({ clara = false, className = "" }: { clara?: boolean; className?: string }) {
  const tinta = clara ? "#f6f3ee" : "#1a1714";
  const fundo = clara ? "rgb(255 255 255 / 0.12)" : "#1a1714";
  const letra = clara ? "#1a1714" : "#f3ead8";

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={clara ? fundo : tinta} />
      <path d="M10 22V10h2.2l3.8 7.2L19.8 10H22v12h-2.1v-7.3L16.4 19h-0.8l-3.5-4.3V22H10Z" fill={clara ? tinta : letra} />
    </svg>
  );
}
