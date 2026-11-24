/** Marca do Nomos. `clara` usa a versão branca, para fundo escuro. */
export function Marca({ clara = false, className = "" }: { clara?: boolean; className?: string }) {
  return <img src={clara ? "/white_logo.png" : "/black_logo.png"} alt="" className={`object-contain ${className}`} />;
}
