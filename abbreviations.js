// Presentation-only definitions from UX_ABBREV_01. Do not change the Medical strings.
document.addEventListener("DOMContentLoaded", () => {
  const expansions = {
    en: {
      ESUR: "European Society of Urogenital Radiology",
      CMSC: "Contrast Media Safety Committee",
      IHR: "immediate hypersensitivity reaction",
      NIHR: "non-immediate hypersensitivity reaction",
      ICM: "iodine-based contrast medium",
      GBCA: "gadolinium-based contrast agent",
      eGFR: "estimated glomerular filtration rate",
      SCAR: "severe cutaneous adverse reaction",
      NSF: "nephrogenic systemic fibrosis",
      HSG: "hysterosalpingography",
      EAACI: "European Association of Allergy & Clinical Immunology",
      ACR: "American College of Radiology",
      CPR: "cardiopulmonary resuscitation",
      PAD: "peripheral arterial disease",
      EVAR: "endovascular aneurysm repair"
    },
    de: {
      ESUR: "European Society of Urogenital Radiology",
      CMSC: "Contrast Media Safety Committee",
      IHR: "unmittelbare Hypersensitivitätsreaktion",
      NIHR: "nicht unmittelbare Hypersensitivitätsreaktion",
      ICM: "iodhaltiges Kontrastmittel",
      GBCA: "gadoliniumbasiertes Kontrastmittel",
      eGFR: "errechnete glomeruläre Filtrationsrate",
      SCAR: "schwere kutane unerwünschte Reaktion",
      NSF: "nephrogene systemische Fibrose",
      HSG: "Hysterosalpingographie",
      EAACI: "European Association of Allergy & Clinical Immunology",
      ACR: "American College of Radiology",
      CPR: "kardiopulmonale Reanimation",
      PAD: "peripheral arterial disease",
      EVAR: "endovascular aneurysm repair"
    }
  };

  const roots = [document.getElementById("view-hsr"), document.getElementById("view-changes")].filter(Boolean);
  const keys = Object.keys(expansions.en);
  const pattern = new RegExp(keys.join("|"), "g");
  const tooltip = document.createElement("div");
  tooltip.id = "abbr-tooltip";
  tooltip.className = "abbr-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  document.body.appendChild(tooltip);

  let active = null;
  let pinned = false;
  let scheduled = false;

  function language() {
    return document.documentElement.lang === "de" ? "de" : "en";
  }

  function visible(element) {
    if (!element.isConnected || !element.getClientRects().length) return false;
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.hidden) return false;
      if (ancestor.tagName === "DETAILS" && !ancestor.open &&
          !ancestor.querySelector(":scope > summary")?.contains(element)) return false;
    }
    return true;
  }

  function eligible(node, key) {
    const parent = node.parentElement;
    if (!parent || parent.closest(".abbr-term, .change-card__refs, script, style")) return false;
    if (!visible(parent)) return false;
    // The German Acute wording already explains resuscitation in context.
    if (key === "CPR" && language() === "de") return false;
    // The NIHR module title already expands its own abbreviation.
    if (key === "NIHR" && parent.closest('[data-i18n="nihr_title"]')) return false;
    const local = parent.closest("li, p, h1, h2, h3, .card__title, .seg__btn") || parent;
    if (local.textContent.toLocaleLowerCase().includes(expansions[language()][key].toLocaleLowerCase())) return false;
    return true;
  }

  function annotate(node) {
    const value = node.nodeValue;
    pattern.lastIndex = 0;
    let match;
    let cursor = 0;
    const parts = [];
    while ((match = pattern.exec(value))) {
      const before = value[match.index - 1] || "";
      const after = value[pattern.lastIndex] || "";
      if ((before && /[\p{L}\p{N}]/u.test(before)) ||
          (after && /[\p{L}\p{N}]/u.test(after)) || !eligible(node, match[0])) continue;
      parts.push(document.createTextNode(value.slice(cursor, match.index)));
      const term = document.createElement("span");
      term.className = "abbr-term";
      term.setAttribute("role", "button");
      term.tabIndex = 0;
      term.dataset.abbr = match[0];
      term.setAttribute("aria-label", `${match[0]}: ${expansions[language()][match[0]]}`);
      term.setAttribute("aria-expanded", "false");
      term.textContent = match[0];
      parts.push(term);
      cursor = pattern.lastIndex;
    }
    if (!parts.length) return;
    parts.push(document.createTextNode(value.slice(cursor)));
    node.replaceWith(...parts);
  }

  function close() {
    if (active) {
      active.setAttribute("aria-expanded", "false");
      active.removeAttribute("aria-describedby");
    }
    active = null;
    pinned = false;
    tooltip.hidden = true;
  }

  function place() {
    if (!active || !visible(active)) return close();
    const box = active.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    tooltip.style.left = `${Math.max(10, Math.min(window.innerWidth - width - 10, box.left + box.width / 2 - width / 2))}px`;
    tooltip.style.top = `${box.top >= height + 12 ? box.top - height - 7 : Math.min(window.innerHeight - height - 10, box.bottom + 7)}px`;
  }

  function open(term, lock = false) {
    if (active !== term) close();
    active = term;
    pinned = lock || pinned;
    tooltip.textContent = expansions[language()][term.dataset.abbr];
    tooltip.hidden = false;
    term.setAttribute("aria-expanded", "true");
    term.setAttribute("aria-describedby", tooltip.id);
    place();
  }

  function annotateVisible() {
    scheduled = false;
    if (active && (!visible(active) ||
        active.getAttribute("aria-label") !== `${active.dataset.abbr}: ${expansions[language()][active.dataset.abbr]}`)) close();
    for (const root of roots) {
      if (!visible(root)) continue;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(annotate);
    }
    if (active) place();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(annotateVisible);
  }

  for (const root of roots) {
    new MutationObserver(schedule).observe(root, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ["hidden", "open"]
    });
  }
  document.addEventListener("click", event => {
    const term = event.target.closest?.(".abbr-term");
    if (term) {
      event.preventDefault();
      event.stopPropagation();
      if (active === term && pinned) close();
      else open(term, true);
    } else if (!tooltip.contains(event.target)) close();
  }, true);
  document.addEventListener("mouseover", event => {
    const term = event.target.closest?.(".abbr-term");
    if (term && !pinned) open(term);
  });
  document.addEventListener("mouseout", event => {
    if (active && !pinned && event.target === active && !active.contains(event.relatedTarget)) close();
  });
  document.addEventListener("focusin", event => {
    if (event.target.matches?.(".abbr-term")) open(event.target);
  });
  document.addEventListener("focusout", event => {
    if (event.target === active && !pinned) close();
  });
  document.addEventListener("keydown", event => {
    if (event.target.matches?.(".abbr-term") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopPropagation();
      if (active === event.target && pinned) close();
      else open(event.target, true);
    } else if (event.key === "Escape" && active) {
      event.preventDefault();
      close();
    }
  }, true);
  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, true);
  schedule();
});
