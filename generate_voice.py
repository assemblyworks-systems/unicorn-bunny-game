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

# Chinese voice for the 拔萝卜 (Pull the Radish) arcade game.
# zh-CN-XiaoxiaoNeural = warm, clear Mandarin woman (zh-CN-XiaoyiNeural is younger/lighter).
ZH_VOICE = "zh-CN-XiaoxiaoNeural"
ZH_RATE  = "-6%"
ZH_PITCH = "+6Hz"

import os, re, asyncio, sys

def slug(t):
    return re.sub(r'[^a-z0-9]+', '_', t.lower()).strip('_')

UPPER = [chr(c) for c in range(65, 91)]
NUMS  = [str(i) for i in range(1, 21)]
WORDS = {'A':'apple','B':'banana','C':'cat','D':'dog','E':'elephant','F':'fish',
 'G':'grapes','H':'hat','I':'ice cream','J':'juice','K':'kite','L':'lion','M':'moon',
 'N':'nose','O':'orange','P':'pig','Q':'queen','R':'rainbow','S':'sun','T':'turtle',
 'U':'umbrella','V':'violin','W':'watermelon','X':'fox','Y':'yo-yo','Z':'zebra'}
# letter sounds (phonics) — phoneme spellings human-auditioned against the Jenny voice
# (Jon, 2026-07); must stay identical to SOUND in learn.html.
SOUND = {'A':'aah','B':'bh','C':'cuh','D':'dh','E':'eh','F':'fff','G':'gh','H':'hh',
 'I':'eye','J':'jh','K':'kuh','L':'lll','M':'mm','N':'nn','O':'o','P':'ph','Q':'kw',
 'R':'rrr','S':'ss','T':'th','U':'uhh','V':'vv','W':'wuh','X':'ex','Y':'yuh','Z':'zzz'}
SHP = ['circle','square','triangle','star','heart','diamond']
COL = ['red','orange','yellow','green','blue','purple']
DOTS = ['a triangle','a square','a diamond','a house','a boat','a fish','a star','a dinosaur']
NAMES = ['Avalynn','Raynice','Sophia']   # arcade voice lines are generated for every allowed profile
PRAISE = ['Yay!','Great job!','Wonderful!','You did it!','Amazing!','Hooray!','Super!',
          'Well done!','Brilliant!','Awesome!']
TRYAGAIN = ['Try again!','Almost!','You can do it!','Keep trying!','So close!']

phrases = []
def add(t): phrases.append(t)

# ===== Learning app (learn.html) =====
for L in UPPER: add('Can you find the letter '+L+'?')
for n in NUMS:  add('Can you find the number '+n+'?')
for L in UPPER:
    add(L+' says '+SOUND[L]+'! Which picture starts with '+L+'?')   # A is for… prompt
    add(L+' says '+SOUND[L]+'! '+L+' is for '+WORDS[L]+'!')          # A is for… praise + Trace It finish
add('How many? Count them and tap the number.')
for n in NUMS: add('Yes! '+n+'!')
for L in UPPER: add("Let's trace the letter "+L+"!")
for n in NUMS:  add("Let's trace the number "+n+"!")
for n in NUMS:  add('You traced '+n+'!')
add("Let's trace your name!"); add('You traced your name!')   # My Name mode (name is shown, never spoken)
# Books — must mirror BOOKS in learn.html (titles + every page sentence)
add('Pick a book!')
BOOK_LINES = ["Hop's Carrot",'This is Hop the bunny.','Hop is very hungry.','Hop finds a big carrot.',
 'Munch, munch, munch!','Happy Hop! The end.',
 'The Dino Egg','Look! A dino egg.','Crack, crack, crack!','A baby dino!','The baby dino says roar!',
 'Good night, little dino. The end.',
 'The Little Star','It is night time.','A little star twinkles.','The star falls down!',
 'Boxy catches the star.','Hooray! The end.']
for s in BOOK_LINES: add(s)
add('Match the number to the dots!'); add('Match the big and little letters!')
add('Connect the dots! Start at number one.')
for d in DOTS: add('Connect the dots to make '+d+'! Start at number one.')
for i in range(1, 11): add(str(i))
for d in DOTS: add('Yay! You made '+d+'!')
add('Drag each one to the matching color box!')
add('Put the letters and numbers in the right box!')
# tap-to-count in Count It + Feed Bunny carrot counting — numbers 11-20 (1-10 made above for dot-to-dot)
for i in range(11, 21): add(str(i))
# Find It teaching feedback when a wrong letter/number is tapped
for L in UPPER: add('That is the letter '+L)
for n in NUMS:  add('That is the number '+n)
for s in SHP: add('Find the '+s+'!')
for c in COL: add('Find the '+c+' one!')
for s in SHP: add('Yes! '+s+'!')
for c in COL: add('Yes! '+c+'!')
for p in PRAISE + TRYAGAIN: add(p)

# ===== Arcade games (index.html) =====
# Name-bearing lines: one clip per allowed profile name (index.html speaks profile.first).
for nm in NAMES:
    add('Tap all the ones that are the same, '+nm+'!')
    add('Pop the balloons, '+nm+'!')
    add('Feed the carrots to the bunny, '+nm+'!')
    add('Catch the stars! Do not tap the rocks, '+nm+'!')
    add('Hatch the dino eggs, '+nm+'!')
    add('Dig up the dinosaur, '+nm+'!')
    add('Draw a picture, '+nm+'!')
    add('Dress the princess, '+nm+'!')
    add('Thank you '+nm)
for c in ['red','orange','yellow','green','blue','purple','pink']: add(c)
# Draw mode: crayon colors (brown/black new) + stamp names
for w in ['brown','black','cat','dog','butterfly','bunny','dinosaur','star']: add(w)
# Princess dress-up: crowns + accessories + twirl praise
for w in ['crown','tiara','flower crown','wand','bow','necklace','Beautiful!']: add(w)
for ch in ['Yay!','Wow!','Yippee!','Hooray!','Magic!','So pretty!','Amazing!']: add(ch)
for m in ['Not that one','Try again','Look again']: add(m)
for f in ['Yum yum','Nom nom nom','Crunchy','Delicious']: add(f)
add('Oops')
add('Roar')
add('You found a dinosaur')
# Pop Balloons color challenge
for c in ['red','orange','yellow','green','blue','purple','pink']: add('Can you pop the '+c+' balloon?')
add('Yes! pink!')   # 'Yes! <color>!' for the other six colors already exists above
# Dino species names — must mirror dinoName() in index.html (DINOS array + DINO_NAMES overrides)
DINO_SPOKEN = ['T rex','triceratops','stegosaurus','brontosaurus','pterodactyl','velociraptor',
               'ankylosaurus','parasaurolophus','spinosaurus','baby dino']
for d in DINO_SPOKEN:
    a = 'An ' if d[0].lower() in 'aeiou' else 'A '
    add(a+d+'!')                      # Dino Eggs hatch line
    add('You found '+a.lower()+d+'!') # Dino Dig reveal line
add('You found a fossil!')

# ===== Tardigrades (arcade story game, index.html) =====
for nm in NAMES: add('Help the three little tardigrades, '+nm+'!')
for who, intro, winl in [
    ('Gavin', 'Gavin lives in a hot volcano.',  'Too hot for the spider!'),
    ('Colin', 'Colin lives in a cold ice cave.','Too cold for the spider!'),
    ('Doug',  'Doug lives on the moon.',        'Too floaty for the spider!')]:
    add(intro)
    add('Here comes the big hairy wolf spider! Tap '+who+'!')
    add(winl)
add('The spider is just lonely. Tap the spider to be his friend!')
add('Hooray! Friends! Tardigrades can live anywhere!')
# The Three Little Tardigrades book (learn.html BOOKS — original retelling, mirror exactly)
TARDI_BOOK = ['The Three Little Tardigrades',
 'Three little tardigrades went to find new homes.',
 'Gavin picked a hot volcano.','Colin picked a cold ice cave.','Doug picked the moon.',
 'Along came the big hairy wolf spider!',
 'Gavin curled into a ball. Too hot for the spider!',
 'Colin curled into a ball. Too cold for the spider!',
 'Doug curled into a ball. Too floaty for the spider!',
 'The spider was not scary. He was just lonely.',
 'They all became friends. The end.']
for s in TARDI_BOOK: add(s)

# ===== Candy House (arcade Hansel & Gretel story game, index.html) =====
for nm in NAMES: add('Follow the candy trail, '+nm+'!')
add('You found the candy house!')
add('Nibble the candy house!')
add('Who is nibbling my house?')
add('The candy witch is kind. Tap her to share!')
add('Hooray! Cookies for everyone!')
# Hansel and Gretel book (learn.html BOOKS — gentle retelling, mirror exactly)
HG_BOOK = ['Hansel and Gretel',
 'Hansel and Gretel went walking in the big forest.',
 'They dropped shiny pebbles to find the way home.',
 'They found a house made of candy!',
 'Nibble, nibble! Yum yum yum!',
 'Out came the candy witch. Who is nibbling my house?',
 'We are sorry! We were so hungry.',
 'The kind witch smiled. Let us share!',
 'They ate cookies and cocoa together.',
 'The shiny pebbles showed the way home.',
 'Home sweet home. The end.']
for s in HG_BOOK: add(s)

# ===== Little Red Riding Hood (arcade story game, index.html) =====
for nm in NAMES: add('Help Little Red Riding Hood, '+nm+'!')
add('Pack the basket for Grandma!')
add('The basket is full!')
add("Follow the path to Grandma's house!")
add("You made it to Grandma's house!")
add('A hungry wolf! He looks sad.')
add('Share your bread with the wolf. Tap him!')
add('You shared! Now everyone is friends!')

# ===== 拔萝卜 Pull the Radish (arcade story game, index.html) — Chinese (Xiaoxiao) =====
# These clips are keyed explicitly (Chinese text can't be slugified) and spoken with ZH_VOICE.
# The JS plays them via sayKey('<key>'). R_ADD / R_SUB MUST match the pools in index.html.
zh_clips = {}
def addzh(key, text): zh_clips[key] = text
ZNUM = ['一','二','三','四','五','六','七','八','九','十']
for i, w in enumerate(ZNUM, 1): addzh('zh_'+str(i), w)   # running count 1-10
addzh('zh_intro',   '我们一起来拔萝卜！')
addzh('zh_win',     '耶！拔出来啦！')
addzh('zh_fewer',   '还不够，再加人！')
addzh('zh_toomany', '太多啦，哈哈！再试一次！')
addzh('zh_hint',    '数一数，等于几？')
R_ADD = [(1,1),(2,1),(1,2),(2,2),(3,1),(1,3),(3,2),(2,3),(4,1),(1,4),(4,2),(3,3),(5,1)]
R_SUB = [(3,1),(4,1),(4,2),(5,1),(5,2),(5,3),(6,2),(6,1),(6,3)]
for a, b in R_ADD: addzh('zh_eq_'+str(a)+'_plus_'+str(b),  ZNUM[a-1]+'加'+ZNUM[b-1]+'，等于几？')
for a, b in R_SUB: addzh('zh_eq_'+str(a)+'_minus_'+str(b), ZNUM[a-1]+'减'+ZNUM[b-1]+'，等于几？')

# Build the work list: English phrases (slugified, VOICE) + Chinese clips (explicit key, ZH_VOICE).
byslug = {}   # slug/key -> (text, voice, rate, pitch)
for t in phrases:
    s = slug(t)
    if s and s not in byslug:
        byslug[s] = (t, VOICE, RATE, PITCH)
for k, t in zh_clips.items():
    byslug[k] = (t, ZH_VOICE, ZH_RATE, ZH_PITCH)

print("Distinct clips:", len(byslug))

if os.environ.get("DRYRUN") == "1":
    for s in sorted(byslug): print(s, "  <-  ", byslug[s][0])
    sys.exit(0)

try:
    import edge_tts
except ImportError:
    print("\nPlease run:  pip install edge-tts\nthen run this script again.")
    sys.exit(1)

os.makedirs("voice", exist_ok=True)

async def one(s, text, voice, rate, pitch):
    path = os.path.join("voice", s + ".mp3")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return True
    last = None
    for attempt in range(5):
        try:
            c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
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
    for i, (s, (text, voice, rate, pitch)) in enumerate(items, 1):
        if await one(s, text, voice, rate, pitch):
            ok += 1
        await asyncio.sleep(0.4)
        if i % 20 == 0:
            print("  ...", i, "/", len(items), "(", ok, "made/skipped )")
    made = len([f for f in os.listdir("voice") if f.endswith(".mp3")])
    print("Done. Clips in 'voice' folder:", made, "of", len(items))
    if made < len(items):
        print(">>> Some are still missing - just run the script again to finish them.")

asyncio.run(main())
