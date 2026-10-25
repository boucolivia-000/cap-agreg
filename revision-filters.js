/* Cap Agrég’ V5.5 — revision discipline filters and alphabetical sorting */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active='Toutes',sort='az';
const base=typeof revision==='function'?revision:null;
if(!base)return;
function disciplineOf(f){
 const q=db.questions.find(x=>x.id===f.question);
 const theme=db.themes.find(x=>x.id===q?.theme);
 const prog=db.programs.find(x=>x.id===theme?.program);
 return prog?.discipline||'Non classées';
}
revision=function(){
 const all=db.fiches||[];
 const names=[...new Set(all.map(disciplineOf))].sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'}));
 const labels=['Toutes',...names];
 if(!labels.includes(active))active='Toutes';
 const filtered=all.filter(f=>active==='Toutes'||disciplineOf(f)===active).sort((a,b)=>{const n=(a.title||'').localeCompare(b.title||'','fr',{sensitivity:'base',numeric:true});return sort==='az'?n:-n});
 // Reuse the original renderer, with a temporary read-only filtered list.
 const previous=db.fiches;let content;
 try{db.fiches=filtered;content=base()}finally{db.fiches=previous}
 const filter=`<div class="cap-revision-filter"><div class="cap-revision-filter-disciplines" role="group" aria-label="Filtrer les révisions par discipline">${labels.map(name=>`<button type="button" class="cap-revision-filter-btn ${active===name?'is-active':''}" data-cap-revision-discipline="${esc(name)}" aria-pressed="${active===name}">${esc(name)}</button>`).join('')}</div><label class="cap-revision-sort-label">Classer les fiches <select data-cap-revision-sort aria-label="Classement des fiches"><option value="az" ${sort==='az'?'selected':''}>Titre A → Z</option><option value="za" ${sort==='za'?'selected':''}>Titre Z → A</option></select></label><span class="cap-revision-count">${filtered.length} fiche${filtered.length>1?'s':''}</span></div>`;
 const first=content.indexOf('<div class="panel">');
 return first>=0?content.slice(0,first)+filter+content.slice(first):content+filter;
};
document.addEventListener('click',e=>{const btn=e.target.closest('[data-cap-revision-discipline]');if(!btn)return;e.preventDefault();active=btn.dataset.capRevisionDiscipline;if(typeof render==='function')render()});
document.addEventListener('change',e=>{if(!e.target.matches('[data-cap-revision-sort]'))return;sort=e.target.value;if(typeof render==='function')render()});
})();
