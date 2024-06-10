let currentIndex = 0;
const cards = document.querySelectorAll('.card');
const dots = document.querySelectorAll('.dot');
const totalCards = cards.length;
const interval = 2000; 
let slideInterval;

function updateCardPosition() {
    cards.forEach((card, index) => {
        let position = (index - currentIndex + totalCards) % totalCards;
        card.style.zIndex = totalCards - position;

        if (position === 0) {
            card.style.transform = `translateX(${0}%)`;
        } else if (position === totalCards) {
            card.style.transform = `translateX(${200}%)`;
        } else {
            card.style.transform = `translateX(${(position ) * 100}%)`;
        }
    });
    updateDots();
}

function updateDots() {
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextCard() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCardPosition();
}

function goToCard(index) {
    currentIndex = index;
    updateCardPosition();
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextCard, interval);
}

updateCardPosition();

slideInterval = setInterval(nextCard, interval);

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        goToCard(parseInt(dot.getAttribute('data-index')));
        resetInterval(); 
    });
});