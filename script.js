// for iso date object const date = new Date(addNewParty.form.date.value)

const COHORT = "2502-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// === State ===
const state = {
  events: [],
};

// add event listener for form submission and create new event
const form = document.querySelector("#addEvent");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const party = {
    name: form.name.value,
    date: new Date(form.date.value),
    location: form.location.value,
    description: form.description.value,
  };

  await addEvent(party);
  render();
});

// updates state with events
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    state.events = result.data;
  } catch (error) {
    console.log(error);
  }
}

// asks API to create new event based given event (from user input)
async function addEvent(party) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(party),
    });

    const result = await response.json();
    render();
  } catch (error) {
    console.log(error);
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    render();
  } catch (error) {
    console.log(error);
  }
}

// === Render ===

// render events from state
function renderEvents() {
  const eventList = document.querySelector("#eventList");

  //   check if there are events in state to render
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events found.</li>";
    return;
  }

  //   map list of events and create card
  const eventCards = state.events.map((party) => {
    const card = document.createElement("li");
    card.innerHTML = `
        <h2>${party.name}</h2>
        <p>Date: ${new Date(party.date).toLocaleDateString()}</p>
        <p>Location: ${party.location}</p>
        <p>Description: ${party.description}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    card.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => deleteEvent(party.id));

    return card;
  });

  eventList.replaceChildren(...eventCards);
}

// sync state with API and rerender
async function render() {
  await getEvents();
  renderEvents();
}
// === Script ===
// initialr render
render();
