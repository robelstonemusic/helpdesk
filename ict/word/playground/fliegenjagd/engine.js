(function(root){'use strict';
const spots=[
 {id:'title',label:'Titelleiste',point:[470,31],rect:[300,9,350,44],kind:'bar'},
 {id:'quick',label:'Schnellzugriff',point:[104,31],rect:[22,9,175,44],kind:'bar'},
 {id:'status',label:'Statusleiste',point:[290,493],rect:[12,476,876,34],kind:'bar'},
 {id:'start',label:'Register Start',point:[133,85],rect:[89,64,88,40],kind:'tab'},
 {id:'insert',label:'Register Einfügen',point:[244,85],rect:[187,64,114,40],kind:'tab',tab:'Einfügen'},
 {id:'clipboard',label:'Start → Gruppe Zwischenablage',point:[105,160],rect:[22,114,176,109],kind:'group',tab:'Start'},
 {id:'font',label:'Start → Gruppe Schriftart',point:[336,158],rect:[211,114,255,109],kind:'group',tab:'Start'},
 {id:'paragraph',label:'Start → Gruppe Absatz',point:[655,160],rect:[480,114,394,109],kind:'group',tab:'Start'},
 {id:'pictures',label:'Einfügen → Gruppe Illustrationen',point:[397,160],rect:[211,114,369,109],kind:'group',tab:'Einfügen'},
 {id:'dialog',label:'Start → Dialogfeldpfeil bei Schriftart',point:[450,207],rect:[435,192,29,29],kind:'dialog',tab:'Start'}
];
function shuffle(a,random=Math.random){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function visible(s,tab){return !s.tab||s.kind==='tab'||s.tab===tab;}
function options(target,tab,random=Math.random){return shuffle([target,...shuffle(spots.filter(s=>s.id!==target.id&&visible(s,tab)&&!(target.kind==='group'||target.kind==='dialog'?s.id==='start'||s.id==='insert':false)&&!(target.id==='dialog'&&s.id==='font')),random).slice(0,3)],random).map(s=>s.id);}
function setup(s,random=Math.random){s.target=spots.find(x=>x.id===s.order[s.index]);s.tab=s.target.tab||'Start';s.options=options(s.target,s.tab,random);s.phase='flying';s.result=null;s.expires=null;return s;}
function create(mode='arcade',random=Math.random){const first=shuffle(spots.map(s=>s.id),random),second=shuffle(spots.map(s=>s.id),random);if(first.at(-1)===second[0])[second[0],second[1]]=[second[1],second[0]];return setup({mode:mode==='practice'?'practice':'arcade',order:first.concat(second),index:0,score:0,hits:0,streak:0,history:[]},random);}
function land(s,now){if(s.phase!=='flying')return false;s.phase='answer';s.expires=s.mode==='arcade'?now+5000:null;return true;}
function remaining(s,now){return s.expires===null?null:Math.max(0,s.expires-now);}
function strike(s,id,now){if(s.phase!=='answer')return null;const left=remaining(s,now);if(left!==null&&left<=0)id=null;if(id!==null&&!s.options.includes(id))return null;const hit=id===s.target.id;let points=0;if(hit){s.hits++;s.streak++;points=10+(left===null?0:Math.ceil(left/1000))+Math.min(5,s.streak-1);s.score+=points;}else s.streak=0;s.result={hit,selected:id,target:s.target.id,points,timeout:id===null};s.history.push({...s.result});s.phase='swatting';return s.result;}
function reveal(s){if(s.phase==='swatting')s.phase='feedback';}
function next(s,random=Math.random){if(s.phase!=='feedback')return false;s.index++;if(s.index>=s.order.length){s.phase='finished';return false;}setup(s,random);return true;}
function pause(s,now){if(s.phase!=='answer')return false;s.left=remaining(s,now);s.phase='paused';return true;}
function resume(s,now){if(s.phase!=='paused')return false;s.expires=s.left===null?null:now+s.left;s.phase='answer';return true;}
const api={spots,shuffle,options,visible,create,land,remaining,strike,reveal,next,pause,resume};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FlyGame=api;
})(typeof window!=='undefined'?window:globalThis);
