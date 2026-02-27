// JS (CodePen) — includes "Known / Unknown culprit" and ESUR wording 1:1 for Unknown
(() => {
  const state = { nav:'flow', situation:'elective', severity:'modsev', culpritKnown:'known' };
  const $ = (s)=>document.querySelector(s);
  const $$ = (s)=>Array.from(document.querySelectorAll(s));

  function setNav(nav){
    state.nav = nav;
    $$('#app .view').forEach(v => v.hidden = true);
    $(`#view-${nav}`).hidden = false;
    $$('.bottomnav__btn').forEach(b => b.classList.toggle('is-active', b.dataset.nav === nav));
  }

  function setSeg(seg, value){
    state[seg]=value;
    $$(`.seg__btn[data-seg="${seg}"]`).forEach(btn=>{
      const on = btn.dataset.value===value;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on?'true':'false');
    });
    if(seg === 'situation' || seg === 'severity') renderFlow();
    if(seg === 'culpritKnown') renderSwitch();
  }

  function flowRecommendation(){
    const isElective = state.situation==='elective';
    const isModSev = state.severity==='modsev';

    if(isElective && isModSev){
      return {
        title: "Elective imaging — prior moderate/severe IHR",
        steps: [
          "Postpone examination.",
          "Await allergy evaluation results.",
          "Prefer allergist-recommended alternative.",
          "Observe ≥ 30 min with IV access."
        ]
      };
    }
    if(!isElective && isModSev){
      return {
        title: "Emergency imaging — prior moderate/severe IHR",
        steps: [
          "Ensure rapid response/resuscitation capability is available nearby.",
          "Choose a different CM (prefer different structural group).",
          "Premedication: optional only in severe HR with unknown culprit (emergency scenario).",
          "Observe ≥ 30 min with IV access."
        ]
      };
    }

    return {
      title: (isElective ? "Elective imaging — prior mild/unclear reaction" : "Emergency imaging — prior mild/unclear reaction"),
      steps: [
        "Proceed with caution and local protocol.",
        "Consider switching to a different CM.",
        isElective ? "Ensure readiness for escalation." : "Ensure rapid response capability nearby.",
        "Observe ≥ 30 min with IV access (per local protocol)."
      ]
    };
  }

  function renderFlow(){
    const out = $('#flowOutput');
    const rec = flowRecommendation();
    out.innerHTML = `
      <div style="font-weight:950;margin-bottom:6px">${rec.title}</div>
      <ul>${rec.steps.map(s=>`<li>${s}</li>`).join('')}</ul>`;
  }

  const AGENTS = {
    iohexol:{type:'ICM',group:'A',name:'Iohexol'},
    iodixanol:{type:'ICM',group:'A',name:'Iodixanol'},
    iomeprol:{type:'ICM',group:'A',name:'Iomeprol'},
    ioversol:{type:'ICM',group:'A',name:'Ioversol'},
    iopamidol:{type:'ICM',group:'B',name:'Iopamidol'},
    iopromide:{type:'ICM',group:'C',name:'Iopromide'},
    iobitridol:{type:'ICM',group:'D',name:'Iobitridol'},
    gadoterate:{type:'GBCA',group:'A',name:'Gadoterate meglumine'},
    gadobutrol:{type:'GBCA',group:'B',name:'Gadobutrol'},
    gadoteridol:{type:'GBCA',group:'B',name:'Gadoteridol'},
    gadopiclenol:{type:'GBCA',group:'C',name:'Gadopiclenol'}
  };

  // Practical ESUR-style suggestions (known culprit)
  const ALT_GROUPS = {
    ICM:{A:['B','D'],B:['A','C','D'],C:['B'],D:['A','B']},
    GBCA:{A:['B'],B:['A'],C:[]}
  };

  function renderSwitch(){
    const known = state.culpritKnown === 'known';
    const wrap = $('#agentSelectWrap');
    if(wrap) wrap.style.display = known ? 'block' : 'none';

    const out = $('#switchOutput');

    if(!known){
      // ESUR text 1:1 as requested
      out.innerHTML = `
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
          <span class="kbd">Unknown culprit</span>
        </div>

        <div style="font-weight:950;margin-bottom:6px">Iodinated contrast media (ICM)</div>
        <div>Due to the higher likelihood that the involved ICM is from group A</div>
        <div style="margin-top:6px">Choose the alternative ICM from <strong>Group B or D</strong></div>
        <div style="margin-top:6px;color:var(--muted)">High cross-reactivity between <strong>Group C</strong>–<strong>Group A</strong>.</div>

        <hr style="border:0;border-top:1px solid #e2e8f0;margin:14px 0"/>

        <div style="font-weight:950;margin-bottom:6px">Gadolinium-based contrast agents (GBCA)</div>
        <div><strong>It is not possible to recommend a regimen with certainty.</strong></div>
        <div style="margin-top:6px">Due to the probability of involvement, using a GBCA <strong>different from the one routinely administered</strong> is suggested.</div>
      `;
      return;
    }

    const v = $('#agentSelect').value;
    const a = AGENTS[v];

    if(!a){
      out.innerHTML = `<div style="color:var(--danger);font-weight:950">Select an agent.</div>`;
      return;
    }

    const alt = (ALT_GROUPS[a.type] && ALT_GROUPS[a.type][a.group]) ? ALT_GROUPS[a.type][a.group] : [];

    // Handle GBCA Group C: insufficient data
    const gbcaC = (a.type === 'GBCA' && a.group === 'C');

    out.innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        <span class="kbd">${a.type}</span><span class="kbd">Group ${a.group}</span>
      </div>
      <div style="font-weight:950;margin-bottom:6px">${a.name}</div>
      ${
        gbcaC
          ? `<div><strong>Insufficient data for empiric change advice.</strong></div>`
          : `<div>Suggested alternative group(s): <strong>${alt.length ? alt.map(g=>`Group ${g}`).join(', ') : '—'}</strong></div>`
      }
      <div style="margin-top:8px;color:var(--muted)">Cross-reactivity is high and variable → testing preferred when feasible.</div>
    `;
  }

  function parseNumber(v){
    if(!v) return NaN;
    return Number(String(v).trim().replace(',', '.'));
  }

  function calcTryptase(){
    const baseline = parseNumber($('#baselineInput').value);
    const acute = parseNumber($('#acuteInput').value);
    const out = $('#tryptaseOutput');

    if(!isFinite(baseline) || !isFinite(acute) || baseline<0 || acute<0){
      out.innerHTML = `<div style="color:var(--danger);font-weight:950">Enter valid non-negative numbers (ng/mL).</div>`;
      return;
    }

    const threshold = 2 + 1.2 * baseline;
    const suggests = acute >= threshold;

    out.innerHTML = `
      <div style="font-weight:950;margin-bottom:6px">${suggests ? 'Suggests IHR' : 'Not significant by rule'}</div>
      <div>Threshold: <strong>${threshold.toFixed(2)}</strong> ng/mL</div>
      <div style="margin-top:6px">Acute: <strong>${acute.toFixed(2)}</strong> • Baseline: <strong>${baseline.toFixed(2)}</strong></div>
      <div style="margin-top:8px;color:var(--muted)">Rule: acute ≥ 2 ng/mL + (1.2 × baseline)</div>`;
  }

  function renderNIHR(){
    const flags = $$('#nihrChecklist input[type="checkbox"]').filter(i=>i.checked).map(i=>i.dataset.flag);
    const out = $('#nihrOutput');

    if(flags.length){
      out.innerHTML = `<div style="color:var(--danger);font-weight:950;margin-bottom:6px">Red flag present → urgent specialist referral</div>
        <ul>${flags.map(f=>`<li>${f}</li>`).join('')}</ul>`;
    }else{
      out.innerHTML = `<div style="font-weight:950;margin-bottom:6px">No red flags selected</div>
        <div>Continue clinical assessment and follow local protocols.</div>`;
    }
  }

  function resetAll(){
    setSeg('situation','elective');
    setSeg('severity','modsev');
    setSeg('culpritKnown','known');

    $('#agentSelect').selectedIndex = 0;
    renderSwitch();

    $('#baselineInput').value=''; $('#acuteInput').value='';
    $('#tryptaseOutput').innerHTML = '<div class="p-muted">Enter baseline and acute values, then press Calculate.</div>';

    $$('#nihrChecklist input[type="checkbox"]').forEach(i=>i.checked=false);
    renderNIHR();

    setNav('flow');
  }

  function wire(){
    $$('.bottomnav__btn').forEach(btn=>btn.addEventListener('click', ()=>setNav(btn.dataset.nav)));
    $$('.seg__btn').forEach(btn=>btn.addEventListener('click', ()=>setSeg(btn.dataset.seg, btn.dataset.value)));
    $('#agentSelect').addEventListener('change', renderSwitch);
    $('#calcBtn').addEventListener('click', calcTryptase);
    $$('#nihrChecklist input[type="checkbox"]').forEach(i=>i.addEventListener('change', renderNIHR));
    $('#resetBtn').addEventListener('click', resetAll);
  }

  wire();
  renderFlow();
  renderSwitch();
  $('#tryptaseOutput').innerHTML = '<div class="p-muted">Enter baseline and acute values, then press Calculate.</div>';
  renderNIHR();
})();
