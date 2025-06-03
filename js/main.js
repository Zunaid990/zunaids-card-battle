let deckId = '';

document.querySelector('#deck').addEventListener('click', getDeck);
document.querySelector('#dealButton').addEventListener('click', dealTwo);
document.querySelector('#resetButton').addEventListener('click', resetGame);

async function getDeck() {
    try {
        const result = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await result.json();
        deckId = data.deck_id;
        document.querySelector('#dealButton').disabled = false;
        document.querySelector('#result').innerText = 'Deck ready! Deal cards to play.';
        resetCards();
    } catch (err) {
        console.error(err);
        document.querySelector('#result').innerText = 'Error fetching deck. Try again.';
    }
}

async function dealTwo() {
    try {
        const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.success) {
            document.querySelector('#result').innerText = 'No cards left! Get a new deck.';
            document.querySelector('#dealButton').disabled = true;
            return;
        }

        // Add flip animation
        document.querySelectorAll('.card-container').forEach(card => card.classList.add('flipped'));

        // Update card images and values
        const card1 = data.cards[0];
        const card2 = data.cards[1];
        document.querySelector('#card1').src = card1.image;
        document.querySelector('#card2').src = card2.image;
        document.querySelector('#card1-value').innerText = `${card1.value} of ${card1.suit}`;
        document.querySelector('#card2-value').innerText = `${card2.value} of ${card2.suit}`;

        // Determine winner
        const playerOneValue = turnItNum(card1.value);
        const playerTwoValue = turnItNum(card2.value);
        const resultElement = document.querySelector('#result');
        if (playerOneValue > playerTwoValue) {
            resultElement.innerText = 'Player 1 Wins!';
            resultElement.className = 'win';
        } else if (playerOneValue < playerTwoValue) {
            resultElement.innerText = 'Player 2 Wins!';
            resultElement.className = 'win';
        } else {
            resultElement.innerText = "It's a Tie!";
            resultElement.className = 'tie';
        }
    } catch (err) {
        console.error(err);
        document.querySelector('#result').innerText = 'Error dealing cards. Try again.';
    }
}

function turnItNum(num) {
    if (num === 'ACE') return 14;
    if (num === 'KING') return 13;
    if (num === 'QUEEN') return 12;
    if (num === 'JACK') return 11;
    return Number(num) || 0;
}

function resetGame() {
    deckId = '';
    document.querySelector('#dealButton').disabled = true;
    document.querySelector('#result').innerText = 'Click "New Deck" to begin!';
    document.querySelector('#result').className = '';
    resetCards();
}

function resetCards() {
    document.querySelectorAll('.card-container').forEach(card => card.classList.remove('flipped'));
    document.querySelector('#card1').src = 'https://www.deckofcardsapi.com/static/img/back.png';
    document.querySelector('#card2').src = 'https://www.deckofcardsapi.com/static/img/back.png';
    document.querySelector('#card1-value').innerText = '';
    document.querySelector('#card2-value').innerText = '';
}