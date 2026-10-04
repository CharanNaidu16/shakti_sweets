import type { SweetArt as SweetArtKind } from '@/types/content'

// Illustrated stand-ins shown until real product photos are uploaded in the admin.
// Deliberately stylised so they are never mistaken for photographs of the shop.

const BG: Record<SweetArtKind, string> = {
  katli: '#EFE6D6',
  laddu: '#F3E3CF',
  jamun: '#EADBC8',
  rasmalai: '#F4EBD9',
  sandwich: '#F4DADF',
  namkeen: '#EFE2C8',
  cake: '#F6E3E6',
  peda: '#F3E8D2',
  biscuit: '#F1E4CC',
  icecream: '#EAE4F2',
  generic: '#F2EBDD',
}

function BrassPlate({ r = 150 }: { r?: number }) {
  return (
    <g>
      <ellipse cx="200" cy={262 + r * 0.9} rx={r * 0.95} ry={r * 0.12} fill="#2B211C" opacity="0.12" />
      <circle cx="200" cy="262" r={r} fill="#C9923A" />
      <circle cx="200" cy="262" r={r - 10} fill="#E3B866" />
      <circle cx="200" cy="262" r={r - 26} fill="#EAC57A" />
    </g>
  )
}

function Bowl({ rim, fill }: { rim: string; fill: string }) {
  return (
    <g>
      <ellipse cx="200" cy="392" rx="150" ry="18" fill="#2B211C" opacity="0.12" />
      <path d="M50 250 C55 360 120 400 200 400 C280 400 345 360 350 250 Z" fill={rim} />
      <ellipse cx="200" cy="250" rx="150" ry="52" fill={rim} />
      <ellipse cx="200" cy="252" rx="134" ry="42" fill={fill} />
    </g>
  )
}

function Katli() {
  const diamond = 'M0 -58 L27 0 L0 58 L-27 0 Z'
  return (
    <g>
      <BrassPlate />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(200 262) rotate(${i * 45}) translate(0 -72)`}>
          <path d={diamond} fill="#ECEAE5" stroke="#CDC7BC" strokeWidth="2" />
          <path d="M0 -58 L27 0 L0 0 Z" fill="#FFFFFF" opacity="0.55" />
        </g>
      ))}
      <path d="M200 236 L213 262 L200 288 L187 262 Z" fill="#ECEAE5" stroke="#CDC7BC" strokeWidth="2" />
      {[
        [120, 120],
        [300, 140],
        [320, 400],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 9} L${x + 3} ${y} L${x} ${y + 9} L${x - 3} ${y} Z`} fill="#C9923A" opacity="0.6" />
      ))}
    </g>
  )
}

function Laddu() {
  const pos = [
    [200, 262],
    [140, 228],
    [260, 228],
    [140, 300],
    [260, 300],
    [200, 196],
    [200, 330],
  ]
  return (
    <g>
      <defs>
        <radialGradient id="laddu-g" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#FFC06A" />
          <stop offset="0.6" stopColor="#F08A2C" />
          <stop offset="1" stopColor="#C9561A" />
        </radialGradient>
        <pattern id="laddu-p" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.6" fill="#FFF3DA" opacity="0.35" />
        </pattern>
      </defs>
      <BrassPlate />
      {pos.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y + 4} r="38" fill="#2B211C" opacity="0.12" />
          <circle cx={x} cy={y} r="38" fill="url(#laddu-g)" />
          <circle cx={x} cy={y} r="38" fill="url(#laddu-p)" />
        </g>
      ))}
    </g>
  )
}

function Jamun() {
  const balls = [
    [160, 240],
    [240, 236],
    [200, 268],
    [130, 276],
    [270, 274],
  ]
  return (
    <g>
      <defs>
        <radialGradient id="jamun-g" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#C46A2E" />
          <stop offset="0.55" stopColor="#8A3E16" />
          <stop offset="1" stopColor="#4E200B" />
        </radialGradient>
      </defs>
      <Bowl rim="#FBF7EF" fill="#E9B866" />
      {balls.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="36" fill="url(#jamun-g)" />
          <ellipse cx={x - 12} cy={y - 14} rx="10" ry="6" fill="#FFFFFF" opacity="0.35" />
        </g>
      ))}
      {[
        [175, 225, 20],
        [250, 222, -30],
        [205, 258, 60],
      ].map(([x, y, a]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="16" height="5" rx="2.5" fill="#FFF5E2" transform={`rotate(${a} ${x} ${y})`} />
      ))}
    </g>
  )
}

function Rasmalai() {
  const discs = [
    [155, 246],
    [245, 246],
    [200, 270],
  ]
  return (
    <g>
      <Bowl rim="#3F5C93" fill="#F1CF6E" />
      {discs.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y + 4} rx="48" ry="24" fill="#C9A44A" opacity="0.35" />
          <ellipse cx={x} cy={y} rx="48" ry="24" fill="#F8EBC8" stroke="#E6D3A0" strokeWidth="2" />
        </g>
      ))}
      {[
        [140, 238, 150, 252],
        [236, 240, 252, 236],
        [190, 262, 206, 274],
        [258, 254, 270, 262],
      ].map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C2471F" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {[
        [170, 250],
        [228, 252],
        [212, 276],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" rx="2" fill="#7E9A3C" />
      ))}
    </g>
  )
}

function Sandwich() {
  const pieces = [
    [200, 200, 1],
    [128, 300, 0.92],
    [272, 300, 0.92],
  ] as const
  return (
    <g>
      {pieces.map(([x, y, s]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <ellipse cx="0" cy="62" rx="74" ry="14" fill="#2B211C" opacity="0.12" />
          <ellipse cx="0" cy="34" rx="70" ry="26" fill="#F1E3C5" />
          <rect x="-70" y="8" width="140" height="26" fill="#F1E3C5" />
          <rect x="-66" y="-4" width="132" height="22" rx="10" fill="#F3C53B" />
          <ellipse cx="0" cy="-8" rx="70" ry="28" fill="#E9E8E5" />
          <ellipse cx="-14" cy="-14" rx="40" ry="12" fill="#FFFFFF" opacity="0.6" />
          <circle cx="0" cy="-16" r="12" fill="#D42A2A" />
          <circle cx="-4" cy="-20" r="3.5" fill="#FFFFFF" opacity="0.6" />
        </g>
      ))}
    </g>
  )
}

function Namkeen() {
  // Deterministic scatter
  const bits = Array.from({ length: 70 }, (_, i) => {
    const a = i * 2.39996
    const r = 12 * Math.sqrt(i)
    return { x: 200 + r * Math.cos(a), y: 258 + r * 0.42 * Math.sin(a), i }
  })
  return (
    <g>
      <Bowl rim="#C9923A" fill="#E8C06C" />
      {bits.map(({ x, y, i }) =>
        i % 5 === 0 ? (
          <ellipse key={i} cx={x} cy={y} rx="7" ry="4.5" fill="#A8642A" />
        ) : i % 7 === 0 ? (
          <ellipse key={i} cx={x} cy={y} rx="8" ry="3" fill="#4F7A2E" transform={`rotate(${i * 23} ${x} ${y})`} />
        ) : (
          <rect key={i} x={x} y={y} width="14" height="3" rx="1.5" fill="#E2A93A" transform={`rotate(${i * 37} ${x} ${y})`} />
        ),
      )}
    </g>
  )
}

function Cake() {
  return (
    <g>
      {/* stand */}
      <ellipse cx="200" cy="420" rx="120" ry="14" fill="#2B211C" opacity="0.12" />
      <path d="M185 360 L215 360 L228 412 L172 412 Z" fill="#E3B866" />
      <ellipse cx="200" cy="360" rx="150" ry="22" fill="#C9923A" />
      <ellipse cx="200" cy="356" rx="150" ry="20" fill="#EAC57A" />
      {/* cake body */}
      <path d="M90 230 V340 C90 356 310 356 310 340 V230 Z" fill="#FBF1E4" />
      <path d="M90 290 C90 304 310 304 310 290 V300 C310 314 90 314 90 300 Z" fill="#F2C4CB" />
      {/* top + pink drip */}
      <ellipse cx="200" cy="230" rx="110" ry="26" fill="#F5D3D8" />
      <path
        d="M90 230 C90 246 100 262 104 262 C110 262 110 244 118 244 C126 244 126 274 134 274 C142 274 140 248 150 248 C160 248 160 266 168 266 C176 266 176 250 186 250 C196 250 196 280 206 280 C216 280 214 250 224 250 C234 250 234 268 244 268 C254 268 252 246 262 246 C272 246 272 270 282 270 C292 270 292 248 300 248 C306 248 310 240 310 230 C310 214 90 214 90 230 Z"
        fill="#E8A0AC"
      />
      {/* cherries + cream dots */}
      {[
        [150, 222],
        [200, 214],
        [250, 222],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y + 6} r="11" fill="#FBF1E4" />
          <circle cx={x} cy={y - 4} r="10" fill="#D42A2A" />
          <circle cx={x - 3} cy={y - 7} r="3" fill="#FFFFFF" opacity="0.6" />
        </g>
      ))}
      {/* candle */}
      <rect x="194" y="150" width="12" height="56" rx="3" fill="#F7E7C6" stroke="#E3B866" strokeWidth="2" />
      <path d="M200 120 C210 132 208 146 200 148 C192 146 190 132 200 120 Z" fill="#E39B2D" />
    </g>
  )
}

function Peda() {
  const pos = [
    [200, 262],
    [138, 236],
    [262, 236],
    [150, 302],
    [250, 302],
    [200, 200],
  ]
  return (
    <g>
      <BrassPlate />
      {pos.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y + 6} rx="40" ry="20" fill="#2B211C" opacity="0.1" />
          <ellipse cx={x} cy={y} rx="40" ry="22" fill="#F1DDB4" />
          <ellipse cx={x} cy={y - 4} rx="34" ry="16" fill="#F6E7C6" />
          <ellipse cx={x} cy={y - 4} rx="11" ry="6" fill="#E3C48E" />
          <circle cx={x} cy={y - 5} r="3.5" fill="#D9822B" />
        </g>
      ))}
    </g>
  )
}

function Biscuit() {
  const rounds = [
    [150, 230],
    [245, 222],
    [200, 290],
    [130, 305],
  ]
  return (
    <g>
      <BrassPlate />
      {/* rusks */}
      {[
        [252, 300, -18],
        [262, 278, -12],
      ].map(([x, y, a]) => (
        <g key={`${x}-${y}`} transform={`rotate(${a} ${x} ${y})`}>
          <rect x={x - 46} y={y - 14} width="92" height="28" rx="6" fill="#C98B45" />
          <rect x={x - 42} y={y - 10} width="84" height="20" rx="4" fill="#E2B072" />
        </g>
      ))}
      {rounds.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y + 4} r="36" fill="#2B211C" opacity="0.1" />
          <circle cx={x} cy={y} r="36" fill="#E9C27E" />
          <circle cx={x} cy={y} r="30" fill="#F2D49A" />
          {[
            [-12, -8],
            [10, -12],
            [0, 6],
            [-10, 14],
            [14, 10],
          ].map(([dx, dy]) => (
            <circle key={`${dx}-${dy}`} cx={x + dx} cy={y + dy} r="2.6" fill="#C98B45" />
          ))}
        </g>
      ))}
    </g>
  )
}

function IceCream() {
  return (
    <g>
      <ellipse cx="200" cy="420" rx="130" ry="14" fill="#2B211C" opacity="0.1" />
      {/* cone */}
      <path d="M150 230 L180 410 L210 230 Z" fill="#D9A15A" />
      <path d="M156 250 L204 250 M162 285 L198 285 M168 320 L192 320" stroke="#B9813E" strokeWidth="4" />
      <circle cx="180" cy="218" r="36" fill="#F4C9D2" />
      <circle cx="160" cy="226" r="20" fill="#F4C9D2" />
      <circle cx="200" cy="226" r="20" fill="#F4C9D2" />
      <circle cx="180" cy="186" r="26" fill="#7B4A2E" />
      <circle cx="172" cy="178" r="6" fill="#FFFFFF" opacity="0.35" />
      {/* kulfi on a stick */}
      <rect x="262" y="330" width="12" height="80" rx="5" fill="#E7C998" />
      <path d="M236 200 C236 176 300 176 300 200 L296 336 C296 346 240 346 240 336 Z" fill="#F2D07A" />
      <path d="M238 250 C260 262 278 238 298 250 L297 268 C278 256 260 280 239 268 Z" fill="#E8A93A" opacity="0.6" />
      <circle cx="256" cy="220" r="4" fill="#7E9A3C" />
      <circle cx="280" cy="232" r="4" fill="#7E9A3C" />
      <circle cx="262" cy="300" r="4" fill="#7E9A3C" />
    </g>
  )
}

function Generic() {
  return (
    <g>
      <BrassPlate r={130} />
      {[
        [170, 250],
        [230, 250],
        [200, 290],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="34" fill="#F3E6CC" stroke="#E2CFA6" strokeWidth="2" />
      ))}
    </g>
  )
}

const ART: Record<SweetArtKind, () => React.JSX.Element> = {
  katli: Katli,
  laddu: Laddu,
  jamun: Jamun,
  rasmalai: Rasmalai,
  sandwich: Sandwich,
  namkeen: Namkeen,
  cake: Cake,
  peda: Peda,
  biscuit: Biscuit,
  icecream: IceCream,
  generic: Generic,
}

export function SweetArt({ kind, className }: { kind: SweetArtKind; className?: string }) {
  const Art = ART[kind] ?? Generic
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className} style={{ background: BG[kind] }}>
      <Art />
    </svg>
  )
}
