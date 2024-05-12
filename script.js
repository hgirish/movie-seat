const movieSelect = document.getElementById('movie-select');
const seatMap = document.getElementById('seat-map');
const selectedSeats = document.getElementById('selected-seats');
const totalPrice = document.getElementById('total-price');

let selectedMovie = null;
let selectedSeatsArr = [];

const seatPrices = {
  movie1: 10,
  movie2: 12,
  movie3: 15,
};





function updateSeatMap() {
  const numRows = 10; // Adjust based on your desired number of rows
  const numCols = 10; // Adjust based on your desired number of columns

  seatMap.innerHTML = '';
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const seat = document.createElement('div');
      seat.classList.add('seat');
      seat.dataset.seatId = `${row}-${col}`;
      seat.addEventListener('click', handleSeatClick);
      seatMap.appendChild(seat);
    }
  }

  const storedSelections = localStorage.getItem('movieBooking');
  if (storedSelections) {
    let dict = JSON.parse(storedSelections);
    const obj = dict.find(x => x.movie === selectedMovie);
    if (obj) {
      selectedMovie = obj.movie;
      selectedSeatsArr = obj.seats;
    }

    updateSelectedSeats();
    updateTotalPrice();
    markSelectedSeats();
  }
}

function handleSeatClick(e) {
  const seatId = e.target.dataset.seatId;
  const seatIndex = selectedSeatsArr.indexOf(seatId);

  if (seatIndex !== -1) {
    selectedSeatsArr.splice(seatIndex, 1);
  } else {
    selectedSeatsArr.push(seatId);
  }

  updateSelectedSeats();
  updateTotalPrice();
  markSelectedSeats();
  storeSelections();
}

function updateSelectedSeats() {
  let selectedSeatsList = '';
  if (selectedSeatsArr.length > 0) {
    selectedSeatsList = selectedSeatsArr.join(', ');
  } else {
    selectedSeatsList = 'No seats selected';
  }
  selectedSeats.textContent = selectedSeatsList;
}

function updateTotalPrice() {
  if (selectedMovie && selectedSeatsArr.length > 0) {
    const moviePrice = seatPrices[selectedMovie];
    const totalPriceValue = moviePrice * selectedSeatsArr.length;
    totalPrice.textContent = `$${totalPriceValue}`;
  } else {
    totalPrice.textContent = '$0';
  }
}

function markSelectedSeats() {
  const seats = seatMap.querySelectorAll('.seat');
  seats.forEach(seat => {
    seat.classList.remove('selected');
    if (selectedSeatsArr.includes(seat.dataset.seatId)) {
      seat.classList.add('selected');
    }
  });
}

// Call updateSeatMap on page load to initialize the seat map
updateSeatMap();

// Update seat map and selections whenever movie selection changes
movieSelect.addEventListener('change', () => {
  selectedMovie = movieSelect.value;
  selectedSeatsArr = [];
  updateSeatMap();
  updateSelectedSeats();
  updateTotalPrice();
  storeSelections();
});

function storeSelections() {
  const data = {
    movie: selectedMovie,
    seats: selectedSeatsArr,
  };
  const storedSelections = localStorage.getItem('movieBooking');
  let dict = JSON.parse(storedSelections);
  if (!dict) dict = [];
  if (selectedMovie !== null) {
    const selectedIndex = dict.findIndex(x => x.movie === selectedMovie);
    if (selectedIndex > -1) {
      dict[selectedIndex] = data;
    } else {
      dict.push(data);
    }

  }
  localStorage.setItem('movieBooking', JSON.stringify(dict));
}
