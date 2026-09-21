
(function(){
  var KEY='mediawatch-lang';
  function apply(l){
    document.documentElement.classList.toggle('lang-en', l==='en');
    document.documentElement.lang = (l==='en' ? 'en' : 'bn');
    var bs=document.querySelectorAll('.langsw button');
    for(var i=0;i<bs.length;i++)
      bs[i].setAttribute('aria-pressed', String(bs[i].dataset.lang===l));
  }
  var saved;
  try{ saved = localStorage.getItem(KEY); }catch(e){}
  apply(saved==='en' ? 'en' : 'bn');
  document.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('.langsw button') : null;
    if(!b) return;
    var l=b.dataset.lang; apply(l);
    try{ localStorage.setItem(KEY,l); }catch(err){}
  });

  // date picker — the list of available days is fetched from the site root so
  // that yesterday's pages can still reach days published after them
  var sel=document.getElementById('datepick');
  if(!sel) return;
  var ROOT=sel.dataset.root||'', HERE=sel.dataset.today||'';
  sel.addEventListener('change', function(){
    if(sel.value) location.href = sel.value;
  });
  fetch(ROOT+'dates.json',{cache:'no-store'}).then(function(r){
    return r.ok ? r.json() : null;
  }).then(function(d){
    if(!d || !d.dates || !d.dates.length) return;
    var latest=d.dates[0];
    sel.innerHTML='';
    d.dates.forEach(function(x){
      var o=document.createElement('option');
      o.value = (x===latest) ? ROOT+'index.html' : ROOT+'archive/'+x+'/index.html';
      o.textContent = x + (x===latest ? ' \u2022' : '');
      if(x===HERE) o.selected=true;
      sel.appendChild(o);
    });
  }).catch(function(){});
})();
