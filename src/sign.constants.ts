export interface FontOption {
  label: string
  family: string
  weight: number
}

export const FONTS: FontOption[] = [
  { label: 'Roboto Regular', family: 'Roboto', weight: 400 },
  { label: 'Roboto Light', family: 'Roboto', weight: 300 },
  { label: 'Roboto Medium', family: 'Roboto', weight: 500 },
  { label: 'Roboto Bold', family: 'Roboto', weight: 700 },
  { label: 'Roboto Condensed Regular', family: 'Roboto Condensed', weight: 400 },
  { label: 'Roboto Condensed Light', family: 'Roboto Condensed', weight: 300 },
  { label: 'Noto Serif', family: 'Noto Serif', weight: 400 },
  { label: 'Rowdies Regular', family: 'Rowdies', weight: 400 },
  { label: 'Rowdies Bold', family: 'Rowdies', weight: 700 },
  { label: 'Rowdies Light', family: 'Rowdies', weight: 300 },
  { label: 'Oxygen Regular', family: 'Oxygen', weight: 400 },
  { label: 'Oxygen Bold', family: 'Oxygen', weight: 700 },
  { label: 'Oxygen Light', family: 'Oxygen', weight: 300 },
  { label: 'Bebas Neue', family: 'Bebas Neue', weight: 400 },
  { label: 'VT323 (pixel)', family: 'VT323', weight: 400 },
  { label: 'Press Start 2P (pixel)', family: 'Press Start 2P', weight: 400 },
]

// Sign colors the user picks from; these are content, not theme tokens.
export const SWATCHES = [
  '#ff0000',
  '#ff8c00',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0066ff',
  '#8a2be2',
  '#ff1493',
  '#ffffff',
  '#808080',
  '#000000',
  '#8b4513',
]
