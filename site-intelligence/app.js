import * as THREE from 'https://esm.sh/three@0.161.0';
import { OrbitControls } from 'https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js';

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
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  const t=titles[id]||titles.dashboard;
  document.getElementById('pageTitle').textContent=t[0];
  document.getElementById('pageSubtitle').textContent=t[1];
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='viewer') setTimeout(resizeViewer,40);
  if(id==='compare') setTimeout(resizeCompare,40);
}

document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.goto)));

const mini=document.getElementById('miniTimeline');
captures.slice().reverse().forEach(c=>mini?.insertAdjacentHTML('beforeend',`<div class="mini-timeline-item"><div><b>${c.date}</b><div class="muted">${c.images} images</div></div><strong>${c.progress}%</strong></div>`));

const dateA=document.getElementById('dateASelect');
const dateB=document.getElementById('dateBSelect');
const viewerDateSelect=document.getElementById('viewerDateSelect');
[captureSelectInit(dateA),captureSelectInit(dateB),captureSelectInit(viewerDateSelect)];
function captureSelectInit(select){ if(!select) return; captures.forEach(c=>select.add(new Option(`${c.date} · ${c.progress}%`,c.id))); }
if(dateA) dateA.value='c1'; if(dateB) dateB.value='c4'; if(viewerDateSelect) viewerDateSelect.value='c4';

const timeline=document.getElementById('captureTimeline');
captures.forEach(c=>timeline?.insertAdjacentHTML('beforeend',`<div class="timeline-node ${c.id==='c4'?'active':''}"><b>${c.date}</b><small>${c.images} images · ${c.progress}% progress</small></div>`));

function renderChanges(){
  if(!dateA||!dateB) return;
  const a=captures.find(c=>c.id===dateA.value), b=captures.find(c=>c.id===dateB.value);
  const delta=(b.progress-a.progress).toFixed(1);
  document.getElementById('blendALabel').textContent=a.date;
  document.getElementById('blendBLabel').textContent=b.date;
  document.getElementById('changeCards').innerHTML=`
    <article class="panel compact"><span class="kicker">Overall change</span><h3>Progress delta</h3><div class="big-value positive">${delta>0?'+':''}${delta}%</div><p>Demonstration progress indicator between selected states.</p></article>
    <article class="panel compact"><span class="kicker">Geometry</span><h3>Changed zones</h3><div class="big-value">6</div><p>Areas with material geometric change in the synthetic model.</p></article>
    <article class="panel compact"><span class="kicker">Review</span><h3>Human verification</h3><div class="big-value warning">4</div><p>Potential issues remain observations until authorised review.</p></article>`;
  updateCompareModels();
}
dateA?.addEventListener('change',renderChanges); dateB?.addEventListener('change',renderChanges);

const blocks=[[-21,-13,12,9,5],[-5,-13,12,9,7],[11,-13,12,9,9],[-21,2,12,9,8],[-5,2,12,9,10],[11,2,12,9,6],[-12,16,16,8,4],[8,16,18,8,7]];
function clearGroup(g){while(g.children.length){const o=g.children.pop();o.geometry?.dispose();o.material?.dispose();}}

let scene,camera,renderer,controls,ground,grid,builtGroup,plannedGroup,markerGroup,tempMarker;
try{
  const host=document.getElementById('threeViewer');
  scene=new THREE.Scene(); scene.background=new THREE.Color(0xdde7ee);
  camera=new THREE.PerspectiveCamera(50,1,.1,1000); camera.position.set(42,34,48);
  renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; host.appendChild(renderer.domElement);
  controls=new OrbitControls(camera,renderer.domElement); controls.target.set(0,2,0); controls.enableDamping=true;
  scene.add(new THREE.HemisphereLight(0xffffff,0x67737d,2.2));
  const sun=new THREE.DirectionalLight(0xffffff,2.2); sun.position.set(30,50,20); sun.castShadow=true; scene.add(sun);
  ground=new THREE.Mesh(new THREE.PlaneGeometry(72,54),new THREE.MeshStandardMaterial({color:0xc9d0ca,roughness:1})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  grid=new THREE.GridHelper(72,36,0x708090,0xaeb9c2); scene.add(grid);
  builtGroup=new THREE.Group(); plannedGroup=new THREE.Group(); markerGroup=new THREE.Group(); scene.add(builtGroup,plannedGroup,markerGroup);
  buildState(captures[3]);
  const raycaster=new THREE.Raycaster(), mouse=new THREE.Vector2();
  renderer.domElement.addEventListener('pointerdown',e=>{
    const rect=renderer.domElement.getBoundingClientRect();
    mouse.x=((e.clientX-rect.left)/rect.width)*2-1; mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse,camera); const hits=raycaster.intersectObject(ground);
    if(hits.length){const p=hits[0].point; selected={x:p.x,y:p.y,z:p.z};
      document.getElementById('coordX').textContent=p.x.toFixed(2)+' m';
      document.getElementById('coordY').textContent=p.y.toFixed(2)+' m';
      document.getElementById('coordZ').textContent=p.z.toFixed(2)+' m';
      document.getElementById('coordsOverlay').textContent=`X ${p.x.toFixed(2)} · Y ${p.y.toFixed(2)} · Z ${p.z.toFixed(2)}`;
      if(tempMarker) markerGroup.remove(tempMarker);
      tempMarker=new THREE.Mesh(new THREE.SphereGeometry(.55,16,16),new THREE.MeshStandardMaterial({color:0xb33c3c,emissive:0x3a0505})); tempMarker.position.set(p.x,.6,p.z); markerGroup.add(tempMarker);
    }
  });
  (function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)})();
}catch(err){ console.error(err); const host=document.getElementById('threeViewer'); if(host) host.insertAdjacentHTML('beforeend','<div style="padding:20px;color:#8b3b24;background:#fff4ee;position:absolute;left:20px;bottom:20px;border-radius:10px">3D engine could not start in this browser. Other workflow controls remain available.</div>'); }

function buildState(capture){
  if(!builtGroup) return;
  clearGroup(builtGroup); clearGroup(plannedGroup); const factor=capture.progress/100;
  blocks.forEach((b,i)=>{const [x,z,w,d,maxH]=b; const prog=Math.max(.15,Math.min(1,factor+(i%3-1)*.11)); const h=maxH*prog;
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:i%2?0x496f91:0x365d7e,roughness:.8})); mesh.position.set(x,h/2,z); mesh.castShadow=true; builtGroup.add(mesh);
    if(prog<.98){const ph=maxH-h; const pm=new THREE.Mesh(new THREE.BoxGeometry(w,ph,d),new THREE.MeshBasicMaterial({color:0xc89c57,wireframe:true,transparent:true,opacity:.28})); pm.position.set(x,h+ph/2,z); plannedGroup.add(pm);}
  });
  document.getElementById('viewerDateLabel').textContent=capture.date;
}
function resizeViewer(){if(!renderer) return; const el=document.getElementById('threeViewer'); const w=Math.max(el.clientWidth,320),h=Math.max(el.clientHeight,360); renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix();}
document.getElementById('resetCamera')?.addEventListener('click',()=>{camera.position.set(42,34,48);controls.target.set(0,2,0);});
document.getElementById('toggleGrid')?.addEventListener('click',()=>{if(grid)grid.visible=!grid.visible;});
document.getElementById('toggleMarkers')?.addEventListener('click',()=>{if(markerGroup)markerGroup.visible=!markerGroup.visible;});
viewerDateSelect?.addEventListener('change',()=>buildState(captures.find(c=>c.id===viewerDateSelect.value)));

let selected={x:0,y:0,z:0};
const inspections=[{id:'INSP-014',date:'23 Sep 2026',coord:'E 18.4 · N 27.6',note:'Verify wall alignment at northern return.',status:'Open'},{id:'INSP-013',date:'17 Sep 2026',coord:'E -6.2 · N 15.1',note:'Roof progress confirmed against prior capture.',status:'Closed'}];
function renderInspectionTable(){const tbody=document.querySelector('#inspectionTable tbody'); if(!tbody)return; tbody.innerHTML=''; inspections.forEach(i=>tbody.insertAdjacentHTML('beforeend',`<tr><td>${i.id}</td><td>${i.date}</td><td>${i.coord}</td><td>${i.note}</td><td><span class="pill ${i.status==='Closed'?'good':'neutral'}">${i.status}</span></td></tr>`));}
renderInspectionTable();
document.getElementById('saveMarker')?.addEventListener('click',()=>{const note=document.getElementById('inspectionNote').value.trim()||'Spatial inspection marker'; inspections.unshift({id:'INSP-'+String(inspections.length+15).padStart(3,'0'),date:captures.find(c=>c.id===viewerDateSelect.value).date,coord:`E ${selected.x.toFixed(1)} · N ${selected.z.toFixed(1)}`,note,status:'Open'}); renderInspectionTable(); document.getElementById('inspectionNote').value=''; alert('Inspection marker saved to the demonstration register.');});

let cScene,cCamera,cRenderer,cControls,earlyGroup,lateGroup;
try{
  const host=document.getElementById('compareViewer'); cScene=new THREE.Scene(); cScene.background=new THREE.Color(0xe4ebf0); cCamera=new THREE.PerspectiveCamera(50,1,.1,1000); cCamera.position.set(42,34,48);
  cRenderer=new THREE.WebGLRenderer({antialias:true}); cRenderer.setPixelRatio(Math.min(devicePixelRatio,2)); host.appendChild(cRenderer.domElement); cControls=new OrbitControls(cCamera,cRenderer.domElement); cControls.target.set(0,2,0); cControls.enableDamping=true;
  cScene.add(new THREE.HemisphereLight(0xffffff,0x65717c,2.2)); const cg=new THREE.Mesh(new THREE.PlaneGeometry(72,54),new THREE.MeshStandardMaterial({color:0xcbd2cd})); cg.rotation.x=-Math.PI/2; cScene.add(cg,new THREE.GridHelper(72,36,0x7d8994,0xb9c2ca)); earlyGroup=new THREE.Group(); lateGroup=new THREE.Group(); cScene.add(earlyGroup,lateGroup);
  (function animateCompare(){requestAnimationFrame(animateCompare);cControls.update();cRenderer.render(cScene,cCamera)})();
}catch(err){console.error(err);}
function buildCompareGroup(group,capture,wire=false){if(!group)return; clearGroup(group); const factor=capture.progress/100; blocks.forEach((b,i)=>{const [x,z,w,d,maxH]=b,prog=Math.max(.15,Math.min(1,factor+(i%3-1)*.11)),h=maxH*prog; const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:wire?0xd09b4d:0x3e6688,wireframe:wire,transparent:true,opacity:wire?.9:.8})); m.position.set(x,h/2,z); group.add(m);});}
function updateCompareModels(){if(!dateA||!dateB)return; buildCompareGroup(earlyGroup,captures.find(c=>c.id===dateA.value),true); buildCompareGroup(lateGroup,captures.find(c=>c.id===dateB.value),false); applyBlend();}
function applyBlend(){if(!lateGroup||!earlyGroup)return; const v=+(document.getElementById('blendSlider')?.value||65)/100; lateGroup.children.forEach(m=>m.material.opacity=Math.max(.18,v)); earlyGroup.children.forEach(m=>m.material.opacity=Math.max(.15,1-v+.15));}
document.getElementById('blendSlider')?.addEventListener('input',applyBlend);
document.querySelectorAll('.mode').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active'); if(!lateGroup)return; const diff=b.dataset.mode==='difference'; lateGroup.children.forEach(m=>m.material.color.setHex(diff?0x2e8b67:0x3e6688)); earlyGroup.children.forEach(m=>m.material.color.setHex(diff?0xc48734:0xd09b4d));}));
function resizeCompare(){if(!cRenderer)return; const el=document.getElementById('compareViewer'); const w=Math.max(el.clientWidth,320),h=Math.max(el.clientHeight,360); cRenderer.setSize(w,h); cCamera.aspect=w/h; cCamera.updateProjectionMatrix();}
window.addEventListener('resize',()=>{resizeViewer();resizeCompare();}); resizeViewer(); resizeCompare(); renderChanges();

const quality=[
  {title:'Wall progress variance',priority:'Medium',coord:'Grid E 18.4 m · N 27.6 m',desc:'Observed geometry appears behind the expected construction state for this zone. Human verification is required.'},
  {title:'Surface irregularity',priority:'Medium',coord:'Grid E -21.1 m · N 14.8 m',desc:'A localised surface variation is visible in the synthetic comparison. Confirm whether this is geometry, temporary material or reconstruction noise.'},
  {title:'Service corridor unchanged',priority:'Low',coord:'Grid E 2.8 m · N -18.9 m',desc:'Limited geometric change is visible between selected dates. Compare against programme before escalation.'},
  {title:'Roof sequence confirmed',priority:'Low',coord:'Grid E 11.0 m · N 2.0 m',desc:'Later state shows roof geometry not present in the baseline capture. Record as verified progress after human review.'}
];
const ql=document.getElementById('qualityList'); quality.forEach((q,i)=>{const el=document.createElement('div'); el.className='quality-item'+(i===0?' active':''); el.innerHTML=`<div class="quality-item-head"><strong>${q.title}</strong><span class="priority">${q.priority}</span></div><p>${q.coord}</p>`; el.addEventListener('click',()=>{document.querySelectorAll('.quality-item').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.getElementById('qualityTitle').textContent=q.title;document.getElementById('qualityPriority').textContent=q.priority;document.getElementById('qualityDescription').textContent=q.desc;document.getElementById('qualityCoord').textContent=q.coord;}); ql?.appendChild(el);});

const input=document.getElementById('captureFiles');
const zone=document.getElementById('uploadZone');
function processFiles(fileList){const fs=[...fileList]; if(!fs.length)return; const size=fs.reduce((a,f)=>a+f.size,0); document.getElementById('captureManifestTitle').textContent='Selected drone image set'; document.getElementById('manifestCount').textContent=fs.length; document.getElementById('manifestSize').textContent=(size/1024/1024).toFixed(1)+' MB'; document.getElementById('manifestGps').textContent='Pending EXIF extraction'; document.getElementById('manifestTime').textContent=new Date(fs[0].lastModified).toLocaleString(); document.getElementById('manifestAltitude').textContent='Pending EXIF extraction'; document.getElementById('manifestOverlap').textContent='Pending reconstruction'; zone?.classList.add('has-files'); zone?.querySelector('strong')&&(zone.querySelector('strong').textContent=`${fs.length} image${fs.length===1?'':'s'} selected`);}
input?.addEventListener('change',()=>processFiles(input.files));
zone?.addEventListener('click',e=>{if(e.target!==input) input?.click();});
['dragenter','dragover'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('dragging');}));
['dragleave','drop'].forEach(ev=>zone?.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('dragging');}));
zone?.addEventListener('drop',e=>processFiles(e.dataTransfer.files));
document.getElementById('loadDemoCapture')?.addEventListener('click',()=>{document.getElementById('captureManifestTitle').textContent='CentralBlue Demo Capture · 23 Sep 2026';document.getElementById('manifestCount').textContent='312';document.getElementById('manifestSize').textContent='4.6 GB';document.getElementById('manifestGps').textContent='312 / 312';document.getElementById('manifestTime').textContent='09:14–09:37';document.getElementById('manifestAltitude').textContent='62 m AGL';document.getElementById('manifestOverlap').textContent='82% / 74%';});

const stages=['Images validated','Camera alignment','Dense point cloud','Textured mesh','Georeference','Spatial state ready']; const ps=document.getElementById('pipelineSteps'); stages.forEach((s,i)=>ps?.insertAdjacentHTML('beforeend',`<div class="pipeline-step"><b>${String(i+1).padStart(2,'0')} · ${s}</b><span>Waiting</span></div>`));
document.getElementById('runPipeline')?.addEventListener('click',async()=>{const els=[...document.querySelectorAll('.pipeline-step')]; els.forEach(e=>{e.className='pipeline-step';e.querySelector('span').textContent='Waiting';}); for(const e of els){e.classList.add('running');e.querySelector('span').textContent='Processing…';await new Promise(r=>setTimeout(r,450));e.classList.remove('running');e.classList.add('done');e.querySelector('span').textContent='Complete';}});

console.info('Citra Site Intelligence interactive demo initialised.');