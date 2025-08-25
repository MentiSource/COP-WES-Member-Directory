let members = [];

// ---- DOM ----
const searchBar       = document.getElementById("searchBar");
const suggestions     = document.getElementById("suggestions");
const memberList      = document.getElementById("memberList");
const regionFilter    = document.getElementById("regionFilter");
const pathogenFilter  = document.getElementById("pathogenFilter");
const settingFilter   = document.getElementById("settingFilter");
const sortBy          = document.getElementById("sortBy");

// ---- Normalize JSON keys ----
function normalizeMember(raw) {
  return {
    name: raw.name || "",
    pronouns: raw.pronouns || "",
    professionalTitle: raw.professionalTitle || raw["Professional Title / Role"] || "",
    sector: raw.sector || "",
    primaryRole: raw.primaryRole || raw["primary role"] || "",
    careerStage: raw.careerStage || raw["Career stage"] || "",
    organization: raw.organization || raw["Organization / Affiliation"] || "",
    healthThreat: raw.healthThreat || raw["Health threat (pathogen/threat)"] || "",
    healthThreatCategory: raw.healthThreatCategory || raw["Health threats (category)"] || "",
    laboratoryMethods: raw.laboratoryMethods || raw["Laboratory methods"] || "",
    region: raw.region || "",
    pathogen: raw.pathogen || "",
    setting: raw.setting || raw["setting of work"] || "",
    expertise: raw.expertise || "",
    email: raw.email || "",
    photo: raw.photo || "images/default.jpg",
    interest: raw.interest || raw.Interests || "",
    language: raw.language || raw["Language "] || "",
    country_work: raw.country_work || raw["Country (work)"] || "",
    country_home: raw.country_home || raw["Country (home)"] || ""
  };
}

// ---- Load data ----
fetch("members.json")
  .then(r => r.json())
  .then(data => {
    members = (data || []).map(normalizeMember);

    const uniq = arr => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    uniq(members.map(m => m.region)).forEach(v => regionFilter.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
    uniq(members.map(m => m.pathogen)).forEach(v => pathogenFilter.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
    uniq(members.map(m => m.setting)).forEach(v => settingFilter.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));

    recompute();
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
      <img src="${member.photo}" alt="${member.name}" class="member-photo">
      <div class="member-info">
        <h3>${member.name}</h3>
        <p><strong>Pronouns:</strong> ${member.pronouns}</p>
        <p><strong>Professional Title / Role:</strong> ${member.professionalTitle}</p>
        <p><strong>Sector:</strong> ${member.sector}</p>
        <p><strong>Primary Role:</strong> ${member.primaryRole}</p>
        <p><strong>Career Stage:</strong> ${member.careerStage}</p>
        <p><strong>Organization / Affiliation:</strong> ${member.organization}</p>
        <p><strong>Region:</strong> ${member.region}</p>
        <p><strong>Pathogen:</strong> ${member.pathogen}</p>
        <p><strong>Health Threat:</strong> ${member.healthThreat}</p>
        <p><strong>Health Threat (Category):</strong> ${member.healthThreatCategory}</p>
        <p><strong>Setting of Work:</strong> ${member.setting}</p>
        <p><strong>Expertise:</strong> ${member.expertise}</p>
        <p><strong>Laboratory Methods:</strong> ${member.laboratoryMethods}</p>
        <p><strong>Language:</strong> ${member.language}</p>
        <p><strong>Interest:</strong> ${member.interest}</p>
        <p><strong>Country (Work):</strong> ${member.country_work}</p>
        <p><strong>Country (Home):</strong> ${member.country_home}</p>
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
      Object.values(m).some(val => (val || "").toString().toLowerCase().includes(q));

    const regionOK   = !r || (m.region === r);
    const pathogenOK = !p || (m.pathogen === p);
    const settingOK  = !s || (m.setting === s);

    return inSearch && regionOK && pathogenOK && settingOK;
  });

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

document.addEventListener("click", (e) => {
  if (!e.target.closest("#suggestions") && e.target !== searchBar) suggestions.innerHTML = "";
});

function checkPassword() {
  const password = document.getElementById("password").value;
  const correctPassword = "copwes1";
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
