console.clear();

// Function to fetch and parse the CSV file - courtesy of chatGPT
function fetchCSVFile() {
    fetch('donorlist.csv') // path to your CSV file
        .then(response => response.text())
        .then(data => {
            const names = data.split('\n'); // Split CSV data into an array of names

            // Get the container element where you want to display the names
            const nameContainer = document.getElementById('card-wall');
            const overlayContainer = document.getElementById('overlay-wall');
            // const nameContainer = document.querySelector('.cards__inner');

            // Iterate through the names and create HTML elements with CSS classes
            names.forEach(name => {
                const nameElement = document.createElement('div');
                nameElement.textContent = name.trim(); // Trim to remove whitespace
                nameElement.classList.add('card'); // Add the CSS class
                nameContainer.appendChild(nameElement);
                // Create corresponding overlay card
                if (window.innerWidth > 768) {
                const overlayCard = document.createElement('div');
                overlayCard.textContent = name.trim(); // Trim to remove whitespace
                overlayCard.classList.add('card');
                overlayContainer.appendChild(overlayCard);
                }

            });
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

// Call the function to fetch and display the CSV data
 fetchCSVFile();

// GLOWING  https://codepen.io/inescodes/details/PoxMyvX

const isMobile = window.innerWidth <= 768; // Define your mobile threshold as needed

if (!isMobile) { // Check if it's not a mobile device

const cardsContainer = document.querySelector(".cards");
const cards = Array.from(document.querySelectorAll(".card"));
const overlay = document.querySelector(".overlay");

const applyOverlayMask = (e) => {
  const overlayEl = e.currentTarget;
  const x = e.pageX - cardsContainer.offsetLeft;
  const y = e.pageY - cardsContainer.offsetTop;

  overlayEl.style = `--opacity: 1; --x: ${x}px; --y:${y}px;`;
};

const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const cardIndex = cards.indexOf(entry.target);
    // let width = entry.borderBoxSize[0].inlineSize;
    // let height = entry.borderBoxSize[0].blockSize;

    if (cardIndex >= 0) {
      overlay.children[cardIndex].style.width = `${width}px`;
      overlay.children[cardIndex].style.height = `${height}px`;
    }
  });
});

const initOverlayCard = (cardEl) => {
  const overlayCard = document.createElement("div");
  overlayCard.classList.add("card");
  overlay.append(overlayCard);
  observer.observe(cardEl);
};

cards.forEach(initOverlayCard);
document.body.addEventListener("pointermove", applyOverlayMask);
}
