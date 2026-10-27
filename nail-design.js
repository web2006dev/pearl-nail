/* Pearl Nails - Interactive Nail Design Model & Vector Renderer */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NailDesign = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';

  const names = ['Thumb', 'Index', 'Middle', 'Ring', 'Little'];
  const colors = {
    'Pearl Glaze': '#F4EFEA',
    'Nude Rose': '#C68E79',
    'Blush Pink': '#D594A4',
    'Cherry Wine': '#7A1F33',
    'Espresso': '#442821',
    'Champagne': '#C5A059',
    'Sage Whisper': '#879781',
    'Midnight Ink': '#201A24',
    'French Rose': '#E8CFCE',
    'Chrome Silver': '#D9D9DE'
  };

  const artColors = {
    'Pearl': '#FFF8EB',
    'Gold': '#C69B52',
    'Rose Gold': '#D8A499',
    'Wine': '#7A1F33',
    'Ink': '#1E171B',
    'Silver': '#E2E2E6'
  };

  const shapes = ['Almond', 'Coffin', 'Square', 'Round', 'Stiletto'];
  const lengths = ['Short', 'Medium', 'Long'];
  const finishes = ['Glossy', 'Matte', 'Chrome', 'Glazed Pearl'];
  const arts = ['Pearl Cabochon', 'Star', 'Heart', 'Flower', 'Bow', 'Wave', 'Moon', 'French Line'];
  const skins = {
    Light: '#EAC3AC',
    Warm: '#C68E70',
    Deep: '#85573F'
  };

  const looks = [
    {
      id: 'pearl-elegance',
      name: 'Pearl Elegance',
      mood: 'Romantic',
      desc: 'Luminous glazed base with delicate bridal pearl accents.',
      color: 'Pearl Glaze',
      shape: 'Almond',
      finish: 'Glazed Pearl',
      art: 'Pearl Cabochon',
      accent: 'Pearl',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'quiet-luxury-nude',
      name: 'Quiet Luxury',
      mood: 'Minimal',
      desc: 'Subtle nude rose with polished champagne line detailing.',
      color: 'Nude Rose',
      shape: 'Almond',
      finish: 'Glossy',
      art: 'Star',
      accent: 'Gold',
      image: 'https://thenailmasters.onrender.com/assets/images/source-1b0864fab8-800.webp'
    },
    {
      id: 'bordeaux-velvet',
      name: 'Bordeaux Velvet',
      mood: 'Bold',
      desc: 'Deep cherry wine with gold celestial motifs.',
      color: 'Cherry Wine',
      shape: 'Coffin',
      finish: 'Glossy',
      art: 'Moon',
      accent: 'Gold',
      image: 'https://thenailmasters.onrender.com/assets/images/source-39971fd02a-736.webp'
    },
    {
      id: 'champagne-shimmer',
      name: 'Champagne Shimmer',
      mood: 'Bridal Glam',
      desc: 'Liquid chrome shimmer crowned with sculpted bows and crystals.',
      color: 'Champagne',
      shape: 'Coffin',
      finish: 'Chrome',
      art: 'Bow',
      accent: 'Gold',
      image: 'https://thenailmasters.onrender.com/assets/images/source-3716ba1e10-720.webp'
    },
    {
      id: 'soft-blush-botanical',
      name: 'Blush Botanical',
      mood: 'Romantic',
      desc: 'Petal-soft blush overlay with hand-painted micro floral art.',
      color: 'Blush Pink',
      shape: 'Round',
      finish: 'Glossy',
      art: 'Flower',
      accent: 'Pearl',
      image: 'https://thenailmasters.onrender.com/assets/images/source-ca5c9bae46-735.webp'
    },
    {
      id: 'chrome-mirage',
      name: 'Chrome Mirage',
      mood: 'Bold',
      desc: 'Futuristic mirror chrome with sleek modern architectural lines.',
      color: 'Chrome Silver',
      shape: 'Stiletto',
      finish: 'Chrome',
      art: 'Wave',
      accent: 'Silver',
      image: 'https://thenailmasters.onrender.com/assets/images/source-45f22c887e-800.webp'
    }
  ];

  const clone = val => JSON.parse(JSON.stringify(val));
  const clamp = (n, min, max, fallback) => Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;

  function fromLook(look = looks[0]) {
    return {
      version: 1,
      skin: 'Warm',
      nails: names.map((_, i) => ({
        shape: look.shape,
        length: 'Medium',
        color: look.color,
        finish: look.finish,
        art: (i === 3 || i === 1) ? [{
          type: look.art,
          color: look.accent,
          x: 50,
          y: 75,
          size: 1,
          rotation: 0
        }] : []
      }))
    };
  }

  function validate(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.nails) || value.nails.length !== 5) return null;
    const nails = [];
    for (const nail of value.nails) {
      if (!nail || !shapes.includes(nail.shape) || !lengths.includes(nail.length) || !Object.hasOwn(colors, nail.color) || !finishes.includes(nail.finish) || !Array.isArray(nail.art) || nail.art.length > 3) return null;
      const art = [];
      for (const detail of nail.art) {
        if (!detail || !arts.includes(detail.type) || !Object.hasOwn(artColors, detail.color)) return null;
        art.push({
          type: detail.type,
          color: detail.color,
          x: clamp(detail.x, 18, 82, 50),
          y: clamp(detail.y, 35, 130, 75),
          size: clamp(detail.size, 0.5, 1.8, 1),
          rotation: clamp(detail.rotation, -180, 180, 0)
        });
      }
      nails.push({ shape: nail.shape, length: nail.length, color: nail.color, finish: nail.finish, art });
    }
    return { version: 1, skin: Object.hasOwn(skins, value.skin) ? value.skin : 'Warm', nails };
  }

  const paths = {
    Almond: 'M50 8 C65 16 91 56 91 104 L90 128 Q88 157 50 158 Q12 157 10 128 L9 104 C9 56 35 16 50 8Z',
    Round: 'M10 65 C10 5 90 5 90 65 L90 128 Q88 158 50 158 Q12 158 10 128Z',
    Square: 'M13 19 Q50 11 87 19 L91 129 Q88 158 50 158 Q12 158 9 129Z',
    Coffin: 'M29 12 Q50 8 71 12 L91 91 L90 129 Q88 158 50 158 Q12 158 10 129 L9 91Z',
    Stiletto: 'M50 2 C60 22 91 65 91 106 L90 128 Q88 157 50 158 Q12 157 10 128 L9 106 C9 65 40 22 50 2Z'
  };

  function detailSVG(detail) {
    const drawings = {
      'Pearl Cabochon': '<circle r="12" fill="#FFF9EB" stroke="#D3B88C" stroke-width="1.4"/><circle cx="-3" cy="-4" r="4.5" fill="#FFFFFF" opacity="0.9"/><circle cx="2" cy="3" r="1.5" fill="#FFFFFF" opacity="0.6"/>',
      'Star': '<path d="M0-17 4-4 15 0 4 4 0 17-4 4-15 0-4-4Z"/><circle cx="15" cy="-15" r="2.5"/>',
      'Heart': '<path d="M0 13C-28-4-8-26 0-12 8-26 28-4 0 13Z"/>',
      'Flower': '<ellipse cy="-10" rx="6" ry="9"/><ellipse cy="-10" rx="6" ry="9" transform="rotate(72)"/><ellipse cy="-10" rx="6" ry="9" transform="rotate(144)"/><ellipse cy="-10" rx="6" ry="9" transform="rotate(216)"/><ellipse cy="-10" rx="6" ry="9" transform="rotate(288)"/><circle r="4" fill="#C5A059"/>',
      'Bow': '<g fill="none" stroke="currentColor" stroke-width="2.2"><path d="M0 0C-32-29-26 16 0 0 26 16 32-29 0 0M0 0-11 22M0 0 11 22"/></g><circle r="3"/>',
      'Wave': '<path d="M-30-30C30-25-30 25 30 30" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
      'Moon': '<path d="M7-17A18 18 0 1 0 12 15 19 19 0 0 1 7-17Z"/>',
      'French Line': '<path d="M12 40 Q50 65 88 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'
    };
    const c = artColors[detail.color] || '#FFF';
    return `<g transform="translate(${detail.x} ${detail.y}) rotate(${detail.rotation}) scale(${detail.size})" fill="${c}" color="${c}">${drawings[detail.type] || drawings['Star']}</g>`;
  }

  function nailSVG(nail, index, size = 180, interactive = false) {
    const scaleY = nail.length === 'Short' ? 0.88 : (nail.length === 'Long' ? 1.15 : 1);
    const baseColor = colors[nail.color] || colors['Pearl Glaze'];
    const pathD = paths[nail.shape] || paths.Almond;
    
    let finishFilter = '';
    let overlayGradient = '';
    if (nail.finish === 'Chrome' || nail.finish === 'Glazed Pearl') {
      overlayGradient = `<linearGradient id="chromeGrad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="65%" stop-color="#ffdca8" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.5"/>
      </linearGradient>`;
    } else if (nail.finish === 'Matte') {
      overlayGradient = `<linearGradient id="matteGrad-${index}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.06"/>
      </linearGradient>`;
    } else {
      // Glossy highlight
      overlayGradient = `<linearGradient id="glossGrad-${index}" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
        <stop offset="35%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="85%" stop-color="#ffffff" stop-opacity="0.2"/>
      </linearGradient>`;
    }

    const artSVGs = nail.art.map(d => detailSVG(d)).join('');

    return `
      <svg class="nc-nail-svg" viewBox="0 0 100 170" width="${size}" height="${size * 1.7}">
        <defs>
          ${overlayGradient}
          <clipPath id="nailClip-${index}">
            <path d="${pathD}" transform="scale(1, ${scaleY}) transform-origin(50 158)"/>
          </clipPath>
        </defs>
        <!-- Shadow -->
        <path d="${pathD}" transform="scale(1.02, ${scaleY * 1.02}) translate(-1, 3)" fill="rgba(0,0,0,0.14)" filter="blur(2px)"/>
        <!-- Nail Base Body -->
        <g clip-path="url(#nailClip-${index})">
          <rect width="100" height="170" fill="${baseColor}"/>
          ${nail.finish === 'Chrome' || nail.finish === 'Glazed Pearl' ? `<rect width="100" height="170" fill="url(#chromeGrad-${index})"/>` : ''}
          ${nail.finish === 'Matte' ? `<rect width="100" height="170" fill="url(#matteGrad-${index})"/>` : ''}
          ${nail.finish === 'Glossy' ? `<rect width="100" height="170" fill="url(#glossGrad-${index})"/>` : ''}
          <!-- Nail Art Layer -->
          ${artSVGs}
        </g>
        <!-- Natural Cuticle Arch Border -->
        <path d="${pathD}" transform="scale(1, ${scaleY}) transform-origin(50 158)" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
      </svg>
    `;
  }

  function handSVG(design, selectedIndex = 3, viewType = 'canvas') {
    const skinHex = skins[design.skin] || skins.Warm;
    const fingers = design.nails.map((nail, idx) => {
      const isSelected = idx === selectedIndex;
      const nailHtml = nailSVG(nail, idx, 44);
      return `
        <div class="nc-finger-wrap ${isSelected ? 'is-selected' : ''}" data-index="${idx}">
          <div class="nc-finger-nail">${nailHtml}</div>
          <span class="nc-finger-name">${names[idx]}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="nc-hand-container" style="--skin-tone: ${skinHex}">
        <div class="nc-hand-wrist"></div>
        <div class="nc-fingers-row">
          ${fingers}
        </div>
      </div>
    `;
  }

  function id(design) {
    const sample = design.nails[3] || design.nails[0];
    return `PN-${sample.shape.substring(0,3).toUpperCase()}-${sample.color.replace(/\s+/g,'').substring(0,4).toUpperCase()}`;
  }

  return {
    names,
    colors,
    artColors,
    shapes,
    lengths,
    finishes,
    arts,
    skins,
    looks,
    clone,
    fromLook,
    validate,
    nailSVG,
    handSVG,
    id
  };
});
