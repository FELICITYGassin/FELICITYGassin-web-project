const catForm = document.getElementById('cat-form');
const nameInput = document.getElementById('name');
const commentInput = document.getElementById('comment');
const feedbackSection = document.getElementById('feedback-section');
const thankYouMessage = document.getElementById('thank-you-message');
const greetingMessage = document.getElementById('greeting-message');
const thankYouText = document.getElementById('thank-you-text');
const openFormBtn = document.getElementById('open-form-btn');

function announceToScreenReaders(msg) {
    const a = document.createElement('div');
    a.setAttribute('role', 'status');
    a.setAttribute('aria-live', 'polite');
    a.setAttribute('aria-atomic', 'true');
    a.className = 'sr-only';
    a.textContent = msg;
    document.body.appendChild(a);
    setTimeout(() => a.remove(), 3000);
}

function validateForm() {
    let valid = true;
    nameInput.removeAttribute('aria-invalid');
    commentInput.removeAttribute('aria-invalid');
    
    if (!nameInput.value.trim()) {
        nameInput.setAttribute('aria-invalid', 'true');
        announceToScreenReaders('Name field is required');
        valid = false;
    }
    if (!commentInput.value.trim()) {
        commentInput.setAttribute('aria-invalid', 'true');
        announceToScreenReaders('Comment field is required');
        valid = false;
    }
    return valid;
}

function clearForm() {
    catForm.reset();
    nameInput.removeAttribute('aria-invalid');
    commentInput.removeAttribute('aria-invalid');
}

function closeForm() {
    clearForm();
    feedbackSection.classList.add('hidden');
    openFormBtn.style.display = 'block';
    openFormBtn.focus();
    feedbackSection.removeAttribute('role');
    feedbackSection.removeAttribute('aria-modal');
    feedbackSection.removeAttribute('aria-labelledby');
}

openFormBtn.addEventListener('click', () => {
    clearForm();
    catForm.style.display = 'block';
    thankYouMessage.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
    openFormBtn.style.display = 'none';
    nameInput.focus();
    announceToScreenReaders('Feedback form opened. Please enter your name and favorite cat breed.');
    feedbackSection.setAttribute('role', 'dialog');
    feedbackSection.setAttribute('aria-modal', 'true');
    feedbackSection.setAttribute('aria-labelledby', 'feedback-section');
});

catForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();
    
    greetingMessage.textContent = `Thank you, ${name}!`;
    thankYouText.innerHTML = `Thank you for sharing your favorite cat breed:<br><br><em>"${comment}"</em><br><br>-Cat Hub!`;
    
    catForm.style.display = 'none';
    thankYouMessage.classList.remove('hidden');
    announceToScreenReaders(`Thank you, ${name}! Your feedback has been received.`);
    thankYouMessage.focus();
    thankYouMessage.setAttribute('tabindex', '-1');
    thankYouMessage.setAttribute('role', 'alert');
});

document.querySelector('.btn-cancel').addEventListener('click', () => {
    announceToScreenReaders('Form closed.');
    closeForm();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearForm();
    catForm.style.display = 'block';
    thankYouMessage.classList.add('hidden');
    nameInput.focus();
    announceToScreenReaders('Form cleared. Ready for new entry.');
});

document.getElementById('back-btn').addEventListener('click', () => {
    announceToScreenReaders('Returning to main page.');
    closeForm();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !feedbackSection.classList.contains('hidden')) {
        announceToScreenReaders('Form closed with Escape key.');
        closeForm();
    }
});

commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) catForm.dispatchEvent(new Event('submit'));
});