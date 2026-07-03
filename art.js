// GYMBRO — illustrazioni esercizi in stile poster tecnico
// Figura con busto evidenziato in arancione, attrezzi in grigio, due posizioni numerate.

const ART_C = {
  body: '#4B4842',
  far: '#C6C2B8',
  shirt: '#FC5200',
  equip: '#8E897F',
  equipFill: '#EFECE5',
  ground: '#DAD6CD',
  accent: '#FC5200',
  cable: '#A9A49A'
};

function _L(pts, color, w) {
  return `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function _fig(p) {
  let s = '';
  if (p.legB) s += _L(p.legB, ART_C.far, 8);
  if (p.armB) s += _L(p.armB, ART_C.far, 7);
  s += _L(p.torso, ART_C.shirt, 15);
  if (p.legF) s += _L(p.legF, ART_C.body, 8);
  if (p.legs) p.legs.forEach(l => { s += _L(l, ART_C.body, 8); });
  s += `<circle cx="${p.head[0]}" cy="${p.head[1]}" r="8" fill="${ART_C.body}"/>`;
  if (p.armF) s += _L(p.armF, ART_C.body, 7);
  if (p.arms) p.arms.forEach(a => { s += _L(a, ART_C.body, 7); });
  return s;
}

// --- attrezzi ---
function _bench(x0, x1, y) {
  return `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/>` +
    `<line x1="${x0 + 12}" y1="${y + 4}" x2="${x0 + 12}" y2="145" stroke="${ART_C.equip}" stroke-width="5"/>` +
    `<line x1="${x1 - 12}" y1="${y + 4}" x2="${x1 - 12}" y2="145" stroke="${ART_C.equip}" stroke-width="5"/>`;
}
function _db(x, y) {
  return `<circle cx="${x}" cy="${y}" r="6.5" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="1.8" fill="${ART_C.equip}"/>`;
}
function _plate(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r * 0.28}" fill="none" stroke="${ART_C.equip}" stroke-width="2"/>`;
}
function _tower(x, yTop) {
  return `<line x1="${x}" y1="${yTop}" x2="${x}" y2="145" stroke="${ART_C.equip}" stroke-width="7"/><line x1="${x - 10}" y1="145" x2="${x + 10}" y2="145" stroke="${ART_C.equip}" stroke-width="5"/>`;
}
function _pulley(x, y) {
  return `<circle cx="${x}" cy="${y}" r="4" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="2.5"/>`;
}
function _cable(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ART_C.cable}" stroke-width="2"/>`;
}
function _handle(x, y, len) {
  return `<line x1="${x - len / 2}" y1="${y}" x2="${x + len / 2}" y2="${y}" stroke="${ART_C.body}" stroke-width="4" stroke-linecap="round"/>`;
}

// --- pose per esercizio: due pannelli 200x160 ---
const ART = {

  'panca-piana': [
    {
      pre: _bench(48, 158, 104),
      fig: { head: [148, 90], torso: [[134, 93], [90, 93]], legF: [[90, 93], [70, 116], [72, 143]], legB: [[90, 93], [78, 120], [82, 143]], armF: [[134, 93], [133, 71], [134, 52]] },
      post: _plate(134, 48, 12)
    },
    {
      pre: _bench(48, 158, 104),
      fig: { head: [148, 90], torso: [[134, 93], [90, 93]], legF: [[90, 93], [70, 116], [72, 143]], legB: [[90, 93], [78, 120], [82, 143]], armF: [[134, 93], [114, 84], [124, 78]] },
      post: _plate(124, 74, 12)
    }
  ],

  'panca-inclinata-manubri': [
    {
      pre: `<line x1="70" y1="133" x2="116" y2="84" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/><line x1="88" y1="118" x2="88" y2="145" stroke="${ART_C.equip}" stroke-width="5"/><line x1="108" y1="96" x2="112" y2="145" stroke="${ART_C.equip}" stroke-width="5"/>`,
      fig: { head: [122, 76], torso: [[112, 84], [86, 114]], legF: [[86, 114], [68, 120], [66, 143]], armF: [[112, 84], [118, 64], [120, 47]] },
      post: _db(120, 42)
    },
    {
      pre: `<line x1="70" y1="133" x2="116" y2="84" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/><line x1="88" y1="118" x2="88" y2="145" stroke="${ART_C.equip}" stroke-width="5"/><line x1="108" y1="96" x2="112" y2="145" stroke="${ART_C.equip}" stroke-width="5"/>`,
      fig: { head: [122, 76], torso: [[112, 84], [86, 114]], legF: [[86, 114], [68, 120], [66, 143]], armF: [[112, 84], [126, 80], [132, 68]] },
      post: _db(133, 63)
    }
  ],

  'croci-cavi': [
    {
      pre: _tower(20, 24) + _tower(180, 24) + _pulley(24, 30) + _pulley(176, 30),
      fig: { head: [100, 42], torso: [[100, 57], [100, 96]], legs: [[[100, 96], [92, 120], [90, 143]], [[100, 96], [108, 120], [110, 143]]], arms: [[[100, 60], [76, 62], [55, 55]], [[100, 60], [124, 62], [145, 55]]] },
      post: _cable(26, 32, 53, 54) + _cable(174, 32, 147, 54)
    },
    {
      pre: _tower(20, 24) + _tower(180, 24) + _pulley(24, 30) + _pulley(176, 30),
      fig: { head: [100, 42], torso: [[100, 57], [100, 96]], legs: [[[100, 96], [92, 120], [90, 143]], [[100, 96], [108, 120], [110, 143]]], arms: [[[100, 60], [80, 72], [96, 76]], [[100, 60], [120, 72], [104, 76]]] },
      post: _cable(26, 32, 95, 75) + _cable(174, 32, 105, 75)
    }
  ],

  'shoulder-press': [
    {
      pre: `<line x1="86" y1="98" x2="86" y2="145" stroke="${ART_C.equip}" stroke-width="6"/><line x1="78" y1="102" x2="106" y2="102" stroke="${ART_C.equip}" stroke-width="8" stroke-linecap="round"/><line x1="80" y1="96" x2="76" y2="58" stroke="${ART_C.equip}" stroke-width="7" stroke-linecap="round"/>` + _tower(140, 22),
      fig: { head: [98, 40], torso: [[98, 56], [94, 99]], legF: [[94, 99], [116, 112], [116, 141]], armF: [[98, 58], [114, 66], [116, 52]] },
      post: _handle(117, 50, 12) + _cable(120, 50, 140, 30)
    },
    {
      pre: `<line x1="86" y1="98" x2="86" y2="145" stroke="${ART_C.equip}" stroke-width="6"/><line x1="78" y1="102" x2="106" y2="102" stroke="${ART_C.equip}" stroke-width="8" stroke-linecap="round"/><line x1="80" y1="96" x2="76" y2="58" stroke="${ART_C.equip}" stroke-width="7" stroke-linecap="round"/>` + _tower(140, 22),
      fig: { head: [98, 40], torso: [[98, 56], [94, 99]], legF: [[94, 99], [116, 112], [116, 141]], armF: [[98, 58], [106, 38], [108, 22]] },
      post: _handle(109, 20, 12) + _cable(112, 20, 140, 24)
    }
  ],

  'alzate-laterali': [
    {
      fig: { head: [100, 40], torso: [[100, 55], [100, 96]], legs: [[[100, 96], [93, 120], [91, 143]], [[100, 96], [107, 120], [109, 143]]], arms: [[[100, 58], [89, 74], [86, 90]], [[100, 58], [111, 74], [114, 90]]] },
      post: _db(85, 96) + _db(115, 96)
    },
    {
      fig: { head: [100, 40], torso: [[100, 55], [100, 96]], legs: [[[100, 96], [93, 120], [91, 143]], [[100, 96], [107, 120], [109, 143]]], arms: [[[100, 58], [76, 58], [55, 56]], [[100, 58], [124, 58], [145, 56]]] },
      post: _db(49, 56) + _db(151, 56)
    }
  ],

  'pushdown': [
    {
      pre: _tower(158, 20) + _pulley(153, 26),
      fig: { head: [94, 40], torso: [[97, 56], [93, 97]], legF: [[93, 97], [95, 121], [93, 143]], legB: [[93, 97], [85, 121], [83, 143]], armF: [[97, 58], [109, 73], [120, 56]] },
      post: _handle(123, 54, 14) + _cable(124, 52, 153, 28)
    },
    {
      pre: _tower(158, 20) + _pulley(153, 26),
      fig: { head: [94, 40], torso: [[97, 56], [93, 97]], legF: [[93, 97], [95, 121], [93, 143]], legB: [[93, 97], [85, 121], [83, 143]], armF: [[97, 58], [109, 74], [127, 92]] },
      post: _handle(130, 92, 14) + _cable(131, 90, 153, 28)
    }
  ],

  'tricipiti-nuca': [
    {
      pre: _bench(76, 122, 108),
      fig: { head: [98, 42], torso: [[98, 58], [94, 106]], legF: [[94, 106], [116, 118], [114, 143]], armF: [[98, 58], [103, 40], [86, 32]] },
      post: _db(82, 30)
    },
    {
      pre: _bench(76, 122, 108),
      fig: { head: [98, 42], torso: [[98, 58], [94, 106]], legF: [[94, 106], [116, 118], [114, 143]], armF: [[98, 58], [103, 40], [105, 20]] },
      post: _db(105, 15)
    }
  ],

  'stacco-rumeno': [
    {
      fig: { head: [98, 38], torso: [[98, 54], [95, 95]], legF: [[95, 95], [96, 120], [94, 143]], legB: [[95, 95], [88, 120], [86, 143]], armF: [[98, 56], [102, 74], [104, 90]] },
      post: _plate(105, 94, 13)
    },
    {
      fig: { head: [136, 60], torso: [[127, 67], [94, 92]], legF: [[94, 92], [98, 118], [95, 143]], legB: [[94, 92], [90, 118], [87, 143]], armF: [[127, 69], [126, 90], [124, 108]] },
      post: _plate(124, 113, 13)
    }
  ],

  'lat-machine': [
    {
      pre: _tower(150, 18) + `<line x1="150" y1="20" x2="98" y2="20" stroke="${ART_C.equip}" stroke-width="6" stroke-linecap="round"/>` + _pulley(100, 24) + _bench(80, 118, 106) + `<line x1="118" y1="92" x2="130" y2="92" stroke="${ART_C.equip}" stroke-width="7" stroke-linecap="round"/>`,
      fig: { head: [98, 46], torso: [[100, 62], [94, 104]], legF: [[94, 104], [116, 114], [114, 142]], armF: [[100, 62], [104, 44], [102, 30]] },
      post: _handle(102, 28, 26) + _cable(102, 26, 100, 26)
    },
    {
      pre: _tower(150, 18) + `<line x1="150" y1="20" x2="98" y2="20" stroke="${ART_C.equip}" stroke-width="6" stroke-linecap="round"/>` + _pulley(100, 24) + _bench(80, 118, 106) + `<line x1="118" y1="92" x2="130" y2="92" stroke="${ART_C.equip}" stroke-width="7" stroke-linecap="round"/>`,
      fig: { head: [98, 46], torso: [[100, 62], [94, 104]], legF: [[94, 104], [116, 114], [114, 142]], armF: [[100, 62], [112, 74], [104, 64]] },
      post: _handle(104, 62, 26) + _cable(104, 60, 100, 26)
    }
  ],

  'rematore-bilanciere': [
    {
      fig: { head: [136, 58], torso: [[127, 65], [94, 90]], legF: [[94, 90], [100, 116], [95, 143]], legB: [[94, 90], [92, 116], [87, 143]], armF: [[127, 67], [126, 88], [123, 106]] },
      post: _plate(123, 111, 13)
    },
    {
      fig: { head: [136, 58], torso: [[127, 65], [94, 90]], legF: [[94, 90], [100, 116], [95, 143]], legB: [[94, 90], [92, 116], [87, 143]], armF: [[127, 67], [122, 84], [113, 84]] },
      post: _plate(112, 84, 13)
    }
  ],

  'pulley-basso': [
    {
      pre: `<rect x="20" y="116" width="16" height="26" rx="3" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>` + _pulley(30, 114) + _bench(84, 126, 112) + `<line x1="52" y1="104" x2="56" y2="130" stroke="${ART_C.equip}" stroke-width="6" stroke-linecap="round"/>`,
      fig: { head: [104, 52], torso: [[103, 68], [98, 108]], legF: [[98, 108], [70, 106], [56, 116]], armF: [[103, 70], [84, 76], [66, 80]] },
      post: _handle(63, 80, 8) + _cable(60, 80, 30, 114)
    },
    {
      pre: `<rect x="20" y="116" width="16" height="26" rx="3" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>` + _pulley(30, 114) + _bench(84, 126, 112) + `<line x1="52" y1="104" x2="56" y2="130" stroke="${ART_C.equip}" stroke-width="6" stroke-linecap="round"/>`,
      fig: { head: [102, 50], torso: [[102, 66], [98, 108]], legF: [[98, 108], [70, 106], [56, 116]], armF: [[102, 68], [104, 84], [92, 88]] },
      post: _handle(89, 88, 8) + _cable(86, 88, 30, 114)
    }
  ],

  'face-pull': [
    {
      pre: _tower(160, 20) + _pulley(155, 54),
      fig: { head: [92, 42], torso: [[95, 58], [91, 98]], legF: [[91, 98], [93, 121], [91, 143]], legB: [[91, 98], [83, 121], [81, 143]], armF: [[95, 60], [113, 58], [131, 56]] },
      post: _cable(133, 56, 155, 55) + _handle(133, 56, 6)
    },
    {
      pre: _tower(160, 20) + _pulley(155, 54),
      fig: { head: [92, 42], torso: [[95, 58], [91, 98]], legF: [[91, 98], [93, 121], [91, 143]], legB: [[91, 98], [83, 121], [81, 143]], armF: [[95, 60], [112, 48], [101, 44]] },
      post: _cable(103, 44, 155, 55) + _handle(103, 44, 6)
    }
  ],

  'curl-bilanciere': [
    {
      fig: { head: [98, 40], torso: [[100, 56], [96, 97]], legF: [[96, 97], [98, 121], [96, 143]], legB: [[96, 97], [88, 121], [86, 143]], armF: [[100, 58], [102, 76], [105, 92]] },
      post: _plate(106, 95, 10)
    },
    {
      fig: { head: [98, 40], torso: [[100, 56], [96, 97]], legF: [[96, 97], [98, 121], [96, 143]], legB: [[96, 97], [88, 121], [86, 143]], armF: [[100, 58], [102, 76], [117, 62]] },
      post: _plate(119, 59, 10)
    }
  ],

  'curl-martello': [
    {
      fig: { head: [98, 40], torso: [[100, 56], [96, 97]], legF: [[96, 97], [98, 121], [96, 143]], legB: [[96, 97], [88, 121], [86, 143]], armF: [[100, 58], [102, 76], [105, 92]] },
      post: _db(106, 96)
    },
    {
      fig: { head: [98, 40], torso: [[100, 56], [96, 97]], legF: [[96, 97], [98, 121], [96, 143]], legB: [[96, 97], [88, 121], [86, 143]], armF: [[100, 58], [102, 76], [116, 62]] },
      post: _db(118, 59)
    }
  ],

  'squat': [
    {
      fig: { head: [98, 38], torso: [[98, 54], [95, 95]], legF: [[95, 95], [97, 120], [95, 143]], legB: [[95, 95], [89, 120], [87, 143]], armF: [[98, 56], [108, 62], [100, 52]] },
      post: _plate(94, 52, 12)
    },
    {
      fig: { head: [108, 70], torso: [[104, 80], [80, 106]], legF: [[80, 106], [104, 118], [99, 143]], legB: [[80, 106], [96, 120], [91, 143]], armF: [[104, 82], [114, 86], [106, 78]] },
      post: _plate(100, 78, 12)
    }
  ],

  'leg-press': [
    {
      pre: `<line x1="58" y1="128" x2="82" y2="88" stroke="${ART_C.equip}" stroke-width="10" stroke-linecap="round"/><line x1="52" y1="142" x2="120" y2="142" stroke="${ART_C.equip}" stroke-width="5"/><line x1="132" y1="46" x2="158" y2="96" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/>`,
      fig: { head: [64, 76], torso: [[72, 86], [88, 112]], legF: [[88, 112], [110, 82], [130, 72]], armF: [[72, 88], [80, 104], [90, 112]] },
      post: ''
    },
    {
      pre: `<line x1="58" y1="128" x2="82" y2="88" stroke="${ART_C.equip}" stroke-width="10" stroke-linecap="round"/><line x1="52" y1="142" x2="120" y2="142" stroke="${ART_C.equip}" stroke-width="5"/><line x1="142" y1="34" x2="168" y2="84" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/>`,
      fig: { head: [64, 76], torso: [[72, 86], [88, 112]], legF: [[88, 112], [116, 86], [146, 62]], armF: [[72, 88], [80, 104], [90, 112]] },
      post: ''
    }
  ],

  'affondi-manubri': [
    {
      fig: { head: [100, 40], torso: [[100, 56], [97, 97]], legF: [[97, 97], [99, 121], [97, 143]], legB: [[97, 97], [90, 121], [88, 143]], armF: [[100, 58], [104, 76], [106, 92]], armB: [[100, 58], [92, 76], [90, 92]] },
      post: _db(107, 98) + _db(89, 98)
    },
    {
      fig: { head: [100, 44], torso: [[100, 60], [96, 100]], legF: [[96, 100], [122, 116], [119, 143]], legB: [[96, 100], [80, 128], [60, 138]], armF: [[100, 62], [104, 80], [106, 96]], armB: [[100, 62], [92, 80], [90, 96]] },
      post: _db(107, 102) + _db(89, 102)
    }
  ],

  'leg-curl': [
    {
      pre: _bench(58, 148, 100),
      fig: { head: [64, 88], torso: [[76, 91], [116, 91]], armF: [[76, 92], [70, 106], [66, 116]], legF: [[116, 91], [138, 92], [158, 94]] },
      post: `<circle cx="162" cy="97" r="7" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>`
    },
    {
      pre: _bench(58, 148, 100),
      fig: { head: [64, 88], torso: [[76, 91], [116, 91]], armF: [[76, 92], [70, 106], [66, 116]], legF: [[116, 91], [138, 92], [142, 62]] },
      post: `<circle cx="143" cy="56" r="7" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>`
    }
  ],

  'leg-extension': [
    {
      pre: `<line x1="76" y1="58" x2="82" y2="104" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/><line x1="78" y1="102" x2="112" y2="104" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/><line x1="94" y1="106" x2="94" y2="145" stroke="${ART_C.equip}" stroke-width="6"/>`,
      fig: { head: [88, 46], torso: [[90, 62], [92, 102]], armF: [[90, 64], [97, 86], [102, 100]], legF: [[92, 102], [116, 108], [120, 136]] },
      post: `<circle cx="122" cy="141" r="7" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>`
    },
    {
      pre: `<line x1="76" y1="58" x2="82" y2="104" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/><line x1="78" y1="102" x2="112" y2="104" stroke="${ART_C.equip}" stroke-width="9" stroke-linecap="round"/><line x1="94" y1="106" x2="94" y2="145" stroke="${ART_C.equip}" stroke-width="6"/>`,
      fig: { head: [88, 46], torso: [[90, 62], [92, 102]], armF: [[90, 64], [97, 86], [102, 100]], legF: [[92, 102], [116, 108], [148, 104]] },
      post: `<circle cx="153" cy="104" r="7" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>`
    }
  ],

  'calf-raise': [
    {
      pre: `<rect x="84" y="132" width="44" height="13" rx="2" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>` + `<line x1="66" y1="40" x2="66" y2="145" stroke="${ART_C.equip}" stroke-width="6"/>`,
      fig: { head: [98, 34], torso: [[99, 50], [97, 92]], legF: [[97, 92], [99, 114], [98, 136]], armF: [[99, 52], [82, 60], [68, 62]] },
      post: ''
    },
    {
      pre: `<rect x="84" y="132" width="44" height="13" rx="2" fill="${ART_C.equipFill}" stroke="${ART_C.equip}" stroke-width="3"/>` + `<line x1="66" y1="40" x2="66" y2="145" stroke="${ART_C.equip}" stroke-width="6"/>`,
      fig: { head: [98, 26], torso: [[99, 42], [97, 84]], legF: [[97, 84], [99, 106], [98, 128]], armF: [[99, 44], [82, 54], [68, 56]] },
      post: `<line x1="94" y1="130" x2="104" y2="126" stroke="${ART_C.body}" stroke-width="6" stroke-linecap="round"/>`
    }
  ],

  'plank': [
    {
      fig: { head: [148, 96], torso: [[136, 101], [95, 104]], legF: [[95, 104], [70, 112], [46, 122]], armF: [[136, 102], [140, 122], [120, 124]] },
      post: `<line x1="30" y1="128" x2="170" y2="128" stroke="${ART_C.ground}" stroke-width="4" stroke-linecap="round"/>`,
      noGround: true
    },
    {
      fig: { head: [148, 96], torso: [[136, 101], [95, 104]], legF: [[95, 104], [70, 112], [46, 122]], armF: [[136, 102], [140, 122], [120, 124]] },
      post: `<line x1="30" y1="128" x2="170" y2="128" stroke="${ART_C.ground}" stroke-width="4" stroke-linecap="round"/>` +
        `<circle cx="160" cy="44" r="14" fill="none" stroke="${ART_C.accent}" stroke-width="3"/><line x1="160" y1="44" x2="160" y2="35" stroke="${ART_C.accent}" stroke-width="3" stroke-linecap="round"/><line x1="160" y1="44" x2="167" y2="47" stroke="${ART_C.accent}" stroke-width="3" stroke-linecap="round"/>`,
      noGround: true
    }
  ],

  'crunch-carico': [
    {
      pre: `<line x1="38" y1="132" x2="162" y2="132" stroke="${ART_C.ground}" stroke-width="6" stroke-linecap="round"/>`,
      fig: { head: [60, 116], torso: [[72, 120], [106, 123]], legF: [[106, 123], [122, 100], [132, 126]], armF: [[72, 120], [80, 110], [88, 112]] },
      post: _plate(84, 106, 9),
      noGround: true
    },
    {
      pre: `<line x1="38" y1="132" x2="162" y2="132" stroke="${ART_C.ground}" stroke-width="6" stroke-linecap="round"/>`,
      fig: { head: [72, 98], torso: [[80, 106], [106, 123]], legF: [[106, 123], [122, 100], [132, 126]], armF: [[80, 106], [88, 98], [94, 102]] },
      post: _plate(92, 95, 9),
      noGround: true
    }
  ],

  'cardio': [
    {
      pre: `<line x1="45" y1="140" x2="162" y2="140" stroke="${ART_C.equip}" stroke-width="7" stroke-linecap="round"/><line x1="152" y1="138" x2="166" y2="82" stroke="${ART_C.equip}" stroke-width="5" stroke-linecap="round"/><line x1="158" y1="84" x2="172" y2="88" stroke="${ART_C.equip}" stroke-width="6" stroke-linecap="round"/>`,
      fig: { head: [104, 46], torso: [[101, 61], [96, 97]], legF: [[96, 97], [116, 114], [106, 136]], legB: [[96, 97], [80, 112], [88, 132]], armF: [[101, 63], [113, 76], [121, 62]], armB: [[101, 63], [89, 74], [81, 86]] },
      noGround: true
    },
    {
      pre: `<line x1="45" y1="140" x2="162" y2="140" stroke="${ART_C.equip}" stroke-width="7" stroke-linecap="round"/><line x1="152" y1="138" x2="166" y2="82" stroke="${ART_C.equip}" stroke-width="5" stroke-linecap="round"/><line x1="158" y1="84" x2="172" y2="88" stroke="${ART_C.equip}" stroke-width="6" stroke-linecap="round"/>`,
      fig: { head: [104, 46], torso: [[101, 61], [96, 97]], legF: [[96, 97], [82, 116], [72, 134]], legB: [[96, 97], [112, 112], [118, 134]], armF: [[101, 63], [90, 76], [82, 62]], armB: [[101, 63], [113, 74], [121, 86]] },
      noGround: true
    }
  ]
};

// Esercizi con fotografie reali in img/ (free-exercise-db, licenza libera).
// Se un id non è in lista si torna al disegno SVG.
const PHOTO_IDS = [
  'panca-piana', 'panca-inclinata-manubri', 'croci-cavi', 'shoulder-press', 'alzate-laterali',
  'pushdown', 'tricipiti-nuca', 'stacco-rumeno', 'lat-machine', 'rematore-bilanciere',
  'pulley-basso', 'face-pull', 'curl-bilanciere', 'curl-martello', 'squat', 'leg-press',
  'affondi-manubri', 'leg-curl', 'leg-extension', 'calf-raise', 'plank', 'crunch-carico', 'cardio'
];

function exerciseArt(exId) {
  if (PHOTO_IDS.includes(exId)) {
    return `<div class="photo-panels">
      <div class="pp"><span class="pp-n">1</span><img src="img/${exId}-0.jpg" alt="Posizione di partenza" loading="lazy"></div>
      <div class="pp"><span class="pp-n">2</span><img src="img/${exId}-1.jpg" alt="Posizione di arrivo" loading="lazy"></div>
    </div>`;
  }
  return exerciseSVG(exId);
}

function exerciseSVG(exId) {
  const panels = ART[exId];
  if (!panels) {
    return `<svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="400" height="170" rx="12" fill="#F4F2ED"/><text x="200" y="90" text-anchor="middle" font-size="15" fill="#8E897F" font-family="-apple-system, sans-serif">Illustrazione in arrivo</text></svg>`;
  }
  let s = `<svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg" role="img">`;
  s += `<rect x="0" y="0" width="400" height="170" rx="12" fill="#FAF9F6"/>`;
  s += `<line x1="200" y1="14" x2="200" y2="156" stroke="#E7E4DC" stroke-width="1.5"/>`;
  panels.forEach((p, i) => {
    s += `<g transform="translate(${i * 200},0)">`;
    if (!p.noGround) s += `<line x1="16" y1="145" x2="184" y2="145" stroke="${ART_C.ground}" stroke-width="3" stroke-linecap="round"/>`;
    if (p.pre) s += p.pre;
    s += _fig(p.fig);
    if (p.post) s += p.post;
    s += `<circle cx="22" cy="22" r="11" fill="${ART_C.accent}"/><text x="22" y="26.5" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="-apple-system, sans-serif">${i + 1}</text>`;
    s += `</g>`;
  });
  s += `</svg>`;
  return s;
}

// --- mappa muscolare: figura fronte + retro con gruppi evidenziati ---

function muscleMapSVG(muscles) {
  const primary = muscles[0];
  const BASE = '#E4E1D8';
  const on = (m) => muscles.includes(m) ? (m === primary ? ART_C.accent : '#F9A778') : 'none';

  function body(cx) {
    return `<circle cx="${cx}" cy="17" r="7.5" fill="${BASE}"/>` +
      _L([[cx, 28], [cx, 62]], BASE, 21) +
      _L([[cx - 12, 31], [cx - 15, 51], [cx - 16, 70]], BASE, 7) +
      _L([[cx + 12, 31], [cx + 15, 51], [cx + 16, 70]], BASE, 7) +
      _L([[cx - 5, 66], [cx - 6, 96], [cx - 6, 124]], BASE, 9) +
      _L([[cx + 5, 66], [cx + 6, 96], [cx + 6, 124]], BASE, 9);
  }

  const f = 48, b = 122;
  let s = `<svg viewBox="0 0 170 140" xmlns="http://www.w3.org/2000/svg" role="img">`;
  s += body(f) + body(b);

  // fronte
  if (on('spalle') !== 'none') s += `<circle cx="${f - 12}" cy="31" r="5" fill="${on('spalle')}"/><circle cx="${f + 12}" cy="31" r="5" fill="${on('spalle')}"/>`;
  if (on('petto') !== 'none') s += `<ellipse cx="${f - 5.5}" cy="36" rx="5.5" ry="4.5" fill="${on('petto')}"/><ellipse cx="${f + 5.5}" cy="36" rx="5.5" ry="4.5" fill="${on('petto')}"/>`;
  if (on('bicipiti') !== 'none') s += `<ellipse cx="${f - 13.5}" cy="42" rx="3.6" ry="6.5" fill="${on('bicipiti')}"/><ellipse cx="${f + 13.5}" cy="42" rx="3.6" ry="6.5" fill="${on('bicipiti')}"/>`;
  if (on('avambracci') !== 'none') s += `<ellipse cx="${f - 15.5}" cy="61" rx="3.2" ry="7.5" fill="${on('avambracci')}"/><ellipse cx="${f + 15.5}" cy="61" rx="3.2" ry="7.5" fill="${on('avambracci')}"/>`;
  if (on('addome') !== 'none') s += `<rect x="${f - 6.5}" y="43" width="13" height="17" rx="3.5" fill="${on('addome')}"/>`;
  if (on('quadricipiti') !== 'none') s += `<ellipse cx="${f - 6}" cy="84" rx="4.6" ry="13" fill="${on('quadricipiti')}"/><ellipse cx="${f + 6}" cy="84" rx="4.6" ry="13" fill="${on('quadricipiti')}"/>`;

  // retro
  if (on('trapezio') !== 'none') s += `<polygon points="${b - 10},29 ${b + 10},29 ${b},44" fill="${on('trapezio')}"/>`;
  if (on('spalle') !== 'none') s += `<circle cx="${b - 12}" cy="31" r="5" fill="${on('spalle')}"/><circle cx="${b + 12}" cy="31" r="5" fill="${on('spalle')}"/>`;
  if (on('tricipiti') !== 'none') s += `<ellipse cx="${b - 13.5}" cy="43" rx="3.6" ry="6.5" fill="${on('tricipiti')}"/><ellipse cx="${b + 13.5}" cy="43" rx="3.6" ry="6.5" fill="${on('tricipiti')}"/>`;
  if (on('dorsali') !== 'none') s += `<ellipse cx="${b - 6}" cy="47" rx="4.4" ry="9" fill="${on('dorsali')}" transform="rotate(12 ${b - 6} 47)"/><ellipse cx="${b + 6}" cy="47" rx="4.4" ry="9" fill="${on('dorsali')}" transform="rotate(-12 ${b + 6} 47)"/>`;
  if (on('lombari') !== 'none') s += `<rect x="${b - 5.5}" y="53" width="11" height="9" rx="2.5" fill="${on('lombari')}"/>`;
  if (on('glutei') !== 'none') s += `<circle cx="${b - 5}" cy="68" r="5" fill="${on('glutei')}"/><circle cx="${b + 5}" cy="68" r="5" fill="${on('glutei')}"/>`;
  if (on('femorali') !== 'none') s += `<ellipse cx="${b - 6}" cy="90" rx="4.4" ry="12" fill="${on('femorali')}"/><ellipse cx="${b + 6}" cy="90" rx="4.4" ry="12" fill="${on('femorali')}"/>`;
  if (on('polpacci') !== 'none') s += `<ellipse cx="${b - 6}" cy="113" rx="3.8" ry="8" fill="${on('polpacci')}"/><ellipse cx="${b + 6}" cy="113" rx="3.8" ry="8" fill="${on('polpacci')}"/>`;

  s += `<text x="${f}" y="138" text-anchor="middle" font-size="9.5" fill="#8E897F" font-family="-apple-system, sans-serif">fronte</text>`;
  s += `<text x="${b}" y="138" text-anchor="middle" font-size="9.5" fill="#8E897F" font-family="-apple-system, sans-serif">retro</text>`;
  s += `</svg>`;
  return s;
}
