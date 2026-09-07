/* Run with a local preview server: npm start, then npm run test:browser. */
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium,webkit}=require('playwright');
const base=process.env.PLAYBOX_URL||'http://127.0.0.1:4173';
(async()=>{
  const engine=process.env.BROWSER_ENGINE==='webkit'?webkit:chromium;
  const browser=await engine.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const errors=[];fs.mkdirSync('artifacts',{recursive:true});
  try {
    const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
    console.log('Opening playroom');await page.goto(base);await page.locator('.activity-card').first().waitFor();
    assert.equal(await page.locator('.activity-card').count(),13);assert.equal(await page.locator('#homeTitle').textContent(),"Avalynn's Playbox");
    await page.locator('.save-activity').first().click();await page.getByRole('button',{name:'♥ Favourites',exact:true}).click();assert.equal(await page.locator('.activity-card:visible').count(),1);
    await page.reload();assert.equal(await page.locator('.save-activity[aria-pressed=true]').count(),1);
    await page.locator('[data-mode=houses]').click();await page.getByRole('button',{name:'Let’s visit! →',exact:true}).click();
    await page.screenshot({path:'artifacts/story-tablet.png'});
    for(let stage=0;stage<3;stage++){console.log('Story stage',stage);
      await page.getByRole('button',{name:'Knock, knock!'}).click();await page.getByRole('button',{name:'Come inside'}).click();
      if(stage===0)for(let i=1;i<=3;i++)await page.getByRole('button',{name:'Pick carrot '+i}).click();
      if(stage===1){await page.getByRole('button',{name:'Square',exact:true}).click();assert.equal(await page.locator('.visit-progress').textContent(),'0 of 3');for(const name of ['Circle','Square','Triangle'])await page.getByRole('button',{name,exact:true}).click();}
      if(stage===2)for(const name of ['Hop','Pip','Rex'])await page.getByRole('button',{name:'Give an apple to '+name}).click();
      await page.getByRole('button',{name:stage<2?'Next home':'Our friendship picnic'}).click();
    }
    assert.equal(await page.locator('.passport-stamp.earned').count(),3);assert.match(await page.locator('#score').textContent(),/3/);
    await page.getByRole('button',{name:'Back to the playroom'}).click();
    console.log('Parent settings');await page.getByRole('button',{name:'Grown-ups',exact:true}).click();const question=await page.locator('label[for=parentAnswer]').textContent();const numbers=question.match(/\d+/g).map(Number);await page.locator('#parentAnswer').fill(String(numbers[0]+numbers[1]));await page.getByRole('button',{name:'Open grown-up space'}).click();
    await page.getByLabel('Gentler motion').check();assert.equal(await page.locator('html.calm').count(),1);await page.getByLabel('Sounds & spoken prompts').uncheck();await page.getByRole('button',{name:'Close',exact:true}).click();
    // Exercise every old game's startup and teardown, then validate the new learning lifetime.
    for(const file of ['index.html','learn.html']){
      await page.goto(base+'/'+file);await page.locator('.activity-card').first().waitFor();
      const modes=await page.locator('.activity-launch').evaluateAll(elements=>elements.map(el=>el.dataset.mode));
      for(const mode of modes){console.log('Smoke',file,mode);while(!await page.locator('[data-mode="'+mode+'"]').isVisible()){await page.getByRole('button',{name:'Next games',exact:true}).click();}await page.locator('[data-mode="'+mode+'"]').click();await page.waitForTimeout(380);assert.equal(await page.locator('#play').isVisible(),true,mode);await page.locator('#backBtn').dispatchEvent('pointerdown',{pointerId:1});assert.equal(await page.locator('#home').isVisible(),true,mode);}
    }
    await page.goto(base+'/learn.html');await page.evaluate(()=>Playbox.setSettings({sound:false}));await page.locator('[data-mode=find]').click();
    await page.evaluate(()=>{for(const b of document.querySelectorAll('#choices button')){ b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1})); if(b.classList.contains('right')) break; }});
    await page.locator('#backBtn').dispatchEvent('pointerdown',{pointerId:1});while(!await page.locator('[data-mode=shapes]').isVisible())await page.getByRole('button',{name:'Next games',exact:true}).click();await page.locator('[data-mode=shapes]').click();const before=await page.locator('#play').innerHTML();await page.waitForTimeout(700);assert.equal(await page.locator('#play').innerHTML(),before,'Old round must not overwrite new game');
    await page.locator('#backBtn').dispatchEvent('pointerdown',{pointerId:1});
    for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:1000}]){
      await page.setViewportSize(viewport);await page.goto(base);await page.locator('.activity-card').first().waitFor();assert.equal(await page.evaluate(()=>document.getElementById('home').scrollWidth<=innerWidth && document.getElementById('home').scrollHeight<=innerHeight),true);await page.locator('.activity-card:not([hidden]) img').evaluateAll(imgs=>Promise.all(imgs.map(im=>im.decode())));await page.screenshot({path:'artifacts/playroom-'+viewport.width+'.png'});
    }
    assert.deepEqual(errors,[]);console.log('PASS: 24 activity launches, full story, favourites, parent controls, navigation cancellation and 3 viewport layouts.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
