import Image from "next/image";
import type { Foto } from "@/config/cliente.types";

type Props = { foto: Foto; className?: string; priority?: boolean; sizes?: string; width?: number; height?: number };

/** Foto com otimização da Vercel; o tamanho visível vem do CSS do kit. */
export function Photo({ foto, className, priority, sizes = "(max-width: 640px) 100vw, 50vw", width = 1200, height = 900 }: Props) {
  return (
    <Image
      className={className}
      src={foto.src}
      alt={foto.alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      style={foto.pos ? ({ "--pos": foto.pos, objectPosition: foto.pos } as React.CSSProperties) : undefined}
    />
  );
}
