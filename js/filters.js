(function () {
  const centers = {
    Amsterdam: [52.3676, 4.9041],
    Rotterdam: [51.9244, 4.4777],
    Utrecht: [52.0907, 5.1214],
    "Den Haag": [52.0705, 4.3007],
    Maastricht: [50.8514, 5.691],
    Haarlem: [52.3874, 4.6462]
  };

  const state = {
    destination: "",
    maxPrice: 450,
    stars: new Set(),
    amenities: new Set(),
    distance: 10,
    sort: "relevance",
    mode: "grid",
    page: 1,
    perPage: 8
  };

  function hotels() {
    return window.StayNLHotels || [];
  }

  function distanceKm(hotel) {
    const center = centers[hotel.city];
    if (!center) return 0;
    const toRad = (value) => value * Math.PI / 180;
    const earth = 6371;
    const dLat = toRad(hotel.lat - center[0]);
    const dLng = toRad(hotel.lng - center[1]);
    const lat1 = toRad(center[0]);
    const lat2 = toRad(hotel.lat);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function updateRangeFill(input) {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || 0);
    const percent = ((value - min) / (max - min)) * 100;
    input.style.setProperty("--range-fill", `${percent}%`);
  }

  function filtered() {
    const query = state.destination.trim().toLowerCase();
    let list = hotels().filter((hotel) => {
      const haystack = `${hotel.name} ${hotel.city} ${hotel.address}`.toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (hotel.pricePerNight > state.maxPrice) return false;
      if (state.stars.size && !state.stars.has(String(hotel.stars))) return false;
      if (distanceKm(hotel) > state.distance) return false;
      for (const amenity of state.amenities) {
        if (!hotel.amenities.includes(amenity)) return false;
      }
      return true;
    });

    if (state.sort === "price") list = list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (state.sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    else list = list.sort((a, b) => (b.rating * 100 + b.reviewCount / 10) - (a.rating * 100 + a.reviewCount / 10));
    return list;
  }

  function render() {
    const grid = document.querySelector("[data-results-grid]");
    const count = document.querySelector("[data-results-count]");
    const pageNav = document.querySelector("[data-pagination]");
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / state.perPage));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.perPage;
    const visible = list.slice(start, start + state.perPage);
    const destination = state.destination ? ` in ${state.destination}` : "";

    count.textContent = `${list.length} ${list.length === 1 ? "hotel" : "hotels"} gevonden${destination}`;
    grid.classList.toggle("card-mode", state.mode === "card");
    grid.classList.toggle("grid-mode", state.mode !== "card");
    grid.innerHTML = "";
    if (!visible.length) {
      grid.innerHTML = '<div class="empty-state"><h3>Geen hotels gevonden</h3><p>Pas de filters aan of zoek op een andere Nederlandse stad.</p></div>';
    } else {
      visible.forEach((hotel) => grid.appendChild(window.StayNL.resultCard(hotel)));
    }

    pageNav.innerHTML = "";
    if (pages > 1) {
      for (let page = 1; page <= pages; page += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = page;
        button.classList.toggle("is-active", page === state.page);
        button.addEventListener("click", () => {
          state.page = page;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        pageNav.appendChild(button);
      }
    }

    window.StayNL.reveal(grid);
  }

  function init() {
    const grid = document.querySelector("[data-results-grid]");
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    state.destination = params.get("destination") || "";

    const destinationInput = document.querySelector('[name="destination"]');
    const checkin = document.querySelector('[name="checkin"]');
    const checkout = document.querySelector('[name="checkout"]');
    const guests = document.querySelector('[name="guests"]');
    if (destinationInput) destinationInput.value = state.destination;
    if (checkin && params.get("checkin")) checkin.value = params.get("checkin");
    if (checkout && params.get("checkout")) checkout.value = params.get("checkout");
    if (guests && params.get("guests")) guests.value = params.get("guests");

    document.querySelectorAll('input[type="range"]').forEach((input) => {
      updateRangeFill(input);
      input.addEventListener("input", () => {
        updateRangeFill(input);
        if (input.dataset.filter === "price") {
          state.maxPrice = Number(input.value);
          document.querySelector("[data-price-label]").innerHTML = `&euro;${state.maxPrice}`;
        }
        if (input.dataset.filter === "distance") {
          state.distance = Number(input.value);
          document.querySelector("[data-distance-label]").textContent = `${state.distance} km`;
        }
        state.page = 1;
        render();
      });
    });

    document.querySelectorAll("[data-star-filter]").forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) state.stars.add(input.value);
        else state.stars.delete(input.value);
        state.page = 1;
        render();
      });
    });

    document.querySelectorAll("[data-amenity-filter]").forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) state.amenities.add(input.value);
        else state.amenities.delete(input.value);
        state.page = 1;
        render();
      });
    });

    document.querySelector("[data-sort]")?.addEventListener("change", (event) => {
      state.sort = event.target.value;
      state.page = 1;
      render();
    });

    document.querySelectorAll("[data-view-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.viewMode;
        document.querySelectorAll("[data-view-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
        render();
      });
    });

    document.querySelector("[data-filter-reset]")?.addEventListener("click", () => {
      state.maxPrice = 450;
      state.distance = 10;
      state.stars.clear();
      state.amenities.clear();
      state.page = 1;
      document.querySelectorAll("[data-star-filter], [data-amenity-filter]").forEach((input) => {
        input.checked = false;
      });
      document.querySelector('[data-filter="price"]').value = "450";
      document.querySelector('[data-filter="distance"]').value = "10";
      document.querySelector("[data-price-label]").innerHTML = "&euro;450";
      document.querySelector("[data-distance-label]").textContent = "10 km";
      document.querySelectorAll('input[type="range"]').forEach(updateRangeFill);
      render();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
