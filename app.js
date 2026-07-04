// GYMBRO — logica applicazione
/* global EXDB, SEED, exerciseSVG, exerciseArt, muscleMapSVG */

const STORE_KEY = 'gymbro.v1';
const DRAFT_KEY = 'gymbro.draft';
// Migrazione dai vecchi nomi (l'app si chiamava GymLog)
const OLD_KEYS = { 'gymbro.v1': 'gymlog.v1', 'gymbro.draft': 'gymlog.draft' };
Object.keys(OLD_KEYS).forEach((k) => {
  if (!localStorage.getItem(k) && localStorage.getItem(OLD_KEYS[k])) {
    localStorage.setItem(k, localStorage.getItem(OLD_KEYS[k]));
    localStorage.removeItem(OLD_KEYS[k]);
  }
});

let state = null;
let draft = null;
let currentTab = 'home';
let progressSel = null;
let sessionSel = null;

// ---------- utilità ----------
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString('it-IT');
const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const dateLabel = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }); };
const uid = () => 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1e5);
const exOf = (id) => EXDB.find((e) => e.id === id) || null;

const FEELINGS = {
  hard: { label: 'Pesante', color: '#D9403A' },
  ok: { label: 'Ok', color: '#E8930C' },
  easy: { label: 'Facile', color: '#2E9E44' }
};

const PARK_REASONS = {
  occupata: 'Macchina occupata',
  stanchezza: 'Stanchezza',
  fastidio: 'Fastidio muscolare'
};

function parkIcon(reason, size) {
  const s = size || 14;
  const common = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
  if (reason === 'occupata') return `<svg ${common}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/></svg>`;
  if (reason === 'stanchezza') return `<svg ${common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`;
  if (reason === 'fastidio') return `<svg ${common}><path d="M12 4 21 19H3z"/><line x1="12" y1="10" x2="12" y2="14.5"/><circle cx="12" cy="16.8" r="0.4" fill="currentColor"/></svg>`;
  return `<svg ${common}><circle cx="12" cy="12" r="9"/><path d="M9 12h6"/></svg>`;
}

function faceSVG(kind, size) {
  const s = size || 24;
  const c = FEELINGS[kind].color;
  let mouth = '';
  if (kind === 'easy') mouth = '<path d="M8 14.5 Q12 18.5 16 14.5" fill="none" stroke-width="1.8" stroke-linecap="round"/>';
  if (kind === 'ok') mouth = '<line x1="8.5" y1="15.5" x2="15.5" y2="15.5" stroke-width="1.8" stroke-linecap="round"/>';
  if (kind === 'hard') mouth = '<path d="M8 16.5 Q12 12.8 16 16.5" fill="none" stroke-width="1.8" stroke-linecap="round"/>';
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" stroke="${c}" fill="none"><circle cx="12" cy="12" r="9.5" stroke-width="1.8"/><circle cx="8.8" cy="9.5" r="1.15" fill="${c}" stroke="none"/><circle cx="15.2" cy="9.5" r="1.15" fill="${c}" stroke="none"/>${mouth}</svg>`;
}

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/></svg>',
  workout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="12" x2="16" y2="12"/><rect x="4.5" y="8" width="2.6" height="8" rx="1"/><rect x="16.9" y="8" width="2.6" height="8" rx="1"/><rect x="1.8" y="9.6" width="1.9" height="4.8" rx="0.9"/><rect x="20.3" y="9.6" width="1.9" height="4.8" rx="0.9"/></svg>',
  plans: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
  progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19 10 12l4 3.5L20 8"/><path d="M15.5 8H20v4.5"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9.3"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.8" r="0.4" fill="currentColor"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>'
};

// ---------- persistenza ----------
function load() {
  state = null;
  draft = null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { state = JSON.parse(raw); }
  } catch (e) { state = null; }
  if (!state || !state.plans) {
    state = JSON.parse(JSON.stringify(SEED));
    save();
  }
  try {
    const d = localStorage.getItem(DRAFT_KEY);
    if (d) draft = JSON.parse(d);
    if (draft) {
      if (!draft.parked) draft.parked = [];
      if (draft.entries) {
        draft.items.forEach((it, i) => { it.entry = draft.entries[i] || {}; });
        delete draft.entries;
      }
      draft.items.forEach((it) => { if (!it.entry) it.entry = {}; });
    }
  } catch (e) { draft = null; }
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function saveDraft() { if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); else localStorage.removeItem(DRAFT_KEY); }

function activePlan() { return state.plans[state.plans.length - 1]; }
function barWeight(ex) {
  if (state.settings && state.settings['bar-' + ex.id] != null) return state.settings['bar-' + ex.id];
  return ex.bar || 20;
}

// ---------- storico e suggerimenti ----------
function historyFor(exId) {
  const out = [];
  state.sessions.forEach((s) => {
    s.entries.forEach((en) => {
      if (en.exId === exId && !en.skipped) out.push({ date: s.date, sessionId: s.id, ...en });
    });
  });
  out.sort((a, b) => a.date < b.date ? 1 : -1);
  return out;
}
function checkinForSession(sessionId) {
  return state.checkins.find((c) => c.sessionId === sessionId) || null;
}

function suggest(ex) {
  const hist = historyFor(ex.id);
  const last = hist.find((h) => ex.type === 'cardio' ? h.speed != null : ex.timed ? h.seconds != null : h.weight != null);
  if (!last) return null;
  const chk = checkinForSession(last.sessionId);

  if (ex.type === 'cardio') {
    let sp = last.speed, why = '';
    if (last.feeling === 'easy') { sp += 0.5; why = 'l’ultima volta è stato facile: +0,5 km/h'; }
    else if (last.feeling === 'hard') { why = 'mantieni il ritmo dell’ultima volta e punta a chiuderlo meglio'; }
    else { why = 'stesso ritmo dell’ultima volta'; }
    return { value: sp, unit: 'km/h', base: last.speed, text: `${fmt(last.speed)} km/h il ${dateLabel(last.date)} — ${why}` };
  }

  if (ex.timed) {
    return { value: last.seconds, unit: 's', base: last.seconds, text: `record da battere: ${last.seconds}" il ${dateLabel(last.date)}` };
  }

  let delta = 0;
  const why = [];
  if (last.feeling === 'easy') { delta = ex.inc; why.push('è stato facile'); }
  else if (last.feeling === 'hard') { delta = 0; why.push('era pesante: consolida la tecnica con lo stesso peso'); }
  else { delta = 0; why.push('è andato bene: conferma il peso'); }
  if (chk && chk.level >= 3 && delta > 0) { delta = 0; why.push('ma i muscoli erano molto affaticati il giorno dopo'); }
  if (chk && chk.level >= 3 && last.feeling === 'hard') { delta = -ex.inc; why.push('e i muscoli erano molto affaticati: scendi un po’'); }

  const val = Math.max(0, last.weight + delta);
  const deltaTxt = delta > 0 ? ` (+${fmt(delta)} kg)` : delta < 0 ? ` (−${fmt(-delta)} kg)` : '';
  return {
    value: val, unit: 'kg', base: last.weight, plusBar: !!last.plusBar,
    text: `${fmt(last.weight)} kg${last.plusBar ? ' + barra' : ''} il ${dateLabel(last.date)}: ${why.join(', ')}${deltaTxt}`
  };
}

// ---------- parser messaggio WhatsApp ----------
function normalizeName(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function matchExercise(name) {
  const n = normalizeName(name);
  let best = null, bestLen = 0;
  EXDB.forEach((ex) => {
    ex.aliases.concat([ex.name]).forEach((al) => {
      const a = normalizeName(al);
      if ((n === a || n.includes(a) || a.includes(n)) && a.length > bestLen) { best = ex; bestLen = a.length; }
    });
  });
  return best;
}
function parseScheda(text) {
  const days = [];
  let cur = null;
  const ensureDay = () => { if (!cur) { cur = { id: uid(), name: 'Giorno 1', items: [] }; days.push(cur); } return cur; };
  text.split(/\n/).forEach((rawLine) => {
    let line = rawLine.replace(/^\[[^\]]*\]\s*[^:]{0,40}:\s*/, '').trim();
    if (!line) return;
    const dayM = line.match(/^giorno\s*(\d+)/i);
    if (dayM) {
      cur = { id: uid(), name: 'Giorno ' + dayM[1], items: [] };
      days.push(cur);
      return;
    }
    const cardioM = line.match(/^cardio\s*(\d+)/i);
    if (cardioM) {
      ensureDay().items.push({ exId: 'cardio', raw: line, minutes: parseInt(cardioM[1], 10) });
      return;
    }
    const m = line.match(/^(.+?)[:\s]+(\d+)\s*[x×X]\s*(\d+|max)\s*(.*)$/i);
    if (m) {
      const name = m[1].replace(/[:\-–]+$/, '').trim();
      const ex = matchExercise(name);
      const reps = /max/i.test(m[3]) ? 'MAX' : parseInt(m[3], 10);
      const perSide = /gamba|lato|braccio/i.test(m[4]);
      ensureDay().items.push({ exId: ex ? ex.id : null, raw: line, name, sets: parseInt(m[2], 10), reps, perSide });
      return;
    }
    // riga non riconosciuta: la teniamo come nota
    ensureDay().items.push({ exId: null, raw: line, name: line, unparsed: true });
  });
  return days;
}

// ---------- rendering ----------
function render() {
  const view = $('#view');
  if (currentTab === 'home') view.innerHTML = sessionSel ? renderSession() : renderHome();
  else if (currentTab === 'workout') view.innerHTML = renderWorkout();
  else if (currentTab === 'plans') view.innerHTML = renderPlans();
  else view.innerHTML = renderProgress();
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === currentTab));
  window.scrollTo(0, 0);
}

function itemLabel(it) {
  const ex = it.exId ? exOf(it.exId) : null;
  const name = ex ? ex.name : (it.name || it.raw);
  if (it.exId === 'cardio') return `${name} ${it.minutes || ''}’`;
  const reps = it.reps === 'MAX' ? 'MAX' : it.reps;
  return `${name} ${it.sets}×${reps}${it.perSide ? ' per lato' : ''}`;
}

function pendingCheckin() {
  const done = new Set(state.checkins.map((c) => c.sessionId));
  const t = todayISO();
  const cand = state.sessions.filter((s) => !done.has(s.id) && s.date < t);
  if (!cand.length) return null;
  cand.sort((a, b) => a.date < b.date ? 1 : -1);
  return cand[0];
}

function lastSessionForDay(dayId) {
  const list = state.sessions.filter((s) => s.dayId === dayId).sort((a, b) => a.date < b.date ? 1 : -1);
  return list[0] || null;
}

// Il giorno che tocca fare: il primo mai fatto, altrimenti quello dopo l'ultima sessione (a rotazione)
function suggestedDayId() {
  const plan = activePlan();
  const done = new Set(state.sessions.filter((s) => s.planId === plan.id).map((s) => s.dayId));
  const firstNew = plan.days.find((d) => !done.has(d.id));
  if (firstNew) return firstNew.id;
  const lastSess = state.sessions.filter((s) => s.planId === plan.id).sort((a, b) => a.date < b.date ? 1 : -1)[0];
  const i = plan.days.findIndex((d) => d.id === lastSess.dayId);
  return plan.days[(i + 1) % plan.days.length].id;
}

// --- home ---
function renderHome() {
  let h = `<header class="top"><div class="logo">GYM<span>BRO</span></div><div class="top-date">${esc(new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }))}</div></header>`;

  const pend = pendingCheckin();
  if (pend) {
    h += `<div class="card checkin-card">
      <div class="card-kicker">Check-in muscolare</div>
      <p class="checkin-q">Come senti i muscoli dopo <strong>${esc(pend.dayName)}</strong> di ${dateLabel(pend.date)}?</p>
      <div class="checkin-row">
        <button class="chk-btn" onclick="App.checkin('${pend.id}',0)">Nessuna<br>stanchezza</button>
        <button class="chk-btn" onclick="App.checkin('${pend.id}',1)">Leggera</button>
        <button class="chk-btn" onclick="App.checkin('${pend.id}',2)">Discreta</button>
        <button class="chk-btn" onclick="App.checkin('${pend.id}',3)">Forte</button>
      </div>
      <p class="hint">Serve a calibrare i pesi suggeriti per la prossima sessione.</p>
    </div>`;
  }

  if (draft) {
    h += `<div class="card resume-card">
      <div class="resume-main" onclick="App.tab('workout')"><div class="card-kicker">Allenamento in corso</div>
      <div class="resume-title">${esc(draft.dayName)} — esercizio ${Math.min(draft.idx + 1, draft.items.length)} di ${draft.items.length}</div></div>
      <div class="resume-actions">
        <button class="btn-primary" onclick="App.tab('workout')">Riprendi</button>
        <button class="btn-ghost btn-ghost-dark" onclick="App.discardDraft()">Scarta</button>
      </div>
    </div>`;
  }

  const plan = activePlan();
  const nextId = draft ? null : suggestedDayId();
  h += `<div class="section-title">Il tuo allenamento <span class="section-sub">${esc(plan.name)}</span></div>`;
  plan.days.forEach((d) => {
    const last = lastSessionForDay(d.id);
    const nEx = d.items.filter((i) => i.exId !== 'cardio').length;
    const isNext = d.id === nextId;
    h += `<div class="card day-card ${isNext ? 'day-next' : ''}">
      <div class="day-info" onclick="App.startDay('${d.id}')">
        <div class="day-name">${esc(d.name)}${isNext ? ' <span class="day-badge">tocca a te</span>' : ''}</div>
        <div class="day-sub">${esc(d.subtitle || '')} · ${nEx} esercizi</div>
        ${last ? `<div class="day-done">✓ fatto ${dateLabel(last.date)}</div>` : ''}
      </div>
      ${isNext ? `<button class="btn-primary" onclick="App.startDay('${d.id}')">Inizia</button>` : `<button class="btn-secondary" onclick="App.startDay('${d.id}')">${last ? 'Rifai' : 'Inizia'}</button>`}
    </div>`;
  });

  const recent = state.sessions.slice().sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 5);
  if (recent.length) {
    h += `<div class="section-title">Attività recenti</div>`;
    recent.forEach((s) => {
      const n = s.entries.filter((e) => !e.skipped && e.exId !== 'cardio').length;
      h += `<div class="card act-card" onclick="App.session('${s.id}')">
        <div class="act-dot"></div>
        <div class="act-main"><div class="act-title">${esc(s.dayName)}</div>
        <div class="act-sub">${dateLabel(s.date)} · ${n} esercizi completati</div></div>
        ${s.overallFeeling ? faceSVG(s.overallFeeling, 26) : ''}
        <span class="act-chev">›</span>
      </div>`;
    });
  }
  return h;
}

// --- dettaglio sessione passata ---
function entryValueLabel(e) {
  if (e.speed != null || e.minutes != null) {
    const parts = [];
    if (e.speed != null) parts.push(fmt(e.speed) + ' km/h');
    if (e.minutes != null) parts.push(e.minutes + '’');
    return parts.join(' · ');
  }
  if (e.seconds != null) return e.seconds + '"';
  if (e.weight != null) return fmt(e.weight) + ' kg' + (e.plusBar ? ' + barra' : '');
  return '—';
}

function entryMetric(e) {
  if (e.speed != null) return e.speed;
  if (e.seconds != null) return e.seconds;
  if (e.weight != null) return e.weight;
  return null;
}

function renderSession() {
  const s = state.sessions.find((x) => x.id === sessionSel);
  if (!s) { sessionSel = null; return renderHome(); }
  const OVERALL = { hard: 'Distrutto', ok: 'Stanco giusto', easy: 'In forma' };
  const LVL = ['Nessuna stanchezza', 'Leggera stanchezza', 'Discreta stanchezza', 'Forte stanchezza'];
  const chk = checkinForSession(s.id);

  let h = `<header class="top"><button class="btn-ghost back" onclick="App.session(null)">← Indietro</button></header>
  <div class="card">
    <div class="sess-head">
      <div><div class="ex-name">${esc(s.dayName)}</div>
      <div class="day-sub">${dateLabel(s.date)}</div></div>
      ${s.overallFeeling ? `<div class="sess-overall">${faceSVG(s.overallFeeling, 30)}<span>${OVERALL[s.overallFeeling]}</span></div>` : ''}
    </div>
    ${chk ? `<div class="sess-chk">Il giorno dopo: <strong>${LVL[chk.level].toLowerCase()}</strong></div>` : ''}
    <div class="hist-list">`;

  s.entries.forEach((e) => {
    const ex = e.exId ? exOf(e.exId) : null;
    const name = ex ? ex.name : (e.raw || 'Esercizio');
    const click = ex ? `onclick="App.sheet('${ex.id}')"` : '';
    if (e.skipped) {
      h += `<div class="hist-row sess-skip" ${click}><span class="hist-date">${esc(name)}</span><span class="sess-skip-tag">saltato${e.reason && PARK_REASONS[e.reason] ? ' · ' + PARK_REASONS[e.reason].toLowerCase() : ''}</span><span></span></div>`;
      return;
    }
    // confronto con la volta precedente
    let trend = '';
    if (e.exId) {
      const prev = historyFor(e.exId).find((x) => x.date < s.date && entryMetric(x) != null);
      const cur = entryMetric(e);
      if (prev && cur != null) {
        const pv = entryMetric(prev);
        if (cur > pv) trend = '<span class="trend up">▲</span>';
        else if (cur < pv) trend = '<span class="trend down">▼</span>';
      }
    }
    h += `<div class="hist-row" ${click}><span class="hist-date">${esc(name)}${e.note ? `<span class="sess-note"> · ${esc(e.note)}</span>` : ''}</span><span class="hist-val">${entryValueLabel(e)} ${trend}</span>${e.feeling ? faceSVG(e.feeling, 20) : '<span></span>'}</div>`;
  });

  h += `</div><p class="hint">Tocca un esercizio per vedere come si fa e il suo storico.</p></div>`;
  return h;
}

// --- allenamento ---
function soreMuscles() {
  const set = new Set();
  if (!draft) return set;
  const collect = (exId) => { const ex = exId ? exOf(exId) : null; if (ex) ex.muscles.forEach((m) => set.add(m)); };
  draft.parked.forEach((p) => { if (p.parkReason === 'fastidio') collect(p.exId); });
  draft.items.forEach((it) => { if (it.entry && it.entry.skipped && it.entry.reason === 'fastidio') collect(it.exId); });
  return set;
}

function renderWorkout() {
  if (!draft) {
    const plan = activePlan();
    let h = `<header class="top"><div class="page-title">Allenati</div></header>
      <p class="lead">Scegli il giorno della scheda e parti.</p>`;
    plan.days.forEach((d) => {
      h += `<div class="card day-card"><div class="day-info">
        <div class="day-name">${esc(d.name)}</div>
        <div class="day-sub">${esc(d.subtitle || '')}</div></div>
        <button class="btn-primary" onclick="App.startDay('${d.id}')">Inizia</button></div>`;
    });
    return h;
  }

  if (draft.idx >= draft.items.length) {
    if (draft.parked.length) return renderRecovery();
    return renderFinish();
  }

  const it = draft.items[draft.idx];
  const ex = it.exId ? exOf(it.exId) : null;
  const en = it.entry;
  const sug = ex ? suggest(ex) : null;
  const pct = Math.round(draft.idx / draft.items.length * 100);

  let h = `<header class="top wk-top">
    <button class="btn-ghost" onclick="App.quitWorkout()">Esci</button>
    <div class="wk-title">${esc(draft.dayName)} <span class="wk-count">${draft.idx + 1}/${draft.items.length}</span></div>
    <button class="btn-ghost btn-park" onclick="App.openPark()">Parcheggia</button>
  </header>
  <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>`;

  if (draft.parked.length) {
    h += `<div class="park-row">` + draft.parked.map((p, i) => {
      const pex = p.exId ? exOf(p.exId) : null;
      return `<button class="park-chip" onclick="App.resumePark(${i})">${parkIcon(p.parkReason)} ${esc(pex ? pex.name : (p.name || p.raw))}</button>`;
    }).join('') + `<span class="park-hint">tocca per riprendere</span></div>`;
  }

  const sore = soreMuscles();
  const shared = (ex && ex.type !== 'cardio') ? ex.muscles.filter((m) => sore.has(m)) : [];

  h += `<div class="card ex-card">`;
  h += `<div class="ex-head">
    <div><div class="ex-name">${esc(ex ? ex.name : it.name || it.raw)}</div>
    <div class="ex-scheme">${it.exId === 'cardio' ? (it.minutes || 15) + ' minuti' : `${it.sets} serie × ${it.reps === 'MAX' ? 'massime' : it.reps} rip${it.perSide ? ' per lato' : ''}`}</div></div>
    ${ex ? `<button class="info-btn" onclick="App.sheet('${ex.id}')" aria-label="Come si fa">${ICONS.info}</button>` : ''}
  </div>`;

  if (ex) h += `<div class="ex-art">${exerciseArt(ex.id)}</div>`;

  if (sug) {
    h += `<div class="sug-box"><div class="sug-value">Suggerito: <strong>${fmt(sug.value)} ${sug.unit}${sug.plusBar ? ' + barra' : ''}</strong></div><div class="sug-why">${esc(sug.text)}</div></div>`;
  } else if (ex && ex.type !== 'cardio' && !ex.timed) {
    h += `<div class="sug-box muted-box">Prima volta con questo esercizio: parti leggero e trova il peso giusto, la prossima volta saprò consigliarti.</div>`;
  }

  if (shared.length) {
    h += `<div class="warn-box">${parkIcon('fastidio', 15)} Oggi hai segnalato fastidio a un muscolo che questo esercizio coinvolge (${esc(shared.join(', '))}): vacci piano o parcheggialo.</div>`;
  }

  if (it.exId === 'cardio') {
    h += stepperHTML('Velocità media', en.speed == null ? (sug ? sug.value : 8) : en.speed, 'km/h', 0.5, 'speed');
    h += stepperHTML('Minuti', en.minutes == null ? (it.minutes || 15) : en.minutes, 'min', 5, 'minutes');
  } else if (ex && ex.timed) {
    h += stepperHTML('Tenuta migliore', en.seconds == null ? (sug ? sug.value : 30) : en.seconds, 'sec', 5, 'seconds');
  } else {
    const startW = en.weight == null ? (sug ? sug.value : 10) : en.weight;
    h += stepperHTML('Peso usato', startW, 'kg', ex ? ex.inc || 1 : 1, 'weight');
    if (ex && ex.type === 'bilanciere') {
      const pb = en.plusBar == null ? (sug ? sug.plusBar : true) : en.plusBar;
      const tot = (en.weight == null ? startW : en.weight) + (pb ? barWeight(ex) : 0);
      h += `<label class="bar-row"><input type="checkbox" ${pb ? 'checked' : ''} onchange="App.togglePlusBar(this.checked)"> il peso indica i dischi, barra esclusa <span class="bar-tot">${pb ? '→ ' + fmt(tot) + ' kg totali' : ''}</span></label>`;
    }
  }

  h += `<div class="feel-label">Com'è andata?</div><div class="feel-row">`;
  ['hard', 'ok', 'easy'].forEach((f) => {
    h += `<button class="feel-btn ${en.feeling === f ? 'sel sel-' + f : ''}" onclick="App.feel('${f}')">${faceSVG(f, 30)}<span>${FEELINGS[f].label}</span></button>`;
  });
  h += `</div>`;

  h += `<button class="btn-primary btn-big ${en.feeling ? '' : 'btn-disabled'}" onclick="App.doneItem()">Fatto, avanti</button>`;
  h += `</div>`;

  // prossimi
  const next = draft.items.slice(draft.idx + 1, draft.idx + 4);
  if (next.length) {
    h += `<div class="section-title">A seguire</div>`;
    next.forEach((n) => { h += `<div class="next-row">${esc(itemLabel(n))}</div>`; });
  }
  return h;
}

function stepperHTML(label, value, unit, inc, field) {
  return `<div class="stepper-label">${esc(label)}</div>
  <div class="stepper">
    <button class="step-btn" onclick="App.bump('${field}',-${inc})">−</button>
    <div class="step-val" onclick="App.typeVal('${field}')">${fmt(value)}<span class="step-unit">${unit}</span></div>
    <button class="step-btn" onclick="App.bump('${field}',${inc})">+</button>
  </div>`;
}

function renderRecovery() {
  let h = `<header class="top wk-top">
    <button class="btn-ghost" onclick="App.quitWorkout()">Esci</button>
    <div class="wk-title">Da recuperare</div>
    <span></span>
  </header>
  <p class="lead">Giro finito! Questi erano rimasti parcheggiati: li fai ora o li lasci per oggi?</p>`;
  draft.parked.forEach((p, i) => {
    const ex = p.exId ? exOf(p.exId) : null;
    h += `<div class="card day-card">
      <div class="day-info">
        <div class="day-name">${esc(ex ? ex.name : (p.name || p.raw))}</div>
        <div class="day-sub park-reason">${parkIcon(p.parkReason)} ${esc(PARK_REASONS[p.parkReason] || 'Parcheggiato')}</div>
      </div>
      <div class="recover-btns">
        <button class="btn-primary" onclick="App.recoverDo(${i})">Fallo ora</button>
        <button class="btn-ghost" onclick="App.recoverSkip(${i})">Lascia stare</button>
      </div>
    </div>`;
  });
  return h;
}

function renderFinish() {
  const of = draft.overallFeeling;
  const nDone = draft.items.filter((it) => it.entry && !it.entry.skipped && Object.keys(it.entry).length).length;
  let h = `<header class="top"><div class="page-title">Fine sessione</div></header>
  <div class="card">
    <div class="finish-big">Ottimo lavoro!</div>
    <p class="lead">${esc(draft.dayName)} completato: ${nDone} esercizi registrati.</p>
    <div class="feel-label">Come ti senti a fine sessione?</div>
    <div class="feel-row">`;
  ['hard', 'ok', 'easy'].forEach((f) => {
    const lbl = f === 'hard' ? 'Distrutto' : f === 'ok' ? 'Stanco giusto' : 'In forma';
    h += `<button class="feel-btn ${of === f ? 'sel sel-' + f : ''}" onclick="App.overall('${f}')">${faceSVG(f, 30)}<span>${lbl}</span></button>`;
  });
  h += `</div>
    <button class="btn-primary btn-big" onclick="App.finish()">Salva allenamento</button>
    <p class="hint">Domani ti chiederò come senti i muscoli: quel feedback affina i pesi suggeriti.</p>
  </div>`;
  return h;
}

// --- schede ---
function renderPlans() {
  const plan = activePlan();
  let h = `<header class="top"><div class="page-title">Schede</div></header>
  <div class="card">
    <div class="card-kicker">Nuova scheda</div>
    <p class="lead">Incolla il messaggio WhatsApp del tuo PT, così com'è.</p>
    <textarea id="paste" rows="7" placeholder="Giorno 1&#10;Cardio 15'&#10;Panca piana 4×8&#10;..."></textarea>
    <button class="btn-primary btn-big" onclick="App.preview()">Leggi la scheda</button>
    <div id="preview"></div>
  </div>`;

  h += `<div class="section-title">Scheda attiva</div>`;
  h += `<div class="card"><div class="plan-name">${esc(plan.name)}</div><div class="plan-date">caricata il ${dateLabel(plan.createdAt)}</div>`;
  plan.days.forEach((d) => {
    h += `<div class="plan-day"><div class="plan-day-name">${esc(d.name)}${d.subtitle ? ' · ' + esc(d.subtitle) : ''}</div>`;
    d.items.forEach((it) => {
      const ex = it.exId ? exOf(it.exId) : null;
      h += `<div class="plan-item ${ex ? '' : 'unmatched'}" ${ex ? `onclick="App.sheet('${ex.id}')"` : ''}>
        <span>${esc(itemLabel(it))}</span>${ex ? `<span class="mini-info">${ICONS.info}</span>` : '<span class="badge-new">non riconosciuto</span>'}</div>`;
    });
    h += `</div>`;
  });
  h += `</div>`;
  return h;
}

function renderPreview(days) {
  if (!days.length) return `<p class="hint">Non ho trovato esercizi nel testo incollato.</p>`;
  let h = `<div class="preview-box">`;
  days.forEach((d) => {
    h += `<div class="plan-day-name">${esc(d.name)}</div>`;
    d.items.forEach((it) => {
      const ok = !!it.exId;
      h += `<div class="plan-item ${ok ? '' : 'unmatched'}"><span>${esc(itemLabel(it))}</span>${ok ? '<span class="badge-ok">✓</span>' : '<span class="badge-new">nuovo</span>'}</div>`;
    });
  });
  h += `</div><button class="btn-primary btn-big" onclick="App.savePlan()">Salva come scheda attiva</button>
  <p class="hint">Gli esercizi "nuovi" vengono salvati lo stesso: potrai registrare i pesi anche per loro.</p>`;
  return h;
}

// --- progressi ---
function renderProgress() {
  let h = `<header class="top"><div class="page-title">Progressi</div></header>`;

  if (progressSel) {
    const ex = exOf(progressSel);
    const hist = historyFor(ex.id).slice().reverse();
    h += `<button class="btn-ghost back" onclick="App.prog(null)">← Tutti gli esercizi</button>`;
    h += `<div class="card"><div class="ex-name">${esc(ex.name)}</div>`;
    const series = hist.map((x) => ex.type === 'cardio' ? x.speed : ex.timed ? x.seconds : x.weight).filter((v) => v != null);
    if (series.length >= 2) h += sparkline(series);
    h += `<div class="hist-list">`;
    hist.slice().reverse().forEach((x) => {
      const val = ex.type === 'cardio' ? (x.speed != null ? fmt(x.speed) + ' km/h' : '—') : ex.timed ? (x.seconds != null ? x.seconds + '"' : '—') : (x.weight != null ? fmt(x.weight) + ' kg' + (x.plusBar ? ' + barra' : '') : '—');
      h += `<div class="hist-row"><span class="hist-date">${dateLabel(x.date)}</span><span class="hist-val">${val}</span>${x.feeling ? faceSVG(x.feeling, 20) : '<span></span>'}</div>`;
    });
    h += `</div><button class="btn-secondary" onclick="App.sheet('${ex.id}')">Come si fa</button></div>`;
    return h;
  }

  const withHist = EXDB.filter((ex) => historyFor(ex.id).length > 0);
  if (withHist.length) {
    h += `<div class="section-title">I tuoi esercizi</div>`;
    withHist.forEach((ex) => {
      const hist = historyFor(ex.id);
      const last = hist[0];
      const val = ex.type === 'cardio' ? (last.speed != null ? fmt(last.speed) + ' km/h' : '—') : ex.timed ? (last.seconds != null ? last.seconds + '"' : '—') : (last.weight != null ? fmt(last.weight) + ' kg' + (last.plusBar ? ' +barra' : '') : '—');
      let trend = '';
      if (hist.length >= 2) {
        const a = ex.type === 'cardio' ? last.speed : ex.timed ? last.seconds : last.weight;
        const b = ex.type === 'cardio' ? hist[1].speed : ex.timed ? hist[1].seconds : hist[1].weight;
        if (a != null && b != null) trend = a > b ? '<span class="trend up">▲</span>' : a < b ? '<span class="trend down">▼</span>' : '';
      }
      h += `<div class="card row-card" onclick="App.prog('${ex.id}')">
        <div><div class="row-name">${esc(ex.name)}</div><div class="row-sub">${hist.length} sessioni</div></div>
        <div class="row-val">${val} ${trend}</div></div>`;
    });
  } else {
    h += `<p class="lead">Ancora nessun dato: completa il primo allenamento.</p>`;
  }

  const chks = state.checkins.slice().sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 5);
  if (chks.length) {
    h += `<div class="section-title">Check-in muscolari</div>`;
    const LVL = ['Nessuna stanchezza', 'Leggera', 'Discreta', 'Forte'];
    chks.forEach((c) => {
      h += `<div class="card row-card"><div><div class="row-name">${LVL[c.level]}</div><div class="row-sub">${dateLabel(c.date)}</div></div></div>`;
    });
  }

  h += `<div class="section-title">I tuoi dati</div>
  <div class="card">
    <p class="hint" style="margin-top:0">Tutto è salvato solo su questo telefono. Fai un backup ogni tanto.</p>
    <div class="data-row">
      <button class="btn-secondary" onclick="App.exportData()">Esporta backup</button>
      <button class="btn-secondary" onclick="document.getElementById('import-file').click()">Importa</button>
      <input type="file" id="import-file" accept=".json" style="display:none" onchange="App.importData(this)">
    </div>
  </div>`;
  return h;
}

function sparkline(series) {
  const w = 280, hh = 70, pad = 8;
  const min = Math.min(...series), max = Math.max(...series);
  const span = (max - min) || 1;
  const pts = series.map((v, i) => [
    pad + i * (w - 2 * pad) / (series.length - 1),
    hh - pad - (v - min) / span * (hh - 2 * pad)
  ]);
  const line = pts.map((p) => p.map((n) => Math.round(n * 10) / 10).join(',')).join(' ');
  const dots = pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#FC5200"/>`).join('');
  return `<svg viewBox="0 0 ${w} ${hh}" class="spark"><polyline points="${line}" fill="none" stroke="#FC5200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}

// --- scheda esercizio (bottom sheet) ---
function renderSheet(exId) {
  const ex = exOf(exId);
  if (!ex) return '';
  const hist = historyFor(ex.id).slice(0, 4);
  const MUSNAME = { petto: 'petto', spalle: 'spalle', tricipiti: 'tricipiti', bicipiti: 'bicipiti', avambracci: 'avambracci', addome: 'addome', dorsali: 'dorsali', trapezio: 'trapezio', lombari: 'zona lombare', glutei: 'glutei', quadricipiti: 'quadricipiti', femorali: 'femorali', polpacci: 'polpacci' };
  let h = `<div class="sheet-backdrop" onclick="App.closeSheet(event)">
  <div class="sheet" onclick="event.stopPropagation()">
    <div class="sheet-grip"></div>
    <div class="sheet-head"><div class="ex-name">${esc(ex.name)}</div>
    <button class="btn-ghost" onclick="App.closeSheet()">Chiudi</button></div>
    <div class="ex-art">${exerciseArt(ex.id)}</div>
    <div class="sheet-sec">Esecuzione</div>
    <p class="sheet-txt">${esc(ex.desc)}</p>
    <div class="err-box"><strong>Attenzione:</strong> ${esc(ex.error)}</div>
    <div class="sheet-sec">Muscoli coinvolti</div>
    <div class="mus-wrap">${muscleMapSVG(ex.muscles)}</div>
    <p class="sheet-txt mus-names">${ex.muscles.map((m, i) => i === 0 ? `<strong>${MUSNAME[m] || m}</strong>` : (MUSNAME[m] || m)).join(', ')}</p>`;
  if (ex.type === 'bilanciere') {
    h += `<div class="sheet-sec">Barra</div>
    <p class="sheet-txt">Peso barra: <strong>${fmt(barWeight(ex))} kg</strong> <button class="btn-link" onclick="App.editBar('${ex.id}')">modifica</button><br><span class="hint-inline">Quando annoti "20 kg + barra", il totale sollevato è dischi + barra.</span></p>`;
  }
  if (hist.length) {
    h += `<div class="sheet-sec">Le ultime volte</div><div class="hist-list">`;
    hist.forEach((x) => {
      const val = ex.type === 'cardio' ? (x.speed != null ? fmt(x.speed) + ' km/h' : '—') : ex.timed ? (x.seconds != null ? x.seconds + '"' : '—') : (x.weight != null ? fmt(x.weight) + ' kg' + (x.plusBar ? ' + barra' : '') : '—');
      h += `<div class="hist-row"><span class="hist-date">${dateLabel(x.date)}</span><span class="hist-val">${val}</span>${x.feeling ? faceSVG(x.feeling, 20) : '<span></span>'}</div>`;
    });
    h += `</div>`;
  }
  h += `<a class="btn-secondary btn-video" href="${ex.video}" target="_blank" rel="noopener">Guarda un video ▸</a>
  </div></div>`;
  return h;
}

// ---------- azioni ----------
const App = {
  tab(t) { currentTab = t; sessionSel = null; render(); },

  session(id) { sessionSel = id; currentTab = 'home'; render(); },

  startDay(dayId) {
    if (draft && draft.dayId !== dayId) {
      if (!confirm('C’è già un allenamento in corso. Vuoi abbandonarlo e iniziarne uno nuovo?')) { currentTab = 'workout'; render(); return; }
      draft = null;
    }
    if (!draft) {
      const plan = activePlan();
      const day = plan.days.find((d) => d.id === dayId);
      draft = {
        planId: plan.id, dayId: day.id, dayName: day.name,
        startedAt: todayISO(), idx: 0,
        items: JSON.parse(JSON.stringify(day.items)).map((it) => Object.assign(it, { entry: {} })),
        parked: [],
        overallFeeling: null
      };
      saveDraft();
    }
    currentTab = 'workout';
    render();
  },

  quitWorkout() {
    if (confirm('Vuoi uscire? L’allenamento resta in pausa e puoi riprenderlo dalla home.')) { currentTab = 'home'; render(); }
  },

  discardDraft() {
    if (confirm('Vuoi scartare questo allenamento? I dati inseriti finora andranno persi e non finirà nello storico.')) {
      draft = null; saveDraft(); render();
    }
  },

  bump(field, delta) {
    const it = draft.items[draft.idx];
    const en = it.entry;
    const ex = it.exId ? exOf(it.exId) : null;
    if (en[field] == null) {
      const sug = ex ? suggest(ex) : null;
      if (field === 'weight') en.weight = sug ? sug.value : 10;
      else if (field === 'speed') en.speed = sug ? sug.value : 8;
      else if (field === 'minutes') en.minutes = it.minutes || 15;
      else if (field === 'seconds') en.seconds = sug ? sug.value : 30;
      if (field === 'weight' && ex && ex.type === 'bilanciere' && en.plusBar == null) en.plusBar = sug ? !!sug.plusBar : true;
    }
    en[field] = Math.max(0, Math.round((en[field] + delta) * 100) / 100);
    saveDraft(); render();
  },

  typeVal(field) {
    const en = draft.items[draft.idx].entry;
    const cur = en[field];
    const v = prompt('Inserisci il valore:', cur == null ? '' : String(cur).replace('.', ','));
    if (v == null) return;
    const n = parseFloat(v.replace(',', '.'));
    if (!isNaN(n) && n >= 0) { en[field] = n; saveDraft(); render(); }
  },

  togglePlusBar(v) {
    const it = draft.items[draft.idx];
    const en = it.entry;
    en.plusBar = v;
    if (en.weight == null) {
      const ex = it.exId ? exOf(it.exId) : null;
      const sug = ex ? suggest(ex) : null;
      en.weight = sug ? sug.value : 10;
    }
    saveDraft(); render();
  },

  feel(f) {
    const en = draft.items[draft.idx].entry;
    en.feeling = en.feeling === f ? null : f;
    saveDraft(); render();
  },

  doneItem() {
    const it = draft.items[draft.idx];
    const en = it.entry;
    if (!en.feeling) return;
    const ex = it.exId ? exOf(it.exId) : null;
    if (it.exId === 'cardio') {
      if (en.minutes == null) en.minutes = it.minutes || 15;
      if (en.speed == null) { const s = ex ? suggest(ex) : null; en.speed = s ? s.value : 8; }
    } else if (ex && ex.timed) {
      if (en.seconds == null) { const s = suggest(ex); en.seconds = s ? s.value : 30; }
    } else if (en.weight == null) {
      const s = ex ? suggest(ex) : null;
      en.weight = s ? s.value : 10;
      if (ex && ex.type === 'bilanciere' && en.plusBar == null) en.plusBar = s ? !!s.plusBar : true;
    }
    draft.idx += 1;
    saveDraft(); render();
  },

  openPark() {
    const it = draft.items[draft.idx];
    const ex = it.exId ? exOf(it.exId) : null;
    const name = ex ? ex.name : (it.name || it.raw);
    let h = `<div class="sheet-backdrop" onclick="App.closeSheet(event)">
      <div class="sheet park-sheet" onclick="event.stopPropagation()">
        <div class="sheet-grip"></div>
        <p class="park-q">Perché salti <strong>${esc(name)}</strong>?</p>`;
    Object.keys(PARK_REASONS).forEach((r) => {
      h += `<button class="park-opt" onclick="App.park('${r}')">${parkIcon(r, 18)} <span>${PARK_REASONS[r]}</span><span class="park-opt-sub">te lo ripropongo dopo</span></button>`;
    });
    h += `<button class="park-opt park-opt-skip" onclick="App.park('skip')">${parkIcon('skip', 18)} <span>Salto e basta</span><span class="park-opt-sub">per oggi non lo faccio</span></button>
      <button class="btn-ghost park-cancel" onclick="App.closeSheet()">Annulla</button>
    </div></div>`;
    $('#sheet-host').innerHTML = h;
    document.body.classList.add('no-scroll');
  },

  park(reason) {
    App.closeSheet();
    const it = draft.items[draft.idx];
    if (reason === 'skip') {
      it.entry = { skipped: true };
      draft.idx += 1;
    } else {
      it.parkReason = reason;
      draft.parked.push(draft.items.splice(draft.idx, 1)[0]);
    }
    saveDraft(); render();
  },

  resumePark(i) {
    const it = draft.parked.splice(i, 1)[0];
    draft.items.splice(draft.idx, 0, it);
    saveDraft(); render();
  },

  recoverDo(i) {
    const it = draft.parked.splice(i, 1)[0];
    draft.items.push(it);
    draft.idx = draft.items.length - 1;
    saveDraft(); render();
  },

  recoverSkip(i) {
    const it = draft.parked.splice(i, 1)[0];
    it.entry = { skipped: true, reason: it.parkReason };
    draft.items.push(it);
    draft.idx = draft.items.length;
    saveDraft(); render();
  },

  overall(f) { draft.overallFeeling = draft.overallFeeling === f ? null : f; saveDraft(); render(); },

  finish() {
    const entries = draft.items.map((it) => Object.assign({ exId: it.exId, raw: it.raw }, (it.entry && Object.keys(it.entry).length) ? it.entry : { skipped: true }));
    draft.parked.forEach((p) => entries.push({ exId: p.exId, raw: p.raw, skipped: true, reason: p.parkReason }));
    const sess = {
      id: uid(), date: todayISO(),
      planId: draft.planId, dayId: draft.dayId, dayName: draft.dayName,
      entries,
      overallFeeling: draft.overallFeeling
    };
    state.sessions.push(sess);
    save();
    draft = null; saveDraft();
    currentTab = 'home';
    render();
  },

  checkin(sessionId, level) {
    state.checkins.push({ id: uid(), date: todayISO(), sessionId, level });
    save(); render();
  },

  preview() {
    const txt = $('#paste').value;
    App._previewDays = parseScheda(txt);
    $('#preview').innerHTML = renderPreview(App._previewDays);
  },

  savePlan() {
    if (!App._previewDays || !App._previewDays.length) return;
    const d = new Date();
    state.plans.push({
      id: uid(),
      name: 'Scheda del ' + d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
      createdAt: todayISO(),
      days: App._previewDays
    });
    save();
    App._previewDays = null;
    render();
  },

  prog(exId) { progressSel = exId; render(); },

  sheet(exId) {
    const host = $('#sheet-host');
    host.innerHTML = renderSheet(exId);
    document.body.classList.add('no-scroll');
  },
  closeSheet(ev) {
    if (ev && ev.target !== ev.currentTarget) return;
    $('#sheet-host').innerHTML = '';
    document.body.classList.remove('no-scroll');
  },

  editBar(exId) {
    const ex = exOf(exId);
    const v = prompt('Peso della barra per "' + ex.name + '" (kg):', String(barWeight(ex)));
    if (v == null) return;
    const n = parseFloat(v.replace(',', '.'));
    if (!isNaN(n) && n >= 0) {
      state.settings = state.settings || {};
      state.settings['bar-' + exId] = n;
      save();
      App.sheet(exId);
    }
  },

  exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gymbro-backup-' + todayISO() + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  },

  importData(input) {
    const f = input.files && input.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!data.plans || !data.sessions) throw new Error('formato non valido');
        state = data; save(); render();
        alert('Backup importato.');
      } catch (e) { alert('File non valido: ' + e.message); }
    };
    r.readAsText(f);
  }
};

// ---------- avvio ----------
load();
render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
