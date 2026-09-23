"use strict";

const AIRPORTS = [
  { city: "Honiara", name: "Honiara International", iata: "HIR", icao: "AGGH", country: "Solomon Islands", lat: -9.428, lon: 160.055, type: "International airport" },
  { city: "Munda", name: "Munda Airport", iata: "MUA", icao: "AGGM", country: "Solomon Islands", lat: -8.328, lon: 157.263, type: "Regional airport" },
  { city: "Port Moresby", name: "Jacksons International", iata: "POM", icao: "AYPY", country: "Papua New Guinea", lat: -9.443, lon: 147.220, type: "International airport" },
  { city: "Nadi", name: "Nadi International", iata: "NAN", icao: "NFFN", country: "Fiji", lat: -17.755, lon: 177.443, type: "International airport" },
  { city: "Nouméa", name: "La Tontouta International", iata: "NOU", icao: "NWWW", country: "New Caledonia", lat: -22.014, lon: 166.213, type: "International airport" },
  { city: "Brisbane", name: "Brisbane Airport", iata: "BNE", icao: "YBBN", country: "Australia", lat: -27.384, lon: 153.117, type: "International airport" },
  { city: "Sydney", name: "Sydney Kingsford Smith", iata: "SYD", icao: "YSSY", country: "Australia", lat: -33.940, lon: 151.175, type: "International airport" },
  { city: "Auckland", name: "Auckland Airport", iata: "AKL", icao: "NZAA", country: "New Zealand", lat: -37.008, lon: 174.792, type: "International airport" },
  { city: "Papeete", name: "Faa'a International", iata: "PPT", icao: "NTAA", country: "French Polynesia", lat: -17.554, lon: -149.607, type: "International airport" },
  { city: "Frankfurt", name: "Frankfurt Airport", iata: "FRA", icao: "EDDF", country: "Germany", lat: 50.033, lon: 8.571, type: "International airport" },
  { city: "Tbilisi", name: "Tbilisi International", iata: "TBS", icao: "UGTB", country: "Georgia", lat: 41.669, lon: 44.955, type: "International airport" },
  { city: "Istanbul", name: "Istanbul Airport", iata: "IST", icao: "LTFM", country: "Türkiye", lat: 41.275, lon: 28.752, type: "International airport" },
  { city: "Cape Town", name: "Cape Town International", iata: "CPT", icao: "FACT", country: "South Africa", lat: -33.970, lon: 18.602, type: "International airport" },
  { city: "Johannesburg", name: "O.R. Tambo International", iata: "JNB", icao: "FAOR", country: "South Africa", lat: -26.139, lon: 28.246, type: "International airport" },
  { city: "Dubai", name: "Dubai International", iata: "DXB", icao: "OMDB", country: "United Arab Emirates", lat: 25.253, lon: 55.365, type: "International airport" },
  { city: "London", name: "Heathrow Airport", iata: "LHR", icao: "EGLL", country: "United Kingdom", lat: 51.470, lon: -0.454, type: "International airport" },
  { city: "Paris", name: "Charles de Gaulle", iata: "CDG", icao: "LFPG", country: "France", lat: 49.010, lon: 2.548, type: "International airport" },
  { city: "Singapore", name: "Singapore Changi", iata: "SIN", icao: "WSSS", country: "Singapore", lat: 1.364, lon: 103.991, type: "International airport" },
  { city: "New York", name: "John F. Kennedy International", iata: "JFK", icao: "KJFK", country: "United States", lat: 40.641, lon: -73.778, type: "International airport" }
];

const state = { runId: null, generatedAt: null, from: null, to: null, distance: 0, evidence: [], weather: [], latestBrief: "" };

const $ = (id) => document.getElementById(id);
const escapeHTML = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
const displayAirport = (airport) => `${airport.name} (${airport.iata} / ${airport.icao})`;

function findAirport(value) {
  const query = String(value || "").trim().toLowerCase();
  if (!query) return null;
  return AIRPORTS.find((a) => [a.city, a.name, a.iata, a.icao, displayAirport(a)].some((v) => String(v).toLowerCase() === query))
    || AIRPORTS.find((a) => [a.city, a.name, a.iata, a.icao, displayAirport(a)].some((v) => String(v).toLowerCase().includes(query)));
}

function utcStamp(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "medium", timeZone: "UTC", hour12: false }).format(date) + " UTC";
}

function shortUTC(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? utcStamp(date) : "Not provided by source";
}

function createRunId() {
  const now = new Date();
  const base = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  return `ARI-${base}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

function haversine(a, b) {
  const radians = (n) => n * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLon = radians(b.lon - a.lon);
  const q = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setDemoValues() {
  $("from").value = displayAirport(AIRPORTS[0]);
  $("to").value = displayAirport(AIRPORTS[1]);
  $("airline").value = "Solomon Airlines";
  $("flight-number").value = "IE 800";
  $("aircraft").value = "DHC-8 (verify scheduled subtype)";
  $("risk-tolerance").value = "standard";
  $("alternative").value = "ferry-road";
  $("route-notes").value = "Essential in-person business; limited commercial options; flexible by one day if operational risk changes.";
}

function resetAll() {
  $("assessment-form").reset();
  setDefaultDates();
  $("empty-state").hidden = false;
  $("results").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setDefaultDates() {
  const tomorrow = new Date(Date.now() + 86400000);
  $("depart-date").value = tomorrow.toISOString().slice(0, 10);
}

function renderRouteMap(from, to) {
  const width = 900, height = 330, padX = 145, padY = 82;
  const lonSpan = Math.max(4, Math.abs(to.lon - from.lon));
  const latSpan = Math.max(3, Math.abs(to.lat - from.lat));
  const minLon = Math.min(from.lon, to.lon) - lonSpan * .25;
  const maxLon = Math.max(from.lon, to.lon) + lonSpan * .25;
  const minLat = Math.min(from.lat, to.lat) - latSpan * .35;
  const maxLat = Math.max(from.lat, to.lat) + latSpan * .35;
  const project = (a) => ({
    x: padX + ((a.lon - minLon) / (maxLon - minLon)) * (width - padX * 2),
    y: padY + ((maxLat - a.lat) / (maxLat - minLat)) * (height - padY * 2)
  });
  const p1 = project(from), p2 = project(to);
  const midX = (p1.x + p2.x) / 2;
  const lift = Math.min(90, Math.max(36, Math.abs(p2.x - p1.x) * .17));
  const path = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${midX.toFixed(1)} ${(Math.min(p1.y, p2.y) - lift).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  const label = (p, a, anchor) => `<g><circle cx="${p.x}" cy="${p.y}" r="16" fill="rgba(255,75,36,.16)"/><circle cx="${p.x}" cy="${p.y}" r="5" fill="#ff4b24" stroke="#fff" stroke-width="2"/><text x="${p.x + (anchor === "start" ? 23 : -23)}" y="${p.y - 3}" text-anchor="${anchor}" fill="#fff" font-size="16" font-weight="800">${escapeHTML(a.iata)}</text><text x="${p.x + (anchor === "start" ? 23 : -23)}" y="${p.y + 15}" text-anchor="${anchor}" fill="#96a2a9" font-size="10">${escapeHTML(a.city)}</text></g>`;
  $("route-map").innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
    <defs><pattern id="grid" width="55" height="55" patternUnits="userSpaceOnUse"><path d="M55 0H0V55" fill="none" stroke="#31383d" stroke-width="1"/></pattern><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect width="100%" height="100%" fill="#1b2024"/><rect width="100%" height="100%" fill="url(#grid)"/>
    <path d="${path}" fill="none" stroke="#ff4b24" stroke-width="3" stroke-dasharray="8 8" filter="url(#glow)"/>
    <path d="${path}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1" transform="translate(0 7)"/>
    ${label(p1, from, "start")}${label(p2, to, "end")}
    <text x="450" y="305" text-anchor="middle" fill="#647078" font-size="10" letter-spacing="2">REPRESENTATIVE ROUTE CORRIDOR • NOT FOR NAVIGATION</text>
  </svg>`;
}

function renderRouteFacts(from, to, distance) {
  const crossing = from.country === to.country ? `Domestic · ${from.country}` : `${from.country} → ${to.country}`;
  $("route-facts").innerHTML = [
    ["Origin", `${from.iata} / ${from.icao}`],
    ["Destination", `${to.iata} / ${to.icao}`],
    ["Great-circle distance", `${Math.round(distance).toLocaleString()} km`],
    ["Jurisdiction", crossing]
  ].map(([key, val]) => `<div><small>${escapeHTML(key)}</small><b>${escapeHTML(val)}</b></div>`).join("");
  $("distance-chip").textContent = `${Math.round(distance).toLocaleString()} KM`;
}

function conflictContext(from, to) {
  const watch = ["Georgia", "Ukraine", "Russia", "Israel", "Lebanon", "Iran", "Iraq", "Syria"];
  return watch.includes(from.country) || watch.includes(to.country);
}

function renderSummary(from, to, distance) {
  const operator = $("airline").value.trim();
  const altLabel = $("alternative").options[$("alternative").selectedIndex].text;
  const sameCountry = from.country === to.country;
  const bullets = [
    `${sameCountry ? "Domestic" : "International"} journey of approximately ${Math.round(distance).toLocaleString()} km between ${from.name} and ${to.name}.`,
    operator ? `${operator} is user-supplied; AOC status, operating carrier, aircraft assignment and current schedule still require authoritative verification.` : "No operator was supplied; airline, AOC, operating carrier and aircraft checks remain open.",
    conflictContext(from, to) ? "The itinerary requires conflict-zone, airspace restriction and route-corridor review before advice is issued." : "No conflict-zone conclusion is automated; EASA CZIB and applicable authority notices remain part of the manual review.",
    `${altLabel} is retained as a resilience option and should be compared on total exposure, reliability, transfer risk and journey time—not travel time alone.`
  ];
  $("summary-list").innerHTML = bullets.map((text) => `<li>${escapeHTML(text)}</li>`).join("");
  const triggers = [
    "New NOTAM, airspace restriction, severe weather warning or airport closure",
    "Operator, aircraft, schedule or connection changes after assessment",
    "Material deterioration in local security, surface-transfer or medical support conditions"
  ];
  $("trigger-list").innerHTML = triggers.map((text) => `<li>${escapeHTML(text)}</li>`).join("");
  return bullets;
}

function renderRisks(from, to) {
  const regional = /Regional/.test(to.type);
  const conflict = conflictContext(from, to);
  const alternative = $("alternative").value;
  const risks = [
    ["Flight safety", "pending", "PENDING", "Requires operator, aircraft, maintenance oversight and official occurrence-history checks."],
    ["Conflict / airspace", conflict ? "moderate" : "pending", conflict ? "MODERATE" : "VERIFY", conflict ? "Destination or corridor context warrants explicit airspace and conflict-source review." : "No automated corridor clearance; verify current CZIBs, restrictions and NOTAMs."],
    ["Weather / environment", "pending", "LIVE CHECK", "METAR/TAF retrieval is attempted below; warnings, SIGMETs and local operating minima need analyst interpretation."],
    ["Airline / regulatory", "pending", "PENDING", "Confirm state AOC, restrictions, actual operating carrier and any regulator action."],
    ["Airport / infrastructure", regional ? "moderate" : "pending", regional ? "MODERATE" : "VERIFY", regional ? "Regional destination: verify runway status, rescue/fire category, fuel, lighting and diversion options." : "Verify operational restrictions, alternates and ground-handling capacity."],
    ["Operational disruption", regional ? "moderate" : "pending", regional ? "MODERATE" : "VERIFY", "Check recent completion performance, schedule frequency, recovery options, strikes and dependencies."],
    ["Travel security / ground", "pending", "VERIFY", "Review official travel advice, airport transfer, protests, crime, health and medical response context."],
    ["Surface alternative", alternative === "none" ? "gap" : "moderate", alternative === "none" ? "LIMITED" : "COMPARE", "Compare ferry/road/rail exposure, total journey time, weather dependence and transfer risk."],
    ["Data completeness", "gap", "PARTIAL", "Public demo coverage is intentionally incomplete; missing feeds are treated as information gaps, not reassuring evidence."]
  ];
  $("risk-grid").innerHTML = risks.map(([name, cls, level, note]) => `<div class="risk-card"><div class="risk-top"><strong>${escapeHTML(name)}</strong><span class="risk-level ${cls}">${escapeHTML(level)}</span></div><p>${escapeHTML(note)}</p></div>`).join("");
}

function renderComparison(distance) {
  const alt = $("alternative").options[$("alternative").selectedIndex].text;
  const roughFlight = distance < 600 ? "~1–2 h + processing" : `~${Math.max(2, Math.round(distance / 700))} h + processing`;
  const rows = [
    ["Dimension", "Air", alt],
    ["Indicative time", roughFlight, "Requires local timetable"],
    ["Primary dependency", "Aircraft, crew, weather, airfield", "Service, road, sea/weather conditions"],
    ["Recovery options", "Schedule frequency / alternate airport", "Sailings, vehicles, daylight and transfers"],
    ["Assessment status", "Operator checks pending", "Feasibility checks pending"]
  ];
  $("comparison-table").innerHTML = rows.map((row) => `<div class="comparison-row">${row.map((cell) => `<span>${escapeHTML(cell)}</span>`).join("")}</div>`).join("");
}

function baseEvidence(from, to, retrieval) {
  const countryAdvice = to.country === "Solomon Islands" ? "https://www.gov.uk/foreign-travel-advice/solomon-islands" : "https://www.gov.uk/foreign-travel-advice";
  return [
    { title: "NOAA Aviation Weather Center", purpose: `METAR / TAF attempt for ${from.icao}, ${to.icao}`, url: "https://aviationweather.gov/data/api/", access: "Checking", cls: "manual", published: "Awaiting source response", retrieved: retrieval, confidence: "Pending" },
    { title: "EASA Conflict Zone Information Bulletins", purpose: "Conflict-zone and airspace advisory review", url: "https://www.easa.europa.eu/en/domains/air-operations/czibs", access: "Manual review", cls: "manual", published: "Current source page; bulletin dates vary", retrieved: retrieval, confidence: "Authoritative source" },
    { title: "EU Air Safety List", purpose: "Operator / state restriction screening", url: "https://transport.ec.europa.eu/transport-themes/eu-air-safety-list_en", access: "Manual review", cls: "manual", published: "Current published list", retrieved: retrieval, confidence: "Authoritative source" },
    { title: "Public airport reference snapshot", purpose: `${from.icao} and ${to.icao} coordinates / identifiers`, url: "https://ourairports.com/data/", access: "Embedded subset", cls: "manual", published: "Not provided by source", retrieved: retrieval, confidence: "Moderate; verify with AIP" },
    { title: "Official travel advice directory", purpose: `${to.country} security, health and entry context`, url: countryAdvice, access: "Manual review", cls: "manual", published: "Page update time varies", retrieved: retrieval, confidence: "Authoritative source" },
    { title: "EUROCONTROL EAD / relevant ANSP", purpose: "NOTAM, AIP, FIR and operational restriction data", url: "https://www.eurocontrol.int/service/european-ais-database", access: "Agreement / account required", cls: "restricted", published: "Not retrieved in demo", retrieved: retrieval, confidence: "Information gap" },
    { title: "State aviation authority + operator", purpose: "AOC, operating carrier, fleet, schedule and operational status", url: "https://www.icao.int/safety/Pages/default.aspx", access: "Manual verification", cls: "manual", published: "Not provided by source", retrieved: retrieval, confidence: "Pending" }
  ];
}

function renderEvidence() {
  $("evidence-body").innerHTML = state.evidence.map((item) => `<tr>
    <td><a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.title)}</a><small>${escapeHTML(item.purpose)}</small></td>
    <td><span class="source-state ${escapeHTML(item.cls)}"><i></i>${escapeHTML(item.access)}</span></td>
    <td>${escapeHTML(item.published)}</td><td>${escapeHTML(item.retrieved)}</td><td>${escapeHTML(item.confidence)}</td>
  </tr>`).join("");
}

async function fetchJSON(url, timeout = 7500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timer); }
}

function weatherObservation(item, type) {
  if (!item) return null;
  const raw = item.rawOb || item.rawTAF || item.raw_text || item.rawText || "Source returned structured data without a raw bulletin.";
  const issued = item.reportTime || item.obsTime || item.issueTime || item.validTimeFrom || null;
  return { type, raw, issued };
}

async function retrieveWeather(from, to) {
  const ids = `${encodeURIComponent(from.icao)},${encodeURIComponent(to.icao)}`;
  const metarURL = `https://aviationweather.gov/api/data/metar?ids=${ids}&format=json&hours=6`;
  const tafURL = `https://aviationweather.gov/api/data/taf?ids=${ids}&format=json`;
  const retrieval = utcStamp();
  const outcomes = await Promise.allSettled([fetchJSON(metarURL), fetchJSON(tafURL)]);
  const records = [];
  if (outcomes[0].status === "fulfilled" && Array.isArray(outcomes[0].value)) outcomes[0].value.forEach((item) => records.push(weatherObservation(item, "METAR")));
  if (outcomes[1].status === "fulfilled" && Array.isArray(outcomes[1].value)) outcomes[1].value.forEach((item) => records.push(weatherObservation(item, "TAF")));
  state.weather = records.filter(Boolean);
  const weatherEvidence = state.evidence[0];

  if (state.weather.length) {
    $("weather-state").textContent = "LIVE PUBLIC DATA";
    $("weather-state").className = "data-chip live";
    $("weather-content").innerHTML = state.weather.slice(0, 5).map((record) => `<div class="weather-block"><div><b>${escapeHTML(record.type)}</b><small>Published: ${escapeHTML(shortUTC(record.issued))}</small></div><code>${escapeHTML(record.raw)}</code></div>`).join("") + `<p class="table-note">Retrieved ${escapeHTML(retrieval)}. Raw reports require qualified interpretation and do not by themselves establish flight suitability.</p>`;
    Object.assign(weatherEvidence, { access: "Live public response", cls: "live", published: state.weather.map((w) => shortUTC(w.issued)).filter((v) => !v.startsWith("Not provided")).join("; ") || "Not provided by source", retrieved: retrieval, confidence: "High for retrieval; interpretation pending" });
  } else {
    $("weather-state").textContent = "FEED UNAVAILABLE";
    $("weather-state").className = "data-chip unavailable";
    $("weather-content").innerHTML = `<p><strong>No current METAR or TAF was returned.</strong></p><p class="table-note">This may mean the aerodrome does not publish the selected product, the feed is temporarily unavailable, or browser access was blocked. It is recorded as an information gap—not an indication of favourable weather.</p><a href="https://aviationweather.gov/" target="_blank" rel="noopener noreferrer">Open Aviation Weather Center ↗</a>`;
    Object.assign(weatherEvidence, { access: "Unavailable in this run", cls: "restricted", published: "Not provided by source", retrieved: retrieval, confidence: "Information gap" });
  }
  renderEvidence();
  updateBrief();
}

function populateAnalystFields(from, to) {
  const operator = $("airline").value.trim() || "the selected operator";
  $("confirmed-facts").value = `${from.name} (${from.icao}) to ${to.name} (${to.icao}); approximate great-circle distance ${Math.round(state.distance)} km. Public-source retrieval attempted at ${utcStamp(state.generatedAt)}.`;
  $("information-gaps").value = `Current NOTAMs/AIP details; ${operator} AOC and actual operating carrier; aircraft assignment; recent completion performance; local diversion, rescue/fire and surface-transfer details.`;
  $("mitigations").value = "Confirm operator and schedule directly; check authoritative NOTAM/AIP and severe-weather sources close to departure; retain a flexible booking and surface alternative; define re-assessment triggers.";
  $("analyst-recommendation").value = "Proceed to targeted verification before booking. Issue a final recommendation only after the listed information gaps and decision triggers have been reviewed by an analyst.";
}

function updateBrief() {
  if (!state.from || !state.to) return;
  const weatherLine = state.weather.length ? `${state.weather.length} live METAR/TAF record(s) returned; qualified interpretation pending.` : "No live METAR/TAF returned; weather remains an information gap.";
  const recommendation = "Proceed to targeted verification before booking; do not treat missing public data as a favourable finding.";
  $("recommendation-text").textContent = recommendation;
  state.latestBrief = [
    "AEROROUTE INTELLIGENCE — PRELIMINARY BRIEF",
    `${state.from.name} (${state.from.icao}) → ${state.to.name} (${state.to.icao})`,
    `Run: ${state.runId} | Extracted: ${utcStamp(state.generatedAt)}`,
    `Distance: ${Math.round(state.distance)} km`,
    `Recommendation: ${recommendation}`,
    `Weather: ${weatherLine}`,
    "Open checks: operator/AOC, aircraft, NOTAM/AIP, current restrictions, disruption history, infrastructure and surface alternative.",
    "This is an unofficial candidate concept demo for preliminary research, not operational flight-planning or regulatory advice."
  ].join("\n");
}

async function runAssessment() {
  const from = findAirport($("from").value);
  const to = findAirport($("to").value);
  if (!from || !to) {
    showToast("Select a supported airport, city, IATA or ICAO code from the list.");
    (!from ? $("from") : $("to")).focus();
    return { ok: false, error: "Unsupported location" };
  }
  if (from.icao === to.icao) { showToast("Origin and destination must be different."); return { ok: false, error: "Same origin and destination" }; }

  state.from = from; state.to = to; state.distance = haversine(from, to); state.runId = createRunId(); state.generatedAt = new Date(); state.weather = [];
  const retrieval = utcStamp(state.generatedAt);
  state.evidence = baseEvidence(from, to, retrieval);
  $("empty-state").hidden = true;
  $("results").hidden = false;
  $("route-title").textContent = `${from.city} → ${to.city}`;
  $("run-meta").textContent = `${state.runId} · extracted ${retrieval}`;
  $("weather-state").textContent = "CHECKING";
  $("weather-state").className = "data-chip pending";
  $("weather-content").innerHTML = '<div class="skeleton"></div><div class="skeleton short"></div>';
  renderRouteMap(from, to);
  renderRouteFacts(from, to, state.distance);
  renderSummary(from, to, state.distance);
  renderRisks(from, to);
  renderComparison(state.distance);
  renderEvidence();
  populateAnalystFields(from, to);
  updateBrief();
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  await retrieveWeather(from, to);
  return { ok: true, runId: state.runId, route: `${from.icao}-${to.icao}`, distanceKm: Math.round(state.distance), liveWeatherRecords: state.weather.length };
}

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const safeRegister = (tool) => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
  safeRegister({
    name: "run_route_assessment",
    title: "Run route assessment",
    description: "Set the visible origin and destination and run the same preliminary public-source assessment as the page form.",
    inputSchema: { type: "object", properties: { from: { type: "string", description: "Airport city, IATA or ICAO" }, to: { type: "string", description: "Airport city, IATA or ICAO" }, airline: { type: "string" } }, required: ["from", "to"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    async execute(input) {
      if (!input || typeof input.from !== "string" || typeof input.to !== "string" || !findAirport(input.from) || !findAirport(input.to)) throw new Error("Use supported airport cities, IATA or ICAO codes.");
      $("from").value = displayAirport(findAirport(input.from));
      $("to").value = displayAirport(findAirport(input.to));
      if (typeof input.airline === "string") $("airline").value = input.airline.slice(0, 120);
      return await runAssessment();
    }
  });
  safeRegister({
    name: "load_demo_scenario",
    title: "Load Honiara to Munda demo",
    description: "Load the visible Honiara to Munda case study inputs without issuing a final travel recommendation.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute() { setDemoValues(); return { loaded: true, route: "AGGH-AGGM" }; }
  });
  window.addEventListener("beforeunload", () => lifecycle.abort(), { once: true });
}

function init() {
  $("airport-options").innerHTML = AIRPORTS.map((a) => `<option value="${escapeHTML(displayAirport(a))}">${escapeHTML(a.city)}, ${escapeHTML(a.country)}</option>`).join("");
  setDefaultDates();
  $("assessment-form").addEventListener("submit", (event) => { event.preventDefault(); void runAssessment(); });
  $("load-demo").addEventListener("click", () => { setDemoValues(); showToast("Honiara to Munda example loaded."); });
  $("reset-form").addEventListener("click", resetAll);
  $("swap-route").addEventListener("click", () => { const temp = $("from").value; $("from").value = $("to").value; $("to").value = temp; });
  $("print-report").addEventListener("click", () => window.print());
  $("copy-brief").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(state.latestBrief); showToast("Preliminary brief copied."); }
    catch { showToast("Copy was blocked by the browser. Use Export / print PDF instead."); }
  });
  registerWebMCP();
  setDemoValues();
}

document.addEventListener("DOMContentLoaded", init);
