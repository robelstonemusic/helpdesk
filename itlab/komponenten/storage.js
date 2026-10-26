(function(root){'use strict';
class ProjectStore{
 constructor(){this.db=null;this.memory=null;this.persistent=false;this.queue=Promise.resolve();}
 async open(){try{this.db=await new Promise((resolve,reject)=>{const r=indexedDB.open('ct-pc-werkstatt',1);r.onupgradeneeded=()=>r.result.createObjectStore('projects');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Speicher ist in einem anderen Fenster blockiert.'));});this.persistent=true;return await new Promise((resolve,reject)=>{const t=this.db.transaction('projects','readonly'),r=t.objectStore('projects').get('current');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}catch{this.persistent=false;return null;}}
 save(data){const copy=JSON.parse(JSON.stringify(data));this.memory=copy;this.queue=this.queue.catch(()=>{}).then(()=>new Promise((resolve,reject)=>{if(!this.db){reject(Error('Browser-Speicher nicht verfügbar. Bitte Sicherung herunterladen.'));return;}const t=this.db.transaction('projects','readwrite');t.objectStore('projects').put(copy,'current');t.oncomplete=()=>{this.persistent=true;resolve();};t.onerror=()=>{this.persistent=false;reject(t.error);};t.onabort=()=>{this.persistent=false;reject(t.error||Error('Speichern abgebrochen.'));};}));return this.queue;}
}
root.PCProjectStore=ProjectStore;
})(typeof window!=='undefined'?window:globalThis);
