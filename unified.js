/* Cap Agreg V5.2 - one-source notebook and diagram previews */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const safe=(s,f)=>/^#[0-9a-f]{6}$/i.test(s||'')?s:f;
function categories(){return (typeof categoryStyles!=='undefined'?categoryStyles:[]).map(c=>c.name)}
function content(f,cat,full=false){
 if(!f)return '';
 const st=f.studio||{}, pages=st.pages||[],boards=st.boards||[],diagrams=st.diagrams||[];
 const matches=x=>cat==='__unassigned'?(!x.category||!categories().includes(x.category)):x.category===cat;
 const pgs=pages.filter(matches), bds=boards.filter(matches), dgs=diagrams.filter(matches);
 let html='';
 for(const p of pgs){const body=(p.html||'').trim(),stickers=p.stickers||[];if(!body&&!stickers.length)continue;
  html+=`<div class="cap-u-item"><div class="cap-u-item-head"><span>📄 ${esc(p.name||'Page')}</span>${actions('page',p,full)}</div>${body?`<div class="cap-u-page">${body}</div>`:''}${stickers.length?`<div class="cap-u-stickers">${stickers.map(n=>`<div style="background:${safe(n.color,'#fff1a8')}">${esc(n.text)}</div>`).join('')}</div>`:''}</div>`;
 }
 for(const b of bds){if(!(b.items||[]).length&&!(b.strokes||[]).length)continue;
  const items=b.items||[],strokes=b.strokes||[];
  const maxX=Math.max(800,...items.map(i=>(+i.x||0)+(+i.w||210)+30)),maxY=Math.max(380,...items.map(i=>(+i.y||0)+(+i.h||155)+30));
  const lineNodes=items.filter(i=>i.type==='node');
  html+=`<div class="cap-u-item"><div class="cap-u-item-head"><span>◇ ${esc(b.name||'Tableau infini')}</span>${actions('board',b,full)}</div><div class="cap-u-scroll"><div class="cap-u-board" style="width:${maxX}px;height:${maxY}px"><svg viewBox="0 0 ${maxX} ${maxY}" width="${maxX}" height="${maxY}"><g fill="none" stroke="#538b7e" stroke-width="2">${lineNodes.slice(1).map((n,i)=>`<line x1="${(+lineNodes[i].x||0)+65}" y1="${(+lineNodes[i].y||0)+50}" x2="${(+n.x||0)+65}" y2="${(+n.y||0)+50}"/>`).join('')}</g><g fill="none" stroke="#be185d" stroke-width="3" stroke-linecap="round">${strokes.map(d=>`<path d="${esc(d)}"/>`).join('')}</g></svg>${items.map(i=>`<div class="cap-u-note" style="left:${+i.x||0}px;top:${+i.y||0}px;width:${+i.w||210}px;min-height:${+i.h||155}px;background:${safe(i.color,'#fff1a8')}">${esc(i.text)}</div>`).join('')}</div></div></div>`;
 }
 for(const d of dgs){if(!(d.nodes||[]).length&&!(d.edges||[]).length)continue;html+=`<div class="cap-u-item"><div class="cap-u-item-head">${d.showTitle!==false?`<span>◇ ${esc(d.title||'Schéma interactif')}</span>`:''}${actions('diagram',d,full)}</div>${diagram(d)}</div>`}
 // Legacy quick writing only when no Studio page in this category, to avoid duplicate copies.
 if(cat!=='__unassigned'&&f.categoryNotebooks?.[cat]&&!pgs.some(p=>(p.html||'').trim()===(f.categoryNotebooks?.[cat]||'').trim()))html+=`<div class="cap-u-item"><div class="cap-u-page">${f.categoryNotebooks[cat]}</div></div>`;
 if(cat==='__unassigned'&&st.resource?.trim())html+=`<div class="cap-u-item"><div class="cap-u-item-head">📚 Notes de consultation</div><div class="cap-u-page">${esc(st.resource)}</div></div>`;
 if(cat==='__unassigned'&&(st.refs||[]).length)html+=`<div class="cap-u-item"><div class="cap-u-item-head">📚 Références du Studio</div>${st.refs.map(r=>`<p>${esc(r.name||'Référence')} ${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a>`:''}</p>`).join('')}</div>`;
 return html;
}
function actions(kind,item,full){return `<span class="cap-u-actions"><button type="button" data-u-edit="${kind}" data-u-id="${esc(item.id)}" title="Modifier">✎ Modifier</button><select aria-label="Catégorie" data-u-assign="${kind}" data-u-id="${esc(item.id)}"><option value="">Non classé</option>${categories().map(c=>`<option value="${esc(c)}" ${item.category===c?'selected':''}>${esc(c)}</option>`).join('')}</select></span>`}
function diagram(d){
 const nodes=d.nodes||[],edges=d.edges||[];
 const find=id=>nodes.find(n=>n.id===id);
 const anchor=(n,side)=>{let x=+n.x||0,y=+n.y||0,w=+n.w||175,h=+n.h||95;return side==='top'?[x+w/2,y]:side==='right'?[x+w,y+h/2]:side==='bottom'?[x+w/2,y+h]:[x,y+h/2]};
 const positions=[];
 nodes.forEach(n=>{const x=+n.x||0,y=+n.y||0,w=+n.w||175,h=+n.h||95;positions.push([x,y],[x+w,y+h])});
 const lines=edges.map(e=>{const a=find(e.from),b=find(e.to);if(!a||!b)return '';
  const [x1,y1]=anchor(a,e.fromSide||'right'),[x2,y2]=anchor(b,e.toSide||'left');
  const cx=Number.isFinite(e.cx)?e.cx:(x1+x2)/2,cy=Number.isFinite(e.cy)?e.cy:(y1+y2)/2;
  const form=e.form||'straight';
  if(form==='orthogonal')positions.push([cx,y1],[cx,y2]);
  if(form==='curve')positions.push([cx*2-(x1+x2)/2,cy*2-(y1+y2)/2]);
  const path=form==='orthogonal'?`M${x1} ${y1} H${cx} V${y2} H${x2}`:form==='curve'?`M${x1} ${y1} Q${cx*2-(x1+x2)/2} ${cy*2-(y1+y2)/2} ${x2} ${y2}`:`M${x1} ${y1} L${x2} ${y2}`;
  const color=safe(e.stroke,'#628a97'),dash=e.pattern==='dotted'?'2 7':e.pattern==='dashed'?'11 7':'';
  const arrow=e.style==='arrow'?`<circle cx="${x2}" cy="${y2}" r="4" fill="${color}"/>`:e.style==='dot'?`<circle cx="${x2}" cy="${y2}" r="5" fill="${color}"/>`:'';
  return `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="${dash}"/>${arrow}`;
 }).join('');
 const padding=22;
 const minX=Math.min(Infinity,...positions.map(p=>p[0]))-padding;
 const minY=Math.min(Infinity,...positions.map(p=>p[1]))-padding;
 const maxX=Math.max(...positions.map(p=>p[0]),0)+padding;
 const maxY=Math.max(...positions.map(p=>p[1]),0)+padding;
 const width=Math.max(90,Math.ceil(maxX-minX)),height=Math.max(70,Math.ceil(maxY-minY));
 return `<div class="cap-u-scroll cap-u-fit-scroll"><div class="cap-u-diagram cap-u-fit-diagram" style="width:${width}px;height:${height}px;max-width:none"><svg viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">${lines}</svg>${nodes.map(n=>`<button type="button" class="cap-u-node" data-u-reveal="${esc(n.id)}" style="left:${(+n.x||0)-minX}px;top:${(+n.y||0)-minY}px;width:${+n.w||175}px;height:${+n.h||95}px;border-color:${safe(n.borderColor,'#7196a1')};background:${safe(n.color,'#e8f2f4')};color:${safe(n.fontColor,'#294b70')};border-radius:${n.shape==='circle'?'50%':n.shape==='diamond'?'5px':'10px'}" title="Cliquer pour révéler la définition">${n.image?`<img class="cap-u-node-image" src="${esc(n.image)}" alt="" draggable="false">`:''}${esc(n.text)}${n.answer?`<span class="cap-u-answer" hidden>${esc(n.answer)}</span>`:''}</button>`).join('')}</div></div>`;
}
window.capUnified={content,categories};
function data(){return (typeof draft!=='undefined'&&draft)||((typeof db!=='undefined'&&typeof selected!=='undefined')?db.fiches.find(f=>f.id===selected.fiche):null)}
function get(kind,id){const f=data();if(!f)return null;const st=f.studio||{};return (kind==='diagram'?st.diagrams:kind==='board'?st.boards:st.pages)?.find(x=>x.id===id)}
document.addEventListener('click',e=>{
 const reveal=e.target.closest('[data-u-reveal]');if(reveal){const ans=reveal.querySelector('.cap-u-answer');if(ans)ans.hidden=!ans.hidden;return}
 const edit=e.target.closest('[data-u-edit]');if(edit){e.preventDefault();const kind=edit.dataset.uEdit,id=edit.dataset.uId,item=get(kind,id);if(!item)return;
 if(kind==='diagram'){window.capCategoryFocus=item.category||null;if(typeof capSaveWorkspace==='function'&&!capSaveWorkspace())return;window.capDiagramOpen?.(id)}else{window.capCategoryFocus=item.category||null;window.capStudioTarget={kind,id};if(typeof capSwitchWorkspace==='function')capSwitchWorkspace('notebook')}
 return}
 const open=e.target.closest('[data-u-open-category]');if(open){e.preventDefault();window.capCategoryFocus=open.dataset.uOpenCategory;window.capStudioTarget=null;if(typeof capSwitchWorkspace==='function')capSwitchWorkspace('notebook');return}
 const create=e.target.closest('[data-u-new-diagram]');if(create){e.preventDefault();window.capCategoryFocus=create.dataset.uNewDiagram;if(typeof capSaveWorkspace==='function'&&!capSaveWorkspace())return;window.capDiagramOpen?.(null,true);return}
});
document.addEventListener('change',e=>{const sel=e.target.closest('[data-u-assign]');if(!sel)return;const item=get(sel.dataset.uAssign,sel.dataset.uId);if(!item)return;item.category=sel.value||null;const f=data();if(f&&typeof db!=='undefined'){const i=db.fiches.findIndex(x=>x.id===f.id);if(i>=0)db.fiches[i]=structuredClone(f);if(typeof save==='function')save();if(typeof render==='function')render()}});
})();
