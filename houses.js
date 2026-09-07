/* Original story game: three homes, three acts of hospitality, one shared picnic. */
(function () {
  'use strict';
  const visits = [
    { name: 'Hop', place: 'The garden cottage', friend: 'hop-bunny.svg', tone: 'grass', task: 'carrots', art: 'carrot.png', count: 3,
      hello: 'Hello! I am Hop. Welcome to my garden cottage!', prompt: 'Can you pick three carrots for our lunch?', thanks: 'Three crunchy carrots! Thank you for helping me.' },
    { name: 'Pip', place: 'The tall town house', friend: 'pip-pig.svg', tone: 'sky', task: 'shapes', count: 3,
      hello: 'Hello! I am Pip. Welcome to my tall town house!', prompt: 'Find a circle, a square, and a triangle for my window.', thanks: 'My window looks wonderful! Thank you for helping me.' },
    { name: 'Rex', place: 'The riverside home', friend: 'rex-dino.svg', tone: 'grape', task: 'table', art: 'count-apple.png', count: 3,
      hello: 'Hello! I am Rex. Welcome to my home beside the river!', prompt: 'Give one apple to each friend at our table.', thanks: 'One apple each! There is a place for everyone.' }
  ];
  window.PLAYBOX_HOUSE_LINES = [
    'Every home has a hello. Let us visit our friends!', ...visits.flatMap(v => [v.hello, v.prompt, v.thanks]),
    'Knock on the door to say hello!', 'All our homes are different. All our friends are welcome!', 'You are a wonderful neighbour!',
    'Circle', 'Square', 'Triangle', 'Look again!'
  ];
  window.startNeighbourhood = function ({ play, say, reward, home }) {
    let visit = 0, stamps = [], steps = 0, welcomed = false;
    const el = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls || ''; if (text) n.textContent = text; return n; };
    const img = file => { const n = el('img'); n.src = 'img/' + file; n.alt = ''; return n; };
    const button = (text, cls, action) => { const n = el('button', cls, text); n.type = 'button'; n.dataset.native = 'true'; n.addEventListener('click', action); return n; };
    function frame(title, subtitle) {
      play.classList.add('neighbour-game'); play.replaceChildren();
      const wrap = el('section', 'visit-wrap'); wrap.setAttribute('aria-label', 'Hello, Neighbour!');
      const passport = el('div', 'passport');
      visits.forEach((v, i) => { const stamp = el('span', 'passport-stamp' + (stamps.includes(i) ? ' earned' : ''), (stamps.includes(i) ? '✓ ' : '') + v.name); stamp.setAttribute('aria-label', v.name + (stamps.includes(i) ? ': visited' : ': not yet visited')); passport.append(stamp); });
      const heading = el('h1', '', title); heading.tabIndex = -1;
      wrap.append(passport, heading, el('p', 'visit-copy', subtitle)); play.append(wrap); heading.focus({ preventScroll: true }); return wrap;
    }
    function intro() {
      const wrap = frame('Every home has a hello.', 'Three friends. Three different homes. A little kindness at every door.');
      const scene = img('neighbourhood.svg'); scene.className = 'neighbour-scene'; wrap.append(scene);
      wrap.append(button('Let’s visit! →', 'primary-action', showHome)); say('Every home has a hello. Let us visit our friends!');
    }
    function showHome() {
      welcomed = false; steps = 0;
      const v = visits[visit], wrap = frame(v.place, 'Knock on the door to say hello!');
      const stage = el('div', 'house-stage t-' + v.tone + ' house-' + visit);
      stage.innerHTML = '<div class="house-cloud cloud-one"></div><div class="house-cloud cloud-two"></div><div class="house-sun"></div><div class="house-ground"></div><div class="house-building"><div class="house-roof"></div><div class="house-window"></div><div class="house-window second"></div></div>';
      const door = button('Knock, knock! 👋', 'house-door', () => {
        if (welcomed) return; welcomed = true; door.disabled = true; door.classList.add('open');
        const host = img(v.friend); host.className = 'house-host'; stage.append(host);
        wrap.querySelector('.visit-copy').textContent = v.hello;
        say(v.hello);
        const next = button('Come inside →', 'primary-action', activity); wrap.append(next); next.focus({ preventScroll: true });
      });
      stage.append(door); wrap.append(stage); say('Knock on the door to say hello!');
    }
    function activity() {
      const v = visits[visit], wrap = frame('A little help for ' + v.name, v.prompt);
      const host = img(v.friend); host.className = 'visit-host'; wrap.append(host);
      const progress = el('p', 'visit-progress', '0 of 3'); progress.setAttribute('role', 'status'); wrap.append(progress);
      const area = el('div', 'visit-activity'); wrap.append(area);
      const repeat = button('↻ Listen again', 'quiet-action', () => say(v.prompt)); wrap.append(repeat); say(v.prompt);
      function advance(target) {
        target.disabled = true; target.classList.add('collected'); steps++; progress.textContent = steps + ' of 3'; say(String(steps));
        if (steps === 3) {
          stamps.push(visit); reward(); repeat.remove();
          progress.textContent = '✓ A friendship stamp for you!'; wrap.querySelector('.visit-copy').textContent = v.thanks; say(v.thanks);
          const next = button(visit < 2 ? 'Next home →' : 'Our friendship picnic →', 'primary-action', () => { visit++; if (visit < 3) showHome(); else finale(); }); wrap.append(next); next.focus({ preventScroll: true });
        }
      }
      if (v.task === 'carrots') {
        area.classList.add('carrot-patch');
        for (let i = 0; i < 3; i++) { const b = button('', 'garden-pick', () => advance(b)); b.setAttribute('aria-label', 'Pick carrot ' + (i + 1)); b.append(img(v.art)); area.append(b); }
      } else if (v.task === 'shapes') {
        const names = ['Circle', 'Square', 'Triangle'];
        const target = el('p', 'shape-request', 'Find the circle ●'); target.setAttribute('role', 'status'); area.before(target);
        ['Triangle', 'Circle', 'Square'].forEach(name => {
          const b = button('', 'shape-choice', () => {
            if (name !== names[steps]) { target.textContent = 'Look for the ' + names[steps].toLowerCase() + ' ' + ['●', '■', '▲'][steps]; say('Look again!'); return; }
            advance(b); if (steps < 3) { target.textContent = 'Find the ' + names[steps].toLowerCase() + ' ' + ['●', '■', '▲'][steps]; say(names[steps]); } else target.textContent = 'A lovely window!';
          }); b.setAttribute('aria-label', name); b.append(el('span', 'shape-art', { Circle: '●', Square: '■', Triangle: '▲' }[name]), el('span', '', name)); area.append(b);
        });
      } else {
        area.classList.add('picnic-table');
        visits.forEach(friend => { const b = button('', 'friend-place', () => { b.append(img(v.art)); advance(b); }); b.setAttribute('aria-label', 'Give an apple to ' + friend.name); b.append(img(friend.friend), el('span', '', friend.name)); area.append(b); });
      }
    }
    function finale() {
      const wrap = frame('Different homes. Happy hearts.', 'All our homes are different. All our friends are welcome!');
      const scene = img('neighbourhood.svg'); scene.className = 'neighbour-scene'; wrap.append(scene);
      wrap.append(el('p', 'visit-progress', '✓ 3 friendship stamps collected'));
      const actions = el('div', 'visit-actions'); actions.append(button('Visit again ↻', 'primary-action', () => { stamps = []; visit = 0; intro(); }), button('Back to the playroom', 'quiet-action', home)); wrap.append(actions);
      say('All our homes are different. All our friends are welcome!');
    }
    intro();
  };
})();
