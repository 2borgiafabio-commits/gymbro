// GYMBRO — database esercizi + dati iniziali
// type: bilanciere | manubri | macchina | cavi | zavorra | corpo | cardio
// inc: incremento minimo sensato in kg (per i suggerimenti)
// muscles: primari poi secondari (chiavi della mappa muscolare in art.js)

const EXDB = [
  {
    id: 'panca-piana', name: 'Panca piana', aliases: ['panca piana', 'bench press', 'panca con bilanciere'],
    type: 'bilanciere', inc: 2.5, bar: 20,
    muscles: ['petto', 'tricipiti', 'spalle'],
    desc: 'Sdraiati sulla panca con i piedi ben appoggiati a terra e le scapole addotte ("strette" dietro). Impugna il bilanciere poco più largo delle spalle, scendi controllando fino a sfiorare il petto e spingi verso l\'alto senza bloccare i gomiti.',
    error: 'Far rimbalzare il bilanciere sul petto o staccare i glutei dalla panca.',
    video: 'https://www.youtube.com/results?search_query=panca+piana+bilanciere+tecnica+esecuzione'
  },
  {
    id: 'panca-inclinata-manubri', name: 'Panca inclinata manubri', aliases: ['panca inclinata manubri', 'panca inclinata', 'incline dumbbell press'],
    type: 'manubri', inc: 1,
    muscles: ['petto', 'spalle', 'tricipiti'],
    desc: 'Panca inclinata a circa 30–45°. Parti con i manubri all\'altezza delle spalle, gomiti sotto i polsi, e spingi verso l\'alto avvicinando leggermente i manubri al vertice. Scendi lentamente fino ad avvertire l\'allungamento del petto.',
    error: 'Inclinare troppo la panca (oltre 45°): il lavoro passa alle spalle.',
    video: 'https://www.youtube.com/results?search_query=panca+inclinata+manubri+tecnica'
  },
  {
    id: 'croci-cavi', name: 'Croci ai cavi', aliases: ['croci ai cavi', 'croci cavi', 'cable fly', 'cable crossover'],
    type: 'cavi', inc: 2.5,
    muscles: ['petto'],
    desc: 'In piedi al centro della cable machine, un piede leggermente avanti. Con i gomiti appena flessi e fissi, porta le mani davanti al petto con un movimento ad arco ("abbraccio"), poi torna indietro controllando l\'apertura.',
    error: 'Piegare e stendere i gomiti trasformando le croci in una distensione.',
    video: 'https://www.youtube.com/results?search_query=croci+ai+cavi+tecnica+esecuzione'
  },
  {
    id: 'shoulder-press', name: 'Shoulder press', aliases: ['shoulder press', 'lento avanti macchina', 'military press macchina'],
    type: 'macchina', inc: 5,
    muscles: ['spalle', 'tricipiti'],
    desc: 'Seduto con la schiena bene appoggiata allo schienale, impugna le maniglie all\'altezza delle spalle. Spingi verso l\'alto fino quasi a distendere le braccia, poi scendi lentamente fino alle orecchie.',
    error: 'Inarcare la zona lombare staccandola dallo schienale per spingere di più.',
    video: 'https://www.youtube.com/results?search_query=shoulder+press+machine+tecnica'
  },
  {
    id: 'alzate-laterali', name: 'Alzate laterali', aliases: ['alzate laterali', 'lateral raise'],
    type: 'manubri', inc: 1,
    muscles: ['spalle'],
    desc: 'In piedi, manubri lungo i fianchi e gomiti appena flessi. Alza le braccia lateralmente fino all\'altezza delle spalle, come per versare due caraffe, e scendi piano. Il movimento parte dalla spalla, non dallo slancio.',
    error: 'Usare lo slancio del busto o alzare le spalle verso le orecchie.',
    video: 'https://www.youtube.com/results?search_query=alzate+laterali+manubri+tecnica'
  },
  {
    id: 'pushdown', name: 'Pushdown', aliases: ['pushdown', 'push down', 'spinte in basso ai cavi', 'triceps pushdown'],
    type: 'cavi', inc: 2.5,
    muscles: ['tricipiti'],
    desc: 'In piedi davanti al cavo alto, gomiti bloccati ai fianchi. Spingi l\'impugnatura verso il basso fino a distendere completamente le braccia, poi risali controllando fino a circa 90°. Solo l\'avambraccio si muove.',
    error: 'Allontanare i gomiti dai fianchi usando le spalle per spingere.',
    video: 'https://www.youtube.com/results?search_query=pushdown+tricipiti+cavo+tecnica'
  },
  {
    id: 'tricipiti-nuca', name: 'Tricipiti dietro la nuca', aliases: ['tricipiti dietro la nuca', 'french press in piedi', 'estensioni dietro la nuca', 'overhead extension'],
    type: 'manubri', inc: 1,
    muscles: ['tricipiti'],
    desc: 'Seduto o in piedi, tieni il manubrio con due mani sopra la testa. Piega i gomiti portando il peso dietro la nuca, mantenendo i gomiti stretti e puntati in alto, poi distendi le braccia.',
    error: 'Aprire i gomiti verso l\'esterno o inarcare la schiena.',
    video: 'https://www.youtube.com/results?search_query=estensioni+tricipiti+dietro+la+nuca+manubrio'
  },
  {
    id: 'stacco-rumeno', name: 'Stacco rumeno', aliases: ['stacco rumeno', 'romanian deadlift', 'rdl', 'stacchi rumeni'],
    type: 'bilanciere', inc: 2.5, bar: 20,
    muscles: ['femorali', 'glutei', 'lombari'],
    desc: 'In piedi con il bilanciere davanti alle cosce, gambe quasi tese. Spingi i fianchi indietro scendendo con il busto e facendo scorrere il bilanciere lungo le gambe fino a metà tibia, schiena sempre neutra. Risali contraendo glutei e femorali.',
    error: 'Curvare la schiena o piegare troppo le ginocchia trasformandolo in uno squat.',
    video: 'https://www.youtube.com/results?search_query=stacco+rumeno+tecnica+esecuzione'
  },
  {
    id: 'lat-machine', name: 'Lat machine', aliases: ['lat machine', 'lat pulldown', 'trazioni al lat'],
    type: 'macchina', inc: 5,
    muscles: ['dorsali', 'bicipiti', 'trapezio'],
    desc: 'Seduto con le cosce bloccate sotto i cuscinetti, impugna la sbarra più larga delle spalle. Tira verso l\'alto del petto portando i gomiti in basso e indietro, petto in fuori, poi risali controllando.',
    error: 'Tirare dietro la nuca o dondolare il busto per aiutarsi.',
    video: 'https://www.youtube.com/results?search_query=lat+machine+avanti+tecnica'
  },
  {
    id: 'rematore-bilanciere', name: 'Rematore con bilanciere', aliases: ['rematore con bilanciere', 'rematore bilanciere', 'barbell row', 'rematore'],
    type: 'bilanciere', inc: 2.5, bar: 20,
    muscles: ['dorsali', 'trapezio', 'bicipiti', 'lombari'],
    desc: 'Busto inclinato in avanti (circa 45°), schiena neutra, ginocchia morbide. Tira il bilanciere verso l\'addome tenendo i gomiti vicini al corpo, stringi le scapole in alto, poi scendi controllando.',
    error: 'Sollevare il busto a ogni ripetizione usando lo slancio.',
    video: 'https://www.youtube.com/results?search_query=rematore+bilanciere+tecnica+esecuzione'
  },
  {
    id: 'pulley-basso', name: 'Pulley basso', aliases: ['pulley basso', 'pulley', 'seated cable row', 'rematore al cavo basso'],
    type: 'cavi', inc: 5,
    muscles: ['dorsali', 'trapezio', 'bicipiti'],
    desc: 'Seduto con i piedi sulla pedana e le ginocchia leggermente flesse, busto verticale. Tira l\'impugnatura verso l\'ombelico stringendo le scapole, poi accompagna il ritorno in avanti senza curvare la schiena.',
    error: 'Oscillare avanti e indietro con il busto per tirare più peso.',
    video: 'https://www.youtube.com/results?search_query=pulley+basso+tecnica+esecuzione'
  },
  {
    id: 'face-pull', name: 'Face pull', aliases: ['face pull', 'facepull', 'tirate al viso'],
    type: 'cavi', inc: 2.5,
    muscles: ['spalle', 'trapezio'],
    desc: 'Cavo all\'altezza del viso con la corda. Tira le estremità della corda verso il viso separandole, gomiti alti e larghi, fino a portare le mani ai lati delle orecchie. Ottimo per la salute delle spalle.',
    error: 'Usare troppo peso e tirare verso il petto invece che verso il viso.',
    video: 'https://www.youtube.com/results?search_query=face+pull+tecnica+esecuzione'
  },
  {
    id: 'curl-bilanciere', name: 'Curl con bilanciere', aliases: ['curl con bilanciere', 'curl bilanciere', 'barbell curl'],
    type: 'bilanciere', inc: 2.5, bar: 10,
    muscles: ['bicipiti', 'avambracci'],
    desc: 'In piedi, impugnatura supina larga quanto le spalle, gomiti fermi ai fianchi. Fletti le braccia portando il bilanciere verso le spalle senza muovere i gomiti, poi scendi lentamente fino a braccia distese.',
    error: 'Dondolare il busto o muovere i gomiti in avanti per completare la ripetizione.',
    video: 'https://www.youtube.com/results?search_query=curl+bilanciere+bicipiti+tecnica'
  },
  {
    id: 'curl-martello', name: 'Curl a martello', aliases: ['curl a martello', 'hammer curl', 'curl martello'],
    type: 'manubri', inc: 1,
    muscles: ['bicipiti', 'avambracci'],
    desc: 'In piedi con i manubri impugnati a presa neutra (palmi verso il corpo, come tenere un martello). Fletti un braccio alla volta o entrambi verso le spalle mantenendo la presa neutra, poi scendi controllando.',
    error: 'Ruotare il polso durante la salita: la presa resta neutra per tutto il movimento.',
    video: 'https://www.youtube.com/results?search_query=curl+a+martello+tecnica+esecuzione'
  },
  {
    id: 'squat', name: 'Squat', aliases: ['squat', 'back squat', 'squat bilanciere'],
    type: 'bilanciere', inc: 2.5, bar: 20,
    muscles: ['quadricipiti', 'glutei', 'lombari'],
    desc: 'Bilanciere appoggiato sui trapezi, piedi larghi quanto le spalle e punte leggermente in fuori. Scendi spingendo i fianchi indietro e piegando le ginocchia, fino ad avere le cosce almeno parallele al suolo, poi risali spingendo con tutto il piede.',
    error: 'Sollevare i talloni o far crollare le ginocchia verso l\'interno.',
    video: 'https://www.youtube.com/results?search_query=squat+bilanciere+tecnica+esecuzione'
  },
  {
    id: 'leg-press', name: 'Leg press', aliases: ['leg press', 'pressa', 'pressa 45'],
    type: 'macchina', inc: 10,
    muscles: ['quadricipiti', 'glutei', 'femorali'],
    desc: 'Seduto sulla pressa con la schiena bene appoggiata, piedi al centro della pedana larghi quanto le spalle. Piega le gambe portando le ginocchia verso il petto senza staccare la zona lombare, poi spingi senza mai bloccare le ginocchia.',
    error: 'Distendere completamente le ginocchia "a scatto" a fine spinta.',
    video: 'https://www.youtube.com/results?search_query=leg+press+45+tecnica+esecuzione'
  },
  {
    id: 'affondi-manubri', name: 'Affondi con manubri', aliases: ['affondi con manubri', 'affondi manubri', 'affondi', 'lunges'],
    type: 'manubri', inc: 1, perSide: true,
    muscles: ['quadricipiti', 'glutei', 'femorali'],
    desc: 'In piedi con i manubri lungo i fianchi, fai un passo avanti e scendi piegando entrambe le ginocchia a 90°, il ginocchio dietro verso il pavimento. Spingi con la gamba avanti per tornare in piedi. Alterna o completa una gamba alla volta.',
    error: 'Passo troppo corto: il ginocchio davanti supera molto la punta del piede.',
    video: 'https://www.youtube.com/results?search_query=affondi+manubri+tecnica+esecuzione'
  },
  {
    id: 'leg-curl', name: 'Leg curl', aliases: ['leg curl', 'leg curl sdraiato', 'lying leg curl'],
    type: 'macchina', inc: 5,
    muscles: ['femorali'],
    desc: 'Sdraiato prono sulla macchina con il rullo appena sopra i talloni. Fletti le gambe portando i talloni verso i glutei senza staccare il bacino dal cuscino, poi torna giù lentamente.',
    error: 'Sollevare il bacino dal cuscino inarcando la schiena.',
    video: 'https://www.youtube.com/results?search_query=leg+curl+sdraiato+tecnica'
  },
  {
    id: 'leg-extension', name: 'Leg extension', aliases: ['leg extension', 'leg estension'],
    type: 'macchina', inc: 5,
    muscles: ['quadricipiti'],
    desc: 'Seduto con la schiena allo schienale e il rullo sulle caviglie. Distendi le gambe fino quasi alla massima estensione, tieni un attimo la contrazione del quadricipite, poi scendi controllando.',
    error: 'Lasciar "cadere" il peso in discesa invece di frenarlo.',
    video: 'https://www.youtube.com/results?search_query=leg+extension+tecnica+esecuzione'
  },
  {
    id: 'calf-raise', name: 'Calf raise', aliases: ['calf raise', 'calf', 'polpacci in piedi'],
    type: 'macchina', inc: 5,
    muscles: ['polpacci'],
    desc: 'In piedi con l\'avampiede sul rialzo e i talloni liberi. Scendi con i talloni sotto il livello del gradino sentendo l\'allungamento, poi spingi sulle punte il più in alto possibile e tieni un secondo.',
    error: 'Movimento corto e veloce "a molla" senza allungamento in basso.',
    video: 'https://www.youtube.com/results?search_query=calf+raise+in+piedi+tecnica'
  },
  {
    id: 'plank', name: 'Plank', aliases: ['plank'],
    type: 'corpo', inc: 0, timed: true,
    muscles: ['addome', 'lombari'],
    desc: 'In appoggio sugli avambracci e sulle punte dei piedi, corpo in linea retta dalla testa ai talloni. Contrai addome e glutei e respira normalmente: l\'obiettivo è mantenere la posizione senza far scendere (o alzare) i fianchi.',
    error: 'Fianchi che cedono verso il basso o sedere troppo in alto.',
    video: 'https://www.youtube.com/results?search_query=plank+tecnica+esecuzione+corretta'
  },
  {
    id: 'crunch-carico', name: 'Crunch con carico', aliases: ['crunch con carico', 'crunch zavorrato', 'crunch con disco', 'crunch'],
    type: 'zavorra', inc: 2.5,
    muscles: ['addome'],
    desc: 'Sdraiato con le ginocchia piegate e un disco tenuto al petto (o teso sopra di te). Solleva le spalle da terra "arrotolando" la parte alta della schiena, senza tirare con il collo, poi scendi lentamente.',
    error: 'Tirare la testa con le mani o sollevare tutta la schiena come in un sit-up.',
    video: 'https://www.youtube.com/results?search_query=crunch+con+disco+tecnica'
  },
  {
    id: 'cardio', name: 'Cardio', aliases: ['cardio', 'tapis roulant', 'corsa', 'camminata'],
    type: 'cardio', inc: 0,
    muscles: ['quadricipiti', 'polpacci', 'femorali'],
    desc: 'Tapis roulant, cyclette o ellittica a scelta. Mantieni un ritmo che ti permetta di parlare a fatica: se riesci a chiacchierare comodamente puoi alzare velocità o pendenza.',
    error: 'Attaccarsi ai corrimano del tapis roulant camminando in salita.',
    video: 'https://www.youtube.com/results?search_query=tapis+roulant+allenamento+corretto'
  }
];

// ---- Dati iniziali: scheda di Valerio (2/7/2026) + prima sessione ----

const SEED = {
  plans: [{
    id: 'plan-1',
    name: 'Scheda di Valerio — luglio 2026',
    createdAt: '2026-07-02',
    days: [
      {
        id: 'day-1', name: 'Giorno 1', subtitle: 'Petto, spalle e tricipiti',
        items: [
          { exId: 'cardio', raw: "Cardio 15'", minutes: 15 },
          { exId: 'panca-piana', raw: 'Panca piana 4×8', sets: 4, reps: 8 },
          { exId: 'panca-inclinata-manubri', raw: 'Panca inclinata manubri 3×10', sets: 3, reps: 10 },
          { exId: 'croci-cavi', raw: 'Croci ai cavi 3×15', sets: 3, reps: 15 },
          { exId: 'shoulder-press', raw: 'Shoulder press 3×10', sets: 3, reps: 10 },
          { exId: 'alzate-laterali', raw: 'Alzate laterali 3×15', sets: 3, reps: 15 },
          { exId: 'pushdown', raw: 'Pushdown 3×12', sets: 3, reps: 12 },
          { exId: 'tricipiti-nuca', raw: 'Tricipiti dietro la nuca 2×12', sets: 2, reps: 12 },
          { exId: 'cardio', raw: "Cardio 15'", minutes: 15 }
        ]
      },
      {
        id: 'day-2', name: 'Giorno 2', subtitle: 'Schiena e bicipiti',
        items: [
          { exId: 'cardio', raw: "Cardio 15'", minutes: 15 },
          { exId: 'stacco-rumeno', raw: 'Stacco rumeno 3×8', sets: 3, reps: 8 },
          { exId: 'lat-machine', raw: 'Lat machine 4×10', sets: 4, reps: 10 },
          { exId: 'rematore-bilanciere', raw: 'Rematore con bilanciere 3×10', sets: 3, reps: 10 },
          { exId: 'pulley-basso', raw: 'Pulley basso 3×12', sets: 3, reps: 12 },
          { exId: 'face-pull', raw: 'Face pull 3×15', sets: 3, reps: 15 },
          { exId: 'curl-bilanciere', raw: 'Curl con bilanciere 3×10', sets: 3, reps: 10 },
          { exId: 'curl-martello', raw: 'Curl a martello 2×12', sets: 2, reps: 12 },
          { exId: 'cardio', raw: "Cardio 15'", minutes: 15 }
        ]
      },
      {
        id: 'day-3', name: 'Giorno 3', subtitle: 'Gambe e core',
        items: [
          { exId: 'cardio', raw: "Cardio 15'", minutes: 15 },
          { exId: 'squat', raw: 'Squat 4×8', sets: 4, reps: 8 },
          { exId: 'leg-press', raw: 'Leg Press 3×10', sets: 3, reps: 10 },
          { exId: 'affondi-manubri', raw: 'Affondi con manubri 3×10 per gamba', sets: 3, reps: 10, perSide: true },
          { exId: 'leg-curl', raw: 'Leg curl 3×12', sets: 3, reps: 12 },
          { exId: 'leg-extension', raw: 'Leg extension 2×15', sets: 2, reps: 15 },
          { exId: 'calf-raise', raw: 'Calf raise 4×15', sets: 4, reps: 15 },
          { exId: 'plank', raw: 'Plank 3×MAX', sets: 3, reps: 'MAX' },
          { exId: 'crunch-carico', raw: 'Crunch con carico 3×15', sets: 3, reps: 15 },
          { exId: 'cardio', raw: "Cardio 15'", minutes: 15 }
        ]
      }
    ]
  }],
  sessions: [{
    id: 'sess-1',
    date: '2026-07-02',
    planId: 'plan-1', dayId: 'day-1', dayName: 'Giorno 1',
    entries: [
      { exId: 'cardio', minutes: 15, speed: 8.5, incline: 0, feeling: 'hard' },
      { exId: 'panca-piana', weight: 20, plusBar: true, barKg: 20, feeling: 'ok' },
      { exId: 'panca-inclinata-manubri', weight: 8, feeling: 'easy' },
      { exId: 'croci-cavi', weight: 20, feeling: 'hard', note: 'peso non sicuro ("credo")' },
      { exId: 'shoulder-press', weight: 35, feeling: 'ok' },
      { exId: 'alzate-laterali', weight: 3, feeling: 'hard' },
      { exId: 'pushdown', weight: 15, feeling: 'easy' },
      { exId: 'tricipiti-nuca', weight: 4, feeling: 'ok' },
      { exId: 'cardio', minutes: 15 }
    ],
    overallFeeling: null
  }],
  checkins: [{
    id: 'chk-1',
    date: '2026-07-03',
    sessionId: 'sess-1',
    level: 1,
    note: 'leggera stanchezza'
  }],
  settings: {}
};
