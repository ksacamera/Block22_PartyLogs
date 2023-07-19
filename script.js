const newPartyForm = document.querySelector("#new-party-form");
const partyContainer = document.querySelector("#party-container");

const PARTIES_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/parties";
const GUESTS_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/guests";
const RSVPS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/rsvps";
const GIFTS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/gifts";

const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.log(error);
  }
};

const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.log(error);
  }
};

const deleteParty = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const renderSinglePartyById = async (id) => {
  try {
    const party = await getPartyById(id);

    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    // const giftsResponse = await fetch(`${PARTIES_API_URL}/gifts/${id}`);
    // const gifts = await giftsResponse.json();

    const partyDetailsElement = document.createElement("div");
    partyDetailsElement.classList.add("party-details");
    partyDetailsElement.innerHTML = `
      <h2>${party.name}</h2>
      <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.time}</p>
      <p>${party.location}</p>
      <h3>Guests:</h3>
      <ul>
        ${guests
          .map(
            (guest, index) => `
            <li>
              <div>${guest.name}</div>
              <div>${rsvps[index].status}</div>
            </li>
          `
          )
          .join("")}
      </ul>
      <button class="close-button">Close</button>
    `;
    partyContainer.appendChild(partyDetailsElement);

    const closeButton = partyDetailsElement.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      partyDetailsElement.remove();
    });
  } catch (error) {
    // console.log(error);
  }
};

const renderParties = async () => {
  try {
    partyContainer.innerHTML = "";

    const parties = await getAllParties();

    parties.forEach((party) => {
      const partyElement = document.createElement("div");
      partyElement.classList.add("party");
      partyElement.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.time}</p>
        <p>${party.location}</p>
        <button class="details-button" data-id="${party.id}">See Details</button>
        <button class="delete-button" data-id="${party.id}">Delete</button>
      `;
      partyContainer.appendChild(partyElement);

      const detailsButton = partyElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;

        await renderSinglePartyById(id);
      });

      const deleteButton = partyElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        await deleteParty(id);
        await renderParties();
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  try {
    await renderParties();
  } catch (error) {
    console.log(error);
  }
};

init();
