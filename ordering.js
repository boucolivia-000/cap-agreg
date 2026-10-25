/* Cap Agrég' V5.3 — ordering independent blocks in each fiche category. */
(()=>{
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const rowId=()=>`r${Date.now().toString(36)}${Math.random().toString(36).slice(2,9)}`;
const kinds=['page','board','diagram'];
const token=(kind,id)=>`${kind}:${id}`;
function ensure(f,cat){
 f.categoryOrder??={};
 const rows=f.sections?.[cat]||[];
 for(const r of rows)if(!r._capId)r._capId=rowId();
 const existing=[];
 for(const r of rows)existing.push(token('row',r._capId));
 const studio=f.studio||{};
 for(const kind of kinds){
  const key=kind==='page'?'pages':kind==='board'?'boards':'diagrams';
  for(const item of studio[key]||[]){
   if(item.category!==cat)continue;
   if(kind==='page'&&!(item.html||'').trim()&&!(item.stickers||[]).length)continue;
   if(kind==='board'&&!(item.items||[]).length&&!(item.strokes||[]).length)continue;
   if(kind==='diagram'&&!(item.nodes||[]).length)continue;
   existing.push(token(kind,item.id));
  }
 }
 if(f.categoryNotebooks?.[cat]&&!((studio.pages||[]).some(p=>p.category===cat&&(p.html||'').trim()===(f.categoryNotebooks[cat]||'').trim())))existing.push('quick:notes');
 const prior=f.categoryOrder[cat]||[];
 const updated=prior.filter(k=>existing.includes(k));
 for(const key of existing)if(!updated.includes(key))updated.push(key);
 f.categoryOrder[cat]=updated;
 return updated;
}
function syncEditor(){
 if(typeof draft==='undefined'||!draft)return;
 document.querySelectorAll('[data-cat][data-index][data-side]').forEach(t=>{
  const r=draft.sections?.[t.dataset.cat]?.[+t.dataset.index];
  if(r)r[t.dataset.side]=t.value;
 });
 document.querySelectorAll('[data-category-notebook]').forEach(t=>{
  draft.categoryNotebooks??={};draft.categoryNotebooks[t.dataset.categoryNotebook]=t.innerHTML;
 });
}
function previewMap(f,cat){
 const wrap=document.createElement('div');
 wrap.innerHTML=window.capUnified?.content(f,cat,true)||'';
 const map=new Map();
 wrap.querySelectorAll('.cap-u-item').forEach(el=>{
  const edit=el.querySelector('[data-u-edit]');
  if(edit)map.set(token(edit.dataset.uEdit,edit.dataset.uId),el);
 });
 // The legacy quick notebook has no edit button; only show if it is not already mirrored in Studio.
 const quick=[...wrap.querySelectorAll('.cap-u-item')].find(el=>!el.querySelector('[data-u-edit]'));
 if(quick)map.set('quick:notes',quick);
 return map;
}
function controls(cat,key){return `<div class="cap-order-controls"><span class="cap-order-grip" draggable="true" role="button" tabindex="0" aria-label="Déplacer cet élément" title="Faire glisser pour déplacer">⠿</span></div>`}
function orderedNode(cat,key,child,editable=true){
 const block=document.createElement('div');
 block.className='cap-order-block';
 block.dataset.capOrderCategory=cat;block.dataset.capOrderKey=key;
 block.draggable=false;
 block.innerHTML=editable?controls(cat,key):'';
 if(editable)block.querySelector('.cap-order-grip').draggable=true;
 block.append(child);
 return block;
}
function editorReorder(root,f){
 const sections=[...root.querySelectorAll('.sections > .category-section')];
 for(const section of sections){
  const cat=section.querySelector('h3')?.textContent?.replace(/^\s*●\s*/,'').trim();
  if(!cat||!f.sections?.[cat])continue;
  const keys=ensure(f,cat), map=previewMap(f,cat);
  section.querySelectorAll('.bubble-row').forEach((el,i)=>{
   const id=f.sections[cat]?.[i]?._capId;
   if(id)map.set(token('row',id),el);
  });
  const zone=document.createElement('div');zone.className='cap-order-zone';
  zone.setAttribute('aria-label',`Éléments réorganisables : ${cat}`);
  for(const key of keys){const node=map.get(key);if(node)zone.append(orderedNode(cat,key,node))}
  const add=section.querySelector('[data-addrow]');
  if(add)section.insertBefore(zone,add);else section.append(zone);
  // No duplicated studio content elsewhere in the editor.
  const inline=section.querySelector('.cap-inline-notebook');
  if(inline&&!(f.categoryNotebooks?.[cat]||'').trim())inline.hidden=true;
  const actions=document.createElement('div');actions.className='cap-category-actions';
  actions.innerHTML=`<button type="button" data-u-open-category="${esc(cat)}">✎ Cahier Studio</button><button type="button" data-u-new-diagram="${esc(cat)}">◇ Nouveau schéma</button>`;
  if(add)add.insertAdjacentElement('afterend',actions);else section.append(actions);
 }
}
function sheetReorder(root,f){
 const sections=[...root.querySelectorAll('.category-output')];
 const cats=window.capUnified?.categories?.()||[];
 for(const cat of cats){
  const keys=ensure(f,cat),map=previewMap(f,cat);
  let section=sections.find(el=>el.querySelector('h3')?.textContent?.trim()===cat);
  if(!section&&keys.length){
   section=document.createElement('section');
   section.className='category-section category-output';
   const style=typeof categoryStyles!=='undefined'?categoryStyles.find(c=>c.name===cat):null;
   if(style&&typeof categoryCss==='function')section.style.cssText=categoryCss(style)+';margin-bottom:24px';
   section.innerHTML=`<h3>${esc(cat)}</h3>`;
   const article=root.querySelector('article.sheet');
   const firstOther=article?.querySelector('.cap-fiche-embed,.resource-list');
   if(firstOther)article.insertBefore(section,firstOther);else article?.append(section);
  }
  if(!section)continue;
  const rows=[...section.querySelectorAll('.category-pair, .category-summary')];
  (f.sections?.[cat]||[]).forEach((r,i)=>{if(rows[i])map.set(token('row',r._capId),rows[i])});
  const zone=document.createElement('div');zone.className='cap-order-zone';
  for(const key of keys){const node=map.get(key);if(node){node.querySelectorAll('[data-u-edit],[data-u-assign]').forEach(el=>el.remove());const actions=node.querySelector('.cap-u-actions');if(actions)actions.remove();const head=node.querySelector('.cap-u-item-head');if(head){if(mode==='summary'&&key.startsWith('diagram:'))head.remove();else if(!head.textContent.trim())head.remove()}zone.append(orderedNode(cat,key,node,false))}}
  section.querySelectorAll('.cap-generated-notebook').forEach(el=>el.remove());
  section.append(zone);
 }
 const old=root.querySelector('article.sheet > h3');
 if(old&&/Cahier numérique/.test(old.textContent)){
  // Older global notebook content is preserved by the legacy renderer, not silently removed.
 }
}
const oldEditor=typeof editor==='function'?editor:null;
const oldSheet=typeof sheet==='function'?sheet:null;
if(oldEditor)editor=function(){
 const html=oldEditor();const f=typeof draft!=='undefined'?draft:null;
 if(!f||!window.capUnified)return html;
 const root=document.createElement('div');root.innerHTML=html;
 editorReorder(root,f);return root.innerHTML;
};
if(oldSheet)sheet=function(){
 const html=oldSheet();const f=typeof by==='function'?by('fiches',selected.fiche):null;
 if(!f||!window.capUnified)return html;
 const root=document.createElement('div');root.innerHTML=html;
 if(mode==='summary')root.classList.add('cap-summary-complete');
 sheetReorder(root,f);if(mode==='summary')root.querySelectorAll('.cap-u-item-head > span:first-child').forEach(el=>{if(el.textContent.trim().startsWith('◇'))el.remove()});return root.innerHTML;
};
function move(cat,key,direction){
 const f=(typeof page!=='undefined'&&page==='editor')?draft:by('fiches',selected.fiche);
 if(!f)return;
 if(page==='editor')syncEditor();
 const order=ensure(f,cat);const i=order.indexOf(key),j=i+direction;
 if(i<0||j<0||j>=order.length)return;
 [order[i],order[j]]=[order[j],order[i]];
 if(page!=='editor'&&typeof save==='function')save();
 if(typeof render==='function')render();
}
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-cap-move]');
 if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 const block=btn.closest('[data-cap-order-key]');
 if(block)move(block.dataset.capOrderCategory,block.dataset.capOrderKey,Number(btn.dataset.capMove));
},true);
let dragging=null;
document.addEventListener('dragstart',e=>{
 const block=e.target.closest('[data-cap-order-key]');
 if(!block||page!=='editor'||!e.target.closest('.cap-order-grip'))return;
 dragging={cat:block.dataset.capOrderCategory,key:block.dataset.capOrderKey};
 e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragging.key);
 block.classList.add('cap-order-dragging');
});
document.addEventListener('dragover',e=>{
 const block=e.target.closest('[data-cap-order-key]');
 if(block&&dragging&&block.dataset.capOrderCategory===dragging.cat){e.preventDefault();e.dataTransfer.dropEffect='move'}
});
document.addEventListener('drop',e=>{
 const block=e.target.closest('[data-cap-order-key]');
 if(!block||page!=='editor'||!dragging||block.dataset.capOrderCategory!==dragging.cat)return;
 e.preventDefault();e.stopPropagation();
 const f=page==='editor'?draft:by('fiches',selected.fiche);
 if(!f)return;
 if(page==='editor')syncEditor();
 const order=ensure(f,dragging.cat),from=order.indexOf(dragging.key),to=order.indexOf(block.dataset.capOrderKey);
 if(from>=0&&to>=0&&from!==to){order.splice(to,0,order.splice(from,1)[0]);if(page!=='editor')save();render()}
 dragging=null;
});
document.addEventListener('dragend',()=>{dragging=null;document.querySelectorAll('.cap-order-dragging').forEach(x=>x.classList.remove('cap-order-dragging'))});
})();
