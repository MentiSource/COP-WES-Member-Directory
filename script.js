let members = [];

let members = [];

// Load members.json
fetch("members.json")
  .then(response => response.json())
  .then(data => {
    members = data;
    displayMembers(members); // show all members at first
  });

const searchBar = document.getElementById("searchBar");
const memberList = document.getElementById("memberList");
const suggestions = document.getElementById("suggestions");

// Display members in cards
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

// Search + suggestions
searchBar.addEventListener("input", function () {
  const query = this.value.toLowerCase();

  // Filter members
  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(query) ||
    m.role.toLowerCase().includes(query) ||
    m.email.toLowerCase().includes(query)
  );

  displayMembers(filtered);

  // Update suggestions
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

// fetch('members.json')
//   .then(response => response.json())
//   .then(data => {
//     const memberList = document.getElementById('memberList');
//     const searchInput = document.getElementById('searchInput');
//     const regionFilter = document.getElementById('regionFilter');
//     const pathogenFilter = document.getElementById('pathogenFilter');
//     const settingFilter = document.getElementById('settingFilter');
//     const sortBy = document.getElementById('sortBy');

//     const allRegions = [...new Set(data.map(m => m.region))];
//     const allPathogens = [...new Set(data.map(m => m.pathogen))];
//     const allSettings = [...new Set(data.map(m => m.setting))];

//     // Populate filter dropdowns
//     allRegions.forEach(region => {
//       regionFilter.innerHTML += `<option value="${region}">${region}</option>`;
//     });
//     allPathogens.forEach(pathogen => {
//       pathogenFilter.innerHTML += `<option value="${pathogen}">${pathogen}</option>`;
//     });
//     allSettings.forEach(setting => {
//       settingFilter.innerHTML += `<option value="${setting}">${setting}</option>`;
//     });

//     function displayMembers(members) {
//       memberList.innerHTML = '';
//       members.forEach(member => {
//         const card = document.createElement('div');
//         card.className = 'member-card';
//         card.innerHTML = `
//           <img src="${member.photo || 'images/default.jpg'}" alt="${member.name}" />
//           <h2>${member.name}</h2>
//           <p><strong>Region:</strong> ${member.region}</p>
//           <p><strong>Pathogen Focus:</strong> ${member.pathogen}</p>
//           <p><strong>Setting:</strong> ${member.setting}</p>
//           <p><strong>Expertise:</strong> ${member.expertise}</p>
//           <p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
//         `;
//         memberList.appendChild(card);
//       });
//     }

//     function filterAndSortMembers() {
//       const query = searchInput.value.toLowerCase();
//       const region = regionFilter.value;
//       const pathogen = pathogenFilter.value;
//       const setting = settingFilter.value;
//       const sort = sortBy.value;

//       let filtered = data.filter(member =>
//         (member.name.toLowerCase().includes(query) ||
//          member.region.toLowerCase().includes(query) ||
//          member.pathogen.toLowerCase().includes(query) ||
//          member.setting.toLowerCase().includes(query) ||
//          member.expertise.toLowerCase().includes(query)) &&
//         (region === '' || member.region === region) &&
//         (pathogen === '' || member.pathogen === pathogen) &&
//         (setting === '' || member.setting === setting)
//       );

//       filtered.sort((a, b) => a[sort].localeCompare(b[sort]));
//       displayMembers(filtered);
//     }

//     searchInput.addEventListener('input', filterAndSortMembers);
//     regionFilter.addEventListener('change', filterAndSortMembers);
//     pathogenFilter.addEventListener('change', filterAndSortMembers);
//     settingFilter.addEventListener('change', filterAndSortMembers);
//     sortBy.addEventListener('change', filterAndSortMembers);

//     // Initial display
//     filterAndSortMembers();
//   });

  