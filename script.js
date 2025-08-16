let members = [];

// Fetch members from JSON
fetch("members.json")
  .then(response => response.json())
  .then(data => {
    members = data;
    displayMembers(members);
  })
  .catch(err => console.error("Error loading members.json:", err));

// Search bar + suggestions
const searchBar = document.getElementById("searchBar");
const suggestions = document.getElementById("suggestions");

searchBar.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = members.filter(member =>
    member.name.toLowerCase().includes(query) ||
    member.region.toLowerCase().includes(query) ||
    member.pathogen.toLowerCase().includes(query) ||
    member.setting.toLowerCase().includes(query) ||
    member.expertise.toLowerCase().includes(query)
  );

  // Update suggestions
  suggestions.innerHTML = "";
  if (query.length > 0) {
    filtered.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m.name;
      li.addEventListener("click", () => {
        searchBar.value = m.name;
        suggestions.innerHTML = "";
        displayMembers([m]);
      });
      suggestions.appendChild(li);
    });
  }

  // Update displayed members
  displayMembers(filtered);
});

// Function to display members in cards
function displayMembers(list) {
  const container = document.getElementById("memberList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No members found.</p>";
    return;
  }

  list.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("member-card");

    card.innerHTML = `
      <img src="${member.photo}" alt="${member.name}" class="member-photo">
      <h2>${member.name}</h2>
      <p><strong>Region:</strong> ${member.region}</p>
      <p><strong>Pathogen:</strong> ${member.pathogen}</p>
      <p><strong>Setting:</strong> ${member.setting}</p>
      <p><strong>Expertise:</strong> ${member.expertise}</p>
      <p><a href="mailto:${member.email}">${member.email}</a></p>
    `;

    container.appendChild(card);
  });
}
