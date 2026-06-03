// Da Bus Music Stop — main.js
// Replace VIDEO_ID values with your actual YouTube video IDs

const videos = [
  // 90s R&B
  { id: "VIDEO_ID_1",  title: "End of the Road",        artist: "Boyz II Men",    genre: "90s-rb"  },
  { id: "VIDEO_ID_2",  title: "I Will Always Love You", artist: "Whitney Houston", genre: "90s-rb"  },
  { id: "VIDEO_ID_3",  title: "Waterfalls",             artist: "TLC",            genre: "90s-rb"  },
  // 70s Soul
  { id: "VIDEO_ID_4",  title: "Let's Stay Together",    artist: "Al Green",       genre: "70s-soul" },
  { id: "VIDEO_ID_5",  title: "Superstition",           artist: "Stevie Wonder",  genre: "70s-soul" },
  { id: "VIDEO_ID_6",  title: "Ain't No Sunshine",      artist: "Bill Withers",   genre: "70s-soul" },
  // 70s Rock
  { id: "VIDEO_ID_7",  title: "Hotel California",       artist: "Eagles",         genre: "70s-rock" },
  { id: "VIDEO_ID_8",  title: "Dream On",               artist: "Aerosmith",      genre: "70s-rock" },
  { id: "VIDEO_ID_9",  title: "Go Your Own Way",        artist: "Fleetwood Mac",  genre: "70s-rock" },
  // 90s Alternative
  { id: "VIDEO_ID_10", title: "Creep",                  artist: "Radiohead",      genre: "90s-alt"  },
  { id: "VIDEO_ID_11", title: "Black Hole Sun",         artist: "Soundgarden",    genre: "90s-alt"  },
  { id: "VIDEO_ID_12", title: "Wonderwall",             artist: "Oasis",          genre: "90s-alt"  },
  // New Finds
  { id: "VIDEO_ID_13", title: "New Find Title",         artist: "Artist Name",    genre: "new-finds" },
];

const genreLabels = {
  "90s-rb":    "90s R&B",
  "70s-soul":  "70s Soul",
  "70s-rock":  "70s Rock",
  "90s-alt":   "90s Alternative",
  "new-finds": "New Finds",
};

function thumbUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function watchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function createVideoCard(video) {
  const a = document.createElement("a");
  a.className = "video-card";
  a.dataset.genre = video.genre;
  a.href = watchUrl(video.id);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.innerHTML = `
    <div class="video-thumb">
      <img src="${thumbUrl(video.id)}" alt="${video.title}" loading="lazy">
      <div class="play-overlay">&#9654;</div>
    </div>
    <div class="video-info">
      <p class="video-title">${video.title}</p>
      <p class="video-artist">${video.artist}</p>
      <p class="video-meta">${genreLabels[video.genre] || video.genre} &middot; Cover</p>
    </div>`;
  return a;
}

// --- index.html: render latest 3 videos ---
function initHome() {
  const grid = document.getElementById("latest-videos");
  if (!grid) return;
  videos.slice(0, 3).forEach(v => grid.appendChild(createVideoCard(v)));
}

// --- music.html: render all videos + filter ---
function initMusic() {
  const sections = {
    "90s-rb":    document.getElementById("grid-90s-rb"),
    "70s-soul":  document.getElementById("grid-70s-soul"),
    "70s-rock":  document.getElementById("grid-70s-rock"),
    "90s-alt":   document.getElementById("grid-90s-alt"),
    "new-finds": document.getElementById("grid-new-finds"),
  };

  // Populate grids
  videos.forEach(v => {
    const grid = sections[v.genre];
    if (grid) grid.appendChild(createVideoCard(v));
  });

  // Update counts
  Object.entries(sections).forEach(([genre, grid]) => {
    if (!grid) return;
    const countEl = document.getElementById(`count-${genre}`);
    if (countEl) countEl.textContent = grid.children.length;
  });

  // Filter buttons
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const genre = btn.dataset.genre;
      document.querySelectorAll(".genre-section").forEach(section => {
        if (genre === "all") {
          section.style.display = "";
        } else {
          section.style.display = section.dataset.genre === genre ? "" : "none";
        }
      });
    });
  });
}

// --- init ---
document.addEventListener("DOMContentLoaded", () => {
  initHome();
  initMusic();
});
