(function () {
  const savedKey = "staynl.saved";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function icon(name) {
    const icons = {
      search: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      pin: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6.8-5.7 6.8-12A6.8 6.8 0 0 0 5.2 9C5.2 15.3 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
      heart: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 5.7a5 5 0 0 0-7.1 0l-1 1-1-1a5 5 0 1 0-7.1 7.1L12 21l8.1-8.2a5 5 0 0 0 0-7.1Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
      grid: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
      list: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.2 6.4 11.2 12.8 4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      wifi: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9.4a11.2 11.2 0 0 1 15 0M7.6 12.6a6.6 6.6 0 0 1 8.8 0M10.3 15.5a2.6 2.6 0 0 1 3.4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="18.4" r="1" fill="currentColor"/></svg>',
      parking: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 17V7h3.2a3 3 0 0 1 0 6H10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      pool: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16c1.6 0 1.6-1 3.2-1s1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1M4 20c1.6 0 1.6-1 3.2-1s1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1M8 12V6a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      breakfast: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h10v5a5 5 0 0 1-10 0V8ZM15 10h2a2 2 0 0 1 0 4h-2M4 21h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      pets: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 12.8c1.2-2.1 5.8-2.1 7 0l1.1 2a3 3 0 0 1-2.6 4.5H10a3 3 0 0 1-2.6-4.5l1.1-2Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="7" cy="8.2" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="6.2" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="8.2" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
      bar: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12l-2 7a4.2 4.2 0 0 1-8 0L6 4ZM12 15v5M8.5 20h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      restaurant: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v18M4.5 3v6a2.5 2.5 0 0 0 5 0V3M16 3v18M16 3c2.4.7 4 3.1 4 6.2V12h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      gym: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4M7 8v8M17 8v8M21 10v4M7 12h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    };
    return icons[name] || icons.pin;
  }

  function starSvg(empty) {
    return `<svg class="${empty ? "star-empty" : ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.6 2.9 5.9 6.5 1-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-1L12 2.6Z"/></svg>`;
  }

  function stars(count) {
    return `<span class="star-row" aria-label="${count} van 5 sterren">${Array.from({ length: 5 }, (_, index) => starSvg(index >= count)).join("")}</span>`;
  }

  function savedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(savedKey) || "[]"));
    } catch (error) {
      return new Set();
    }
  }

  function saveSet(set) {
    localStorage.setItem(savedKey, JSON.stringify(Array.from(set)));
  }

  function amenityLabel(amenity) {
    const labels = {
      wifi: "WiFi",
      breakfast: "Ontbijt",
      bar: "Bar",
      parking: "Parking",
      restaurant: "Restaurant",
      pool: "Zwembad",
      gym: "Gym",
      pets: "Huisdieren"
    };
    return labels[amenity] || amenity;
  }

  function amenityIcon(amenity) {
    return icon(amenity === "pets" ? "pets" : amenity);
  }

  function favoriteButton(hotel) {
    const saved = savedSet();
    const active = saved.has(String(hotel.id));
    return `<button class="favorite-button${active ? " is-saved" : ""}" type="button" data-favorite="${hotel.id}" aria-label="Bewaar ${escapeHtml(hotel.name)}" aria-pressed="${active}">${icon("heart")}</button>`;
  }

  function resultCard(hotel) {
    const amenities = hotel.amenities.slice(0, 5).map((amenity) => `
      <span class="amenity-chip">${amenityIcon(amenity)}${amenityLabel(amenity)}</span>
    `).join("");

    const article = document.createElement("article");
    article.className = "hotel-card result-card";
    article.dataset.hotelId = hotel.id;
    article.dataset.city = hotel.city;
    article.dataset.price = hotel.pricePerNight;
    article.dataset.stars = hotel.stars;
    article.dataset.rating = hotel.rating;
    article.dataset.amenities = hotel.amenities.join(",");
    article.innerHTML = `
      <a class="card-image" href="hotel.html?id=${hotel.id}" aria-label="Bekijk ${escapeHtml(hotel.name)}">
        <img src="${hotel.imageUrl}" alt="${escapeHtml(hotel.name)}" loading="lazy" width="800" height="600">
        ${favoriteButton(hotel)}
      </a>
      <div class="result-card__body">
        <div>${stars(hotel.stars)}</div>
        <a href="hotel.html?id=${hotel.id}"><h3>${escapeHtml(hotel.name)}</h3></a>
        <div class="location-line">${icon("pin")}<span>${escapeHtml(hotel.address)}</span></div>
        <div class="amenity-icons" aria-label="Voorzieningen">${amenities}</div>
        <p class="result-card__description">${escapeHtml(hotel.description)}</p>
        <div class="result-card__footer">
          <span class="price">v.a. &euro;${hotel.pricePerNight} / nacht</span>
          <div class="result-actions">
            <a class="btn btn-outline-blue" href="${hotel.hotelWebsiteUrl}" target="_blank" rel="noopener">Hotelwebsite &rarr;</a>
            <a class="btn btn-booking" href="${hotel.bookingAffiliateUrl}" target="_blank" rel="noopener"><img class="booking-badge" src="assets/icons/booking-icon.svg" alt="">Boek via Booking.com</a>
          </div>
        </div>
      </div>
    `;
    return article;
  }

  function editorialCard(hotel) {
    const article = document.createElement("article");
    article.className = "hotel-card editorial-card";
    article.innerHTML = `
      <a class="card-image" href="hotel.html?id=${hotel.id}" aria-label="Bekijk ${escapeHtml(hotel.name)}">
        <img src="${hotel.imageUrl}" alt="${escapeHtml(hotel.name)}" loading="lazy" width="800" height="600">
      </a>
      <div class="editorial-card__body">
        <a href="hotel.html?id=${hotel.id}"><h3>${escapeHtml(hotel.name)}</h3></a>
        <div class="editorial-card__meta">
          <span>${escapeHtml(hotel.city)}</span>
          ${stars(hotel.stars)}
        </div>
        <p class="editorial-card__description">${escapeHtml(hotel.description)}</p>
        <span class="price">v.a. &euro;${hotel.pricePerNight} / nacht</span>
        <div class="editorial-links">
          <a href="${hotel.hotelWebsiteUrl}" target="_blank" rel="noopener">&rarr; Hotelwebsite</a>
          <a href="${hotel.bookingAffiliateUrl}" target="_blank" rel="noopener">&rarr; Booking.com</a>
        </div>
      </div>
    `;
    return article;
  }

  function reveal(context) {
    const root = context || document;
    const cards = Array.from(root.querySelectorAll(".hotel-card:not([data-observed])"));
    cards.forEach((card, index) => {
      card.dataset.observed = "true";
      card.style.transitionDelay = `${(index % 8) * 60}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    cards.forEach((card) => observer.observe(card));
  }

  function initNav() {
    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector("[data-menu-toggle]");
    const drawer = document.querySelector("[data-mobile-drawer]");
    const updateScrolled = () => nav?.classList.toggle("scrolled", window.scrollY > 12);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    if (toggle && drawer) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("drawer-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      drawer.addEventListener("click", (event) => {
        if (!event.target.closest("a")) return;
        document.body.classList.remove("drawer-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    }

    const activePage = document.body.dataset.page;
    if (activePage) {
      document.querySelectorAll("[data-nav]").forEach((link) => {
        link.classList.toggle("active", link.dataset.nav === activePage);
      });
    }
  }

  function initFavorites() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-favorite]");
      if (!button) return;
      event.preventDefault();
      const id = String(button.dataset.favorite);
      const set = savedSet();
      if (set.has(id)) set.delete(id);
      else set.add(id);
      saveSet(set);
      button.classList.toggle("is-saved", set.has(id));
      button.setAttribute("aria-pressed", String(set.has(id)));
    });
  }

  function initLightbox() {
    let lightbox = document.querySelector("[data-lightbox]");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.dataset.lightbox = "true";
      lightbox.innerHTML = '<button type="button" aria-label="Sluit foto">&times;</button><img alt="">';
      document.body.appendChild(lightbox);
    }
    const image = lightbox.querySelector("img");
    const close = () => {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      image.removeAttribute("src");
    };

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox-src]");
      if (!trigger) return;
      event.preventDefault();
      image.src = trigger.dataset.lightboxSrc;
      image.alt = trigger.dataset.lightboxAlt || "";
      lightbox.classList.add("is-open");
      document.body.classList.add("lightbox-open");
    });
    lightbox.querySelector("button").addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initContact() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();
      const message = document.querySelector("[data-form-message]");
      if (message) {
        message.textContent = "Dank voor uw bericht. We nemen contact op zodra de redactie uw hotel heeft bekeken.";
        message.classList.add("is-visible");
      }
    });
  }

  window.StayNL = {
    icon,
    stars,
    amenityIcon,
    amenityLabel,
    resultCard,
    editorialCard,
    escapeHtml,
    reveal
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initFavorites();
    initLightbox();
    initContact();
    reveal(document);
  });
})();
