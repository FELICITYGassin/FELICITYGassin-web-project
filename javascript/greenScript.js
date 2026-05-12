const body = document.body;
const themeToggle = document.getElementById('contrast-toggle');
const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');
const newsletterMessage = document.getElementById('newsletter-message');
const contactForm = document.getElementById('contact-form');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const contactResponse = document.getElementById('contact-response');
const productSearch = document.getElementById('product-search');
const productCategory = document.getElementById('product-category');
const priceRange = document.getElementById('price-range');
const productCards = document.querySelectorAll('.product-card');
const productButtons = document.querySelectorAll('.product-cta');

function updateContrastButton() {
  if (!themeToggle) return;
  const enabled = body.classList.contains('high-contrast');
  themeToggle.textContent = enabled ? 'Normal contrast' : 'High contrast';
  themeToggle.setAttribute('aria-pressed', enabled.toString());
}

function loadContrastPreference() {
  try {
    const saved = localStorage.getItem('greentech-contrast');
    if (saved === 'enabled') {
      body.classList.add('high-contrast');
    }
  } catch (error) {
    console.warn('Contrast preference unavailable', error);
  }
  updateContrastButton();
}

function toggleContrast() {
  body.classList.toggle('high-contrast');
  const enabled = body.classList.contains('high-contrast');
  try {
    localStorage.setItem('greentech-contrast', enabled ? 'enabled' : 'disabled');
  } catch (error) {
    console.warn('Unable to save contrast preference', error);
  }
  updateContrastButton();
  announceMessage(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`, 'polite');
}

function announceMessage(message, type = 'status') {
  const live = document.getElementById('live-region') || createLiveRegion();
  live.textContent = message;
  if (type === 'assertive') live.setAttribute('aria-live', 'assertive');
}

function createLiveRegion() {
  const live = document.createElement('div');
  live.id = 'live-region';
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  document.body.appendChild(live);
  return live;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function handleNewsletterSubmit(event) {
  if (!newsletterForm) return;
  event.preventDefault();

  const email = newsletterEmail.value.trim();
  if (!validateEmail(email)) {
    newsletterMessage.textContent = 'Please enter a valid email address to join the GreenTech mailing list.';
    newsletterMessage.className = 'error-message';
    newsletterEmail.setAttribute('aria-invalid', 'true');
    newsletterEmail.focus();
    announceMessage('Newsletter email is invalid. Please enter a valid email address.', 'assertive');
    return;
  }

  newsletterEmail.setAttribute('aria-invalid', 'false');
  newsletterMessage.textContent = 'Thanks! You\'re subscribed to sustainability updates.';
  newsletterMessage.className = 'success-message';
  newsletterForm.reset();
  announceMessage('Newsletter signup complete. Thank you for subscribing.');
}

function showContactMessage(message, isError = false) {
  if (!contactResponse) return;
  contactResponse.textContent = message;
  contactResponse.className = isError ? 'error-message' : 'success-message';
}

function handleContactSubmit(event) {
  if (!contactForm) return;
  event.preventDefault();

  const name = contactName.value.trim();
  const email = contactEmail.value.trim();
  const message = contactMessage.value.trim();

  // Reset aria-invalid attributes
  contactName.setAttribute('aria-invalid', 'false');
  contactEmail.setAttribute('aria-invalid', 'false');
  contactMessage.setAttribute('aria-invalid', 'false');

  if (!name || !validateEmail(email) || !message) {
    let errorMessage = 'Please complete all required fields: ';
    const errors = [];
    
    if (!name) {
      errors.push('name');
      contactName.setAttribute('aria-invalid', 'true');
    }
    if (!validateEmail(email)) {
      errors.push('valid email address');
      contactEmail.setAttribute('aria-invalid', 'true');
    }
    if (!message) {
      errors.push('message');
      contactMessage.setAttribute('aria-invalid', 'true');
    }
    
    errorMessage += errors.join(', ');
    showContactMessage(errorMessage, true);
    announceMessage('Contact form submission failed. ' + errorMessage, 'assertive');
    
    // Focus first invalid field
    if (!name) contactName.focus();
    else if (!validateEmail(email)) contactEmail.focus();
    else contactMessage.focus();
    
    return;
  }

  showContactMessage('Thanks for reaching out! Our team will contact you soon.');
  contactForm.reset();
  announceMessage('Contact form submitted successfully.');
}

function filterProducts() {
  if (!productCards.length) return;
  const query = productSearch?.value.trim().toLowerCase() || '';
  const category = productCategory?.value || 'all';
  const priceFilter = priceRange?.value || 'all';
  
  let visibleCount = 0;
  productCards.forEach((card) => {
    const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
    const summary = card.querySelector('p')?.textContent.toLowerCase() || '';
    const cardCategory = card.dataset.category || 'all';
    const cardPrice = Number(card.dataset.price) || 0;
    const matchesQuery = !query || title.includes(query) || summary.includes(query);
    const matchesCategory = category === 'all' || cardCategory === category;
    let matchesPrice = true;
    if (priceFilter === 'under-1000') matchesPrice = cardPrice < 1000;
    else if (priceFilter === '1000-5000') matchesPrice = cardPrice >= 1000 && cardPrice <= 5000;
    else if (priceFilter === '5000-10000') matchesPrice = cardPrice >= 5000 && cardPrice <= 10000;
    
    const shouldShow = matchesQuery && matchesCategory && matchesPrice;
    card.style.display = shouldShow ? 'grid' : 'none';
    if (shouldShow) visibleCount++;
  });
  
  // Announce filter results to screen readers
  const filterDescription = query ? `Search results for "${query}"` : 'All products';
  const categoryText = category !== 'all' ? ` in ${category} category` : '';
  const priceText = priceFilter !== 'all' ? ` with ${priceFilter} price range` : '';
  announceMessage(`Showing ${visibleCount} products: ${filterDescription}${categoryText}${priceText}`, 'polite');
}

function redirectToContact() {
  window.location.href = 'contactUs.html';
}

// Add keyboard navigation support for product cards
function handleProductCardKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    redirectToContact();
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleContrast);
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);
}

if (contactForm) {
  contactForm.addEventListener('submit', handleContactSubmit);
}

if (productSearch) {
  productSearch.addEventListener('input', filterProducts);
}

if (productCategory) {
  productCategory.addEventListener('change', filterProducts);
}

if (priceRange) {
  priceRange.addEventListener('change', filterProducts);
}

if (productButtons?.length) {
  productButtons.forEach((button) => {
    button.addEventListener('click', redirectToContact);
    button.addEventListener('keydown', handleProductCardKeydown);
    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', `Get quote for ${button.closest('.product-card').querySelector('h2').textContent}`);
  });
}

loadContrastPreference();
