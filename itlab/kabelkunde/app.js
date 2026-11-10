'use strict';
const TYPES = [
 ['a','USB-A (USB 2.0)','Breites, flaches Rechteck. Im gezeigten USB-2.0-Beispiel sind vier Kontakte dargestellt.','Tastatur oder Maus → PC, oft mit festem USB-A-Kabel.','USB-Daten und Strom. USB 2.0: bis zu 480 Mbit/s im High-Speed-Modus.'],
 ['a3','USB-A (USB 3.0)','Gleiche rechteckige Form; fünf zusätzliche Kontakte für SuperSpeed. Oft blau, aber die Farbe ist kein sicherer Nachweis.','Externe SSD mit USB-C → PC mit USB-A und SuperSpeed: geeignetes USB-A–USB-C-Kabel.','USB-Daten und Strom. USB 3.0: theoretisch bis 5 Gbit/s. Für dieses Tempo müssen beide Geräte und das Kabel es unterstützen.'],
 ['b','USB-B','Fast quadratischer Querschnitt mit zwei abgeschrägten oberen Ecken. Gezeigt ist die klassische USB-2.0-Bauform.','PC mit USB-A → Drucker mit USB-B: USB-A–USB-B-Kabel.','USB-Daten und Strom; der Drucker braucht in der Regel eine eigene Stromversorgung.'],
 ['c','USB-C','Kleine, symmetrische Form mit runden Enden. In der Buchse sitzt mittig eine Kontaktzunge. Der Stecker passt in beiden Orientierungen.','USB-C-Ladegerät → Smartphone mit USB-C: USB-C–USB-C-Kabel.','Strom und je nach Ausstattung Daten und Bild. Die Form allein verrät weder Tempo noch Ladeleistung noch Bildfähigkeit.'],
 ['micro','USB Micro-B','Sehr flach und asymmetrisch; seitliche Kanten abgeschrägt. Gezeigt ist die schmale USB-2.0-Bauform.','USB-A-Ladegerät → ältere Powerbank mit Micro-B-Eingang: USB-A–Micro-B-Kabel.','Je nach Gerät und Kabel Laden und USB-Daten. Der Stecker passt nur in einer Orientierung.'],
 ['hdmi','HDMI','Flaches, breites Profil mit abgeschrägten unteren Ecken. Gezeigt ist Standard-HDMI (Typ A).','PC mit HDMI-Ausgang → Fernseher mit HDMI-Eingang: HDMI–HDMI-Kabel.','Digitales Bild und Ton gemeinsam. Auflösung und Bildrate hängen von den Geräten und dem Kabel ab.'],
 ['dvi','DVI','Breiter Anschluss mit einem Raster und einem seitlichen Flachkontakt. Oft mit Schrauben; hier DVI-D Single Link.','PC mit DVI-D-Ausgang → Monitor mit passendem DVI-D-Eingang: DVI-D–DVI-D-Kabel.','DVI-D überträgt digitales Bild. Ton ist nicht Teil des DVI-Standards. DVI-I kann zusätzlich analoge Bildsignale führen.'],
 ['vga','VGA','Trapezförmiger Anschluss mit 15 Pins oder Löchern in drei Reihen. Oft mit Schrauben.','Älterer PC mit VGA-Ausgang → Beamer mit VGA-Eingang: VGA–VGA-Kabel.','Analoges Bild, kein Ton. Die Bildqualität kann bei langen Kabeln oder hohen Auflösungen leiden.'],
 ['light','Lightning','Flacher, massiver Stecker mit offen liegenden Kontakten; in beiden Orientierungen einsteckbar. Die Buchse hat keine mittige USB-C-Zunge.','USB-C-Ladegerät → iPhone mit Lightning-Buchse: USB-C–Lightning-Kabel.','Laden und Daten, je nach Kabel und Gerät. Neuere iPhones verwenden teilweise USB-C; Buchse prüfen.'],
 ['lan','RJ45 (Ethernet)','Breites, rechteckiges Profil mit acht Kontaktpositionen und einer Rastlasche. In der Buchse ist eine Aussparung für die Lasche.','PC mit Ethernet-Buchse → LAN-Port am Router oder Switch: RJ45–RJ45-Netzwerkkabel.','Netzwerkdaten über Kupfer. RJ45 ist die gebräuchliche Bezeichnung für diesen 8P8C-Netzwerkstecker.']
];
const type = Object.fromEntries(TYPES.map(t=>[t[0],t]));
function drawing(id, socket=false, label='Schematische Darstellung'){
 const metal=socket?'#263f3c':'#bccbc5', dark='#193733', light='#dbe7e1', gold=socket?'#e8c175':'#976017', blue='#3473aa';
 const rect=(x,y,w,h,r,fill,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
 const shape=(d,fill,stroke=dark)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
 const dots=(n,x,y,dx,r=2.4)=>Array.from({length:n},(_,i)=>`<circle cx="${x+i*dx}" cy="${y}" r="${r}" fill="${socket?light:gold}"/>`).join('');
 const contacts=(n,x,y,dx,w=5,h=8)=>Array.from({length:n},(_,i)=>rect(x+i*dx,y,w,h,1,gold)).join('');
 let s='';
 if(id==='a'||id==='a3'){
   const tongue=id==='a3'?blue:light;
   s=rect(26,30,108,54,4,metal,dark)+rect(33,37,94,40,2,socket?'#112523':'#edf4ef')+rect(36,socket?39:55,88,id==='a3'?18:15,2,tongue)+contacts(4,51,socket?49:58,17,7,6);
   if(id==='a3')s+=contacts(5,49,socket?39:68,14,6,5);
 }else if(id==='b'){
   s=shape('M48 89V44L62 27H98L112 44V89Z',metal)+shape('M56 81V48L66 35H94L104 48V81Z',socket?'#112523':light)+rect(66,48,28,22,2,socket?light:dark)+contacts(2,62,40,28,5,7)+contacts(2,62,71,28,5,7);
 }else if(id==='c'){
   s=rect(32,38,96,40,20,metal,dark)+rect(39,45,82,26,13,socket?'#112523':light)+(socket?rect(46,54,68,8,4,light):rect(46,51,68,14,7,dark))+contacts(12,49,socket?55:53,5.3,2,4);
 }else if(id==='micro'||id==='hdmi'){
   const h=id==='hdmi';
   s=shape(h?'M23 36H137V64L124 81H36L23 64Z':'M35 45H125L117 72H43Z',metal)+shape(h?'M30 43H130V62L120 74H40L30 62Z':'M43 51H117L111 66H49Z',socket?'#112523':light);
   s+=rect(h?39:52,h?52:55,h?82:56,h?14:7,2,socket?light:dark)+contacts(h?10:5,h?43:55,h?54:55,h?8:11,h?3:5,h?4:6);
   if(h)s+=contacts(9,47,60,8,3,4);
 }else if(id==='dvi'||id==='vga'){
   const v=id==='vga';
   s=rect(12,34,136,49,8,'#aabfb7',dark)+dots(1,21,58,0,4)+dots(1,139,58,0,4);
   s+=v?shape('M32 36H128L120 81H40Z',socket?'#345988':'#a6c6e4'):rect(29,36,102,45,3,metal,dark);
   for(let i=0;i<3;i++){s+=v?dots(5,51+(i%2)*4,47+i*11,13):dots(3,39,47+i*11,9,2)+dots(3,76,47+i*11,9,2);}
   if(!v)s+=rect(107,56,16,4,1,socket?light:gold);
 }else if(id==='light'){
   s=socket?rect(30,44,100,28,12,metal,dark)+rect(37,49,86,18,8,'#112523')+contacts(8,49,62,8.5,4,2):rect(49,23,62,61,11,metal,dark)+contacts(8,55,37,6.5,4,22)+rect(40,79,80,15,5,light,dark);
 }else{
   s=shape('M33 28H127V78H100V93H60V78H33Z',metal)+rect(40,35,80,35,2,socket?'#112523':'#e3eee8')+contacts(8,45,39,9.5,5,18)+rect(64,73,32,13,3,socket?'#112523':'#9ab7ad');
 }
 return `<svg viewBox="0 0 160 115" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}
const LINK_CASES=[
 ['Eine Tastatur hat einen fest montierten USB-A-Stecker. Wo stecken Sie ihn ein?','USB-A-Buchse am PC',['USB-B-Buchse am Drucker','HDMI-Buchse am Monitor','Ethernet-Buchse am Router'],'USB-A ist die passende Buchse. Eine gewöhnliche Tastatur benötigt kein SuperSpeed.'],
 ['PC mit USB-A → Drucker mit quadratischer USB-B-Buchse.','USB-A ↔ USB-B',['USB-A ↔ USB-C','USB-A ↔ Micro-B','USB-A ↔ HDMI'],'USB-A passt in den PC; der fast quadratische USB-B-Stecker passt in den Drucker.'],
 ['USB-C-Ladegerät → Smartphone mit USB-C-Buchse.','USB-C ↔ USB-C',['USB-C ↔ Lightning','USB-A ↔ USB-C','USB-A ↔ Micro-B'],'Beide Enden sind USB-C. Für die Ladeleistung zählen zusätzlich die Fähigkeiten von Ladegerät, Kabel und Smartphone.'],
 ['USB-A-Ladegerät → ältere Powerbank mit Micro-B-Ladeeingang.','USB-A ↔ Micro-B',['USB-A ↔ USB-B','USB-A ↔ USB-C','USB-C ↔ Lightning'],'Der breite Stecker kommt ans Ladegerät, der flache asymmetrische Micro-B-Stecker an die Powerbank.'],
 ['PC mit HDMI-Ausgang → TV mit HDMI-Eingang. Bild und Ton sollen über ein Kabel laufen.','HDMI ↔ HDMI',['VGA ↔ VGA','DVI-D ↔ DVI-D','RJ45 ↔ RJ45'],'HDMI überträgt Bild und Ton digital.'],
 ['Älterer PC mit DVI-D-Ausgang → Monitor mit passendem DVI-D-Eingang.','DVI-D ↔ DVI-D',['VGA ↔ VGA','HDMI ↔ HDMI','USB-A ↔ USB-B'],'DVI-D passt an beide Geräte und liefert digitales Bild.'],
 ['Alter PC mit VGA-Ausgang → Beamer mit VGA-Eingang.','VGA ↔ VGA',['HDMI ↔ HDMI','DVI-D ↔ DVI-D','USB-C ↔ USB-C'],'VGA liefert analoges Bild. Für Ton braucht es eine separate Verbindung.'],
 ['USB-C-Ladegerät → iPhone mit Lightning-Buchse.','USB-C ↔ Lightning',['USB-C ↔ USB-C','USB-A ↔ Lightning','USB-C ↔ Micro-B'],'Das Ladegerät benötigt USB-C; am iPhone passt der flache Lightning-Stecker.'],
 ['PC mit Ethernet-Buchse → LAN-Buchse am Router.','RJ45 ↔ RJ45',['HDMI ↔ HDMI','USB-A ↔ USB-B','VGA ↔ VGA'],'Das Ethernet-Kabel verbindet PC und Router über die beiden RJ45-Buchsen. Die Lasche rastet ein.'],
 ['Externe SSD mit USB-C → PC mit SuperSpeed-fähigem USB-A. Welche Wahl ermöglicht USB 3.0, wenn beide Geräte es unterstützen?','USB-A ↔ USB-C, Kabel für mindestens 5 Gbit/s',['USB-A ↔ USB-C, Kabel nur für USB 2.0','USB-C ↔ USB-C ohne Adapter','USB-A ↔ USB-B für USB 3.0'],'Die Stecker müssen passen, und auch das Kabel muss die Übertragungsrate unterstützen.']
];
const COMPARE=[
 ['USB-A oder USB 3.0: Welche Aussage stimmt?','USB-A bezeichnet die Form, USB 3.0 einen Standard.',['USB-A ist immer langsamer als USB 3.0.','Jede USB-A-Buchse unterstützt USB 3.0.','USB 3.0 ist die runde Steckerform.'],'USB-A gibt es mit verschiedenen Übertragungsstandards. Vergleichen Sie USB 2.0 mit USB 3.0.'],
 ['Wie schnell sind USB 2.0 High-Speed und USB 3.0 theoretisch maximal?','480 Mbit/s und 5 Gbit/s',['Beide 480 Mbit/s.','5 Gbit/s und 480 Mbit/s','480 MB/s und 5 MB/s'],'USB 3.0 hat eine rund zehnmal höhere theoretische Signaldatenrate. Die effektive Dateikopiergeschwindigkeit ist tiefer.'],
 ['Sie sehen eine blaue USB-A-Buchse. Was wissen Sie sicher?','Die Farbe allein beweist das Tempo nicht.',['Blau bedeutet immer genau 5 Gbit/s.','Blau bedeutet immer USB 2.0.','Blau bedeutet USB-C.'],'Achten Sie auf Kennzeichnungen wie SuperSpeed oder Angaben des Herstellers.'],
 ['Was unterscheidet HDMI von DVI-D und VGA?','HDMI überträgt standardmässig Bild und Ton.',['VGA überträgt Ton, HDMI nur Bild.','Alle drei übertragen Ton.','DVI-D überträgt analoges Bild und Ton.'],'HDMI: digitales Bild und Ton. DVI-D: digitales Bild. VGA: analoges Bild. Ton ist bei DVI und VGA nicht Teil des Standards.'],
 ['Die USB-C-Stecker passen. Ist Bildausgabe damit garantiert?','Nein, Geräte und Kabel müssen die Bildfunktion unterstützen.',['Ja, USB-C bedeutet immer Bild und Ton.','Ja, solange sich ein Gerät laden lässt.','Nein, USB-C kann grundsätzlich kein Bild übertragen.'],'Die symmetrische Bauform sagt nichts über die unterstützten Funktionen aus.'],
 ['Passt Lightning in USB-C?','Nein. Beide sind wendbar, aber verschieden gebaut.',['Ja, wenn der Stecker umgedreht wird.','Ja, wenn das Ladegerät genügend Leistung hat.','Ja, beide Namen meinen dieselbe Buchse.'],'Lightning hat einen flachen Stecker mit freiliegenden Kontakten; USB-C hat eine andere Form mit Kontaktzunge in der Buchse.']
];
const shuffle=arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const questions=()=>TYPES.flatMap(([id,name,feature])=>[false,true].map(socket=>({
 title:socket?'Welche Buchse ist das?':'Welcher Stecker ist das?',
 art:drawing(id,socket,socket?'Abbildung einer Buchse':'Abbildung eines Steckers'),answer:name,
 options:[name,...(['a','a3'].includes(id)?[type[id==='a'?'a3':'a'][1],...shuffle(TYPES.filter(t=>!['a','a3'].includes(t[0]))).slice(0,2).map(t=>t[1])]:shuffle(TYPES.filter(t=>t[0]!==id)).slice(0,3).map(t=>t[1]))],why:feature
})));
const fromCases=rows=>rows.map(([title,answer,wrong,why])=>({title,answer,options:[answer,...wrong],why}));
if(typeof module!=='undefined')module.exports={TYPES,drawing,questions,LINK_CASES,COMPARE,fromCases};
if(typeof document!=='undefined')(() => {
 const $=id=>document.getElementById(id);
 const key='itlab-kabelkunde-v1', boards=[['recognition',questions,20,16],['connections',()=>fromCases(LINK_CASES),10,8],['comparison',()=>fromCases(COMPARE),6,5]];
 const state={best:{},checks:[]};
 try{const old=JSON.parse(localStorage.getItem(key)||'null');boards.forEach(([id,,max])=>{const n=old?.best?.[id];state.best[id]=Number.isInteger(n)?Math.max(0,Math.min(n,max)):0;});state.checks=[0,1,2,3].map(i=>old?.checks?.[i]===true);}catch{}
 const update=()=>{$('progress').textContent=boards.filter(([id,,,goal])=>state.best[id]>=goal).length+' / 3 Spielstationen bestanden';};
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));$('save').textContent='Fortschritt in diesem Browser gespeichert.';}catch{$('save').textContent='Dieser Browser konnte den Fortschritt nicht speichern.';}update();};
 $('hero-art').innerHTML=['c','hdmi','lan','a3'].map(id=>drawing(id)).join('');
 TYPES.forEach(([id,name])=>{const b=document.createElement('button');b.textContent=name;b.onclick=()=>show(id);b.dataset.id=id;$('catalog-buttons').append(b);});
 function show(id){
  const [,name,feature,use,signal]=type[id];
  for(const b of $('catalog-buttons').children)b.setAttribute('aria-pressed',String(b.dataset.id===id));
  $('catalog').innerHTML=`<h3>${name}</h3><div class="visuals"><figure>${drawing(id,false,name+' als Stecker')}<figcaption>${id==='light'?'Stecker · Kontaktseite':'Stecker'}</figcaption></figure><figure>${drawing(id,true,name+' als Buchse')}<figcaption>Buchse</figcaption></figure></div><dl class="facts"><dt>So erkennen Sie den Anschluss</dt><dd>${feature}</dd><dt>Das verbinden Sie damit</dt><dd>${use}</dd><dt>Das wird übertragen</dt><dd>${signal}</dd></dl>`;
 }
 show('a');
 boards.forEach(([id,make,max,goal])=>{
  const el=$(id);
  let round=[],index=0,score=0,missed=[],locked=false;
  const start=()=>{round=shuffle(make());index=score=0;missed=[];render();};
  const intro=()=>{el.innerHTML=`<p class="counter">${max} Aufgaben · bestanden ab ${goal} richtig · Bestresultat: ${state.best[id]||0}/${max}</p><button type="button" class="btn">Spiel starten</button>`;el.querySelector('button').onclick=start;};
  function render(){
   const q=round[index];locked=false;
   el.innerHTML=`<p class="counter">Aufgabe ${index+1} / ${round.length} · ${score} richtig</p><h3 tabindex="-1">${q.title}</h3>${q.art?`<div class="single">${q.art}</div>`:''}<div class="answers"></div><div class="feedback" role="status" hidden></div><button type="button" class="btn next" hidden>${index===round.length-1?'Ergebnis anzeigen':'Weiter →'}</button>`;
   const answerArea=el.querySelector('.answers'),feedback=el.querySelector('.feedback'),next=el.querySelector('.next');
   for(const option of shuffle(q.options)){
    const b=document.createElement('button');b.type='button';b.textContent=option;b.onclick=()=>{
     if(locked)return;locked=true;
     const correct=option===q.answer;if(correct)score++;else missed.push(q);
     for(const choice of answerArea.children){choice.disabled=true;if(choice.textContent===q.answer)choice.classList.add('good');}
     if(!correct)b.classList.add('bad');
     feedback.classList.add(correct?'good':'bad');feedback.hidden=false;feedback.textContent=(correct?'Richtig. ':'Richtig ist: '+q.answer+'. ')+q.why;next.hidden=false;
    };answerArea.append(b);
   }
   next.onclick=()=>{if(!locked)return;index++;if(index<round.length)render();else finish();};
   el.querySelector('h3').focus();
  }
  function finish(){
   state.best[id]=Math.max(state.best[id]||0,score);save();
   el.innerHTML=`<h3 tabindex="-1">${score>=goal?'✓ Bestanden':'Noch nicht bestanden'} · ${score}/${max} richtig</h3><p>Bestresultat: ${state.best[id]}/${max}. Ziel: mindestens ${goal} richtige Antworten.</p>${missed.length?`<details><summary>${missed.length} Fehler nachschauen</summary><ul>${missed.map(q=>`<li><b>${q.answer}</b>: ${q.why}</li>`).join('')}</ul></details>`:''}<button type="button" class="btn">Noch einmal spielen</button>`;
   el.querySelector('button').onclick=start;el.querySelector('h3').focus();
  }
  intro();
 });
 const checks=['Alle neun Anschlussarten sind enthalten; USB-A vergleicht USB 2.0 und USB 3.0.','Zu jeder Art stehen Steckermerkmal, Buchsenmerkmal und ein Gerätepaar auf dem Blatt.','Die Vergleiche zu USB-Tempo, USB-C und Bild/Ton sind fachlich richtig.','Ich habe das Ergebnis überprüft und als Word-Datei oder PDF gespeichert.'];
 checks.forEach((label,i)=>{const row=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=state.checks[i]===true;box.onchange=()=>{state.checks[i]=box.checked;save();};row.append(box,document.createTextNode(label));$('checklist').append(row);});
 $('copy').onclick=async()=>{const p=$('prompt');try{await navigator.clipboard.writeText(p.value);$('copy-status').textContent='Kopiert.';}catch{p.focus();p.select();$('copy-status').textContent='Text markiert. Kopieren Sie ihn mit Strg+C oder ⌘C.';}};
 update();
})();
