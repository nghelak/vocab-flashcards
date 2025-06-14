
let vocabData = [];
let currentItems = [];
let currentIndex = 0;

fetch('vocab_data.json')
  .then(response => response.json())
  .then(data => {
    vocabData = data;
    populateUnits();
  });

function populateUnits() {
  const unitSelect = document.getElementById("unit");
  const units = [...new Set(vocabData.map(item => item.unit))];
  units.forEach(unit => {
    const option = document.createElement("option");
    option.value = unit;
    option.textContent = unit;
    unitSelect.appendChild(option);
  });

  unitSelect.addEventListener("change", populateCategories);
  document.getElementById("category").addEventListener("change", startFlashcards);
}

function populateCategories() {
  const selectedUnit = document.getElementById("unit").value;
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = "";

  const categories = vocabData
    .filter(item => item.unit === selectedUnit)
    .map(item => item.category);

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  startFlashcards();
}

function startFlashcards() {
  const unit = document.getElementById("unit").value;
  const category = document.getElementById("category").value;
  const match = vocabData.find(item => item.unit === unit && item.category === category);

  if (match) {
    currentItems = match.items;
    currentIndex = 0;
    showCard();
  }
}

function showCard() {
  const card = document.getElementById("flashcard");
  const word = currentItems[currentIndex];
  card.innerHTML = `
    <div>${word}</div>
    <button onclick="speak('${word}')">🔊 Listen</button>
  `;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // or 'en-GB' for British accent
  speechSynthesis.speak(utterance);
}



document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentItems.length === 0) return;
  currentIndex = (currentIndex + 1) % currentItems.length;
  showCard();
});
