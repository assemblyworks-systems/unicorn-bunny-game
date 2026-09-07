/* Shared device preferences, activity lifetime and HTML5 audio. No accounts or telemetry. */
(function () {
  'use strict';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const defaults = { sound: true, calm: false, reminder: 0 };
  const saved = read('playbox_settings_v2', {});
  const settings = { sound:typeof saved?.sound==='boolean'?saved.sound:defaults.sound, calm:typeof saved?.calm==='boolean'?saved.calm:defaults.calm, reminder:[0,10,20,30].includes(saved?.reminder)?saved.reminder:0 };
  const reducedMotion = () => settings.calm || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let lifetime = 0;
  const timers = new Set(), intervals = new Set();
  const session = {
    timeout(fn, ms) { const generation = lifetime; const id = setTimeout(() => { timers.delete(id); if (generation === lifetime) fn(); }, ms); timers.add(id); return id; },
    interval(fn, ms) { const id = setInterval(fn, ms); intervals.add(id); return id; },
    clear() { lifetime++; timers.forEach(clearTimeout); intervals.forEach(clearInterval); timers.clear(); intervals.clear(); audio.stop(); document.querySelectorAll?.(".confetti,.cheer,.spark,.flyStick,.burst-star").forEach(el=>el.remove()); },
    get generation() { return lifetime; }
  };
  const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  let voice, safety, completion, audioRun = 0;
  const audio = {
    stop() { audioRun++; clearTimeout(safety); completion = null; if (voice) { voice.pause(); voice.onended = voice.onerror = null; } if ('speechSynthesis' in window) speechSynthesis.cancel(); },
    play(text, onDone, explicitKey) {
      // A repeat or another spoken choice must not leave a correct-answer round locked.
      const previous = completion; if (previous) previous(); audio.stop();
      if (!settings.sound) { if (onDone) onDone(); return; }
      const generation = lifetime, run = audioRun;
      let finished = false;
      const finish = () => { if (finished || run !== audioRun || generation !== lifetime) return; finished = true; clearTimeout(safety); completion = null; if (onDone) onDone(); };
      completion = finish;
      voice ||= new Audio();
      voice.onended = finish;
      voice.onerror = finish;
      voice.src = 'voice/' + (explicitKey || slug(text)) + '.mp3';
      voice.volume = 1;
      const promise = voice.play(); if (promise?.catch) promise.catch(finish);
      safety = setTimeout(finish, 10000);
    }
  };
  function applySettings() {
    document.documentElement.classList.toggle('calm', !!settings.calm);
    const button = document.getElementById('soundBtn');
    if (button) { button.textContent = settings.sound ? '🔊' : '🔇'; button.setAttribute('aria-label', settings.sound ? 'Mute sound' : 'Turn sound on'); button.setAttribute('aria-pressed', String(!settings.sound)); }
  }
  function setSettings(next) { Object.assign(settings, next); write('playbox_settings_v2', settings); applySettings(); if (!settings.sound) { const pending = completion; if (pending) pending(); audio.stop(); } window.dispatchEvent(new CustomEvent('playbox-settings')); }
  function profile(input) {
    const full = String(input || '').trim().replace(/\s+/g, ' ');
    if (!/^[A-Za-z][A-Za-z '-]{0,23}$/.test(full)) return null;
    const first = full.split(/[ '-]/)[0];
    return { full, first: first[0].toUpperCase() + first.slice(1).toLowerCase() };
  }
  // Use existing personalised clips for original players; generic clips for all others.
  function arcadePhrase(text, name) { return ['Avalynn', 'Raynice', 'Sophia'].includes(name) ? text : text.replace(new RegExp(', ' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([!.?]?)$'), '$1'); }
  window.Playbox = { read, write, settings, reducedMotion, setSettings, applySettings, profile, session, audio, slug, arcadePhrase };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { const pending = completion; if (pending) pending(); audio.stop(); } });
  window.addEventListener('pagehide', () => session.clear());
})();
