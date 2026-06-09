// ============================================
// winstep.io — Avatar Set (18 premium SVG avatars)
// Usage: avatarSVG('warrior', 100)  → returns SVG string
//        AVATAR_LIST → array of {id, name, gender}
// ============================================

const AVATAR_LIST = [
  { id:'warrior',   name:'Warrior',   gender:'m' },
  { id:'mage',      name:'Mage',      gender:'f' },
  { id:'racer',     name:'Racer',     gender:'m' },
  { id:'pilot',     name:'Pilot',     gender:'f' },
  { id:'astronaut', name:'Astronaut', gender:'m' },
  { id:'archer',    name:'Archer',    gender:'f' },
  { id:'captain',   name:'Captain',   gender:'m' },
  { id:'hero',      name:'Hero',      gender:'f' },
  { id:'viking',    name:'Viking',    gender:'m' },
  { id:'fairy',     name:'Fairy',     gender:'f' },
  { id:'boxer',     name:'Boxer',     gender:'m' },
  { id:'queen',     name:'Queen',     gender:'f' },
  { id:'ninja',     name:'Ninja',     gender:'m' },
  { id:'diva',      name:'Diva',      gender:'f' },
  { id:'gamer',     name:'Gamer',     gender:'m' },
  { id:'athlete',   name:'Athlete',   gender:'f' },
  { id:'wizard',    name:'Wizard',    gender:'m' },
  { id:'explorer',  name:'Explorer',  gender:'f' }
];

// inner artwork for each avatar (100x100 coordinate space, no bg circle)
const AVATAR_ART = {
  warrior: '<ellipse cx="50" cy="54" rx="23" ry="25" fill="#d9a066"/><path d="M50 54 Q40 54 38 64 Q50 60 50 54" fill="#c08850" opacity="0.5"/><path d="M27 46 Q50 20 73 46 L73 36 Q50 22 27 36 Z" fill="#3a3a45"/><path d="M27 46 Q24 38 30 32 L34 44 Z" fill="#2a2a35"/><path d="M73 46 Q76 38 70 32 L66 44 Z" fill="#2a2a35"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M40 67 Q50 72 60 67" fill="none" stroke="#9a6840" stroke-width="2" stroke-linecap="round"/><path d="M34 44 Q40 42 44 45" fill="none" stroke="#2a1810" stroke-width="1.8"/><path d="M56 45 Q60 42 66 44" fill="none" stroke="#2a1810" stroke-width="1.8"/>',
  mage: '<ellipse cx="50" cy="52" rx="22" ry="24" fill="#f0c8a0"/><path d="M28 50 Q24 18 50 16 Q76 18 72 50 L80 84 L68 78 L72 50 Q50 30 28 50 L32 78 L20 84 Z" fill="#6a4a9a"/><path d="M28 50 Q26 40 32 34 L36 48 Z" fill="#5a3a8a"/><ellipse cx="41" cy="50" rx="3" ry="3.5" fill="#3a2860"/><ellipse cx="59" cy="50" rx="3" ry="3.5" fill="#3a2860"/><circle cx="42" cy="49" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="49" r="1" fill="#fff" opacity="0.8"/><path d="M43 64 Q50 69 57 64" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="22" r="3.5" fill="#f5c842"/><circle cx="33" cy="60" r="3.5" fill="#e89090" opacity="0.4"/><circle cx="67" cy="60" r="3.5" fill="#e89090" opacity="0.4"/>',
  racer: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#d9a066"/><path d="M26 48 Q50 20 74 48 L74 30 Q50 16 26 30 Z" fill="#e63946"/><path d="M26 48 Q50 38 74 48 L74 44 Q50 34 26 44 Z" fill="#c0392b"/><rect x="32" y="44" width="36" height="10" rx="5" fill="#1a1a1a" opacity="0.85"/><rect x="34" y="46" width="14" height="6" rx="3" fill="#8ab4ff" opacity="0.6"/><rect x="52" y="46" width="14" height="6" rx="3" fill="#8ab4ff" opacity="0.6"/><path d="M40 66 Q50 71 60 66" fill="none" stroke="#9a6840" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="24" r="3" fill="#f5c842"/>',
  pilot: '<ellipse cx="50" cy="52" rx="22" ry="24" fill="#f0c8a0"/><path d="M26 50 Q24 22 50 20 Q76 22 74 50 L70 70 L66 50 Q50 34 34 50 L30 70 Z" fill="#3a2a1a"/><path d="M26 48 Q50 22 74 48 L74 38 Q50 24 26 38 Z" fill="#2ec4b6"/><path d="M26 48 Q50 40 74 48 L74 44 Q50 36 26 44 Z" fill="#26a99d"/><ellipse cx="41" cy="50" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="50" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="49" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="49" r="1" fill="#fff" opacity="0.8"/><path d="M43 64 Q50 69 57 64" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/><circle cx="33" cy="60" r="3.5" fill="#e89090" opacity="0.4"/><circle cx="67" cy="60" r="3.5" fill="#e89090" opacity="0.4"/>',
  astronaut: '<ellipse cx="50" cy="50" rx="28" ry="29" fill="#e8e8f0"/><ellipse cx="50" cy="50" rx="28" ry="29" fill="none" stroke="#b8b8c8" stroke-width="2"/><path d="M30 50 Q30 30 50 30 Q70 30 70 50 Q70 64 50 66 Q30 64 30 50 Z" fill="#1a2a4a"/><path d="M36 42 Q42 36 50 36" fill="none" stroke="#8ab4ff" stroke-width="3" opacity="0.6" stroke-linecap="round"/><circle cx="50" cy="22" r="3" fill="#e63946"/><rect x="44" y="62" width="12" height="4" rx="2" fill="#b8b8c8"/>',
  archer: '<ellipse cx="50" cy="52" rx="22" ry="24" fill="#d9a066"/><path d="M26 48 Q24 20 50 18 Q76 20 74 48 L70 64 L66 48 Q50 32 34 48 L30 64 Z" fill="#3a2a1a"/><path d="M26 46 Q50 22 74 46 L74 38 Q50 24 26 38 Z" fill="#2ec47a"/><path d="M50 18 Q58 8 68 14 L60 26 Z" fill="#26a96a"/><ellipse cx="41" cy="50" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="50" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="49" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="49" r="1" fill="#fff" opacity="0.8"/><path d="M43 64 Q50 69 57 64" fill="none" stroke="#9a6840" stroke-width="2" stroke-linecap="round"/>',
  captain: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#d9a066"/><path d="M27 44 Q50 20 73 44 L73 32 Q50 16 27 32 Z" fill="#1a3a6a"/><rect x="32" y="40" width="36" height="6" rx="3" fill="#f5c842"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M38 62 Q50 56 62 62 L60 70 Q50 66 40 70 Z" fill="#9a6840"/>',
  hero: '<ellipse cx="50" cy="52" rx="22" ry="24" fill="#f0c8a0"/><path d="M26 48 Q24 16 50 14 Q76 16 74 48 L82 76 L70 72 L74 48 Q50 30 26 48 L30 72 L18 76 Z" fill="#1a1a2a"/><rect x="33" y="40" width="34" height="7" rx="3.5" fill="#e63946"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M43 66 Q50 71 57 66" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>',
  viking: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#d9a066"/><path d="M30 42 Q50 22 70 42 L70 34 Q50 22 30 34 Z" fill="#a8682a"/><path d="M30 40 Q20 30 26 20 Q36 28 36 38 Z" fill="#e8e8e8"/><path d="M70 40 Q80 30 74 20 Q64 28 64 38 Z" fill="#e8e8e8"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M34 60 Q50 54 66 60 L62 78 Q50 70 38 78 Z" fill="#c89858"/>',
  fairy: '<ellipse cx="50" cy="52" rx="22" ry="24" fill="#f5d0b0"/><path d="M26 48 Q24 16 50 14 Q76 16 74 48 L78 76 L68 72 L72 48 Q50 30 28 48 L32 72 L22 76 Z" fill="#ff8ac0"/><path d="M26 48 Q24 38 30 32 L34 46 Z" fill="#e87ab0"/><ellipse cx="41" cy="50" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="50" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="49" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="49" r="1" fill="#fff" opacity="0.8"/><path d="M43 64 Q50 69 57 64" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/><circle cx="30" cy="24" r="3" fill="#f5c842"/><circle cx="70" cy="24" r="3" fill="#f5c842"/><circle cx="33" cy="60" r="3.5" fill="#e89090" opacity="0.4"/><circle cx="67" cy="60" r="3.5" fill="#e89090" opacity="0.4"/>',
  boxer: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#c89058"/><path d="M28 44 Q50 22 72 44 L72 34 Q50 22 28 34 Z" fill="#1a1a1a"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M40 64 Q50 70 60 64" fill="none" stroke="#8a5a3a" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="70" r="10" fill="#e63946"/><circle cx="78" cy="70" r="10" fill="#e63946"/><circle cx="22" cy="70" r="10" fill="none" stroke="#c0392b" stroke-width="1.5"/><circle cx="78" cy="70" r="10" fill="none" stroke="#c0392b" stroke-width="1.5"/>',
  queen: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#f0c8a0"/><path d="M26 50 Q24 24 50 22 Q76 24 74 50 L80 82 L68 78 L72 50 Q50 34 28 50 L32 78 L20 82 Z" fill="#5a3a8a"/><path d="M28 36 L34 22 L42 32 L50 18 L58 32 L66 22 L72 36 Z" fill="#f5c842"/><circle cx="50" cy="26" r="2.5" fill="#e63946"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#3a2860"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#3a2860"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M43 65 Q50 70 57 65" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>',
  ninja: '<ellipse cx="50" cy="52" rx="22" ry="24" fill="#2a2a35"/><rect x="28" y="46" width="44" height="12" fill="#d9a066"/><ellipse cx="41" cy="52" rx="3" ry="3" fill="#1a1a1a"/><ellipse cx="59" cy="52" rx="3" ry="3" fill="#1a1a1a"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><rect x="26" y="36" width="48" height="7" rx="3" fill="#e63946"/><path d="M70 38 L82 34 L78 44 Z" fill="#e63946"/>',
  diva: '<ellipse cx="50" cy="52" rx="22" ry="24" fill="#f5d0b0"/><path d="M24 50 Q22 16 50 14 Q78 16 76 50 L84 84 L70 80 L74 50 Q50 32 26 50 L30 80 L16 84 Z" fill="#1a1a2a"/><ellipse cx="41" cy="50" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="50" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="49" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="49" r="1" fill="#fff" opacity="0.8"/><path d="M44 64 Q50 69 56 64" fill="none" stroke="#d81b60" stroke-width="2.5" stroke-linecap="round"/><circle cx="28" cy="62" r="4" fill="#f5c842"/><circle cx="33" cy="58" r="3.5" fill="#e89090" opacity="0.4"/><circle cx="67" cy="58" r="3.5" fill="#e89090" opacity="0.4"/>',
  gamer: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#d9a066"/><path d="M28 46 Q50 24 72 46 L72 38 Q50 26 28 38 Z" fill="#2a2a35"/><rect x="28" y="46" width="44" height="13" rx="6" fill="#2ec4b6" opacity="0.9"/><rect x="34" y="48" width="11" height="9" rx="2" fill="#0d1614"/><rect x="55" y="48" width="11" height="9" rx="2" fill="#0d1614"/><path d="M72 52 Q82 52 82 62" fill="none" stroke="#2a2a35" stroke-width="3"/><path d="M40 66 Q50 71 60 66" fill="none" stroke="#9a6840" stroke-width="2" stroke-linecap="round"/>',
  athlete: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#c89058"/><path d="M28 42 Q50 22 72 42 L72 32 Q50 20 28 32 Z" fill="#1a1a1a"/><path d="M70 26 Q82 32 76 48 L70 42 Z" fill="#1a1a1a"/><rect x="33" y="36" width="34" height="7" rx="3" fill="#e63946"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M43 65 Q50 70 57 65" fill="none" stroke="#a83a2a" stroke-width="2" stroke-linecap="round"/>',
  wizard: '<ellipse cx="50" cy="56" rx="20" ry="22" fill="#d9a066"/><path d="M30 44 L50 8 L70 44 Z" fill="#5a3a8a"/><path d="M30 44 L50 8 L40 44 Z" fill="#4a2a7a"/><circle cx="50" cy="20" r="3" fill="#f5c842"/><ellipse cx="41" cy="54" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="54" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="53" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="53" r="1" fill="#fff" opacity="0.8"/><path d="M40 64 Q50 70 60 64 L58 80 Q50 86 42 80 Z" fill="#d8d8d8"/>',
  explorer: '<ellipse cx="50" cy="54" rx="22" ry="24" fill="#d9a066"/><path d="M26 50 Q24 24 50 22 Q76 24 74 50 L70 70 L66 50 Q50 36 34 50 L30 70 Z" fill="#8a5a3a"/><path d="M26 44 Q50 26 74 44 L74 38 Q50 26 26 38 Z" fill="#2ec47a"/><rect x="32" y="38" width="36" height="6" rx="3" fill="#1a3a2a"/><ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#2a1810"/><ellipse cx="59" cy="52" rx="3" ry="3.5" fill="#2a1810"/><circle cx="42" cy="51" r="1" fill="#fff" opacity="0.8"/><circle cx="60" cy="51" r="1" fill="#fff" opacity="0.8"/><path d="M43 65 Q50 70 57 65" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>'
};

// border color per avatar (matches the preview)
const AVATAR_BORDER = {
  warrior:'rgba(245,200,66,.3)', mage:'rgba(167,139,250,.4)', racer:'rgba(230,57,70,.4)',
  pilot:'rgba(46,196,182,.4)', astronaut:'rgba(138,180,255,.4)', archer:'rgba(46,196,122,.4)',
  captain:'rgba(26,58,106,.5)', hero:'rgba(230,57,70,.4)', viking:'rgba(200,150,80,.4)',
  fairy:'rgba(255,138,192,.4)', boxer:'rgba(230,57,70,.4)', queen:'rgba(245,200,66,.4)',
  ninja:'rgba(58,58,69,.6)', diva:'rgba(255,138,192,.4)', gamer:'rgba(46,196,182,.4)',
  athlete:'rgba(230,57,70,.4)', wizard:'rgba(106,74,154,.5)', explorer:'rgba(46,196,122,.4)'
};

// returns an <svg> string for the given avatar id at the given pixel size.
// if id is unknown/null, returns null (caller can fall back to initials).
function avatarSVG(id, size){
  size = size || 100;
  if(!id || !AVATAR_ART[id]) return null;
  const border = AVATAR_BORDER[id] || 'rgba(46,196,182,.3)';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><linearGradient id="abg_'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#243634"/><stop offset="1" stop-color="#16201e"/></linearGradient></defs>'
    + '<circle cx="50" cy="50" r="48" fill="url(#abg_'+id+')" stroke="'+border+'" stroke-width="2"/>'
    + '<clipPath id="aclip_'+id+'"><circle cx="50" cy="50" r="47"/></clipPath>'
    + '<g clip-path="url(#aclip_'+id+')">' + AVATAR_ART[id] + '</g>'
    + '</svg>';
}

// helper: avatar name by id
function avatarName(id){
  const a = AVATAR_LIST.find(x=>x.id===id);
  return a ? a.name : '';
}
