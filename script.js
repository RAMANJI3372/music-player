

let songs = [

    {
        id: 1,
        title: "Wonders of the Earth",
        artist: "Unknown Artist",
        album: "Wonders of the Earth",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
        src: "songs/grand_project-wonders-of-the-earth-550792.mp3"
    },

    {
        id: 2,
        title: "Dramatic Cinematic",
        artist: "Unknown Artist",
        album: "Cinematic",
        cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
        src: "songs/musicdream-dramatic-cinematic-documentary-609202.mp3"
    },

    {
        id: 3,
        title: "Krishna flute",
        artist: "Unknown Artist",
        album: "flute",
        cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
        src: "songs/echoes_of_lumen-krishna-flute-596320.mp3"
    }

];



const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const progress =
    document.getElementById("progress");

const volume =
    document.getElementById("volume");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const playerCover =
    document.getElementById("playerCover");

const playerFavorite =
    document.getElementById("playerFavorite");

const songGrid =
    document.getElementById("songGrid");

const favoriteList =
    document.getElementById("favoriteList");

const queueList =
    document.getElementById("queueList");

const recentList =
    document.getElementById("recentList");



let currentIndex = 0;

let isPlaying = false;

let isShuffle = false;

let isRepeat = false;

let favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

let recentlyPlayed =
    JSON.parse(
        localStorage.getItem("recentlyPlayed")
    ) || [];


audio.volume = 0.8;

renderSongs();

renderFavorites();

renderQueue();

renderRecentlyPlayed();


function loadSong(index) {

    if (songs.length === 0) {
        return;
    }

    currentIndex = index;

    const song = songs[currentIndex];

    audio.src = song.src;

    playerTitle.textContent = song.title;

    playerArtist.textContent = song.artist;

    playerCover.src = song.cover;

    updateFavoriteButton();

}


function playSong(index = currentIndex) {

    if (songs.length === 0) {
        return;
    }

    currentIndex = index;

    const song = songs[currentIndex];

    if (audio.src !== new URL(song.src, window.location.href).href) {

        loadSong(currentIndex);

    }

    audio.play()
        .then(() => {

            isPlaying = true;

            updatePlayButton();

            addToRecentlyPlayed(song);


            const vinyl =
                document.querySelector(".vinyl");

            if (vinyl) {
                vinyl.style.animationPlayState = "running";
            }

        })
        .catch(error => {

            console.log(
                "Audio could not be played:",
                error
            );

            alert(
                "Please make sure the MP3 file exists in the songs folder."
            );

        });

}



function pauseSong() {

    audio.pause();

    isPlaying = false;

    updatePlayButton();

    const vinyl =
        document.querySelector(".vinyl");

    if (vinyl) {
        vinyl.style.animationPlayState = "paused";
    }

}



playBtn.addEventListener(
    "click",
    () => {

        if (!audio.src) {

            loadSong(currentIndex);

        }

        if (isPlaying) {

            pauseSong();

        } else {

            playSong(currentIndex);

        }

    }
);


function updatePlayButton() {

    playBtn.innerHTML = isPlaying

        ? `<i class="fa-solid fa-pause"></i>`

        : `<i class="fa-solid fa-play"></i>`;

}


nextBtn.addEventListener(
    "click",
    nextSong
);


function nextSong() {

    if (songs.length === 0) {
        return;
    }

    if (isShuffle) {

        let randomIndex;

        do {

            randomIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        } while (
            randomIndex === currentIndex &&
            songs.length > 1
        );

        currentIndex = randomIndex;

    } else {

        currentIndex++;

        if (currentIndex >= songs.length) {
            currentIndex = 0;
        }

    }

    playSong(currentIndex);

}


previousBtn.addEventListener(
    "click",
    previousSong
);


function previousSong() {

    if (songs.length === 0) {
        return;
    }


    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;

    }

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }

    playSong(currentIndex);

}


audio.addEventListener(
    "ended",
    () => {

        if (isRepeat) {

            audio.currentTime = 0;

            playSong(currentIndex);

        } else {

            nextSong();

        }

    }
);

audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) {
            return;
        }

        const percentage =
            (audio.currentTime /
                audio.duration) * 100;

        progress.value = percentage;

        currentTime.textContent =
            formatTime(audio.currentTime);

    }
);

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(audio.duration);

    }
);



progress.addEventListener(
    "input",
    () => {

        if (!audio.duration) {
            return;
        }

        audio.currentTime =
            (progress.value / 100) *
            audio.duration;

    }
);


function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return `${minutes}:${secs
        .toString()
        .padStart(2, "0")}`;

}

volume.addEventListener(
    "input",
    () => {

        audio.volume =
            volume.value;

        updateVolumeIcon();

    }
);


function updateVolumeIcon() {

    const icon =
        document.getElementById("volumeIcon");

    if (audio.volume === 0) {

        icon.className =
            "fa-solid fa-volume-xmark";

    } else if (audio.volume < 0.5) {

        icon.className =
            "fa-solid fa-volume-low";

    } else {

        icon.className =
            "fa-solid fa-volume-high";

    }

}



const shuffleBtn =
    document.getElementById("shuffleBtn");

shuffleBtn.addEventListener(
    "click",
    () => {

        isShuffle = !isShuffle;

        shuffleBtn.classList.toggle(
            "active",
            isShuffle
        );

    }
);

const repeatBtn =
    document.getElementById("repeatBtn");

repeatBtn.addEventListener(
    "click",
    () => {

        isRepeat = !isRepeat;

        repeatBtn.classList.toggle(
            "active",
            isRepeat
        );

    }
);

function renderSongs(list = songs) {

    songGrid.innerHTML = "";

    if (list.length === 0) {

        songGrid.innerHTML = `
            <div class="empty-message">
                No songs found.
            </div>
        `;

        return;

    }

    list.forEach(
        (song) => {

            const isFavorite =
                favorites.includes(song.id);

            const card =
                document.createElement("div");

            card.className =
                "song-card";

            card.innerHTML = `

                <div class="cover-wrapper">

                    <img
                        src="${song.cover}"
                        alt="${song.title}"
                    >

                    <button
                        class="card-play"
                        data-id="${song.id}"
                    >
                        <i class="fa-solid fa-play"></i>
                    </button>

                </div>


                <div class="song-info">

                    <div>

                        <h3>
                            ${song.title}
                        </h3>

                        <p>
                            ${song.artist}
                        </p>

                    </div>


                    <button
                        class="favorite-btn
                        ${isFavorite ? "active" : ""}"
                        data-favorite="${song.id}"
                    >

                        <i class="${
                            isFavorite
                                ? "fa-solid"
                                : "fa-regular"
                        } fa-heart"></i>

                    </button>

                </div>
            `;

            songGrid.appendChild(card);

        }
    );


    document
        .querySelectorAll(".card-play")
        .forEach(button => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    const id =
                        Number(
                            button.dataset.id
                        );

                    const index =
                        songs.findIndex(
                            song =>
                                song.id === id
                        );

                    playSong(index);

                }
            );

        });



    document
        .querySelectorAll("[data-favorite]")
        .forEach(button => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    const id =
                        Number(
                            button.dataset.favorite
                        );

                    toggleFavorite(id);

                }
            );

        });

}



function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId =>
                    favoriteId !== id
            );

    } else {

        favorites.push(id);

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    renderSongs();

    renderFavorites();

    updateFavoriteButton();

}


playerFavorite.addEventListener(
    "click",
    () => {

        if (songs.length === 0) {
            return;
        }

        toggleFavorite(
            songs[currentIndex].id
        );

    }
);

function updateFavoriteButton() {

    if (songs.length === 0) {
        return;
    }

    const isFavorite =
        favorites.includes(
            songs[currentIndex].id
        );

    playerFavorite.classList.toggle(
        "active",
        isFavorite
    );

    playerFavorite.innerHTML = `

        <i class="${
            isFavorite
                ? "fa-solid"
                : "fa-regular"
        } fa-heart"></i>

    `;

}

function renderFavorites() {

    favoriteList.innerHTML = "";

    const favoriteSongs =
        songs.filter(
            song =>
                favorites.includes(song.id)
        );


    if (favoriteSongs.length === 0) {

        favoriteList.innerHTML = `

            <div class="empty-state">

                <i class="fa-regular fa-heart"></i>

                <h3>
                    No favorites yet
                </h3>

                <p>
                    Add songs to your favorites
                    and they will appear here.
                </p>

            </div>

        `;

        return;

    }


    favoriteSongs.forEach(song => {

        const item =
            createListItem(song);

        favoriteList.appendChild(item);

    });

}


function createListItem(song) {

    const item =
        document.createElement("div");

    item.className =
        "list-item";

    item.innerHTML = `

        <img
            src="${song.cover}"
            alt="${song.title}"
        >

        <div class="list-item-info">

            <h4>
                ${song.title}
            </h4>

            <p>
                ${song.artist}
            </p>

        </div>

        <button class="list-play">

            <i class="fa-solid fa-play"></i>

        </button>

    `;


    item
        .querySelector(".list-play")
        .addEventListener(
            "click",
            () => {

                const index =
                    songs.findIndex(
                        item =>
                            item.id === song.id
                    );

                playSong(index);

            }
        );


    return item;

}

function renderQueue() {

    queueList.innerHTML = "";

    songs.forEach(song => {

        const item =
            createListItem(song);

        queueList.appendChild(item);

    });

}

function addToRecentlyPlayed(song) {

    recentlyPlayed =
        recentlyPlayed.filter(
            id => id !== song.id
        );

    recentlyPlayed.unshift(song.id);

    recentlyPlayed =
        recentlyPlayed.slice(0, 5);

    localStorage.setItem(
        "recentlyPlayed",
        JSON.stringify(recentlyPlayed)
    );

    renderRecentlyPlayed();

}


function renderRecentlyPlayed() {

    recentList.innerHTML = "";

    const recentSongs =
        recentlyPlayed
            .map(
                id =>
                    songs.find(
                        song =>
                            song.id === id
                    )
            )
            .filter(Boolean);


    if (recentSongs.length === 0) {

        recentList.innerHTML = `

            <p style="
                color:#777;
                font-size:12px;
                padding:20px 0;
            ">
                Your recently played songs
                will appear here.
            </p>

        `;

        return;

    }


    recentSongs.forEach(song => {

        const item =
            document.createElement("div");

        item.className =
            "recent-item";

        item.innerHTML = `

            <img
                src="${song.cover}"
                alt="${song.title}"
            >

            <div class="recent-info">

                <h4>
                    ${song.title}
                </h4>

                <p>
                    ${song.artist}
                </p>

            </div>

            <span style="
                color:#777;
                font-size:10px;
            ">
                Recently played
            </span>

        `;


        item.addEventListener(
            "click",
            () => {

                const index =
                    songs.findIndex(
                        item =>
                            item.id === song.id
                    );

                playSong(index);

            }
        );


        recentList.appendChild(item);

    });

}

const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredSongs =
            songs.filter(song =>

                song.title
                    .toLowerCase()
                    .includes(query)

                ||

                song.artist
                    .toLowerCase()
                    .includes(query)

                ||

                song.album
                    .toLowerCase()
                    .includes(query)

            );


        renderSongs(filteredSongs);

    }
);

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


const homeSection =
    document.getElementById(
        "homeSection"
    );

const favoritesSection =
    document.getElementById(
        "favoritesSection"
    );

const queueSection =
    document.getElementById(
        "queueSection"
    );


navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            navItems.forEach(
                nav =>
                    nav.classList.remove("active")
            );

            item.classList.add("active");

            const section =
                item.dataset.section;


            homeSection.classList.add(
                "hidden"
            );

            favoritesSection.classList.add(
                "hidden"
            );

            queueSection.classList.add(
                "hidden"
            );


            if (section === "home") {

                homeSection.classList.remove(
                    "hidden"
                );

            }


            if (section === "favorites") {

                favoritesSection.classList.remove(
                    "hidden"
                );

                renderFavorites();

            }


            if (section === "queue") {

                queueSection.classList.remove(
                    "hidden"
                );

                renderQueue();

            }

        }
    );

});


const addSongBtn =
    document.getElementById(
        "addSongBtn"
    );

const songInput =
    document.getElementById(
        "songInput"
    );


addSongBtn.addEventListener(
    "click",
    () => {

        songInput.click();

    }
);


songInput.addEventListener(
    "change",
    (event) => {

        const files =
            Array.from(
                event.target.files
            );


        files.forEach(
            (file, index) => {

                const newSong = {

                    id:
                        Date.now() + index,

                    title:
                        file.name
                            .replace(
                                /\.[^/.]+$/,
                                ""
                            ),

                    artist:
                        "Local Artist",

                    album:
                        "My Music",

                    cover:
                        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500",

                    src:
                        URL.createObjectURL(file)

                };


                songs.push(newSong);

            }
        );


        renderSongs();

        renderQueue();

    }
);

const startListeningBtn =
    document.getElementById(
        "startListeningBtn"
    );


startListeningBtn.addEventListener(
    "click",
    () => {

        playSong(0);

    }
);


document
    .getElementById("viewAllBtn")
    .addEventListener(
        "click",
        () => {

            document
                .querySelector(
                    '[data-section="home"]'
                )
                .click();

            window.scrollTo({
                top: 400,
                behavior: "smooth"
            });

        }
    );


document.addEventListener(
    "keydown",
    (event) => {


        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT"
        ) {

            event.preventDefault();

            playBtn.click();

        }


        if (event.code === "ArrowRight") {

            nextSong();

        }


        if (event.code === "ArrowLeft") {

            previousSong();

        }

    }
);