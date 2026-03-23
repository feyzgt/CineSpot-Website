// Movie data for all carousel sections
const carouselData = {
  "now-showing": [
    { title: "Annihilation", image: "images/annihilation.png", mtrcb: "R-16", genre: "Science Fiction, Horror", director: "Alex Garland", cast: "Natalie Portman, Jennifer Jason Leigh, Gina Rodriguez", description: "A biologist signs up for a dangerous expedition into a mysterious zone where the laws of nature don't apply.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "The Batman", image: "images/batman.png", mtrcb: "R-13", genre: "Action, Crime", director: "Matt Reeves", cast: "Robert Pattinson, Zoe Kravitz, Paul Dano", description: "Batman uncovers corruption in Gotham while pursuing the Riddler.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "The Evil Dead", image: "images/evildead.png", mtrcb: "R-16", genre: "Horror, Thriller", director: "Sam Raimi", cast: "Bruce Campbell, Ellen Sandweiss, Sarah Berry", description: "Five friends unleash demonic forces in a remote cabin.", cinemaName: "Robinsons Dumaguete Cinema 2" }
  ],
  "advance-ticket": [
    { title: "F1", image: "images/f1.png", mtrcb: "PG", genre: "Sports, Documentary", director: "Various", cast: "Formula 1 Drivers", description: "The high-speed world of Formula 1 racing.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "Get Out", image: "images/getout.png", mtrcb: "R-13", genre: "Horror, Thriller", director: "Jordan Peele", cast: "Daniel Kaluuya, Allison Williams, Bradley Whitford", description: "A young African-American visits his white girlfriend's family and uncovers horrifying secrets.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "Hereditary", image: "images/hereditary.png", mtrcb: "R-16", genre: "Horror, Drama", director: "Ari Aster", cast: "Toni Collette, Alex Wolff, Milly Shapiro", description: "A grieving family is haunted by tragic and disturbing occurrences.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "Interstellar", image: "images/interstellar.png", mtrcb: "PG-13", genre: "Science Fiction, Adventure", director: "Christopher Nolan", cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain", description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.", cinemaName: "Robinsons Dumaguete Cinema 2" }
  ],
  "coming-soon": [
    { title: "The Phoenician Scheme", image: "images/phoenician.png", mtrcb: "R-16", genre: "Thriller, Mystery", director: "Unknown", cast: "Various", description: "A complex scheme unfolds involving ancient secrets and modern intrigue.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "The Matrix", image: "images/thematrix.png", mtrcb: "R-16", genre: "Science Fiction, Action", director: "Lana Wachowski and Lilly Wachowski", cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving", description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "Project Hail Mary", image: "images/projecthm.png", mtrcb: "PG-13", genre: "Science Fiction, Adventure", director: "Various", cast: "Various", description: "A lone astronaut must save the earth from disaster.", cinemaName: "Robinsons Dumaguete Cinema 2" },
    { title: "Golden", image: "images/golden.png", mtrcb: "PG", genre: "Drama, Family", director: "Unknown", cast: "Various", description: "A heartwarming story of family and redemption.", cinemaName: "Robinsons Dumaguete Cinema 2" }
  ]
};

const sectionState = {};

const movies = {};

Object.keys(carouselData).forEach(section => {
  carouselData[section].forEach(movie => {
    const id = normalizeMovieId(movie.title);
    movies[id] = movie;
  });
});

function normalizeMovieId(title) {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function selectMovie(movieId) {
  const movie = movies[movieId];
  if (movie) {
    localStorage.setItem('selectedMovie', movieId);
    sessionStorage.setItem('movieSelection', JSON.stringify(movie));
    window.location.href = `movie-details.html?id=${movieId}`;
  }
  return false;
}

function createMovieCard(movie, isOriginal = false) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  const movieId = normalizeMovieId(movie.title);
  card.setAttribute('data-id', movieId);
  if (isOriginal) card.setAttribute('data-original', 'true');

  const posterWrap = document.createElement('div');
  posterWrap.className = 'movie-poster-wrap';

  const img = document.createElement('img');
  img.className = 'movie-poster';
  img.src = movie.image;
  img.alt = movie.title;

  const overlay = document.createElement('div');
  overlay.className = 'movie-poster-overlay';
  overlay.textContent = 'CLICK POSTER TO BUY TICKETS';

  const bottomLabel = document.createElement('div');
  bottomLabel.className = 'movie-bottom-label';
  bottomLabel.textContent = 'CLICK POSTER TO BUY TICKETS';

  const title = document.createElement('p');
  title.className = 'movie-title';
  title.textContent = movie.title;

  posterWrap.appendChild(img);
  posterWrap.appendChild(overlay);
  card.appendChild(posterWrap);
  card.appendChild(bottomLabel);
  card.appendChild(title);

  return card;
}

function renderCarousel(sectionKey, movies, isSearchMode = false) {
  const section = document.querySelector(`[data-section="${sectionKey}"]`);
  const track = document.querySelector(`[data-carousel="${sectionKey}"]`);
  if (!section || !track) return;

  track.innerHTML = '';

  const oldNext = section.querySelector('.scroll-next');
  const oldPrev = section.querySelector('.scroll-prev');
  if (oldNext && oldPrev) {
    const next = oldNext.cloneNode(true);
    const prev = oldPrev.cloneNode(true);
    oldNext.replaceWith(next);
    oldPrev.replaceWith(prev);
  }

  if (!movies || movies.length === 0) {
    sectionState[sectionKey] = [];
    return;
  }

  const repetitions = isSearchMode ? 1 : Math.max(10, Math.ceil(15 / movies.length));
  const cards = [];

  for (let r = 0; r < repetitions; r++) {
    movies.forEach((movie) => {
      cards.push(createMovieCard(movie, !isSearchMode && r === 0));
    });
  }

  if (cards.length === 0) return;

  if (isSearchMode) {
    cards.forEach((card) => track.appendChild(card));
    initializeMovement(sectionKey, track, cards.length, false);
  } else {
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);
    firstClone.removeAttribute('data-original');
    lastClone.removeAttribute('data-original');

    track.appendChild(lastClone);
    cards.forEach((card) => track.appendChild(card));
    track.appendChild(firstClone);
    initializeMovement(sectionKey, track, cards.length + 2, true);
  }

  sectionState[sectionKey] = movies;
}

function initializeMovement(sectionKey, track, totalItems, isLooping = true) {
  const allCards = track.querySelectorAll('.movie-card');
  if (!allCards.length) return;

  const cardWidth = allCards[0].offsetWidth;
  const gap = 32;
  const step = cardWidth + gap;

  let currentIndex = isLooping ? 1 : 0;
  let isTransitioning = false;

  const section = document.querySelector(`[data-section="${sectionKey}"]`);
  const nextBtn = section.querySelector('.scroll-next');
  const prevBtn = section.querySelector('.scroll-prev');

  const updateCarousel = (index, instant = false) => {
    if (!isLooping) {
      if (index < 0) index = 0;
      if (index > allCards.length - 1) index = allCards.length - 1;
    }

    currentIndex = index;
    const translateX = -(currentIndex * step);

    if (instant) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${translateX}px)`;
      track.offsetHeight;
      track.style.transition = 'transform 0.4s ease';
    } else {
      track.style.transform = `translateX(${translateX}px)`;
    }
  };

  if (isLooping) {
    track.ontransitionend = null;
    track.ontransitionend = () => {
      isTransitioning = false;
      if (currentIndex === totalItems - 1) {
        updateCarousel(1, true);
      } else if (currentIndex === 0) {
        updateCarousel(totalItems - 2, true);
      }
    };
  } else {
    track.ontransitionend = null;
    track.ontransitionend = () => {
      isTransitioning = false;
    };
  }

  updateCarousel(currentIndex, true);

  if (nextBtn) {
    nextBtn.onclick = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      if (!isLooping && currentIndex >= allCards.length) {
        currentIndex = allCards.length - 1;
      }
      updateCarousel(currentIndex);
      isTransitioning = false;
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      if (!isLooping && currentIndex < 0) {
        currentIndex = 0;
      }
      updateCarousel(currentIndex);
      isTransitioning = false;
    };
  }
}

function initializeMovieSearch() {
  const input = document.getElementById('movie-search-input');
  const noResults = document.getElementById('search-no-results');

  if (!input || !noResults) return;

  const filterAndRebuild = () => {
    const query = input.value.trim().toLowerCase();
    let totalMatches = 0;
    const isSearchMode = query.length > 0;

    Object.keys(carouselData).forEach((sectionKey) => {
      const originals = carouselData[sectionKey];
      const filtered = isSearchMode
        ? originals.filter((movie) => movie.title.toLowerCase().includes(query))
        : originals;

      totalMatches += filtered.length;
      renderCarousel(sectionKey, filtered, isSearchMode);
    });

    noResults.style.display = totalMatches === 0 ? 'block' : 'none';
  };

  input.addEventListener('input', filterAndRebuild);
  filterAndRebuild();
}

function escapeHTML(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"]|'/g, (char) => map[char]);
}

function updateHighlightedTitles() {
  const query = document.getElementById('movie-search-input')?.value.trim().toLowerCase() || '';
  document.querySelectorAll('.movie-card').forEach((card) => {
    const titleElem = card.querySelector('.movie-title');
    if (!titleElem) return;
    const base = card.getAttribute('data-original') === 'true' ? titleElem.textContent : titleElem.textContent;

    if (!query) {
      titleElem.textContent = base;
      return;
    }

    const lower = base.toLowerCase();
    const index = lower.indexOf(query);
    if (index === -1) {
      titleElem.textContent = base;
      return;
    }

    const before = escapeHTML(base.slice(0, index));
    const match = escapeHTML(base.slice(index, index + query.length));
    const after = escapeHTML(base.slice(index + query.length));
    titleElem.innerHTML = `${before}<span class="highlight">${match}</span>${after}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  Object.keys(carouselData).forEach((sectionKey) => {
    renderCarousel(sectionKey, carouselData[sectionKey]);
  });

  initializeMovieSearch();

  document.getElementById('movie-search-input')?.addEventListener('input', updateHighlightedTitles);

  if (document.getElementById('movie-search-input')) {
    document.addEventListener('click', function (e) {
      const card = e.target.closest('.movie-card');

      if (!card) return;

      // 🚫 STOP EVERYTHING ELSE
      e.preventDefault();
      e.stopPropagation();

      const movieId = card.dataset.id;

      if (!movieId) return;

      // 🛑 prevent multiple rapid triggers
      if (card.classList.contains('clicked')) return;
      card.classList.add('clicked');

      // ✅ single navigation
      localStorage.setItem('selectedMovie', movieId);

      const selectedMovie = movies[movieId] || { title: card.querySelector('.movie-title')?.textContent || 'Unknown Movie' };
      sessionStorage.setItem('movieSelection', JSON.stringify(selectedMovie));

      window.location.href = "movie-details.html";
    });
  }
});

// Profile dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load user data into header
  const userData = JSON.parse(localStorage.getItem('cinespot_user'));
  if (userData) {
    // Update header name
    const userNameElements = document.querySelectorAll('#user-name, #dropdown-user-name');
    userNameElements.forEach(el => {
      if (el) el.textContent = userData.name || 'User';
    });

    // Update dropdown email
    const emailElement = document.getElementById('dropdown-user-email');
    if (emailElement) emailElement.textContent = userData.email || 'user@cinespot.com';

    // Update member since
    const memberSinceElement = document.getElementById('dropdown-member-since');
    if (memberSinceElement && userData.memberSince) {
      const date = new Date(userData.memberSince);
      memberSinceElement.textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    }

    // Update tickets
    const ticketsElement = document.getElementById('dropdown-tickets');
    if (ticketsElement) ticketsElement.textContent = userData.ticketsBooked || 0;
  }

  const profileContainer = document.querySelector('.profile-container');
  const profileDropdown = document.querySelector('.profile-dropdown');

  if (profileContainer && profileDropdown) {
    profileContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      profileDropdown.classList.remove('show');
    });
  }

  // Handle sign out
  const signOutLinks = document.querySelectorAll('.signout');
  signOutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('cinespot_logged_in');
      window.location.href = 'login.html';
    });
  });
});
