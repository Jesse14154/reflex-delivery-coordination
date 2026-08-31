/* realtime.js — shared presentation helpers used by retailer.js / dispatcher.js / rider.js
   Does NOT open its own connection and does NOT touch any API calls.
   Each page keeps its own existing EventSource + event listeners exactly as before;
   this file just adds a toast pop-up and a "live" dot when those same events fire. */

function ensureToastRegion() {
  if (document.getElementById("toast-region")) return;
  const region = document.createElement("div");
  region.id = "toast-region";
  document.body.appendChild(region);
}

function showToast(message) {
  ensureToastRegion();
  const region = document.getElementById("toast-region");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="dot"></span><span>${message}</span>`;
  region.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3600);
}

function setLiveOn() {
  document.querySelectorAll(".live-dot").forEach((dot) => dot.classList.add("on"));
}

function setLiveOff() {
  document.querySelectorAll(".live-dot").forEach((dot) => dot.classList.remove("on"));
}

/* Formats the SQLite "YYYY-MM-DD HH:MM:SS" (UTC) timestamps used by
   created_at / updated_at into a readable local date + time string.
   Purely presentational — does not touch any API field or value. */
function formatDateTime(sqliteTimestamp) {
  if (!sqliteTimestamp) return "—";
  const iso = sqliteTimestamp.replace(" ", "T") + "Z";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return sqliteTimestamp;

  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const datePart = isToday
    ? "Today"
    : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  const timePart = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return `${datePart}, ${timePart}`;
}

/* The homepage (index.html) has a live indicator dot but no dashboard
   logic of its own, so it never opened a connection to /api/events —
   which is why it never lit up. This gives it a minimal read-only
   connection just to drive that dot; it doesn't fetch or render any
   delivery data. */
function initHomeLiveIndicator() {
  try {
    const events = new EventSource("/api/events");
    events.onopen = () => setLiveOn();
    events.onerror = () => setLiveOff();
  } catch (err) {
    setLiveOff();
  }
}