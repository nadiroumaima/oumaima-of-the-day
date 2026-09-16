const NOTE_FILES = ["small-ideas.md"];

function parseNote(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const [, frontmatter, body] = match;
  const meta = {};
  frontmatter.split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i === -1) return;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  const paragraphs = body
    .trim()
    .split(/\n\s*\n/)
    .map((block) =>
      block.trim().startsWith(">")
        ? `<blockquote>${block.trim().slice(1).trim()}</blockquote>`
        : `<p>${block.trim()}</p>`,
    );
  return {
    id: meta.id,
    time: meta.time,
    title: meta.title,
    body: paragraphs,
  };
}

async function loadPosts() {
  const files = await Promise.all(
    NOTE_FILES.map((f) => fetch(`notes/${f}`).then((r) => r.text())),
  );
  return files.map(parseNote);
}

let posts = [];
const companion = document.querySelector("#companion"),
  motion = document.querySelector("#motion"),
  statusLine = document.querySelector("#companion-status");
const reduce = matchMedia("(prefers-reduced-motion:reduce)");
let paused = reduce.matches,
  current = 0;
const discovered = new Set();

function renderEntries() {
  const list = document.querySelector("#entries");
  list.replaceChildren();
  posts.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "entry";
    b.innerHTML = `<span class="entry-number">0${i + 1}</span><span class="entry-content">${p.title}<small>  ${p.time}${discovered.has(i) ? " · Discovered" : ""}</small></span><span class="entry-arrow" aria-hidden="true">↗</span>`;
    b.onclick = () => openPost(i, true);
    list.appendChild(b);
  });
  document.querySelector("#found-count").textContent =
    `${discovered.size} of ${posts.length} discovered`;
}

function openPost(i, scroll = false) {
  current = i;
  discovered.add(i);
  const p = posts[i];
  document.querySelector("#title").textContent = p.title;
  document.querySelector("#reading-time").textContent = p.time;
  document.querySelector("#body").innerHTML = p.body.join("");
  document.title = p.title + " — Oumaima";
  renderEntries();
  if (scroll) {
    history.replaceState(null, "", "#" + p.id);
    document.querySelector("#reading").scrollIntoView({ block: "start" });
    document.querySelector("#article").focus({ preventScroll: true });
  }
}

function choose() {
  const choices = posts.map((_, i) => i).filter((i) => i !== current);
  const next = choices[Math.floor(Math.random() * choices.length)];
  statusLine.textContent = "Here's a little thought for you.";
  openPost(next, true);
}
companion.onclick = choose;
document.querySelector("#next-note").onclick = choose;

function setMotion() {
  document.body.classList.toggle("paused", paused);
  motion.textContent = paused ? "Play motion" : "Pause motion";
  motion.setAttribute("aria-pressed", String(paused));
}
motion.onclick = () => {
  paused = !paused;
  setMotion();
};
reduce.addEventListener("change", () => {
  paused = reduce.matches;
  setMotion();
});
setMotion();

loadPosts().then((loaded) => {
  posts = loaded;
  const initial = posts.findIndex((p) => "#" + p.id === location.hash);
  openPost(initial < 0 ? 0 : initial);
  window.addEventListener("hashchange", () => {
    const i = posts.findIndex((p) => "#" + p.id === location.hash);
    if (i >= 0) openPost(i, true);
  });
});
