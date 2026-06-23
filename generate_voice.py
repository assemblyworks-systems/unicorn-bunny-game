#!/usr/bin/env python3
# Generates the spoken voice clips for Avalynn's app (learning app + arcade games).
# Run on a computer with normal internet:
#     pip install edge-tts
#     python generate_voice.py
# It creates/fills a "voice" folder of .mp3 clips next to this script.
# Run it from inside C:\Repo\unicorn-bunny-game so the clips land in the repo's voice/ folder.
# It skips clips that already exist, so re-running only makes the new/missing ones.
#
# Voice options (edit VOICE):
#   en-US-JennyNeural  (warm, clear woman - default)
#   en-US-AnaNeural    (cheerful child voice)
#   en-US-AriaNeural   (friendly woman)
#   en-GB-SoniaNeural  (British woman)

VOICE = "en-US-JennyNeural"
RATE  = "-8%"
PITCH = "+8Hz"

import os, re, asyncio, sys

def slug(t):
    return re.sub(r'[^a-z0-9]+', '_', t.lower()).strip('_')

UPPER = [chr(c) for c in range(65, 91)]
NUMS  = [str(i) for i in range(1, 21)]
WORDS = {'A':'apple','B':'banana','C':'cat','D':'dog','E':'elephant','F':'fish',
 'G':'grapes','H':'hat','I':'ice cream','J':'juice','K':'kite','L':'lion','M':'moon',
 'N':'nose','O':'orange','P':'pig','Q':'queen','R':'rainbow','S':'sun','T':'turtle',
 'U':'umbrella','V':'violin','W':'watermelon','X':'fox','Y':'yo-yo','Z':'zebra'}
SHP = ['circle','square','triangle','star','heart','diamond']
COL = ['red','orange','yellow','green','blue','purple']
DOTS = ['a triangle','a square','a diamond','a house','a boat','a fish','a star']
PRAISE = ['Yay!','Great job!','Wonderful!','You did it!','Amazing!','Hooray!','Super!',
          'Well done!','Brilliant!','Awesome!']
TRYAGAIN = ['Try again!','Almost!','You can do it!','Keep trying!','So close!']

phrases = []
def add(t): phrases.append(t)

# ===== Learning app (learn.html) =====
for L in UPPER: add('Can you find the letter '+L+'?')
for n in NUMS:  add('Can you find the number '+n+'?')
for L in UPPER:
    add(L+'. Which picture starts with '+L+'?')
    add(L+'. '+L+' is for '+WORDS[L]+'!')
add('How many? Count them and tap the number.')
for n in NUMS: add('Yes! '+n+'!')
for L in UPPER: add("Let's trace the letter "+L+"!")
for n in NUMS:  add("Let's trace the number "+n+"!")
for L in UPPER: add(L+'! '+L+' is for '+WORDS[L]+'!')
for n in NUMS:  add('You traced '+n+'!')
add('Match the number to the dots!'); add('Match the big and little letters!')
add('Connect the dots! Start at number one.')
for d in DOTS: add('Connect the dots to make '+d+'! Start at number one.')
for i in range(1, 11): add(str(i))
for d in DOTS: add('Yay! You made '+d+'!')
add('Drag each one to the matching color box!')
add('Put the letters and numbers in the right box!')
for s in SHP: add('Find the '+s+'!')
for c in COL: add('Find the '+c+' one!')
for s in SHP: add('Yes! '+s+'!')
for c in COL: add('Yes! '+c+'!')
for p in PRAISE + TRYAGAIN: add(p)

# ===== Arcade games (index.html) =====
add('Tap all the ones that are the same, Avalynn!')
add('Pop the balloons, Avalynn!')
add('Feed the carrots to the bunny, Avalynn!')
add('Catch the stars! Do not tap the rocks, Avalynn!')
for c in ['red','orange','yellow','green','blue','purple','pink']: add(c)
for ch in ['Yay!','Wow!','Yippee!','Hooray!','Magic!','So pretty!','Amazing!']: add(ch)
for m in ['Not that one','Try again','Look again']: add(m)
for f in ['Yum yum','Thank you Avalynn','Nom nom nom','Crunchy','Delicious']: add(f)
add('Oops')

byslug = {}
for t in phrases:
    s = slug(t)
    if s and s not in byslug:
        byslug[s] = t

print("Distinct clips:", len(byslug))

if os.environ.get("DRYRUN") == "1":
    for s in sorted(byslug): print(s, "  <-  ", byslug[s])
    sys.exit(0)

try:
    import edge_tts
except ImportError:
    print("\nPlease run:  pip install edge-tts\nthen run this script again.")
    sys.exit(1)

os.makedirs("voice", exist_ok=True)

async def one(s, text):
    path = os.path.join("voice", s + ".mp3")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return True
    last = None
    for attempt in range(5):
        try:
            c = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
            await c.save(path)
            if os.path.exists(path) and os.path.getsize(path) > 0:
                return True
        except Exception as e:
            last = e
        await asyncio.sleep(2.0 * (attempt + 1))
    print("  ! failed:", s, last)
    try:
        if os.path.exists(path) and os.path.getsize(path) == 0:
            os.remove(path)
    except Exception:
        pass
    return False

async def main():
    items = list(byslug.items())
    ok = 0
    for i, (s, text) in enumerate(items, 1):
        if await one(s, text):
            ok += 1
        await asyncio.sleep(0.4)
        if i % 20 == 0:
            print("  ...", i, "/", len(items), "(", ok, "made/skipped )")
    made = len([f for f in os.listdir("voice") if f.endswith(".mp3")])
    print("Done. Clips in 'voice' folder:", made, "of", len(items))
    if made < len(items):
        print(">>> Some are still missing - just run the script again to finish them.")

asyncio.run(main())
