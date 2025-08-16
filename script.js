let members = [];

async function loadMembers() {
  try {
    const response = await fetch("members.json"); // ensure members.json is in the same folder as index.html
    members = await response.json();
    displayMembers(members); // show all members on page load
  } catch (error) {
    console.error("Error loading members.json:", error);
  }
}

const searchBar = document.getElementById("searchBar");
const memberList = document.getElementById("memberList");
const suggestions = document.getElementById("suggestions");

// Display members
function displayMembers(memberArray) {
  memberList.innerHTML = "";
  if (memberArray.length === 0) {
    memberList.innerHTML = "<p>No members found.</p>";
    return;
  }

  memberArray.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("member-card");
    card.innerHTML = `
      <h3>${member.name}</h3>
      <p><strong>Role:</strong> ${member.role}</p>
      <p><strong>Email:</strong> ${member.email}</p>
    `;
    memberList.appendChild(card);
  });
}

// Handle search input
searchBar.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();

  // Filter members
  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(query) ||
    m.role.toLowerCase().includes(query) ||
    m.email.toLowerCase().includes(query)
  );

  displayMembers(filtered);

  // Show suggestions
  suggestions.innerHTML = "";
  if (query.length > 0) {
    const suggestedNames = members
      .filter(m => m.name.toLowerCase().startsWith(query))
      .map(m => m.name);

    suggestedNames.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      li.addEventListener("click", () => {
        searchBar.value = name;
        displayMembers(members.filter(m => m.name === name));
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(li);
    });
  }
});

// Initialize
loadMembers();
