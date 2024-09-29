const storyContainer = document.getElementById('story');
const userInput = document.getElementById('user-input');
const addSentenceButton = document.getElementById('add-sentence');
const resetButton = document.getElementById('reset-story');
const feedback = document.getElementById('feedback');

const prompts = [
    "Once upon a time, in a mysterious forest...",
    "In a kingdom far away, a brave knight embarked on a quest...",
    "On a stormy night, a strange creature appeared at the door...",
    "Deep in the ocean, a hidden treasure awaited discovery...",
    "In a bustling city, a secret society plotted their next move..."
];

let story = "";

// Function to select a random prompt
function getRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}

// Initialize the story on page load
function initializeStory() {
    story = getRandomPrompt();
    updateStory();
}

// Function to update the displayed story
function updateStory() {
    storyContainer.textContent = story;
}

// Add sentence to the story
addSentenceButton.addEventListener('click', () => {
    const userSentence = userInput.value.trim();
    if (userSentence) {
        story += ` ${userSentence}`;
        userInput.value = '';
        updateStory();
        feedback.textContent = "Your sentence has been added!";
    } else {
        feedback.textContent = "Please enter a sentence!";
    }
});

// Reset the story to a new random prompt
resetButton.addEventListener('click', () => {
    initializeStory();
    feedback.textContent = "";
});

// Initialize the story when the page loads
initializeStory();
