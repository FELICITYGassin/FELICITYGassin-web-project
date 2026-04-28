const catForm = document.getElementById('cat-form');
const nameInput = document.getElementById('name');
const commentInput = document.getElementById('comment');
const feedbackSection = document.getElementById('feedback-section');
const thankYouMessage = document.getElementById('thank-you-message');
const greetingMessage = document.getElementById('greeting-message');
const thankYouText = document.getElementById('thank-you-text');
const resetBtn = document.getElementById('reset-btn');
const openFormBtn = document.getElementById('open-form-btn');

// Event listener to open the form
openFormBtn.addEventListener('click', function() {
    catForm.reset();
    catForm.style.display = 'block';
    thankYouMessage.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
    openFormBtn.style.display = 'none';
    nameInput.focus();
});

// event listener for form submission
catForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // User input
    const userName = nameInput.value.trim();
    const userComment = commentInput.value.trim();
    
    // Personalized greeting message
    greetingMessage.textContent = `Thank you, ${userName}!`;
    
    // Thank you message with their comment
    thankYouText.innerHTML = `We appreciate you sharing your thoughts about your favorite cat breed:<br><br><em>"${userComment}"</em><br><br>Your feedback has been received!`;
    
    // Hide form and show thank you message
    catForm.style.display = 'none';
    thankYouMessage.classList.remove('hidden');
});

// Event listener to submit another response
resetBtn.addEventListener('click', function() {
    catForm.reset();
    
    catForm.style.display = 'block';
    thankYouMessage.classList.add('hidden');
    
    nameInput.focus();
});

const cancelBtn = document.querySelector('.btn-cancel');
cancelBtn.addEventListener('click', function() {
    catForm.reset();
    feedbackSection.classList.add('hidden');
    openFormBtn.style.display = 'block';
});

// Event listener for back button
const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', function() {
    catForm.reset();
    thankYouMessage.classList.add('hidden');
    feedbackSection.classList.add('hidden');
    openFormBtn.style.display = 'block';
});