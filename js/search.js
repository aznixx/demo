(function () {
  const cityImages = {
    Amsterdam: "assets/cities/Amsterdam.jpg",
    Rotterdam: "assets/cities/rotterdam-hd.jpg",
    Utrecht: "assets/cities/utrecht.jpg",
    "Den Haag": "assets/cities/denhaag.jpg",
    Maastricht: "assets/cities/maastricht.jpg",
    Haarlem: "assets/cities/haarlem.jpg"
  };

  const cityText = {
    Amsterdam: "Grachten, musea en intieme hotels met geschiedenis achter elke gevel.",
    Rotterdam: "Architectuur, havenlicht en hotels met uitgesproken stedelijke energie.",
    Utrecht: "Werfkelders, hofjes en compacte luxe in een van de warmste binnensteden.",
    "Den Haag": "Paleizen, musea, zee en ingetogen hotels met internationale allure.",
    Maastricht: "Bourgondisch ritme, kloosters, pleinen en hotels met zuidelijke elegantie.",
    Haarlem: "Cultuur, boetieks, het Spaarne en de duinen op fietsafstand."
  };

  const tips = {
    Amsterdam: ["Loop vroeg langs de westelijke grachten.", "Reserveer musea ruim vooraf.", "Neem de pont naar Noord voor rust en uitzicht."],
    Rotterdam: ["Start bij de Maas voor het beste stadsgevoel.", "Combineer Depot Boijmans met Witte de With.", "Eet op de Kop van Zuid bij zonsondergang."],
    Utrecht: ["Kies een werfterras aan de Oudegracht.", "Beklim de Dom op een heldere ochtend.", "Wandel naar de hofjes achter de hoofdstraten."],
    "Den Haag": ["Plan Mauritshuis in de ochtend.", "Neem de tram naar Scheveningen.", "Bewaar Noordeinde voor winkels en galeries."],
    Maastricht: ["Begin rond het Vrijthof.", "Loop door naar Wyck voor lunch.", "Reserveer diner in het Jekerkwartier."],
    Haarlem: ["Wandel langs het Spaarne.", "Huur fietsen richting de duinen.", "Bezoek het Frans Hals Museum vroeg op de dag."]
  };

  function hotels() {
    return window.StayNLHotels || [];
  }

  function initSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach((form) => {
      const checkin = form.querySelector('[name="checkin"]');
      const checkout = form.querySelector('[name="checkout"]');
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      if (checkin) checkin.min = today.toISOString().slice(0, 10);
      if (checkout) checkout.min = tomorrow.toISOString().slice(0, 10);

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        const destination = form.querySelector('[name="destination"]')?.value.trim();
        const checkinValue = checkin?.value;
        const checkoutValue = checkout?.value;
        const guests = form.querySelector('[name="guests"]')?.value;
        if (destination) params.set("destination", destination);
        if (checkinValue) params.set("checkin", checkinValue);
        if (checkoutValue) params.set("checkout", checkoutValue);
        if (guests) params.set("guests", guests);
        window.location.href = `results.html?${params.toString()}`;
      });
    });
  }

  function initHome() {
    const destinationGrid = document.querySelector("[data-destinations]");
    if (destinationGrid) {
      const cities = ["Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Maastricht", "Haarlem"];
      destinationGrid.innerHTML = cities.map((city, index) => {
        const count = hotels().filter((hotel) => hotel.city === city).length;
        return `
          <a class="destination-tile ${index === 0 ? "large" : ""}" href="destination.html?city=${encodeURIComponent(city)}">
            <img src="${cityImages[city]}" alt="${city}" loading="lazy" width="800" height="600">
            <span class="destination-tile__text">
              <span>${count} hotels geselecteerd</span>
              <h3>${city}</h3>
            </span>
          </a>
        `;
      }).join("");
    }

    const featured = document.querySelector("[data-featured-hotels]");
    if (featured) {
      featured.innerHTML = "";
      [1, 2, 8, 12, 14].forEach((id) => {
        const hotel = hotels().find((item) => item.id === id);
        if (hotel) featured.appendChild(window.StayNL.editorialCard(hotel));
      });
      window.StayNL.reveal(featured);
    }
  }

  function initDestination() {
    const page = document.querySelector("[data-destination-page]");
    if (!page) return;
    const params = new URLSearchParams(window.location.search);
    const city = cityImages[params.get("city")] ? params.get("city") : "Amsterdam";
    const cityHotels = hotels().filter((hotel) => hotel.city === city);

    document.title = `Hotels in ${city} | StayNL`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `Hotels in ${city}, zorgvuldig geselecteerd door StayNL.`;

    document.querySelector("[data-city-image]").src = cityImages[city];
    document.querySelector("[data-city-image]").alt = city;
    document.querySelector("[data-city-name]").textContent = city;
    document.querySelector("[data-city-intro]").textContent = cityText[city];

    const grid = document.querySelector("[data-city-hotels]");
    grid.innerHTML = "";
    cityHotels.forEach((hotel) => grid.appendChild(window.StayNL.resultCard(hotel)));

    const tipsGrid = document.querySelector("[data-city-tips]");
    tipsGrid.innerHTML = tips[city].map((tip, index) => `
      <article class="tip-card">
        <h3>${String(index + 1).padStart(2, "0")}</h3>
        <p>${tip}</p>
      </article>
    `).join("");

    window.StayNL.reveal(document);
  }

  function initHotelDetail() {
    const detail = document.querySelector("[data-hotel-detail]");
    if (!detail) return;
    const params = new URLSearchParams(window.location.search);
    const hotel = hotels().find((item) => item.id === Number(params.get("id") || 1)) || hotels()[0];
    const similar = hotels().filter((item) => item.id !== hotel.id && (item.city === hotel.city || item.stars === hotel.stars)).slice(0, 5);
    const gallery = [
      hotel.imageUrl,
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900"
    ];

    document.title = `${hotel.name} | StayNL`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `${hotel.name} in ${hotel.city}: bekijk foto's, voorzieningen en boek direct of via Booking.com.`;

    const galleryMain = document.querySelector("[data-gallery-main]");
    galleryMain.dataset.lightboxSrc = gallery[0];
    galleryMain.dataset.lightboxAlt = `${hotel.name} hoofdfoto`;
    galleryMain.innerHTML = `<img src="${gallery[0]}" alt="${window.StayNL.escapeHtml(hotel.name)}" width="1200" height="900">`;
    document.querySelectorAll("[data-gallery-small]").forEach((button, index) => {
      const src = gallery[index + 1] || hotel.imageUrl;
      button.dataset.lightboxSrc = src;
      button.dataset.lightboxAlt = `${hotel.name} foto ${index + 2}`;
      button.innerHTML = `<img src="${src}" alt="${window.StayNL.escapeHtml(hotel.name)} foto ${index + 2}" loading="lazy" width="900" height="700">`;
    });
    const more = document.querySelector("[data-gallery-more]");
    more.dataset.lightboxSrc = gallery[0];
    more.dataset.lightboxAlt = `${hotel.name} fotogalerij`;
    more.querySelector("img").src = gallery[3];

    document.querySelector("[data-hotel-name]").textContent = hotel.name;
    document.querySelector("[data-hotel-location]").innerHTML = `${window.StayNL.icon("pin")}<span>${window.StayNL.escapeHtml(hotel.address)}</span>`;
    document.querySelector("[data-hotel-stars]").innerHTML = window.StayNL.stars(hotel.stars);
    document.querySelector("[data-hotel-rating]").textContent = hotel.rating.toFixed(1);
    document.querySelector("[data-hotel-tagline]").textContent = `${hotel.city} met karakter, zorgvuldig gekozen voor reizigers die sfeer en boekgemak willen combineren.`;
    document.querySelector("[data-hotel-description]").textContent = `${hotel.description} StayNL toont de directe hotelwebsite naast een Booking.com optie, zodat u voorwaarden, gemak en prijs in uw eigen tempo vergelijkt.`;
    document.querySelector("[data-booking-price]").innerHTML = `v.a. &euro;${hotel.pricePerNight} <span>per nacht</span>`;
    document.querySelector("[data-direct-link]").href = hotel.hotelWebsiteUrl;
    document.querySelector("[data-booking-link]").href = hotel.bookingAffiliateUrl;

    const amenities = document.querySelector("[data-hotel-amenities]");
    amenities.innerHTML = hotel.amenities.map((amenity) => `
      <div class="amenity-tile">${window.StayNL.amenityIcon(amenity)}<span>${window.StayNL.amenityLabel(amenity)}</span></div>
    `).join("");

    const nearby = {
      Amsterdam: ["Rokin", "Dam", "Negen Straatjes", "Rijksmuseum"],
      Rotterdam: ["Erasmusbrug", "Kop van Zuid", "Markthal", "Depot Boijmans"],
      Utrecht: ["Domtoren", "Oudegracht", "Ganzenmarkt", "Museumkwartier"],
      "Den Haag": ["Mauritshuis", "Noordeinde", "Paleistuin", "Scheveningen"],
      Maastricht: ["Vrijthof", "Wyck", "Jekerkwartier", "Bonnefanten"],
      Haarlem: ["Grote Markt", "Spaarne", "Frans Hals Museum", "Kennemerduinen"]
    };
    document.querySelector("[data-nearby]").innerHTML = nearby[hotel.city].map((item) => `<li>${item}</li>`).join("");

    const reviews = [
      ["LV", "Lotte Vermeer", "12 april 2026", 5, "Een hotel met echte aandacht voor materiaal, service en stilte. De boekkeuze was helder."],
      ["MK", "Milan Kok", "27 maart 2026", 4, "Mooi gelegen, goed ontbijt en precies de juiste balans tussen luxe en ontspannen."],
      ["SB", "Sara Bakker", "4 februari 2026", 5, "We boekten direct bij het hotel. Snel bevestigd en persoonlijk ontvangen."]
    ];
    document.querySelector("[data-reviews]").innerHTML = reviews.map(([initials, name, date, rating, text]) => `
      <article class="review-card">
        <div class="review-head">
          <div class="review-person"><span class="avatar">${initials}</span><div><strong>${name}</strong><p class="mono">${date}</p></div></div>
          ${window.StayNL.stars(rating)}
        </div>
        <p>${text}</p>
      </article>
    `).join("");

    const similarRow = document.querySelector("[data-similar-hotels]");
    similarRow.innerHTML = "";
    similar.forEach((item) => similarRow.appendChild(window.StayNL.editorialCard(item)));
    window.StayNL.reveal(document);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSearchForms();
    initHome();
    initDestination();
    initHotelDetail();
  });
})();
