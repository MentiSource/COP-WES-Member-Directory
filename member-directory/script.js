fetch('members.json')
  .then(response => response.json())
  .then(data => {
    const memberList = document.getElementById('memberList');
    const searchInput = document.getElementById('searchInput');

    function displayMembers(members) {
      memberList.innerHTML = '';
      members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
          <img src="${member.photo || 'images/default.jpg'}" alt="${member.name}" />
          <h2>${member.name}</h2>
          <p><strong>Region:</strong> ${member.region}</p>
          <p><strong>Pathogen Focus:</strong> ${member.pathogen}</p>
          <p><strong>Setting:</strong> ${member.setting}</p>
          <p><strong>Expertise:</strong> ${member.expertise}</p>
          <p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
        `;
        memberList.appendChild(card);
      });
    }

    displayMembers(data);

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = data.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.region.toLowerCase().includes(query) ||
        member.pathogen.toLowerCase().includes(query) ||
        member.setting.toLowerCase().includes(query) ||
        member.expertise.toLowerCase().includes(query)
      );
      displayMembers(filtered);
    });
  });
