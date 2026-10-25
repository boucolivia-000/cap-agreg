/* V5.6: consistent sidebar selection, without colored active background. */
(()=>{'use strict';
 const update=()=>{document.querySelectorAll('.cap-sheet-actions button').forEach(btn=>{
  const action=btn.dataset.action||'';
  const current=(typeof page!=='undefined'&&page==='sheet')&&((typeof mode!=='undefined'&&mode==='full'&&action==='view-full')||(typeof mode!=='undefined'&&mode==='summary'&&action==='view-summary'));
  if(current)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');
 });};
 const obs=new MutationObserver(update);obs.observe(document.getElementById('app'),{childList:true,subtree:false});update();
})();
