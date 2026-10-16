/**
 * Logo de Ingenia para React / Next.js.
 *
 * Variantes: "horizontal" (isotipo + texto), "vertical" (isotipo arriba), "wordmark" (solo texto),
 * "icon" (isotipo en gradiente) e "icon-flat" (silueta monocromática que toma currentColor).
 * El contenedor es polimórfico: con `as` se renderiza como cualquier elemento o componente (por ejemplo, `as="a"` o el `Link` de Next).
 *
 *   <IngeniaLogo variant="horizontal" theme="dark" height={40} as="a" href="/" />
 *
 * La geometría y los colores replican brand/generate-brand.mjs. Si cambia la marca, actualizá los dos.
 * Requiere React 18 o superior (usa useId).
 */
import * as React from "react";

export const INGENIA_COLORS = {
  electricBlue: "#007AFF",
  deepNavy: "#1C1C1E",
  kineticTeal: "#30B0C7",
  slateGray: "#8E8E93",
  studioWhite: "#F2F2F7",
  pureWhite: "#FFFFFF",
} as const;

export type IngeniaLogoVariant = "horizontal" | "vertical" | "wordmark" | "icon" | "icon-flat";
export type IngeniaLogoTheme = "light" | "dark";

type OwnProps<E extends React.ElementType> = {
  as?: E;
  variant?: IngeniaLogoVariant;
  /** "light" para fondos claros ("Ingen" en Deep Navy), "dark" para fondos oscuros ("Ingen" en blanco). */
  theme?: IngeniaLogoTheme;
  /** Alto del logo en px (el ancho se ajusta solo). */
  height?: number;
  /** Texto accesible. Pasá una cadena vacía si el logo acompaña un texto que ya dice "Ingenia". */
  title?: string;
};

export type IngeniaLogoProps<E extends React.ElementType = "span"> = OwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof OwnProps<E>>;

const FONT = "'Plus Jakarta Sans','Inter','Segoe UI',system-ui,-apple-system,sans-serif";

// Viga doble T en isométrica: [puntos, cara], de atrás hacia adelante
const FACES: ReadonlyArray<readonly [string, "front" | "top" | "side"]> = [
  ["-20.78,-12 31.18,18 51.96,6 0,-24", "top"],
  ["31.18,42 51.96,30 51.96,6 31.18,18", "side"],
  ["-20.78,12 31.18,42 31.18,18 -20.78,-12", "front"],
  ["12.99,7.5 33.77,-4.5 33.77,-56.5 12.99,-44.5", "side"],
  ["-2.6,-1.5 12.99,7.5 12.99,-44.5 -2.6,-53.5", "front"],
  ["31.18,-34 51.96,-46 51.96,-70 31.18,-58", "side"],
  ["-20.78,-88 31.18,-58 51.96,-70 0,-100", "top"],
  ["-20.78,-64 31.18,-34 31.18,-58 -20.78,-88", "front"],
];

const VIEWBOX: Record<IngeniaLogoVariant, [number, number]> = {
  horizontal: [448, 152],
  vertical: [360, 280],
  wordmark: [380, 110],
  icon: [160, 160],
  "icon-flat": [160, 160],
};

function Gradients({ id, dark }: { id: string; dark: boolean }) {
  const { electricBlue, kineticTeal, deepNavy } = INGENIA_COLORS;
  return (
    <defs>
      <linearGradient id={`${id}-front`} gradientUnits="userSpaceOnUse" x1="-21" y1="-88" x2="31" y2="42">
        <stop offset="0" stopColor={electricBlue} />
        <stop offset="1" stopColor={kineticTeal} />
      </linearGradient>
      <linearGradient id={`${id}-top`} gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="52" y2="-58">
        <stop offset="0" stopColor={kineticTeal} />
        <stop offset="1" stopColor="#7AD3E3" />
      </linearGradient>
      <linearGradient id={`${id}-side`} gradientUnits="userSpaceOnUse" x1="31" y1="-70" x2="52" y2="42">
        <stop offset="0" stopColor={dark ? "#1E63B8" : "#0A4FA3"} />
        <stop offset="1" stopColor={dark ? "#123A6B" : deepNavy} />
      </linearGradient>
    </defs>
  );
}

function Isotype({ id, transform, flat }: { id: string; transform: string; flat?: boolean }) {
  const flatOpacity = { front: 1, top: 0.55, side: 0.8 } as const;
  return (
    <g transform={transform} fill={flat ? "currentColor" : undefined}>
      {FACES.map(([points, face]) =>
        flat ? (
          <polygon key={points} points={points} fillOpacity={flatOpacity[face]} />
        ) : (
          <polygon key={points} points={points} fill={`url(#${id}-${face})`} />
        ),
      )}
    </g>
  );
}

function Wordmark({ x, y, size, anchor, dark }: { x: number; y: number; size: number; anchor: "start" | "middle"; dark: boolean }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={800} fontSize={size} letterSpacing={-size * 0.03}>
      <tspan fill={dark ? INGENIA_COLORS.pureWhite : INGENIA_COLORS.deepNavy}>Ingen</tspan>
      <tspan fill={INGENIA_COLORS.electricBlue}>ia</tspan>
    </text>
  );
}

export function IngeniaLogo<E extends React.ElementType = "span">({
  as,
  variant = "horizontal",
  theme = "light",
  height = 40,
  title = "Ingenia",
  style,
  ...rest
}: IngeniaLogoProps<E>) {
  const Component: React.ElementType = as ?? "span";
  const id = `ingenia-${React.useId().replace(/:/g, "")}`;
  const dark = theme === "dark";
  const [w, h] = VIEWBOX[variant];
  const titleId = `${id}-title`;

  return (
    <Component style={{ display: "inline-flex", lineHeight: 0, ...style }} {...rest}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${w} ${h}`}
        height={height}
        width={(height * w) / h}
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        aria-labelledby={title ? titleId : undefined}
        color={variant === "icon-flat" && !dark ? INGENIA_COLORS.deepNavy : variant === "icon-flat" ? INGENIA_COLORS.pureWhite : undefined}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        {variant !== "wordmark" && variant !== "icon-flat" ? <Gradients id={id} dark={dark} /> : null}
        {variant === "horizontal" && (
          <>
            <Isotype id={id} transform="translate(30 105)" />
            <Wordmark x={102} y={104} size={78} anchor="start" dark={dark} />
          </>
        )}
        {variant === "vertical" && (
          <>
            <Isotype id={id} transform="translate(164.4 114)" />
            <Wordmark x={180} y={252} size={64} anchor="middle" dark={dark} />
          </>
        )}
        {variant === "wordmark" && <Wordmark x={190} y={78} size={78} anchor="middle" dark={dark} />}
        {variant === "icon" && <Isotype id={id} transform="translate(64.4 109)" />}
        {variant === "icon-flat" && <Isotype id={id} transform="translate(64.4 109)" flat />}
      </svg>
    </Component>
  );
}

export default IngeniaLogo;
