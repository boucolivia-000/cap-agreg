/* Cap Agrég’ V5.4: image insertion in Studio and diagrams. */
(()=>{'use strict';
const style=document.createElement('style');style.textContent=`
.cap-u-node-image{max-width:100%;max-height:100%;object-fit:contain;display:block;margin:auto;pointer-events:none}
.cap-dg-node-image{max-width:100%;max-height:75%;object-fit:contain;display:block;pointer-events:none}
.cap-shape:has(.cap-dg-node-image){display:flex;flex-direction:column;gap:3px}
.studio-page img.cap-studio-image{max-width:100%;height:auto;cursor:move;resize:both;overflow:auto;display:inline-block}
.cap-u-page img,.cap-category-page-content img{max-width:100%;height:auto}
.cap-summary-complete .cap-u-item-head > span:first-child{display:none}
.cap-summary-complete .cap-u-item-head{justify-content:flex-end}
.cap-u-node:has(.cap-u-node-image){display:flex;flex-direction:column;align-items:center;justify-content:center}
`;document.head.append(style);
let picker=null;
function importImage(where){
 if(!picker){picker=document.createElement('input');picker.type='file';picker.accept='image/png,image/jpeg,image/webp,image/gif';picker.style.display='none';document.body.append(picker)}
 picker.value='';picker.onchange=async()=>{
 const file=picker.files?.[0];if(!file)return;
 if(file.size>4*1024*1024){window.capNotice?.('Image trop volumineuse : 4 Mo maximum. Réduis-la avant de l’importer.');return}
 const reader=new FileReader();reader.onload=()=>{
  const src=String(reader.result||'');if(!src.startsWith('data:image/'))return;
  if(where==='diagram'){window.capDiagramAddImage?.(src);return}
  const editor=document.getElementById('studio-editor');if(!editor){window.capNotice?.('Ouvre une page du Cahier Studio pour insérer une image.');return}
  editor.focus();const img=document.createElement('img');img.src=src;img.alt=file.name;img.className='cap-studio-image';img.style.width='min(100%, 420px)';img.style.height='auto';img.setAttribute('contenteditable','false');
  const sel=window.getSelection();if(sel?.rangeCount&&editor.contains(sel.anchorNode)){const range=sel.getRangeAt(0);range.deleteContents();range.insertNode(img);range.setStartAfter(img);range.collapse(true);sel.removeAllRanges();sel.addRange(range)}else editor.append(img);
  editor.dispatchEvent(new Event('input',{bubbles:true}));window.capStudio?.capture?.();window.capNotice?.('Image insérée dans la page. Enregistre la fiche pour la conserver.');
 };reader.readAsDataURL(file)
 };picker.click()
}
window.capImportImage=importImage;
// Add the control inside the existing Studio toolbar after every render, without replacing it.
const observer=new MutationObserver(()=>{
 const bar=document.querySelector('#studio-editor')?.closest('.studio-layout')?.previousElementSibling;
 if(bar?.classList.contains('studio-bar')&&!bar.querySelector('[data-cap-studio-image]')){
  const btn=document.createElement('button');btn.type='button';btn.dataset.capStudioImage='';btn.textContent='▧ Image';btn.title='Insérer une image dans la page';bar.append(btn)
 }
});observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target.closest('[data-cap-studio-image]')){e.preventDefault();importImage('studio')}});
})();
