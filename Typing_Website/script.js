let randomSentence = "";
let timer;
let timeLeft = 60;
let isTyping = false;
let startTime = null;

// Fetch a random sentence
async function fetchRandomSentence() {
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        randomSentence = data.quote;
        displaySentence();
    } catch (error) {
        document.getElementById('random-sentence').textContent =
            "Failed to load sentence. Please refresh the page.";
        console.error("Error fetching sentence:", error);
    }
}

// Display sentence with spans
function displaySentence() {
    const sentenceDiv = document.getElementById('random-sentence');
    sentenceDiv.innerHTML = randomSentence.split('').map(char => `<span>${char}</span>`).join('');
}

// Start timer when typing begins
function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
        } else {
            stopTimer();
            document.getElementById('typing-area').disabled = true;
            calculateResults();
        }
    }, 1000);
}

// Stop timer
function stopTimer() {
    clearInterval(timer);
}

// Calculate and display CPM and WPM
function calculateResults() {
    const typedText = document.getElementById('typing-area').value.trim();
    let correctChars = 0, correctWords = 0;

    // Count correct characters
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === randomSentence[i]) {
            correctChars++;
        }
    }

    correctWords = correctChars / 5;

    // Prevent division by zero
    let elapsedTime = (Date.now() - startTime) / 1000; // in seconds
    if (elapsedTime === 0) elapsedTime = 1;

    const cpm = Math.round((correctChars / elapsedTime) * 60);
    const wpm = Math.round((correctWords / elapsedTime) * 60);

    document.getElementById('results').textContent = `CPM: ${cpm}, WPM: ${wpm}`;
}

// Typing event listener
document.getElementById('typing-area').addEventListener('input', (e) => {
    if (!isTyping) {
        isTyping = true;
        startTimer();
    }

    const typedText = e.target.value;
    const randomTextSpans = document.querySelectorAll('#random-sentence span');
    let lastTypedIndex = typedText.length - 1;
    
    // Highlight correct and incorrect characters
    randomSentence.split('').forEach((char, index) => {
        if (typedText[index] == null) {
            randomTextSpans[index].className = '';
        } else if (typedText[index] === char) {
            randomTextSpans[index].className = 'highlight-correct';
        } else {
            randomTextSpans[index].className = 'highlight-error';
        }
    });

    // Stop timer when last character is typed, even if errors exist
    if (lastTypedIndex === randomSentence.length - 1) {
        stopTimer();
        document.getElementById('typing-area').disabled = true;
        calculateResults();
    }
});

// Refresh button
document.getElementById('refresh-button').addEventListener('click', () => {
    location.reload();
});

// Fetch sentence on page load
fetchRandomSentence();
