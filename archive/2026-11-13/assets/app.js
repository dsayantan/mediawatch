
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
  var BN=['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট',
          'সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  var EN=['January','February','March','April','May','June','July','August',
          'September','October','November','December'];
  function bnNum(n){return String(n).replace(/[0-9]/g,function(d){
    return '০১২৩৪৫৬৭৮৯'[+d];});}
  function label(iso, fmt, isLatest){
    var p=iso.split('-'), y=+p[0], m=+p[1]-1, d=+p[2];
    return fmt==='bn' ? bnNum(d)+' '+BN[m]+' '+bnNum(y)+(isLatest?'  (আজ)':'')
                      : d+' '+EN[m]+' '+y+(isLatest?'  (today)':'');
  }
  var sels=[document.getElementById('datepick'),
            document.getElementById('datepick-en')].filter(Boolean);
  if(!sels.length) return;
  sels.forEach(function(sel){
    sel.addEventListener('change', function(){ if(sel.value) location.href=sel.value; });
  });
  var ROOT=sels[0].dataset.root||'', HERE=sels[0].dataset.today||'';
  fetch(ROOT+'dates.json',{cache:'no-store'}).then(function(r){
    return r.ok ? r.json() : null;
  }).then(function(d){
    if(!d || !d.dates || !d.dates.length) return;
    var latest=d.dates[0];
    sels.forEach(function(sel){
      var fmt=sel.dataset.fmt||'bn';
      sel.innerHTML='';
      d.dates.forEach(function(x){
        var o=document.createElement('option');
        o.value = (x===latest) ? ROOT+'index.html' : ROOT+'archive/'+x+'/index.html';
        o.textContent = label(x, fmt, x===latest);
        if(x===HERE) o.selected=true;
        sel.appendChild(o);
      });
    });
  }).catch(function(){});
})();
