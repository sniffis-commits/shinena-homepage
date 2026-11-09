/* Shinena homepage wiring: config links, store badges, contact stub, HE/EN. */
(function () {
  "use strict";
  var cfg = window.SHINENA_HOME || {};

  function $(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  // ---- Outbound links from config ----
  $("[data-app-link]").forEach(function (a) {
    if (cfg.APP_URL) a.href = cfg.APP_URL;
  });
  var donate = document.querySelector("[data-donate-link]");
  if (donate) {
    if (cfg.DONATE_URL && cfg.DONATE_URL !== "#") donate.href = cfg.DONATE_URL;
    else donate.setAttribute("aria-disabled", "true");
  }

  // ---- Store badges: real URL or "soon" state ----
  function storeState(name, url) {
    var btn = document.querySelector('[data-store="' + name + '"]');
    if (!btn) return;
    if (url && url !== "#") {
      btn.href = url;
    } else {
      btn.href = "#get";
      btn.classList.add("soon");
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        toast(currentLang === "he" ? "בקרוב בחנות — עקבו אחרינו!" : "Coming soon to the store!");
      });
    }
  }
  // TODO(store): direct APK link can go live anytime via ANDROID_APK_URL.
  storeState("android-apk", cfg.ANDROID_APK_URL);
  storeState("play", cfg.PLAY_STORE_URL);
  storeState("ios", cfg.APP_STORE_URL);

  // ---- Contact form: backend later, mailto for now ----
  var form = document.getElementById("contactForm");
  var note = document.getElementById("contactNote");
  if (form) {
    if (cfg.CONTACT_ACTION && cfg.CONTACT_ACTION !== "#") {
      form.action = cfg.CONTACT_ACTION;
    } else {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var data = new FormData(form);
        var subject = encodeURIComponent("Shinena contact: " + (data.get("name") || ""));
        var body = encodeURIComponent((data.get("message") || "") + "\n\n— " + (data.get("email") || ""));
        window.location.href = "mailto:" + (cfg.CONTACT_EMAIL || "") + "?subject=" + subject + "&body=" + body;
        if (note) note.textContent = currentLang === "he" ? "נפתחה תוכנת המייל — שלחו את ההודעה משם." : "Mail app opened — send from there.";
      });
    }
  }

  // ---- Toast ----
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1c1917;color:#fff;padding:10px 18px;border-radius:12px;font-weight:700;z-index:99";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.display = "block";
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.style.display = "none"; }, 2500);
  }

  // ---- HE/EN toggle (minimal dictionary; Hebrew is default) ----
  var currentLang = document.documentElement.lang || "he";
  var STR = {
    en: {
      brand: "🦁 Shinena", navFeatures: "Features", navHow: "How it works", navGet: "Get the app",
      navDonate: "Donate", navContact: "Contact", navPrivacy: "Privacy", playNow: "Play now ▶",
      kicker: "Gamified Torah memorization", heroTitle: "Shinena — memorize like a game",
      heroSub: "Mishna, Tanakh, Gemara, Rambam and Shulchan Arukh — recite to the mic, get instant scores, earn XP and streaks, and review right on time with SM-2.",
      playNow2: "Start memorizing — free ▶", getApp: "Get for Android / iPhone",
      tick1: "✓ Hebrew voice recognition, with niqqud", tick2: "✓ All of Shas, Tanakh and Mishna — browser or app",
      tick3: "✓ Badges, leaderboards and an adventure world map",
      featuresTitle: "What's inside", f1t: "Recitation Arena", f1d: "Recite aloud to the mic — verbatim live accuracy, combos and XP.",
      f2t: "World map", f2d: "Every mishna and verse is a stage — conquer Mishna, Tanakh, Nehardea trails.",
      f3t: "Smart SM-2 reviews", f3d: "Each passage returns exactly when you're about to forget it. For years.",
      f4t: "Badges & ranks", f4d: "Streaks, badges, global / country / subject / book leaderboards.",
      f5t: "Parashot, dafim, halakhot", f5d: "Torah by parasha, Gemara by daf, Rambam and Shu'a — all sourced, all free.",
      f6t: "14 themes", f6d: "From forest quest to arcade — every player styles their arena.",
      howTitle: "How it works — 3 steps",
      s1t: "1. Pick a passage", s1d: "Tractate, chapter and mishna — or parasha, daf and halakha.",
      s2t: "2. Train & recite", s2d: "Graded hints, then a full recitation to the mic.",
      s3t: "3. Advance & review", s3d: "Score, XP, stars — and automatic review before forgetting.",
      getTitle: "Download & play", getSub: "The browser app is already fully playable. Store versions on the way.",
      apkT: "Android (direct beta)", apkD: "Manual APK install file", soon: "Soon",
      donateTitle: "Love it? Help Shinena grow 💛", donateSub: "Shinena is free and stays free. Your gift funds servers, recordings and new texts.",
      donateBtn: "Secure donation 💛", contactTitle: "Contact",
      cName: "Name", cEmail: "Email", cMsg: "Message", cSend: "Send ✉️",
      rights: "© Shinena — joyful Torah learning", openApp: "Open the app",
      navDonate2: "Donate", navContact2: "Contact", navPrivacy2: "Privacy"
    }
  };
  var btn = document.getElementById("langToggle");
  function applyLang(l) {
    currentLang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === "he" ? "rtl" : "ltr";
    if (btn) btn.textContent = l === "he" ? "EN" : "עב";
    if (l === "en") {
      $("[data-i18n]").forEach(function (el) {
        var k = el.getAttribute("data-i18n");
        if (STR.en[k]) el.textContent = STR.en[k];
      });
      // Swap privacy link target for English store listing
      var priv = document.querySelector('[data-i18n="navPrivacy"]');
      if (priv && priv.getAttribute("data-i18n-href")) priv.href = priv.getAttribute("data-i18n-href");
      var priv2 = document.querySelector('[data-i18n="navPrivacy2"]');
      if (priv2 && priv2.getAttribute("data-i18n-href")) priv2.href = priv2.getAttribute("data-i18n-href");
    } else {
      location.reload();
    }
  }
  if (btn) btn.addEventListener("click", function () {
    applyLang(currentLang === "he" ? "en" : "he");
  });
})();
