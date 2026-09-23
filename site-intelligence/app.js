if (location.search || location.hash) history.replaceState(null, '', location.pathname);

const captures = [
  { id:'c1', date:'01 Sep 2026', progress:42, images:278 },
  { id:'c2', date:'10 Sep 2026', progress:51, images:294 },
  { id:'c3', date:'17 Sep 2026', progress:58, images:306 },
  { id:'c4', date:'23 Sep 2026', progress:68.2, images:312 }
];

const titles = {
  dashboard:['Executive Overview','From drone imagery to spatial progress and quality intelligence.'],
  viewer:['3D Site Viewer','Inspect a geospatial construction state and create coordinate-linked observations.'],
  compare:['Time Comparison','Compare the same site through different capture dates.'],
  capture:['Capture Ingestion','Upload drone imagery and prepare capture metadata for reconstruction.'],
  processing:['Processing Pipeline','Follow the photogrammetry workflow from images to a georeferenced model.'],
  quality:['Quality Monitoring','Review simulated spatial observations and prioritise human verification.'],
  inspections:['Inspection Markers','Maintain a spatial register of coordinate-linked observations.'],
  report:['Report Preview','Convert spatial progress and review points into a management-ready summary.'],
  architecture:['Technical Boundary','Separate interactive proof-of-concept functions from production infrastructure.']
};

function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.id===id));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.view===id));
  const t=titles[id]||['Citra Site Intelligence','Spatial Progress Platform'];
  document.getElementById('pageTitle').textContent=t[0];
  document.getElementById('pageSubtitle').textContent=t[1];
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='viewer') requestAnimationFrame(renderSite);
  if(id==='compare') requestAnimationFrame(renderCompare);
}

document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.goto)));

const extraStyle=document.createElement('style');
extraStyle.textContent=`
.virtual-3d{position:absolute;inset:0;overflow:hidden;perspective:900px;background:linear-gradient(180deg,#dbe6ed 0%,#eef2f4 58%,#d0d7d2 58%,#c5cec8 100%)}
.site-stage{position:absolute;left:50%;top:52%;width:760px;height:520px;transform-style:preserve-3d;transform:translate(-50%,-50%) rotateX(58deg) rotateZ(-28deg) scale(.82);transition:transform .12s ease-out}
.site-ground{position:absolute;inset:0;border:1px solid rgba(80,100,112,.35);background-image:linear-gradient(rgba(70,90,105,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(70,90,105,.12) 1px,transparent 1px);background-size:32px 32px;background-color:#c8d1cb;box-shadow:0 20px 55px rgba(26,40,52,.22);transform-style:preserve-3d}
.building{position:absolute;transform-style:preserve-3d;transform-origin:50% 100%;filter:drop-shadow(6px 8px 5px rgba(20,30,40,.24))}
.building .top{position:absolute;inset:0;background:#496f91;border:1px solid rgba(255,255,255,.35)}
.building .front,.building .side{position:absolute;background:#365d7e;border:1px solid rgba(255,255,255,.18)}
.building .front{left:0;right:0;height:var(--h);top:100%;transform-origin:top;transform:rotateX(-90deg)}
.building .side{top:0;bottom:0;width:var(--h);left:100%;transform-origin:left;transform:rotateY(90deg)}
.plan-shell{position:absolute;border:2px dashed rgba(200,156,87,.72);background:rgba(200,156,87,.07)}
.pin3d{position:absolute;width:16px;height:16px;border-radius:50%;background:#b33c3c;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,.3);transform:translate(-50%,-50%);z-index:20}
.viewer-help{position:absolute;right:14px;bottom:14px;background:rgba(13,24,34,.82);color:#fff;padding:8px 10px;border-radius:8px;font-size:11px;z-index:25}
.compare-layer{position:absolute;inset:0;transition:opacity .15s ease}.compare-early .building .top{background:#d09b4d}.compare-early .building .front,.compare-early .building .side{background:#bb8130}.compare-early .building{opacity:.55}.compare-late .building .top{background:#3e6688}.compare-late .building .front,.compare-late .building .side{background:#31536f}
.upload-zone{cursor:pointer}.upload-zone.dragging{outline:3px solid rgba(217,154,66,.45);background:#fff9ec}
`;
document.head.appendChild(extraStyle);

const mini=document.getElementById('miniTimeline');
captures.slice().reverse().forEach(c=>mini?.insertAdjacentHTML('beforeend',`<div class="mini-timeline-item"><div><b>${c.date}</b><div class="muted">${c.images} images</div></div><strong>${c.progress}%</strong></div>`));

const dateA=document.getElementById('dateASelect');
const dateB=document.getElementById('dateBSelect');
const viewerDateSelect=document.getElementById('viewerDateSelect');
[captures].flat().forEach(()=>{});
captures.forEach(c=>[dateA,dateB,viewerDateSelect].forEach(s=>{if(s)s.add(new Option(`${c.date} · ${c.progress}%`,c.id));}));
if(dateA) dateA.value='c1'; if(dateB) dateB.value='c4'; if(viewerDateSelect) viewerDateSelect.value='c4';

const timeline=document.getElementById('captureTimeline');
captures.forEach(c=>timeline?.insertAdjacentHTML('beforeend',`<div class="timeline-node ${c.id==='c4'?'active':''}"><b>${c.date}</b><small>${c.images} images · ${c.progress}% progress</small></div>`));

const blocks=[
  {x:55,y:68,w:105,d:76,max:62},{x:195,y:68,w:105,d:76,max:90},{x:335,y:68,w:105,d:76,max:112},
  {x:55,y:213,w:105,d:76,max:98},{x:195,y:213,w:105,d:76,max:128},{x:335,y:213,w:105,d:76,max:78},
  {x:120,y:350,w:142,d:66,max:58},{x:315,y:350,w:160,d:66,max:92}
];

let rotX=58,rotZ=-28,scale=.82,dragging=false,lastX=0,lastY=0,markerVisible=true,gridVisible=true;
let selected={x:0,y:0,z:0};
let markerPoint=null;

function buildingHTML(b,i,progress,extraClass=''){
  const factor=Math.max(.16,Math.min(1,progress/100+((i%3)-1)*.11));
  const h=Math.round(b.max*factor);
  return `<div class="building ${extraClass}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.d}px;--h:${h}px"><div class="top"></div><div class="front"></div><div class="side"></div></div>`;
}
function stageTransform(){return `translate(-50%,-50%) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;}
function attachStageInteraction(container,stage){
  container.onpointerdown=e=>{if(e.target.closest('button,select,textarea,input'))return;dragging=true;lastX=e.clientX;lastY=e.clientY;container.setPointerCapture?.(e.pointerId)};
  container.onpointermove=e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;rotZ+=dx*.25;rotX=Math.max(32,Math.min(76,rotX-dy*.18));stage.style.transform=stageTransform()};
  container.onpointerup=()=>dragging=false;container.onpointercancel=()=>dragging=false;
  container.onwheel=e=>{e.preventDefault();scale=Math.max(.5,Math.min(1.25,scale-(e.deltaY*.0008)));stage.style.transform=stageTransform()};
}

function renderSite(){
  const host=document.getElementById('threeViewer'); if(!host)return;
  const capture=captures.find(c=>c.id===(viewerDateSelect?.value||'c4'))||captures[3];
  document.getElementById('viewerDateLabel').textContent=capture.date;
  host.querySelectorAll('.virtual-3d').forEach(n=>n.remove());
  const shell=document.createElement('div');shell.className='virtual-3d';
  const stage=document.createElement('div');stage.className='site-stage';stage.style.transform=stageTransform();
  const ground=document.createElement('div');ground.className='site-ground'; if(!gridVisible)ground.style.backgroundImage='none';stage.appendChild(ground);
  blocks.forEach((b,i)=>ground.insertAdjacentHTML('beforeend',buildingHTML(b,i,capture.progress)));
  if(markerPoint&&markerVisible){const p=document.createElement('div');p.className='pin3d';p.style.left=markerPoint.left+'px';p.style.top=markerPoint.top+'px';ground.appendChild(p)}
  shell.appendChild(stage);shell.insertAdjacentHTML('beforeend','<div class="viewer-help">Drag to rotate · Scroll to zoom · Click site to inspect</div>');host.appendChild(shell);attachStageInteraction(shell,stage);
  shell.addEventListener('click',e=>{if(dragging)return;const r=ground.getBoundingClientRect();const cx=Math.max(0,Math.min(760,e.clientX-r.left));const cy=Math.max(0,Math.min(520,e.clientY-r.top));markerPoint={left:cx,top:cy};selected={x:(cx-380)/10,y:0,z:(260-cy)/10};document.getElementById('coordX').textContent=selected.x.toFixed(2)+' m';document.getElementById('coordY').textContent='0.00 m';document.getElementById('coordZ').textContent=selected.z.toFixed(2)+' m';document.getElementById('coordsOverlay').textContent=`X ${selected.x.toFixed(2)} · Y 0.00 · Z ${selected.z.toFixed(2)}`;renderSite()});
}

function renderCompare(){
  const host=document.getElementById('compareViewer');if(!host)return;
  const a=captures.find(c=>c.id===dateA.value), b=captures.find(c=>c.id===dateB.value);
  host.querySelectorAll('.virtual-3d').forEach(n=>n.remove());
  const shell=document.createElement('div');shell.className='virtual-3d';
  const stage=document.createElement('div');stage.className='site-stage';stage.style.transform=stageTransform();
  const ground=document.createElement('div');ground.className='site-ground';stage.appendChild(ground);
  const early=document.createElement('div');early.className='compare-layer compare-early';blocks.forEach((bl,i)=>early.insertAdjacentHTML('beforeend',buildingHTML(bl,i,a.progress)));
  const late=document.createElement('div');late.className='compare-layer compare-late';blocks.forEach((bl,i)=>late.insertAdjacentHTML('beforeend',buildingHTML(bl,i,b.progress)));
  ground.appendChild(early);ground.appendChild(late);shell.appendChild(stage);host.appendChild(shell);attachStageInteraction(shell,stage);applyBlend();
}
function applyBlend(){const v=(+document.getElementById('blendSlider')?.value||65)/100;document.querySelectorAll('.compare-late').forEach(el=>el.style.opacity=Math.max(.2,v));document.querySelectorAll('.compare-early').forEach(el=>el.style.opacity=Math.max(.18,1-v+.18));}

function renderChanges(){
  const a=captures.find(c=>c.id===dateA.value),b=captures.find(c=>c.id===dateB.value);if(!a||!b)return;
  const delta=(b.progress-a.progress).toFixed(1);
  document.getElementById('blendALabel').textContent=a.date;document.getElementById('blendBLabel').textContent=b.date;
  document.getElementById('changeCards').innerHTML=`<article class="panel compact"><span class="kicker">Overall change</span><h3>Progress delta</h3><div class="big-value positive">${delta>0?'+':''}${delta}%</div><p>Demonstration progress indicator between selected states.</p></article><article class="panel compact"><span class="kicker">Geometry</span><h3>Changed zones</h3><div class="big-value">6</div><p>Areas with material geometric change in the synthetic model.</p></article><article class="panel compact"><span class="kicker">Review</span><h3>Human verification</h3><div class="big-value warning">4</div><p>Potential issues remain observations until authorised review.</p></article>`;
  renderCompare();
}

dateA?.addEventListener('change',renderChanges);dateB?.addEventListener('change',renderChanges);viewerDateSelect?.addEventListener('change',renderSite);
document.getElementById('blendSlider')?.addEventListener('input',applyBlend);
document.getElementById('resetCamera')?.addEventListener('click',()=>{rotX=58;rotZ=-28;scale=.82;renderSite()});
document.getElementById('toggleGrid')?.addEventListener('click',()=>{gridVisible=!gridVisible;renderSite()});
document.getElementById('toggleMarkers')?.addEventListener('click',()=>{markerVisible=!markerVisible;renderSite()});
document.querySelectorAll('.mode').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.compare-early .building').forEach(x=>x.style.filter=b.dataset.mode==='difference'?'saturate(1.4) brightness(1.05)':'');document.querySelectorAll('.compare-late .building').forEach(x=>x.style.filter=b.dataset.mode==='difference'?'saturate(1.5) contrast(1.05)':'')}));

const inspections=[
  {id:'INSP-014',date:'23 Sep 2026',coord:'E 18.4 · N 27.6',note:'Verify wall alignment at northern return.',status:'Open'},
  {id:'INSP-013',date:'17 Sep 2026',coord:'E -6.2 · N 15.1',note:'Roof progress confirmed against prior capture.',status:'Closed'}
];
function renderInspectionTable(){const tbody=document.querySelector('#inspectionTable tbody');if(!tbody)return;tbody.innerHTML='';inspections.forEach(i=>tbody.insertAdjacentHTML('beforeend',`<tr><td>${i.id}</td><td>${i.date}</td><td>${i.coord}</td><td>${i.note}</td><td><span class="pill ${i.status==='Closed'?'good':'neutral'}">${i.status}</span></td></tr>`));}
document.getElementById('saveMarker')?.addEventListener('click',()=>{const note=document.getElementById('inspectionNote').value.trim()||'Spatial inspection marker';inspections.unshift({id:'INSP-'+String(inspections.length+15).padStart(3,'0'),date:captures.find(c=>c.id===viewerDateSelect.value).date,coord:`E ${selected.x.toFixed(1)} · N ${selected.z.toFixed(1)}`,note,status:'Open'});renderInspectionTable();document.getElementById('inspectionNote').value='';alert('Inspection marker saved to the demonstration register.');});
renderInspectionTable();

function updateManifest(files){const fs=[...files];const size=fs.reduce((a,f)=>a+f.size,0);document.getElementById('captureManifestTitle').textContent=fs.length?`Selected capture · ${fs.length} image${fs.length===1?'':'s'}`:'No capture selected';document.getElementById('manifestCount').textContent=fs.length||'—';document.getElementById('manifestSize').textContent=fs.length?(size/1024/1024).toFixed(1)+' MB':'—';document.getElementById('manifestGps').textContent=fs.length?'Pending metadata extraction':'—';document.getElementById('manifestTime').textContent=fs[0]?new Date(fs[0].lastModified).toLocaleString():'—';document.getElementById('manifestAltitude').textContent=fs.length?'Pending metadata extraction':'—';document.getElementById('manifestOverlap').textContent=fs.length?'Pending processing':'—';}
const captureFiles=document.getElementById('captureFiles');
const uploadZone=document.getElementById('uploadZone');
if(uploadZone&&captureFiles){
  uploadZone.addEventListener('click',e=>{if(e.target!==captureFiles)captureFiles.click()});
  captureFiles.addEventListener('change',()=>updateManifest(captureFiles.files));
  ['dragenter','dragover'].forEach(ev=>uploadZone.addEventListener(ev,e=>{e.preventDefault();uploadZone.classList.add('dragging')}));
  ['dragleave','drop'].forEach(ev=>uploadZone.addEventListener(ev,e=>{e.preventDefault();uploadZone.classList.remove('dragging')}));
  uploadZone.addEventListener('drop',e=>{if(e.dataTransfer?.files?.length)updateManifest(e.dataTransfer.files)});
}
document.getElementById('loadDemoCapture')?.addEventListener('click',()=>{document.getElementById('captureManifestTitle').textContent='CentralBlue Demo Capture · 23 Sep 2026';document.getElementById('manifestCount').textContent='312';document.getElementById('manifestSize').textContent='4.6 GB';document.getElementById('manifestGps').textContent='312 / 312';document.getElementById('manifestTime').textContent='09:14–09:37';document.getElementById('manifestAltitude').textContent='62 m AGL';document.getElementById('manifestOverlap').textContent='82% / 74%';});

const stages=['Images validated','Camera alignment','Dense point cloud','Textured mesh','Georeference','Spatial state ready'];
const ps=document.getElementById('pipelineSteps');
stages.forEach((s,i)=>ps?.insertAdjacentHTML('beforeend',`<div class="pipeline-step"><b>${String(i+1).padStart(2,'0')} · ${s}</b><span>Waiting</span></div>`));
document.getElementById('runPipeline')?.addEventListener('click',async()=>{const els=[...document.querySelectorAll('.pipeline-step')];for(const e of els){e.className='pipeline-step running';e.querySelector('span').textContent='Processing…';await new Promise(r=>setTimeout(r,450));e.className='pipeline-step done';e.querySelector('span').textContent='Complete';}});

const quality=[
  {title:'Wall progress variance',priority:'Medium',coord:'Grid E 18.4 m · N 27.6 m',desc:'Observed geometry appears behind the expected construction state for this zone. Human verification is required.'},
  {title:'Surface irregularity',priority:'Medium',coord:'Grid E -21.1 m · N 14.8 m',desc:'A localised surface variation is visible in the synthetic comparison. Confirm whether this is geometry, temporary material or reconstruction noise.'},
  {title:'Service corridor unchanged',priority:'Low',coord:'Grid E 2.8 m · N -18.9 m',desc:'Limited geometric change is visible between selected dates. Compare against programme before escalation.'},
  {title:'Roof sequence confirmed',priority:'Low',coord:'Grid E 11.0 m · N 2.0 m',desc:'Later state shows roof geometry not present in the baseline capture. Record as verified progress after human review.'}
];
const ql=document.getElementById('qualityList');
quality.forEach((q,i)=>{const el=document.createElement('div');el.className='quality-item'+(i===0?' active':'');el.innerHTML=`<div class="quality-item-head"><strong>${q.title}</strong><span class="priority">${q.priority}</span></div><p>${q.coord}</p>`;el.addEventListener('click',()=>{document.querySelectorAll('.quality-item').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.getElementById('qualityTitle').textContent=q.title;document.getElementById('qualityPriority').textContent=q.priority;document.getElementById('qualityDescription').textContent=q.desc;document.getElementById('qualityCoord').textContent=q.coord});ql?.appendChild(el)});

renderChanges();
renderSite();
