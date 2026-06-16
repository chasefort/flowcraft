/**
 * Verdant Studio backdrop.
 *
 * A fixed, low-opacity atmosphere: two soft green radial washes plus a
 * topographic contour field. The contour motif ties to the product idea —
 * planning a content strategy is like mapping terrain. Kept faint so it never
 * fights text contrast. Static + decorative, so it
 * is hidden from assistive tech.
 */

// One topographic "ridge" — a closed organic loop, repeated at growing scales
// to read as nested contour lines.
const RIDGE =
  "M0,-60 C40,-58 70,-30 66,4 C62,38 34,62 -4,60 C-42,58 -68,30 -64,-6 C-60,-40 -36,-62 0,-60 Z";

function ContourCluster({
  cx,
  cy,
  rings = 8,
  step = 11,
}: {
  cx: number;
  cy: number;
  rings?: number;
  step?: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {Array.from({ length: rings }).map((_, i) => {
        const scale = 0.6 + i * (step / 60);
        return (
          <path
            key={i}
            d={RIDGE}
            transform={`scale(${scale}) rotate(${i * 6})`}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={1 / scale}
            opacity={0.5 - i * 0.045}
          />
        );
      })}
    </g>
  );
}

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* paper + radial green washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 44rem at 88% -8%, rgba(21,114,76,0.10), transparent 60%)," +
            "radial-gradient(52rem 42rem at -8% 12%, rgba(143,224,163,0.12), transparent 58%)," +
            "radial-gradient(40rem 40rem at 50% 118%, rgba(47,156,99,0.07), transparent 60%)",
        }}
      />
      {/* topographic contours */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.5 }}
      >
        <g style={{ opacity: 0.16 }}>
          <ContourCluster cx={1230} cy={130} rings={9} step={12} />
        </g>
        <g style={{ opacity: 0.12 }}>
          <ContourCluster cx={120} cy={760} rings={8} step={13} />
        </g>
      </svg>
    </div>
  );
}
