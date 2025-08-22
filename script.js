let members = [];

// ---- DOM ----
const searchBar       = document.getElementById("searchBar");
const suggestions     = document.getElementById("suggestions");
const memberList      = document.getElementById("memberList");
const regionFilter    = document.getElementById("regionFilter");
const pathogenFilter  = document.getElementById("pathogenFilter");
const settingFilter   = document.getElementById("settingFilter");
const sortBy          = document.getElementById("sortBy");

// ---- Load data ----
fetch("members.json")
  .then(r => r.json())
  .then(data => {
    members = data || [];

    // populate filter options
    const uniq = arr => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    uniq(members.map(m => m.region)).forEach(v => regionFilter.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
    uniq(members.map(m => m.pathogen)).forEach(v => pathogenFilter.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
    uniq(members.map(m => m.setting)).forEach(v => settingFilter.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));

    recompute();           // initial render (sorted by Name by default)
  })
  .catch(err => console.error("Error loading members.json:", err));

// ---- Render cards ----
function displayMembers(list) {
  memberList.innerHTML = "";
  if (!list.length) {
    memberList.innerHTML = "<p>No members found.</p>";
    return;
  }

  list.forEach(member => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.innerHTML = `
      <img src="${member.photo || 'images/default.jpg'}" alt="${member.name}" class="member-photo">
      <div class="member-info">
        <h3>${member.name || ''}</h3>
        <p><strong>Region:</strong> ${member.region || ''}</p>
        <p><strong>Pathogen:</strong> ${member.pathogen || ''}</p>
        <p><strong>Setting:</strong> ${member.setting || ''}</p>
        <p><strong>Expertise:</strong> ${member.expertise || ''}</p>
        <p><strong>Language:</strong> ${member.language || ''}</p>
        <p><strong>Interest:</strong> ${member.interest || ''}</p>
        <p><strong>Country (Work):</strong> ${member.countryWork || ''}</p>
        <p><strong>Country (Home):</strong> ${member.countryHome || ''}</p>
        <p><strong>Email:</strong> ${member.email ? `<a href="mailto:${member.email}">${member.email}</a>` : ''}</p>
      </div>
    `;
    memberList.appendChild(card);
  });
}

// ---- Suggestions ----
function updateSuggestions(query, sourceList) {
  suggestions.innerHTML = "";
  if (!query) return;

  const names = [...new Set(
    sourceList
      .map(m => m.name || "")
      .filter(n => n.toLowerCase().includes(query))
  )].slice(0, 8);

  names.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => {
      searchBar.value = name;
      recompute();
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(li);
  });
}

// ---- Filter + Sort + Render pipeline ----
function recompute() {
  const q = searchBar.value.trim().toLowerCase();
  const r = regionFilter.value;
  const p = pathogenFilter.value;
  const s = settingFilter.value;
  const key = sortBy.value || "name";

  let list = members.filter(m => {
    const inSearch =
      !q ||
      (m.name || "").toLowerCase().includes(q) ||
      (m.region || "").toLowerCase().includes(q) ||
      (m.pathogen || "").toLowerCase().includes(q) ||
      (m.setting || "").toLowerCase().includes(q) ||
      (m.expertise || "").toLowerCase().includes(q) ||
      (m.language || "").toLowerCase().includes(q) ||
      (m.interest || "").toLowerCase().includes(q) ||
      (m.countryWork || "").toLowerCase().includes(q) ||
      (m.countryHome || "").toLowerCase().includes(q);

    const regionOK   = !r || (m.region === r);
    const pathogenOK = !p || (m.pathogen === p);
    const settingOK  = !s || (m.setting === s);

    return inSearch && regionOK && pathogenOK && settingOK;
  });

  // sort (case-insensitive, handles missing fields)
  list.sort((a, b) =>
    ((a[key] || "") + "").toLowerCase()
      .localeCompare(((b[key] || "") + "").toLowerCase(), undefined, { sensitivity: "base", numeric: true })
  );

  displayMembers(list);
  updateSuggestions(q, list);
}

// ---- Events ----
searchBar.addEventListener("input", recompute);
regionFilter.addEventListener("change", recompute);
pathogenFilter.addEventListener("change", recompute);
settingFilter.addEventListener("change", recompute);
sortBy.addEventListener("change", recompute);

// close suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#suggestions") && e.target !== searchBar) suggestions.innerHTML = "";
});

function checkPassword() {
  const password = document.getElementById("password").value;
  const correctPassword = "copwes1"; // 🔑 change this password
  if (password === correctPassword) {
    localStorage.setItem("authenticated", "true");
    window.location.href = "home.html";
  } else {
    document.getElementById("error").innerText = "❌ Incorrect password. Try again.";
  }
}

const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}