# 🏈 oBEATS Sports Stream Cleanup

> **Declutter sports streaming sites into a clean, zero-lag, full-width cinema theatre mode.**  
> Banish annoying popups, kill CPU-hogging chat spam, and enjoy smooth high-bitrate live sports.

[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-Install%20Userscript-red?style=for-the-badge&logo=tampermonkey)](https://greasyfork.org/en/scripts/604416-obeats-sports-stream-cleanup)
[![Twitter Follow](https://img.shields.io/badge/Twitter-@officebeats-1DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://x.com/officebeats)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

👉 **[Click Here to Install Directly on Greasy Fork](https://greasyfork.org/en/scripts/604416-obeats-sports-stream-cleanup)**  
*(Works with Violentmonkey, Tampermonkey, or any userscript extension on Chrome, Brave, Firefox, Edge)*

---

## 🥽 The Backstory: Watching Sports in VR on a Budget

I love watching live sports on a massive virtual cinema screen inside my VR headset using **PCVR via Virtual Desktop**. There's nothing quite like sitting in a virtual luxury home theatre or floating stadium suite with a 120-inch screen right in front of your eyes.

However, doing this without spending hundreds of dollars a month on multiple premium sports cable and streaming packages means relying on free sports streaming mirrors. Anyone who has used these sites knows the pain:
- **Relentless Popups & Click-Traps**: You try to click play or unmute, and three new tabs for shady gambling sites open.
- **CPU & GPU Hogging Chatrooms**: Massive live chatrooms spamming thousands of animated emoticons, badges, and WebSocket packets per second. In standard desktop browsing it's annoying—but inside **Virtual Desktop in VR**, thread contention causes frame drops, micro-stutters, and visual jitter that completely ruins immersion.
- **Cut-Off Video Players**: 16:9 streams that stretch wider than the screen, pushing player controls and scoreboard banners below the fold so you're forced to constantly scroll around in VR.

I solo vibe-coded **oBEATS Sports Stream Cleanup** to permanently kill the bloat. It strips away the clutter, terminates background chat WebSockets, neutralizes popups before they spawn, and maximizes the video into a pristine, above-the-fold theatre mode canvas. Now, watching NFL RedZone, Formula 1, Premier League, and NBA games in PCVR is smooth, stutter-free, and 100% budget-friendly.

---

## 🚀 Key Features

### 🚫 1. Anti-Popup & Fake Click-Trap Neutralizer
- **No More Spam Tabs**: Automatically intercepts and blocks sneaky `window.open` calls from intrusive ad networks (AdCash, PopAds, PropellerAds, AdsBoosters, etc.).
- **Anti-Clickjacking**: Deletes transparent full-screen overlay click-traps and blocks deceptive programmatic link clicks inside video embeds.
- **HTML Blob Blocker**: Neutralizes hidden in-memory HTML blob popunders (`blob:...`) before they can redirect your browser.

### ⚡ 2. Smooth Playback with Zero Stutter or Freezing
- **Kills Chat WebSockets**: Blocks connections to live chat sockets (`wss://ws.television.st/chat`, Chatango, etc.) right at `document-start`. This frees up 100% of your CPU cores and RAM for pure video decoding.
- **Zero-Overhead CSS**: Removes chat and ads using clean, declarative CSS rules rather than heavy `MutationObserver` layout-thrashing loops.
- **Native Live Sync**: Lets the player stream adapt naturally without artificial buffer over-allocation, eliminating the dreaded 1–2 minute feed freeze and restart.

### 🎬 3. Responsive Above-the-Fold Theatre Mode
- Automatically expands the video player to full screen width.
- Dynamically constrains video height (`calc(100dvh - top_offset)`) so 100% of the 16:9 stream canvas, scoreboard, and playback controls stay comfortably **above the fold** without vertical scrolling.
- Sleek dark cinema backdrop.

---

## 🌐 Supported Streaming Sites & Mirrors

| Network | Supported Domains |
| :--- | :--- |
| **PPV Network** | `ppv.st`, `ppv.tj`, `ppvs.pk`, `ppv.rw`, `ppv.ms`, `ppv.bi`, `ppv.ug` |
| **StreamFree Network** | `strmfree.pk`, `streamfree.top`, `strmfree.st`, `strmfree.link` |
| **TimStreams Network** | `tim-streams.com`, `timst.cfd` |
| **Stream Embed Hosts** | `taifood-blog.asia`, `ehgembxe.cfd` |

---

## 📦 How to Install

1. Install a userscript manager extension in your browser:
   - [Violentmonkey](https://violentmonkey.github.io/) *(Recommended)*
   - [Tampermonkey](https://www.tampermonkey.net/)
2. Open the script page on Greasy Fork:
   - **[oBEATS sports stream cleanup on Greasy Fork](https://greasyfork.org/en/scripts/604416-obeats-sports-stream-cleanup)**
3. Click the green **Install this script** button.
4. Navigate to any supported sports stream and enjoy clean, full-width theatre mode!

---

## 📣 Community & Social

Follow my work, check out my solo vibe-code builds, and join the conversation:

- 🐦 **Twitter / X**: [@officebeats](https://x.com/officebeats)
- 🧵 **Featured Post**: Check out the [launch post on X](https://x.com/officebeats/status/2119540055832215843)
- 🐙 **GitHub**: [github.com/officebeats](https://github.com/officebeats)

If you find this useful, consider dropping a star on the repo and sharing it with fellow sports fans and VR enthusiasts! ⭐

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
