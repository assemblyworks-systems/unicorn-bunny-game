(function () {
  'use strict';
  const home = document.getElementById('home'), menu = document.getElementById('menu');
  const learning = location.pathname.endsWith('learn.html');
  const catalog = window.PLAYBOX_CATALOG;
  const savedFavourites = Playbox.read('playbox_favourites_v2', []);
  const favourites = new Set(Array.isArray(savedFavourites) ? savedFavourites.filter(id => catalog[id]) : []);
  let filter = 'all', pageIndex=0, activeGame = null, breakTimer;
  const native = button => { button.dataset.native = 'true'; return button; };
  const button = (label, cls, action) => { const b = native(document.createElement('button')); b.type = 'button'; b.className = cls; b.textContent = label; b.addEventListener('click', action); return b; };
  function launch(id) { const b = menu.querySelector('[data-mode="' + id + '"]'); if (b) b.click(); }
  home.querySelectorAll('.decor,.big,.hero,#homeSub').forEach(el => el.remove());
  const title = document.getElementById('homeTitle'); title.className = 'profile-greeting';
  const nav = document.createElement('header'); nav.className = 'library-header';
  const mascot=document.createElement('img'); mascot.src='img/mascot-boxy.svg'; mascot.alt=''; nav.append(mascot,title);
  const parentButton = button('⚙', 'parent-link', showParentGate); parentButton.setAttribute('aria-label','Grown-ups'); nav.append(parentButton); home.prepend(nav);
  const dock=document.createElement('nav'); dock.className='app-dock'; dock.setAttribute('aria-label','Playbox areas');
  dock.innerHTML='<a href="index.html" '+(!learning?'aria-current="page"':'')+'><span aria-hidden="true">🧸</span>Play</a><a href="learn.html" '+(learning?'aria-current="page"':'')+'><span aria-hidden="true">📚</span>Learn</a>';
  const boardButton=document.getElementById('boardBtn'); if(boardButton){ boardButton.innerHTML='<span aria-hidden="true">⭐</span>Stickers'; dock.append(boardButton); }
  const profileButton=document.getElementById('profileBtn'); if(profileButton){profileButton.hidden=true;home.append(profileButton);} home.querySelector('.homeRow')?.remove(); home.append(dock);
  const filters = document.createElement('div'); filters.className = 'library-filters'; filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter activities');
  const categories = learning ? [['all','🌈 All'],['letters','🔤 ABC'],['numbers','🔢 123'],['puzzles','🧩 Puzzles'],['stories','📖 Stories'],['saved','♥ Favourites']] : [['all','🌈 All'],['stories','📖 Stories'],['puzzles','🧩 Games'],['create','🎨 Create'],['saved','♥ Favourites']];
  categories.forEach(([id,label]) => { const b = button(label, 'filter-chip', () => { filter = id; pageIndex=0; applyFilter(); }); b.dataset.filter = id; filters.append(b); }); menu.before(filters);
  const cards = [];
  menu.querySelectorAll('[data-mode]').forEach(b => {
    const id = b.dataset.mode, entry = catalog[id]; if (!entry) return;
    const [name,category,description,art,tone,badge] = entry;
    const card = document.createElement('article'); card.className = 'activity-card t-' + tone; card.dataset.category = category; card.dataset.id = id;
    b.className = 'menu-btn activity-launch'; b.setAttribute('aria-label', 'Play ' + name);
    b.innerHTML = '<div class="activity-art"><img src="img/' + art + '" alt="" draggable="false" decoding="async"></div><div class="activity-copy"><h3>' + name + '</h3></div>';

    b.before(card); card.append(b);
    const star = button('♡', 'save-activity', () => { if(favourites.has(id)) favourites.delete(id); else favourites.add(id); Playbox.write('playbox_favourites_v2', [...favourites]); applyFilter(); });
    star.setAttribute('aria-label', 'Favourite ' + name); card.append(star);
    if(badge) { const tag = document.createElement('span'); tag.className = 'new-badge'; tag.textContent = badge; card.append(tag); }
    cards.push({card,star,id,category});
  });
  const empty = document.createElement('div'); empty.className = 'empty-library'; empty.innerHTML = '<span>♡</span><h3>A little collection of favourites</h3><p>Tap the heart on any activity to keep it here.</p>'; menu.after(empty);
  const pager=document.createElement('div'); pager.className='app-pager';
  const previous=button('←','page-arrow',()=>{pageIndex--;applyFilter();}); previous.setAttribute('aria-label','Previous games');
  const dots=document.createElement('div'); dots.className='page-dots'; dots.setAttribute('role','status'); dots.setAttribute('aria-live','polite');
  const next=button('→','page-arrow',()=>{pageIndex++;applyFilter();}); next.setAttribute('aria-label','Next games');
  pager.append(previous,dots,next); menu.after(pager);
  function pageSize(){return innerWidth>=900?8:(innerWidth>=600?9:4);}
  function applyFilter() {
    const selected=cards.filter(({id,category})=>filter==='all'||filter===category||(filter==='saved'&&favourites.has(id)));
    const size=pageSize(), pages=Math.max(1,Math.ceil(selected.length/size)); pageIndex=Math.min(Math.max(0,pageIndex),pages-1);
    const visible=new Set(selected.slice(pageIndex*size,(pageIndex+1)*size));
    cards.forEach(item=>{const saved=favourites.has(item.id);item.star.textContent=saved?'♥':'♡';item.star.setAttribute('aria-pressed',String(saved));item.card.hidden=!visible.has(item);});
    filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
    empty.hidden=selected.length!==0; menu.hidden=selected.length===0;
    previous.disabled=pageIndex===0;next.disabled=pageIndex>=pages-1;dots.replaceChildren();
    for(let i=0;i<pages;i++){const dot=button('','page-dot',()=>{pageIndex=i;applyFilter();});dot.setAttribute('aria-label','Games page '+(i+1));dot.setAttribute('aria-current',String(i===pageIndex));dots.append(dot);}
    dots.setAttribute('aria-label','Page '+(pageIndex+1)+' of '+pages);
  }
  applyFilter();window.addEventListener('resize',applyFilter);
  let swipe=null,ignoreClickUntil=0;
  menu.addEventListener('pointerdown',e=>{swipe={id:e.pointerId,x:e.clientX,y:e.clientY};});
  menu.addEventListener('pointerup',e=>{if(!swipe||swipe.id!==e.pointerId)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5){ignoreClickUntil=Date.now()+400;pageIndex+=dx<0?1:-1;applyFilter();}});
  menu.addEventListener('pointercancel',()=>swipe=null);
  menu.addEventListener('click',e=>{if(Date.now()<ignoreClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
  const dialog = document.createElement('dialog'); dialog.className = 'parent-dialog'; dialog.setAttribute('aria-labelledby','parentTitle'); document.body.append(dialog);
  function openDialog(title,content) {
    dialog.replaceChildren();
    const close = button('✕', 'dialog-close',()=>dialog.close()); close.setAttribute('aria-label','Close');
    const heading = document.createElement('h2'); heading.id='parentTitle'; heading.textContent=title; dialog.append(close,heading,content);
    if(!dialog.open) dialog.showModal();
  }
  function showParentGate() {
    const a=3+Math.floor(Math.random()*6), b=3+Math.floor(Math.random()*6);
    const form=document.createElement('form'); form.innerHTML='<p>A small pause for grown-ups. This is a child-friendly check, not a password.</p><label for="parentAnswer">What is '+a+' + '+b+'?</label><input id="parentAnswer" inputmode="numeric" pattern="[0-9]*" autocomplete="off" required><p class="parent-error" role="alert"></p>';
    const submit=button('Open grown-up space →','primary-action',()=>{}); submit.type='submit'; form.append(submit);
    form.addEventListener('submit',e=>{e.preventDefault(); if(Number(form.querySelector('input').value)===a+b) showParents(); else form.querySelector('.parent-error').textContent='Try that one again.';});
    openDialog('Just for grown-ups',form); form.querySelector('input').focus();
  }
  function showParents() {
    const content=document.createElement('div'); content.className='parent-content';
    content.innerHTML='<p class="parent-intro">A few simple choices for your daughter’s playtime.</p><div class="parent-facts"><span>24 activities</span><span>Made for Avalynn</span></div><h3>Make yourself at home</h3>';
    const setting = (key,label,help) => { const row=document.createElement('label'); row.className='setting-row'; row.innerHTML='<span><strong>'+label+'</strong><small>'+help+'</small></span><input type="checkbox">'; const input=row.querySelector('input'); input.checked=!!Playbox.settings[key]; input.addEventListener('change',()=>Playbox.setSettings({[key]:input.checked})); content.append(row); };
    setting('sound','Sounds & spoken prompts','Recorded voices, with visual instructions in the new story.');
    setting('calm','Gentler motion','Reduce decorative movement and celebrations.');
    const reminder=document.createElement('label'); reminder.className='setting-row'; reminder.innerHTML='<span><strong>A little break reminder</strong><small>A gentle invitation to pause. No countdown for your child.</small></span><select aria-label="Break reminder"><option value="0">Off</option><option value="10">10 minutes</option><option value="20">20 minutes</option><option value="30">30 minutes</option></select>'; const select=reminder.querySelector('select'); select.value=Playbox.settings.reminder; select.addEventListener('change',()=>{Playbox.setSettings({reminder:Number(select.value)}); armBreak();}); content.append(reminder);
    const privacy=document.createElement('section'); privacy.className='parent-section'; privacy.innerHTML='<h3>Your family’s space</h3><p>Nicknames, favourites and settings stay in this browser. Stars reset each session. There are no accounts, advertising or activity tracking. This is your family’s personal playroom.</p><p>Learning activities are invitations to practise, not assessments. Play together, follow your child’s pace, and take breaks.</p>'; content.append(privacy);
    const reset=button('Clear this device’s Playbox data','quiet-action danger-action',()=>{
      reset.textContent='Clear name, favourites and settings?';
      const confirm=button('Yes, clear local data','quiet-action',async()=>{
        confirm.disabled=true;
        try { ['playbox_profile_v1','playbox_settings_v2','playbox_favourites_v2','avalynn_stickers_v1'].forEach(k=>localStorage.removeItem(k)); if('caches' in window) { const keys=await caches.keys(); await Promise.all(keys.filter(k=>k.startsWith('playbox-')).map(k=>caches.delete(k))); } location.reload(); } catch { confirm.textContent='Could not clear everything. Please use browser site settings.'; confirm.disabled=false; }
      }); reset.replaceWith(confirm);
    }); content.append(button('Change player name','quiet-action',()=>{dialog.close();document.getElementById('profileBtn')?.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1}));})); content.append(reset); openDialog('The grown-up space',content);
  }
  function armBreak(){ clearTimeout(breakTimer); if(!Playbox.settings.reminder) return; breakTimer=setTimeout(()=>{
    document.getElementById('backBtn').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1}));
    const content=document.createElement('div'); content.innerHTML='<p>Stretch up tall, look around, or share a little cuddle. Your playroom will be right here.</p>'; content.append(button('Back to the playroom','primary-action',()=>{dialog.close();armBreak();})); openDialog('Time for a little stretch?',content);
  }, Number(Playbox.settings.reminder)*60000); }
  window.addEventListener('playbox-activity',e=>{activeGame=e.detail; if(!breakTimer) armBreak();});
  window.addEventListener('playbox-home',()=>{activeGame=null;});
  // Keyboard activation for legacy pointer-first buttons; native new controls use click.
  document.addEventListener('click',e=>{ const b=e.target.closest('button,[role="button"]'); if(e.detail===0 && b && !b.dataset.native && b.id!=='gateGo' && !b.disabled) { const rect=b.getBoundingClientRect(); b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1,clientX:rect.left+rect.width/2,clientY:rect.top+rect.height/2})); b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1,clientX:rect.left+rect.width/2,clientY:rect.top+rect.height/2})); } });
  function labelControls() {
    document.querySelectorAll('.critter,.kitchenItem,.bookCard').forEach((el,i)=>{if(el.tagName==='BUTTON') return; el.setAttribute('role','button'); el.tabIndex=0; if(!el.getAttribute('aria-label')) el.setAttribute('aria-label',el.textContent.trim() || 'Play item '+(i+1));});
  }
  const observer=new MutationObserver(labelControls); observer.observe(document.getElementById('play'),{childList:true,subtree:true});
  document.addEventListener('keydown',e=>{ if((e.key==='Enter'||e.key===' ') && e.target.matches('[role="button"]:not(button)')){e.preventDefault();e.target.click();} });
  document.getElementById('soundBtn').setAttribute('aria-label',Playbox.settings.sound?'Mute sound':'Turn sound on');
  Playbox.applySettings();
})();
