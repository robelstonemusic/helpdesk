'use strict';
(() => {
 const KEY='word-begleitung-v1', OLD_KEY='word-labor-v1';
 const $=s=>document.querySelector(s);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fresh=()=>({app:'word-begleitung',version:1,platform:'win',topics:{}});
 function validate(raw){
  if(!raw||raw.app!=='word-begleitung'||raw.version!==1||!raw.topics||typeof raw.topics!=='object'||Array.isArray(raw.topics))throw Error('Das ist keine passende Word-Labor-Sicherung.');
  const out=fresh();out.platform=raw.platform==='mac'?'mac':'win';
  WORD_TOPICS.forEach(t=>{const v=raw.topics[t.id];out.topics[t.id]=[0,1,2].map(i=>v?.[i]===true);});
  return out;
 }
 let state=fresh(),canSave=true,timer;
 try {
  const raw=localStorage.getItem(KEY);
  if(raw)state=validate(JSON.parse(raw));
  else {
   const old=JSON.parse(localStorage.getItem(OLD_KEY)||'null');
   if(old?.app==='word-labor'&&old.version===1){
    state.platform=old.platform==='mac'?'mac':'win';
    WORD_TOPICS.forEach(t=>{const c=old.lessons?.[t.id]?.checks;state.topics[t.id]=[c?.[0]===true,c?.[1]===true,c?.[2]===true&&c?.[3]===true];});
   }
  }
 }catch(_){canSave=false;}
 function checks(t){return state.topics[t.id]||(state.topics[t.id]=[false,false,false]);}
 function done(t){return checks(t).every(Boolean);}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(state));canSave=true;}catch(_){canSave=false;}status();}
 function status(){
  $('#save-state').textContent=canSave?'Häkchen automatisch gespeichert · in diesem Browser.':'Speichern nicht möglich. Bitte Fortschritt sichern.';
  $('#save-state').classList.toggle('warning',!canSave);
 }
 function progress(){
  const count=WORD_TOPICS.filter(done).length;$('#progress').value=count;$('#progress-label').textContent=count+' / 6 Themen abgeschlossen';
  $('#nav').innerHTML=WORD_TOPICS.map((t,i)=>`<a href="#${t.id}" ${current()?.id===t.id?'aria-current="page"':''}><span>${done(t)?'✓':String(i+1).padStart(2,'0')}</span>${esc(t.title)}</a>`).join('');status();
  const homeCount=$('#home-count');if(homeCount)homeCount.textContent=count+' von 6 Themen abgeschlossen';
 }
 function current(){return WORD_TOPICS.find(t=>t.id===location.hash.slice(1));}
 function card(t,i){const c=checks(t),complete=done(t);return `<article class="topic-card ${complete?'complete':''}" data-card="${t.id}"><a class="card-link" href="#${t.id}"><div class="card-top"><span class="num">THEMA ${String(i+1).padStart(2,'0')}</span><span class="card-state">${complete?'✓ Abgeschlossen':c.some(Boolean)?'In Arbeit':'Noch offen'}</span></div><span class="topic-icon" aria-hidden="true">${t.icon}</span><h2>${esc(t.title)}</h2><p>${esc(t.subtitle)}</p><span class="open-topic">Auftrag &amp; Hilfe öffnen →</span></a><label class="card-check"><input type="checkbox" data-complete="${t.id}" ${complete?'checked':''}><span>Thema abgeschlossen</span></label></article>`;}
 function home(){return `<section class="hero"><p class="eyebrow">SECHS THEMEN · IHR EIGENES TEMPO</p><h1>In Word üben.<br><em>Schritt für Schritt anwenden.</em></h1><p class="lead">Ihre Dateien liegen bereits auf Ihrem Computer. Bearbeiten Sie zuerst die Vorübung in der jeweiligen Übungsdatei. Danach wenden Sie das Gelernte im Bewerbungsdossier von <b>Nik Keller</b> an.</p></section><div class="flow" aria-label="Arbeitsablauf"><div><span>1</span><b>Vorübung</b><small>In der Übungsdatei ausprobieren</small></div><div><span>2</span><b>Hauptübung</b><small>Im Dossier von Nik Keller anwenden</small></div><div><span>3</span><b>Prüfen &amp; speichern</b><small>Ergebnis kontrollieren und abhaken</small></div></div><div class="notice"><b>Eine Beispielbewerbung, sechs Arbeitsschritte.</b><p>Verwenden Sie die vorgegebenen Angaben von Nik Keller. Öffnen Sie bei jedem Thema Ihre bereits bearbeitete Dossier-Datei und führen Sie sie weiter. Sie erstellen hier keine eigene Bewerbung.</p></div><div class="section-title"><h2>Wählen Sie Ihr Thema</h2><span id="home-count">${WORD_TOPICS.filter(done).length} von 6 Themen abgeschlossen</span></div><div class="topic-grid">${WORD_TOPICS.map(card).join('')}</div><p class="small muted">Setzen Sie «Thema abgeschlossen», wenn Vorübung und Hauptübung erledigt, geprüft und gespeichert sind. Die Kachel wird grün. Sie können das Häkchen jederzeit wieder entfernen.</p><section class="panel essentials"><h2>Bevor Sie beginnen</h2><details><summary>Welche Datei bearbeite ich wann?</summary><p><b>Vorübung:</b> Öffnen Sie die Übungsdatei zum jeweiligen Thema. Bearbeiten Sie darin den Abschnitt «Vorübung».</p><p><b>Hauptübung:</b> Öffnen Sie die bereitgestellte Bewerbung von Nik Keller (Bewerbung_Inf-PE_Keller). Verwenden Sie vom zweiten Thema an immer Ihre bereits bearbeitete Datei. Erstellen Sie nicht bei jedem Thema eine neue Bewerbung.</p><p>Die Anweisungen für die Hauptübung stehen in Ihrer Übungsdatei. Auf dieser Webseite finden Sie sie zusätzlich unter «Genaue Vorgaben».</p></details><details><summary>Wo speichere ich?</summary><p>Nutzen Sie den von der Lehrperson vorgesehenen Arbeitsordner, zum Beispiel OneDrive → Word. Behalten Sie die Übungsdateien und Ihre Arbeitskopie von Nik Kellers Dossier dort. Die Webseite öffnet oder speichert Ihre Word-Dateien nicht.</p></details><details><summary>Wie helfen mir die Erklärungen hier?</summary><p>Öffnen Sie ein Thema und wählen Sie unter «Ich brauche Hilfe» die passende Frage. Sie erhalten eine Anleitung in kleinen Schritten. Wenn es danach noch nicht klappt, zeigen Sie der Lehrperson die genaue Stelle in Word.</p></details></section><div class="play-banner"><div><b>Begriffe noch einmal spielerisch üben?</b><p>Im Playground finden Sie Word-Vokabular und die Fliegenjagd.</p></div><a class="button secondary" href="playground/">Zum Playground →</a></div>`;}
 function specification(t){
  const c=WORD_ASSIGNMENTS.find(x=>x.id===t.id);
  let lines=c.steps.find(x=>x[0]==='Auf Nik Kellers Dossier anwenden')[1].split('\n');
  lines=lines.filter(l=>!l.startsWith('Die Bilddateien finden Sie unten'));
  const sections=[];const heads=['Titelseite','Bewerbungsschreiben','Bewerbungsschreiben (ohne Kopfzeile)','Kopfzeile','Lebenslauf','Gesamtes Dokument','Rechtschreibung'];
  for(let i=0;i<lines.length;i++){
   const l=lines[i];if(heads.includes(l)){sections.push({title:l,items:[]});continue;}
   if(t.id==='bilder'&&l==='Titel'&&lines[i+1]==='Suchwort'){
    sections[sections.length-1].items.push('Piktogramme: Personalien → Person; Schulbildung → Schule; Sprachen → Sprache; Schnupperlehren → Nase; Hobbys → Basketball; Referenzen → Adressbuch.');break;
   }
   if(!sections.length)sections.push({title:'Im Dossier',items:[]});if(l.trim())sections[sections.length-1].items.push(l);
  }
  return `<details class="specifications"><summary>Genaue Vorgaben für Nik Kellers Dossier</summary><p class="small muted">Die Werte stammen aus Ihrem Arbeitsauftrag. Die Nachher-Bilder und das Bildmaterial verwenden Sie aus Ihren bereitgestellten Dateien.</p>${sections.map(s=>`<h4>${esc(s.title)}</h4><ul>${s.items.map(l=>'<li>'+esc(l)+'</li>').join('')}</ul>`).join('')}</details>`;
 }
 function lesson(t){const i=WORD_TOPICS.indexOf(t),c=checks(t),complete=done(t);return `<div class="lesson-head"><a href="#" class="back">← Zur Themenübersicht</a><p class="eyebrow">THEMA ${String(i+1).padStart(2,'0')} VON 06</p><h1>${esc(t.title)}</h1><p class="lead">${esc(t.learn)}</p><div class="lesson-status ${complete?'finished':''}" id="lesson-status">${complete?'✓ Thema abgeschlossen':c.some(Boolean)?'In Arbeit':'Noch offen'}</div></div><div class="notice"><b>Hier geht es um Nik Kellers Bewerbung.</b><p>Ihre Word-Dateien liegen auf Ihrem Computer. Sie bearbeiten die Vorübung in der Übungsdatei und die Hauptübung in Ihrer bestehenden Arbeitskopie von Nik Kellers Dossier.</p></div><div class="work-layout"><div><section class="panel phase"><p class="eyebrow">SCHRITT 1 · AUSPROBIEREN</p><h2>Vorübung in der Übungsdatei</h2><span class="file-chip">Datei zum Thema: ${esc(t.exercise)}</span><p>${esc(t.practice)}</p><details><summary>Ich weiss nicht, wo ich anfangen soll.</summary><ol><li>Öffnen Sie die Word-Übungsdatei zu diesem Thema.</li><li>Suchen Sie die Überschrift <b>Vorübung</b>.</li><li>Lesen Sie den ersten Teilauftrag und führen Sie ihn direkt im Dokument aus.</li><li>Arbeiten Sie die weiteren Teilaufträge nacheinander ab. Speichern Sie die bearbeitete Übungsdatei.</li></ol></details><label class="check"><input type="checkbox" data-step="0" ${c[0]?'checked':''}><span>Ich habe die Vorübung in der Übungsdatei bearbeitet und gespeichert.</span></label></section><section class="panel phase"><p class="eyebrow">SCHRITT 2 · ANWENDEN</p><h2>Hauptübung im Dossier</h2><span class="file-chip">Ihre Arbeitskopie: Bewerbung von Nik Keller</span><p>${esc(t.transfer)}</p><ol class="short-steps"><li>Öffnen Sie Ihre <b>${i===0?'Arbeitskopie':'bereits bearbeitete Arbeitskopie'}</b> von Nik Kellers Bewerbung.</li><li>Lesen Sie in der Übungsdatei den Abschnitt <b>Hauptübung</b>. Er beschreibt, was Sie im Dossier verändern sollen.</li><li>Bearbeiten Sie einen Dokumentbereich nach dem anderen. Nutzen Sie die Vorgaben unten und bei Bedarf den Bereich «Ich brauche Hilfe».</li></ol>${specification(t)}<label class="check"><input type="checkbox" data-step="1" ${c[1]?'checked':''}><span>Ich habe die Hauptübung in Nik Kellers Dossier ausgeführt.</span></label></section><section class="panel phase"><p class="eyebrow">SCHRITT 3 · KONTROLLIEREN</p><h2>Prüfen und speichern</h2><p>Vergleichen Sie Ihr Ergebnis mit der Anleitung und den Nachher-Bildern in Ihrer Übungsdatei. Prüfen Sie besonders:</p><ul class="verify">${t.verify.map(s=>'<li>'+esc(s)+'</li>').join('')}</ul><p>Speichern Sie Ihre bearbeitete Dossier-Datei. Bei einer Vorgabe, die Sie noch nicht umsetzen konnten, fragen Sie die Lehrperson.</p><label class="check"><input type="checkbox" data-step="2" ${c[2]?'checked':''}><span>Ich habe das Ergebnis kontrolliert und mein Dossier gespeichert.</span></label><p class="small muted">Die Webseite prüft Ihre Word-Datei nicht automatisch. Ihre Häkchen bestätigen Ihre eigene Kontrolle.</p><div id="finish">${finish(t)}</div></section></div><aside class="help-column"><section class="panel help-panel"><p class="eyebrow">KLEINE SCHRITTE STATT FESTSTECKEN</p><h2>Ich brauche Hilfe</h2><p class="small muted">Öffnen Sie die Frage, die gerade zu Ihrer Schwierigkeit passt.</p>${t.helpers.map(([q,steps])=>`<details><summary>${esc(q)}</summary><ol>${steps.map(s=>'<li>'+esc(s)+'</li>').join('')}</ol></details>`).join('')}<details><summary>Ich finde einen Befehl nicht.</summary><p>Sie arbeiten mit <b>${state.platform==='mac'?'Word auf dem Mac':'Word auf Windows'}</b>. ${state.platform==='mac'?'Einige Befehle liegen auch oben im Menü Format.':'Zusätzliche Einstellungen finden Sie oft über den kleinen Dialogfeldpfeil in einer Gruppe.'}</p><p>Nutzen Sie die Suchfunktion oben in Word und geben Sie den Begriff ein, zum Beispiel «Tabstopps» oder «Silbentrennung». Falls Sie Word im Browser geöffnet haben, wechseln Sie zur Desktop-App.</p></details><p class="small muted">Noch unklar? Zeigen Sie der Lehrperson den Teilauftrag und was Sie bisher in Word versucht haben.</p></section></aside></div><div class="lesson-bottom"><a href="#">← Alle Themen</a>${WORD_TOPICS[i+1]?`<a href="#${WORD_TOPICS[i+1].id}">Nächstes Thema: ${esc(WORD_TOPICS[i+1].title)} →</a>`:''}</div>`;}
 function finish(t){return done(t)?'<div class="finish"><b>✓ Thema abgeschlossen</b><p>Ihre Themenkachel ist jetzt grün. Verwenden Sie beim nächsten Thema dieselbe Dossier-Datei weiter.</p></div>':'<p class="small">Wenn alle drei Schritte abgehakt sind, wird die Themenkachel grün.</p>';}
 function render(){const t=current();$('#main').innerHTML=t?lesson(t):home();$('#platform').value=state.platform;document.title=(t?t.title:'Schritt für Schritt')+' · Word-Labor';progress();}
 function updateTopic(t){
  progress();const cardEl=document.querySelector(`[data-card="${t.id}"]`);if(cardEl){cardEl.classList.toggle('complete',done(t));cardEl.querySelector('.card-state').textContent=done(t)?'✓ Abgeschlossen':checks(t).some(Boolean)?'In Arbeit':'Noch offen';}
  const el=$('#lesson-status');if(current()?.id===t.id&&el){el.textContent=done(t)?'✓ Thema abgeschlossen':checks(t).some(Boolean)?'In Arbeit':'Noch offen';el.classList.toggle('finished',done(t));$('#finish').innerHTML=finish(t);}
 }
 function toast(s){const el=$('#toast');clearTimeout(timer);el.textContent=s;el.hidden=false;timer=setTimeout(()=>el.hidden=true,6500);}
 function exportState(){const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Word-Labor-Fortschritt.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);}
 $('#main').addEventListener('change',e=>{
  if(e.target.matches('[data-step]')){const t=current(),i=Number(e.target.dataset.step);if(!t||!Number.isInteger(i)||i<0||i>2)return;checks(t)[i]=e.target.checked;save();updateTopic(t);}
  if(e.target.matches('[data-complete]')){const t=WORD_TOPICS.find(x=>x.id===e.target.dataset.complete);if(!t)return;state.topics[t.id]=[0,1,2].map(()=>e.target.checked);save();updateTopic(t);}
 });
 $('#platform').addEventListener('change',()=>{state.platform=$('#platform').value==='mac'?'mac':'win';save();render();});
 $('#export').addEventListener('click',exportState);
 $('#import').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>100000)throw Error('Die Sicherungsdatei ist zu gross.');const p=validate(JSON.parse(await file.text()));if(!confirm('Die Häkchen in diesem Browser durch diese Sicherung ersetzen?'))return;state=p;save();render();toast('Fortschritt geladen. Ihre Word-Dateien werden dadurch nicht verändert.');}catch(err){toast('Sicherung konnte nicht geladen werden: '+err.message);}finally{e.target.value='';}
 });
 window.addEventListener('hashchange',()=>{render();window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});});
 render();
})();
