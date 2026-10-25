(()=>{'use strict';
const css=`#cap-diagram-modal{position:fixed;inset:0;background:#13283bbb;z-index:100001;display:flex;align-items:center;justify-content:center;padding:12px}#cap-diagram-modal *{box-sizing:border-box}#cap-diagram-shell{background:#fffaf5;border-radius:16px;width:min(1100px,100%);height:min(92vh,880px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 15px 60px #0004}#cap-diagram-tools{display:flex;flex-wrap:wrap;gap:7px;padding:12px;border-bottom:1px solid #e2d8ce;align-items:center}#cap-diagram-tools button,#cap-diagram-tools select{background:white;border:1px solid #bcb4aa;border-radius:7px;padding:8px;cursor:pointer;font-size:13px}#cap-diagram-tools button.selected{background:#d5e9de}#cap-diagram-stage-wrap{overflow:auto;flex:1;background:#f4f0eb}#cap-diagram-stage{position:relative;width:1100px;height:760px;background-color:white;background-image:linear-gradient(#dfe8eb 1px,transparent 1px),linear-gradient(90deg,#dfe8eb 1px,transparent 1px);background-size:25px 25px}#cap-diagram-lines{position:absolute;inset:0;pointer-events:none} .cap-shape{position:absolute;min-width:110px;min-height:65px;border:2px solid #7196a1;border-radius:10px;background:#e8f2f4;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;cursor:grab;touch-action:none;user-select:none;white-space:pre-wrap;overflow-wrap:anywhere;font:600 15px 'Roboto Serif',serif}.cap-shape.selected{outline:3px solid #e59b58;outline-offset:3px}.cap-shape.circle{border-radius:50%}.cap-shape.diamond{border-radius:4px;transform:rotate(45deg)}.cap-shape.diamond .cap-shape-label{transform:rotate(-45deg)}.cap-shape .cap-shape-label{pointer-events:none}.cap-shape .cap-shape-reveal{display:block;font:12px system-ui;color:#365b6b;margin-top:4px}.cap-diagram-help{padding:8px 12px;font:12px system-ui;color:#666;border-top:1px solid #ddd}#cap-diagram-properties{padding:12px;border-top:1px solid #ddd;display:grid;gap:6px;max-height:32vh;overflow:auto;background:#fffdfb}#cap-diagram-properties label{display:grid;gap:3px;font:13px system-ui}#cap-diagram-properties textarea,#cap-diagram-properties select,#cap-diagram-properties input{padding:7px;border:1px solid #bbb;border-radius:6px;font:14px system-ui}#cap-diagram-answer{position:absolute;z-index:5;max-width:330px;background:white;border:1px solid #a5bac4;box-shadow:0 5px 18px #0002;border-radius:10px;padding:14px;white-space:pre-wrap;font:14px 'Roboto Serif',serif}`;
const extraCss=`#cap-diagram-modal .cap-dg-control:hover{fill:#ffeedc;stroke:#c16b36;stroke-width:3.5} #cap-diagram-modal .cap-dg-anchor{position:absolute;width:17px;height:17px;padding:0;border-radius:50%;border:2px solid #286a88;background:#fff;z-index:8;cursor:crosshair;touch-action:manipulation}.cap-dg-anchor[data-dg-anchor="top"]{top:-10px;left:calc(50% - 8px)}.cap-dg-anchor[data-dg-anchor="right"]{right:-10px;top:calc(50% - 8px)}.cap-dg-anchor[data-dg-anchor="bottom"]{bottom:-10px;left:calc(50% - 8px)}.cap-dg-anchor[data-dg-anchor="left"]{left:-10px;top:calc(50% - 8px)}#cap-diagram-lines{pointer-events:auto}#cap-diagram-edges [data-dg-edge]{cursor:pointer}#cap-diagram-modal .cap-shape{overflow:visible}#cap-diagram-modal .cap-shape-label{pointer-events:auto;outline:none;cursor:text;min-width:40px}#cap-diagram-modal .cap-shape-label[contenteditable="true"]{user-select:text;cursor:text}#cap-diagram-modal .cap-dg-case-tools{position:absolute;left:calc(100% + 12px);top:0;z-index:20;background:#fffdf9;border:1px solid #d6c9bc;border-radius:12px;padding:7px;display:flex;flex-direction:column;gap:5px;box-shadow:0 4px 20px #0002;min-width:126px;font:12px system-ui;text-align:left}#cap-diagram-modal .cap-dg-case-tools label{display:flex;align-items:center;justify-content:space-between;gap:6px}#cap-diagram-modal .cap-dg-case-tools input[type=color]{width:34px;height:26px;padding:1px;border:1px solid #ddd;border-radius:5px;cursor:pointer}#cap-diagram-modal .cap-dg-case-tools button,#cap-dg-edge-tools button{border:1px solid #cbbdb0;border-radius:6px;background:#fff;padding:5px 7px;cursor:pointer}#cap-dg-edge-tools{position:absolute;z-index:25;background:#fffdfa;border:1px solid #d6c9bc;border-radius:10px;box-shadow:0 5px 20px #0002;padding:8px;display:flex;flex-wrap:wrap;align-items:center;gap:5px;width:320px;font:12px system-ui}#cap-dg-edge-tools label{display:flex;align-items:center;gap:4px}#cap-dg-edge-tools select{font:12px system-ui;max-width:108px}#cap-dg-edge-tools input[type=color]{width:31px;height:25px;padding:0}#cap-diagram-modal .cap-dg-definition{position:absolute;z-index:30;background:#fffdfb;border:1px solid #a8bac4;box-shadow:0 6px 22px #0003;border-radius:12px;padding:12px;width:280px;max-width:calc(100vw - 50px);font:13px system-ui;text-align:left}#cap-diagram-modal .cap-dg-definition textarea{width:100%;min-height:105px;resize:vertical;border:1px solid #bbb;border-radius:7px;padding:7px;font:13px system-ui}#cap-diagram-modal .cap-dg-definition button{float:right;border:0;background:transparent;cursor:pointer}#cap-diagram-modal .cap-dg-control{cursor:grab;touch-action:none}#cap-diagram-modal .cap-dg-resize{position:absolute;right:-8px;bottom:-8px;width:15px;height:15px;background:#fff;border:2px solid #d58b49;border-radius:4px;cursor:nwse-resize;touch-action:none}#cap-diagram-modal .cap-dg-case-tools button.selected,#cap-dg-edge-tools button.selected{background:#dceee3}#cap-diagram-modal .cap-shape{user-select:none}#cap-diagram-modal .cap-shape-label{white-space:pre-wrap;overflow-wrap:anywhere}`;
const polishCss=`#cap-diagram-modal .cap-dg-case-tools{border:1px solid #e8e4df;box-shadow:0 3px 12px #00000013;background:#fffefa;padding:5px;min-width:115px}#cap-dg-edge-tools{border:1px solid #e8e4df;box-shadow:0 4px 14px #00000018;width:310px;padding:6px}#cap-dg-edge-tools[hidden]{display:none!important}#cap-diagram-modal .cap-dg-move{cursor:move;touch-action:none;user-select:none;flex-basis:100%;font-size:11px;color:#73818a;padding:3px 4px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between}#cap-diagram-modal .cap-dg-definition{box-shadow:0 5px 16px #0000001a;border:1px solid #e2e5e5}#cap-diagram-tools{padding:7px 10px;gap:5px}#cap-diagram-tools button,#cap-diagram-tools select{padding:5px 7px;border-color:#e4e2df;background:transparent}#cap-diagram-shell{border-radius:11px}#cap-diagram-stage{background-image:linear-gradient(#e9eff0 1px,transparent 1px),linear-gradient(90deg,#e9eff0 1px,transparent 1px)}.cap-diagram-help{font-size:11px;line-height:1.4;color:#7d8790}`;
const style=document.createElement('style');style.textContent=css+extraCss+polishCss;document.head.append(style);
let current=null,mode='edit',chosen=null,linkFrom=null,drag=null,doc=null,connecting=false,edgeSelected=null,definitionOpen=null,edgeDrag=null,floatingDrag=null,windowPositions={};
const sides=['top','right','bottom','left'];
const uid=()=> 'dg'+Math.random().toString(36).slice(2,10);
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function store(){if(!draft)return;draft.studio??={};draft.studio.diagrams??=[];return draft.studio.diagrams}
function saveDiagram(){if(!doc)return;const all=store();if(!all)return;const ix=all.findIndex(x=>x.id===doc.id);if(ix<0)all.push(doc);else all[ix]=doc;const i=db.fiches.findIndex(f=>f.id===draft.id);if(i>=0)db.fiches[i]=structuredClone(draft);else db.fiches.push(structuredClone(draft));save()}
function close(){definitionOpen=null;edgeDrag=null;floatingDrag=null;windowPositions={};connecting=false;linkFrom=null;edgeSelected=null;saveDiagram();document.getElementById('cap-diagram-modal')?.remove();doc=null;chosen=null}
function open(){if(!draft){const f=by('fiches',selected.fiche);if(f)initDraft(f)}if(!draft)return window.capNotice('Ouvre une fiche avant de créer un schéma.');window.capStudio?.capture?.();const all=store();const modal=document.createElement('div');modal.id='cap-diagram-modal';modal.innerHTML=`<div id="cap-diagram-shell"><div id="cap-diagram-tools"><strong>◇ Schémas interactifs</strong><select id="cap-diagram-select" aria-label="Choisir un schéma"></select><button data-dg="new">＋ Schéma</button><button data-dg="rename">Renommer</button><button data-dg="add">＋ Case</button><button data-dg="connect">↗ Relier</button><button data-dg="mode">👁 Mode Révision</button><button data-dg="save">Enregistrer</button><button data-dg="close">✕ Fermer</button></div><div id="cap-diagram-stage-wrap"><div id="cap-diagram-stage"><svg id="cap-diagram-lines" width="1100" height="760" viewBox="0 0 1100 760"><defs><marker id="cap-dg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#628a97"/></marker></defs><g id="cap-diagram-edges"></g></svg><div id="cap-diagram-nodes"></div></div></div><div class="cap-diagram-help">Création : déplace les cases à la souris ou au doigt. « Relier » : clique directement sur un point d'une case puis sur un point d'une autre. Sélectionne ensuite la liaison pour changer son extrémité. Clique sur une case pour modifier directement son texte et ses couleurs. Clique sur une liaison pour choisir sa forme et sa couleur. En mode Révision, clique sur une case pour révéler sa réponse. Les schémas sont liés à cette fiche et sauvegardés avec elle.</div></div>`;document.body.append(modal);if(!all.length)all.push({id:uid(),title:'Mon premier schéma',nodes:[],edges:[]});doc=all[0];mode='edit';chosen=null;connecting=false;edgeSelected=null;linkFrom=null;draw();}
function anchor(n,side){
 const w=n.w||175,h=n.h||95;
 return side==='top'?[n.x+w/2,n.y]:side==='right'?[n.x+w,n.y+h/2]:side==='bottom'?[n.x+w/2,n.y+h]:[n.x,n.y+h/2];
}
function safeColor(v,fallback){return /^#[0-9a-f]{6}$/i.test(v||'')?v:fallback}
function geometry(e){
 const a=doc.nodes.find(n=>n.id===e.from),b=doc.nodes.find(n=>n.id===e.to);
 if(!a||!b)return null;
 const [x1,y1]=anchor(a,e.fromSide||'right'),[x2,y2]=anchor(b,e.toSide||'left');
 const cx=Number.isFinite(e.cx)?e.cx:(x1+x2)/2,cy=Number.isFinite(e.cy)?e.cy:(y1+y2)/2;
 const form=e.form||'straight';
 const d=form==='curve'?`M ${x1} ${y1} Q ${cx*2-(x1+x2)/2} ${cy*2-(y1+y2)/2} ${x2} ${y2}`:
 form==='orthogonal'?`M ${x1} ${y1} L ${cx} ${y1} L ${cx} ${y2} L ${x2} ${y2}`:
 `M ${x1} ${y1} L ${x2} ${y2}`;
 return {d,x1,y1,x2,y2,cx,cy,form,handleX:form==='orthogonal'?cx:cx,handleY:form==='orthogonal'?(y1+y2)/2:cy};
}
function edgeMarkup(e){
 const g=geometry(e);if(!g)return '';
 const selected=edgeSelected===e.id,color=safeColor(e.stroke,'#628a97');
 const dash=e.pattern==='dotted'?'2 7':e.pattern==='dashed'?'11 7':'';
 const marker=e.style==='arrow'?'url(#cap-dg-arrow-'+e.id+')':'';
 return `<g data-dg-edge="${esc(e.id)}">
 <defs><marker id="cap-dg-arrow-${esc(e.id)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${color}"/></marker></defs>
 <path d="${g.d}" fill="none" stroke="transparent" stroke-width="24" pointer-events="stroke"/>
 <path d="${g.d}" fill="none" stroke="${color}" stroke-width="${selected?3.5:2.5}" stroke-dasharray="${dash}" stroke-linecap="round" marker-end="${marker}" pointer-events="none"/>
 ${e.style==='dot'?`<circle cx="${g.x2}" cy="${g.y2}" r="6" fill="${color}" pointer-events="none"/>`:''}
 ${selected?`<circle class="cap-dg-control" data-dg-control="${esc(e.id)}" cx="${g.handleX}" cy="${g.handleY}" r="9" fill="#fff" stroke="#d27636" stroke-width="2.5" pointer-events="all"/>`:''}
 </g>`;
}
function caseTools(n){
 const color=(key,def,label)=>`<label>${label}<input type="color" data-dg-case-color="${key}" data-dg-node-id="${esc(n.id)}" value="${safeColor(n[key],def)}" title="${label}"></label>`;
 return `<div class="cap-dg-case-tools" data-dg-case-tools="${esc(n.id)}" style="${windowPositions['case:'+n.id]?`left:${windowPositions['case:'+n.id].x}px;top:${windowPositions['case:'+n.id].y}px`:''}"><div class="cap-dg-move" data-dg-move="case:${esc(n.id)}" title="Déplacer le menu">⠿ Options</div>
 ${color('fontColor','#294b70','Police')}
 
 ${color('color','#e8f2f4','Fond')}
 ${color('borderColor','#7196a1','Contour case')}
 <button type="button" data-dg="definition" data-dg-node-id="${esc(n.id)}">▤ Définition</button>
 <button type="button" data-dg="delete-node" data-dg-node-id="${esc(n.id)}">✕ Supprimer</button>
 </div><span class="cap-dg-resize" data-dg-resize="${esc(n.id)}" title="Redimensionner"></span>`;
}
function draw(){
 const modal=document.getElementById('cap-diagram-modal');if(!modal||!doc)return;
 const all=store(),sel=modal.querySelector('#cap-diagram-select');
 sel.innerHTML=all.map(x=>`<option value="${esc(x.id)}" ${x.id===doc.id?'selected':''}>${esc(x.title)}</option>`).join('');
 modal.querySelector('#cap-diagram-nodes').innerHTML=doc.nodes.map(n=>{
 const active=chosen===n.id&&mode==='edit';
 const border=safeColor(n.borderColor,'#7196a1'),fc=safeColor(n.fontColor,'#294b70');
 return `<div class="cap-shape ${esc(n.shape||'rect')} ${active?'selected':''}" data-dg-node="${esc(n.id)}" style="left:${n.x}px;top:${n.y}px;width:${n.w||175}px;height:${n.h||95}px;background:${safeColor(n.color,'#e8f2f4')};border-color:${border};color:${fc}">
 <div class="cap-shape-label" data-dg-label="${esc(n.id)}" ${active?'contenteditable="true" spellcheck="true"':''} style="color:${fc}">${esc(n.text)}</div>
 ${mode==='review'&&n.answer?'<span class="cap-shape-reveal">👁 Révéler</span>':''}
 ${active?caseTools(n):''}
 ${connecting&&mode==='edit'?sides.map(side=>`<button type="button" class="cap-dg-anchor ${linkFrom?.id===n.id&&linkFrom?.side===side?'active':''}" data-dg-anchor="${side}" data-dg-node-id="${esc(n.id)}" aria-label="Connecter ${side}"></button>`).join(''):''}
 </div>`;
 }).join('');
 modal.querySelector('#cap-diagram-edges').innerHTML=doc.edges.map(edgeMarkup).join('');
 modal.querySelector('[data-dg="mode"]').textContent=mode==='review'?'✎ Mode Création':'👁 Mode Révision';
 modal.querySelector('[data-dg="connect"]').classList.toggle('selected',connecting);
 let tools=modal.querySelector('#cap-dg-edge-tools');
 if(!tools){tools=document.createElement('div');tools.id='cap-dg-edge-tools';modal.querySelector('#cap-diagram-stage').append(tools)}
 const edge=doc.edges.find(e=>e.id===edgeSelected);
 tools.hidden=!edge;
 tools.style.display=edge?'flex':'none';
 if(edge){
 const g=geometry(edge);
 const ep=windowPositions['edge:'+edge.id];
 tools.style.left=(ep?.x??Math.max(5,Math.min(760,g.handleX-140)))+'px';
 tools.style.top=(ep?.y??Math.max(5,Math.min(680,g.handleY-85)))+'px';
 tools.innerHTML=`<div class="cap-dg-move" data-dg-move="edge:${esc(edge.id)}" title="Déplacer le menu">⠿ <span> Liaison</span></div><label>Bout <select data-dg-edge-prop="style"><option value="line">Rien</option><option value="arrow">Flèche</option><option value="dot">Point</option></select></label>
 <label>Type <select data-dg-edge-prop="pattern"><option value="solid">Trait</option><option value="dotted">Points</option><option value="dashed">Tirets</option></select></label>
 <label>Forme <select data-dg-edge-prop="form"><option value="straight">Droite</option><option value="curve">Libre / courbe</option><option value="orthogonal">Angles droits</option></select></label>
 <label>Couleur <input type="color" data-dg-edge-prop="stroke" value="${safeColor(edge.stroke,'#628a97')}"></label>
 <button data-dg="delete-edge">✕</button>`;
 tools.querySelectorAll('select').forEach(el=>el.value=edge[el.dataset.dgEdgeProp]||(el.dataset.dgEdgeProp==='style'?'arrow':el.dataset.dgEdgeProp==='pattern'?'solid':'straight'));
 }
 if(definitionOpen){
 const n=doc.nodes.find(n=>n.id===definitionOpen);
 if(n){
  const popup=document.createElement('div');popup.className='cap-dg-definition';popup.id='cap-dg-definition';
  const dp=windowPositions['definition:'+n.id];popup.style.left=(dp?.x??Math.min(n.x,810))+'px';popup.style.top=(dp?.y??Math.max(8,n.y-145))+'px';
  popup.innerHTML=`<div class="cap-dg-move" data-dg-move="definition:${esc(n.id)}" title="Déplacer la fenêtre">⠿ Définition / explication <button type="button" data-dg="close-definition" aria-label="Fermer">✕</button></div><textarea data-dg-answer="${esc(n.id)}" placeholder="Rédiger ici…">${esc(n.answer||'')}</textarea>`;
  modal.querySelector('#cap-diagram-stage').append(popup);
 }
 }
}
function updateEdges(){const edges=document.getElementById('cap-diagram-edges');if(edges)edges.innerHTML=doc.edges.map(edgeMarkup).join('')}
document.addEventListener('input',e=>{
 if(!doc)return;
 const color=e.target.dataset.dgCaseColor;
 if(color){const n=doc.nodes.find(n=>n.id===e.target.dataset.dgNodeId);if(n){n[color]=e.target.value;const el=e.target.closest('.cap-shape');if(el){if(color==='color')el.style.background=n.color;if(color==='borderColor')el.style.borderColor=n.borderColor;if(color==='fontColor')el.querySelector('.cap-shape-label').style.color=n.fontColor;if(color==='fontOutline')el.querySelector('.cap-shape-label').style.webkitTextStroke='.4px '+n.fontOutline}saveDiagram()}return}
 const label=e.target.closest('[data-dg-label]');
 if(label){const n=doc.nodes.find(n=>n.id===label.dataset.dgLabel);if(n){n.text=label.innerText;saveDiagram()}return}
 if(e.target.dataset.dgAnswer){const n=doc.nodes.find(n=>n.id===e.target.dataset.dgAnswer);if(n){n.answer=e.target.value;saveDiagram()}}
});
document.addEventListener('change',e=>{
 const key=e.target.dataset.dgEdgeProp;
 if(key&&doc&&edgeSelected){const ed=doc.edges.find(x=>x.id===edgeSelected);if(ed){ed[key]=e.target.value;saveDiagram();draw()}}
});
document.addEventListener('click',async e=>{
 if(e.target.closest('[data-cap-diagrams]')){e.preventDefault();open();return}
 const m=e.target.closest('#cap-diagram-modal');if(!m)return;
 if(e.target.id==='cap-diagram-modal'){close();return}
 if(e.target.closest('#cap-dg-definition')){if(e.target.closest('[data-dg="close-definition"]')){definitionOpen=null;draw()}return}
 if(definitionOpen&&!e.target.closest('[data-dg="definition"]')){definitionOpen=null;document.getElementById('cap-dg-definition')?.remove()}
 const point=e.target.closest('[data-dg-anchor]');
 if(point&&connecting&&mode==='edit'){
  e.preventDefault();e.stopPropagation();
  const id=point.dataset.dgNodeId,side=point.dataset.dgAnchor;
  if(!linkFrom){linkFrom={id,side};chosen=id}
  else if(linkFrom.id!==id){const edge={id:uid(),from:linkFrom.id,fromSide:linkFrom.side,to:id,toSide:side,style:'arrow',pattern:'solid',form:'straight',stroke:'#628a97'};doc.edges.push(edge);edgeSelected=edge.id;linkFrom=null;connecting=false;saveDiagram()}
  else linkFrom={id,side};
  draw();return;
 }
 if(e.target.closest('[data-dg-control]'))return;
 const edgeEl=e.target.closest('[data-dg-edge]');
 if(edgeEl&&mode==='edit'){edgeSelected=edgeEl.dataset.dgEdge;chosen=null;definitionOpen=null;draw();return}
 const b=e.target.closest('[data-dg]');
 if(b){
  e.preventDefault();const a=b.dataset.dg;
  if(a==='close'){close();return}
  if(a==='close-definition'){definitionOpen=null;draw();return}
  if(a==='definition'){definitionOpen=definitionOpen===b.dataset.dgNodeId?null:b.dataset.dgNodeId;draw();if(definitionOpen)document.querySelector('#cap-dg-definition textarea')?.focus();return}
  if(a==='delete-node'){
   const id=b.dataset.dgNodeId;
   if(await window.capConfirm('Supprimer cette case et ses connexions ?')){
    doc.nodes=doc.nodes.filter(n=>n.id!==id);doc.edges=doc.edges.filter(x=>x.from!==id&&x.to!==id);chosen=null;definitionOpen=null;saveDiagram();draw()
   }return
  }
  if(a==='delete-edge'){doc.edges=doc.edges.filter(x=>x.id!==edgeSelected);edgeSelected=null;saveDiagram();draw();return}
  if(a==='save'){saveDiagram();window.capNotice('Schéma enregistré dans la fiche.');return}
  if(a==='new'){const title=await window.capAsk('Titre du nouveau schéma :','Nouveau schéma');if(!title)return;doc={id:uid(),title,nodes:[],edges:[]};store().push(doc);chosen=null;edgeSelected=null;definitionOpen=null;saveDiagram();draw();return}
  if(a==='rename'){const t=await window.capAsk('Titre du schéma :',doc.title);if(t?.trim()){doc.title=t.trim();saveDiagram()}draw();return}
  if(a==='add'){
   const n={id:uid(),text:'Nouvelle notion',answer:'',shape:'rect',color:'#E8F2F4',fontColor:'#294B70',fontOutline:'#FFFFFF',borderColor:'#7196A1',x:100+(doc.nodes.length%4)*210,y:100+Math.floor(doc.nodes.length/4)*145,w:175,h:95};
   doc.nodes.push(n);chosen=n.id;edgeSelected=null;saveDiagram();draw();document.querySelector(`[data-dg-label="${n.id}"]`)?.focus();return
  }
  if(a==='connect'){connecting=!connecting;linkFrom=null;edgeSelected=null;chosen=null;definitionOpen=null;draw();return}
  if(a==='mode'){mode=mode==='edit'?'review':'edit';linkFrom=null;connecting=false;edgeSelected=null;chosen=null;definitionOpen=null;draw();return}
 }
 if(e.target.closest('#cap-dg-edge-tools')||e.target.closest('.cap-dg-case-tools')||e.target.closest('[data-dg-resize]')||e.target.closest('[data-dg-label]'))return;
 const node=e.target.closest('[data-dg-node]');
 if(node&&!drag){
  const n=doc.nodes.find(n=>n.id===node.dataset.dgNode);if(!n)return;
  if(mode==='review'){
   m.querySelector('#cap-diagram-answer')?.remove();
   if(n.answer){const pop=document.createElement('div');pop.id='cap-diagram-answer';pop.style.left=Math.min(n.x+30,760)+'px';pop.style.top=Math.min(n.y+95,620)+'px';pop.textContent=n.answer;m.querySelector('#cap-diagram-stage').append(pop)}
   return;
  }
  if(connecting)return;
  if(chosen!==n.id){chosen=n.id;edgeSelected=null;definitionOpen=null;draw()}
  return;
 }
 if(definitionOpen||edgeSelected||chosen){definitionOpen=null;edgeSelected=null;chosen=null;draw()}
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.getElementById('cap-diagram-modal')){
  e.preventDefault();
  if(definitionOpen){definitionOpen=null;draw()}
  else if(edgeSelected||chosen){edgeSelected=null;chosen=null;draw()}else close();
 }
});
document.addEventListener('change',e=>{if(e.target.id==='cap-diagram-select'){saveDiagram();doc=store().find(x=>x.id===e.target.value);chosen=null;edgeSelected=null;definitionOpen=null;draw()}});
document.addEventListener('pointerdown',e=>{
 const move=e.target.closest('[data-dg-move]');
 if(move&&doc&&!e.target.closest('button,input,select,textarea')){const panel=move.closest('#cap-dg-definition,#cap-dg-edge-tools,.cap-dg-case-tools');if(panel){floatingDrag={key:move.dataset.dgMove,x:e.clientX,y:e.clientY,left:parseFloat(panel.style.left)||0,top:parseFloat(panel.style.top)||0,panel};move.setPointerCapture(e.pointerId);e.preventDefault();return}}
 const control=e.target.closest('[data-dg-control]');
 if(control&&doc){const stage=document.getElementById('cap-diagram-stage');const r=stage.getBoundingClientRect();edgeDrag={id:control.dataset.dgControl,stageX:r.left,stageY:r.top,scrollX:stage.parentElement.scrollLeft,scrollY:stage.parentElement.scrollTop};stage.setPointerCapture(e.pointerId);e.preventDefault();return}
 const resize=e.target.closest('[data-dg-resize]');
 if(resize&&doc){const n=doc.nodes.find(x=>x.id===resize.dataset.dgResize);if(n){drag={id:n.id,x:e.clientX,y:e.clientY,ow:n.w||175,oh:n.h||95,resize:true,moved:false};resize.setPointerCapture(e.pointerId);e.preventDefault()}return}
 if(e.target.closest('.cap-dg-case-tools')||e.target.closest('[data-dg-label]'))return;
 const el=e.target.closest('#cap-diagram-modal .cap-shape');
 if(!el||mode!=='edit'||connecting||e.target.closest('[data-dg-anchor]'))return;
 const n=doc?.nodes.find(x=>x.id===el.dataset.dgNode);if(!n)return;
 drag={id:n.id,x:e.clientX,y:e.clientY,ox:n.x,oy:n.y,moved:false};
 el.setPointerCapture(e.pointerId);
});
document.addEventListener('pointermove',e=>{
 if(floatingDrag){const f=floatingDrag;const x=f.left+e.clientX-f.x,y=f.top+e.clientY-f.y;f.panel.style.left=x+'px';f.panel.style.top=y+'px';windowPositions[f.key]={x,y};return}
 if(edgeDrag&&doc){
  const ed=doc.edges.find(x=>x.id===edgeDrag.id);if(!ed)return;
  ed.cx=Math.max(0,Math.min(1100,e.clientX-edgeDrag.stageX+edgeDrag.scrollX));
  ed.cy=Math.max(0,Math.min(760,e.clientY-edgeDrag.stageY+edgeDrag.scrollY));
  if((ed.form||'straight')==='straight')ed.form='curve';
  updateEdges();return;
 }
 if(!drag||!doc)return;
 const n=doc.nodes.find(x=>x.id===drag.id);if(!n)return;
 const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
 if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
 if(drag.moved){
  if(drag.resize){n.w=Math.max(110,Math.round(drag.ow+dx));n.h=Math.max(65,Math.round(drag.oh+dy))}
  else{n.x=Math.max(0,Math.min(1000,Math.round(drag.ox+dx)));n.y=Math.max(0,Math.min(670,Math.round(drag.oy+dy)))}
  const el=document.querySelector(`[data-dg-node="${n.id}"]`);
  if(el){el.style.left=n.x+'px';el.style.top=n.y+'px';el.style.width=n.w+'px';el.style.height=n.h+'px'}
  updateEdges();
 }
});
document.addEventListener('pointerup',()=>{
 floatingDrag=null;
 if(edgeDrag){saveDiagram();edgeDrag=null;draw()}
 if(drag?.moved)saveDiagram();
 drag=null;
});
})();
