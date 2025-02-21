// New concept: Implemented Levenshtein Distance for typo forgiveness

const genres = {
  rock: {
    name: "Rock & Roll",
    songs: [
      {
        title: "I Love Rock 'n' Roll",
        artist: "Joan Jett",
        file: "audio/rock1.mp3",
        image: "images/joanjett.jpg",
        //video: "https://www.youtube.com/watch?v=STG7w6h1IrM",
      },
      {
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        file: "audio/rock2.mp3",
        image: "images/gunsnroses.jpg",
        //video: "https://www.youtube.com/embed/1w7OgIMMRc4",
      },
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        file: "audio/rock3.mp3",
        image: "images/queen.jpg",
        //video: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
      },
    ],
    style: { background: "#2c3e50", color: "#E63946" },
    backgroundimage: "url('images/rock-background.jpg)"
  },

  country: {
    name: "Country",
    songs: [
      {
        title: "Jolene",
        artist: "Dolly Parton",
        file: "audio/country1.mp3",
        image: "images/dollyparton.jpg",
        //video: "https://www.youtube.com/embed/irnTlxdJghM",
      },
      {
        title: "Friends in Low Places",
        artist: "Garth Brooks",
        file: "audio/country2.mp3",
        image: "images/garthbrooks.jpg",
        //video: "https://www.youtube.com/embed/aWtv_ySeNW0",
      },
      {
        title: "Forever and Ever, Amen",
        artist: "Randy Travis",
        file: "audio/country3.mp3",
        image: "images/randytravis.jpg",
        //video: "https://www.youtube.com/embed/KtKXc_v2iLE",
      },
    ],
    style: { background: "#8B4513", color: "#F4A261" },
  },

  pop: {
    name: "Pop",
    songs: [
      {
        title: "Don't Stop Believin'",
        artist: "Journey",
        file: "audio/pop1.mp3",
        image: "images/journey.jpg",
        //video: "https://www.youtube.com/embed/VcjzHMhBtf0",
      },
      {
        title: "Oops! I Did It Again",
        artist: "Britney Spears",
        file: "audio/pop2.mp3",
        image: "images/britneyspears.jpg",
        //video: "https://www.youtube.com/embed/6X4I59bFV-s",
      },
      {
        title: "I Want It That Way",
        artist: "Backstreet Boys",
        file: "audio/pop3.mp3",
        image: "images/backstreetboys.jpg",
        //video: "https://www.youtube.com/embed/jJ-ueetuZOk",
      },
    ],
    style: { background: "#ff69b4", color: "#ffffff" },
  },
};

const maxStages = 3;
let currentGenre = null;
let currentStage = 0;

function startGame(genre) {
  currentGenre = genres[genre];
  currentStage = 0;

  console.log(`Starting game with genre: ${currentGenre.name}`);

  // Hide genre selection and show the game room
  document.getElementById("genre-selection").classList.add("hidden");
  generateGameRoom();

  document.body.style.background = currentGenre.style.background;
  document.body.style.color = currentGenre.style.color;
  document.body.style.backgroundImage = currentGenre.backgroundImage;
  document.body.style.backgroundSize = "cover"; // Ensure full coverage
  document.body.style.backgroundPosition = "center"; // Center image
  document.body.style.backgroundRepeat = "no-repeat"; // Prevent tiling

  loadClue();
}

function generateGameRoom() {
  let gameRoom = document.getElementById("game-room");
  gameRoom.classList.remove("hidden");
  gameRoom.innerHTML = "";

  let roomTitle = document.createElement("h2");
  roomTitle.innerText = `Welcome to ${currentGenre.name} Escape Room`;
  gameRoom.appendChild(roomTitle);

  let roomDescription = document.createElement("p");
  roomDescription.innerText = "Solve music puzzles to escape!";
  gameRoom.appendChild(roomDescription);

  // Clue Section
  let clueContainer = document.createElement("article");
  clueContainer.id = "clue-container";
  gameRoom.appendChild(clueContainer);

  // Answer Input Sectipn
  let answerSection = document.createElement("article");
  answerSection.id = "answer-section";
  let answerInput = document.createElement("input");
  answerInput.id = "answer";
  answerInput.placeholder = "enter song title or artist...";
  let submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.onclick = checkAnswer;
  answerSection.appendChild(answerInput);
  answerSection.appendChild(submitButton);
  gameRoom.appendChild(answerSection);

  // Locked Door
  let doorStatus = document.createElement("article");
  doorStatus.id = "door-status";
  let door = document.createElement("h3");
  door.id = "door";
  door.classList.add("locked");
  door.innerText = "🚪 LOCKED";
  let message = document.createElement("p");
  message.id = "message";
  doorStatus.appendChild(door);
  doorStatus.appendChild(message);
  gameRoom.appendChild(doorStatus);
}

function loadClue() {
  let song = currentGenre.songs[currentStage];
  let clueContainer = document.getElementById("clue-container");
  clueContainer.innerHTML = "";

  let questionText = document.createElement("p");
  questionText.id = "question-text";
  questionText.innerText = `🎧 Listen to Sound Clip & Guess! (Stage ${
    currentStage + 1
  })`;
  clueContainer.appendChild(questionText);

  // Create Audio Elemnt
  let audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.src = song.file;
  audioElement.preload = "auto";
  audioElement.classList.add("center-audio");

  audioElement.addEventListener("play", () => {
    setTimeout(() => {
      audioElement.pause();
      audioElement.currentTime = 0;
      console.log("Audio clip stopped and reset to the start.");
    }, 3000);
  });

  clueContainer.appendChild(audioElement);
}

function checkAnswer() {
  let answerInput = document.getElementById("answer");
  let guess = answerInput.value.toLowerCase().trim();
  let song = currentGenre.songs[currentStage];

  let correctTitle = normalizeText(song.title);
  let correctArtist = normalizeText(song.artist);
  let normalizedGuess = normalizeText(guess);

  console.log("User Answer:", guess);
  console.log("Normalized Answer:", normalizedGuess);
  console.log("Correct Title:", correctTitle);
  console.log("Correct Artist:", correctArtist);

  if (
    isCloseMatch(normalizedGuess, correctTitle) ||
    isCloseMatch(normalizedGuess, correctArtist)
  ) {
    currentStage++;
    document.getElementById("message").innerText =
      "✅ Correct! Unlocking next stage...";

    // show artist image when correct answer
    let artistImage = document.createElement("img");
    artistImage.src = song.image;
    artistImage.alt = song.artist;
    artistImage.style.width = "250px";
    artistImage.style.marginTop = "15px";
    artistImage.style.borderRadius = "10px";
    artistImage.style.boxShadow = "0px 0px 10px white";

    let clueContainer = document.getElementById("clue-container");
    clueContainer.appendChild(artistImage);

    // add image to game room
    answerInput.value = "";
    answerInput.focus();

    // clear input field and focus on it
    answerInput.value = "";
    answerInput.focus();

    if (currentStage < maxStages) {
      document.getElementById("door").innerText = "🔓 Unlocking...";
      document.getElementById("door").style.color = "#FFD700";
      setTimeout(loadClue, 2000);
    } else {
      // Unlock the door on the final stage
      document.getElementById("door").classList.remove("locked");
      document.getElementById("door").classList.add("unlocked");
      document.getElementById("door").innerText = "🚪 OPEN!";
      document.getElementById("message").innerText = "🎉 CONGRATULATIONS!!! YOU ESCAPED!!!";
      document.getElementById("door").style.color = "#32CD32";
    }
  } else {
    document.getElementById("message").innerText = "❌ Try Again!";
  }
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, "") // Remove punctuation
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim();
}

function isCloseMatch(userInput, correctAnswer) {
  let distance = levenshteinDistance(userInput, correctAnswer);
  let maxLen = Math.max(userInput.length, correctAnswer.length);

  return (
    distance <= Math.ceil(maxLen * 0.3) || correctAnswer.includes(userInput)
  );
}

function levenshteinDistance(a, b) {
  let matrix = Array.from(Array(a.length + 1), () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      let cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[a.length][b.length];
}
