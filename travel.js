// Travel page photo data.
// When you add a new image to assets/travel/, add a matching object here.
// This is a static GitHub Pages site, so JavaScript cannot scan the folder automatically.
const travelPhotos = [
  {
    src: "assets/travel/travel-1.jpg",
    title: "Knuckles Ridge",
    location: "Central Highlands, Sri Lanka",
    caption: "Cloud inversions, windy ridgelines, and a sunrise that turned the trail gold.",
    year: "2025"
  },
  {
    src: "assets/travel/travel-2.jpg",
    title: "Sinharaja After Rain",
    location: "Sinharaja, Sri Lanka",
    caption: "Emerald forest paths, quiet rain, and soft light between the trees.",
    year: "2025"
  },
  {
    src: "assets/travel/travel-3.jpg",
    title: "Riverston Cloud Paths",
    location: "Matale, Sri Lanka",
    caption: "Grassy shoulders and clouds moving slowly across the ridge.",
    year: "2024"
  }
];

(function initTravelPage() {
  const collage = document.getElementById("travelCollage");
  const featured = document.getElementById("travelFeatured");
  const gallery = document.getElementById("travelGallery");

  if (!collage && !featured && !gallery) return;

  const makeImage = (photo, loading = "lazy") => {
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = `${photo.title} - ${photo.location}`;
    img.loading = loading;
    return img;
  };

  const makeCollagePhoto = (photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "travel-photo reveal";
    figure.setAttribute("aria-label", `${photo.title}, ${photo.location}`);

    figure.appendChild(makeImage(photo, index === 0 ? "eager" : "lazy"));

    const caption = document.createElement("figcaption");
    caption.textContent = photo.title;
    figure.appendChild(caption);

    return figure;
  };

  const makeTravelCard = (photo, options = {}) => {
    const card = document.createElement("article");
    card.className = "travel-card reveal";

    const link = document.createElement("a");
    link.href = photo.src;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `Open photo: ${photo.title}`);
    link.appendChild(makeImage(photo));

    const body = document.createElement("div");
    body.className = "travel-card-body";

    const place = document.createElement("div");
    place.className = "travel-place";
    place.textContent = photo.location;

    const title = document.createElement("h3");
    title.textContent = photo.title;

    const caption = document.createElement("p");
    caption.textContent = photo.caption;

    body.append(place, title, caption);

    if (options.showYear && photo.year) {
      const year = document.createElement("div");
      year.className = "travel-date";
      year.textContent = photo.year;
      body.appendChild(year);
    }

    card.append(link, body);
    return card;
  };

  if (collage) {
    const collagePhotos = travelPhotos.slice(0, 5);
    collage.replaceChildren(...collagePhotos.map(makeCollagePhoto));
  }

  if (featured) {
    const featuredPhotos = travelPhotos.slice(0, 3);
    featured.replaceChildren(...featuredPhotos.map(photo => makeTravelCard(photo, { showYear: true })));
  }

  if (gallery) {
    gallery.replaceChildren(...travelPhotos.map(photo => makeTravelCard(photo)));
  }
})();
