/* mock data */
const data = {
  seances: [
    {
      id: "seance1",
      day: "12.04.2023",
      time: "10",
      movieId: "movie1",
      reserved: [0, 1, 5, 8, 15, 19]
    },
    {
      id: "seance2",
      day: "12.04.2023",
      time: "10",
      movieId: "movie3",
      reserved: [0, 1, 6, 8, 12, 19]
    },
    {
      id: "seance3",
      day: "12.04.2023",
      time: "12",
      movieId: "movie1",
      reserved: [0, 3, 5, 8, 15, 18]
    },
    {
      id: "seance4",
      day: "12.04.2023",
      time: "12",
      movieId: "movie2",
      reserved: [0, 2, 5, 6, 14, 15, 18]
    },
    {
      id: "seance40",
      day: "12.04.2023",
      time: "16",
      movieId: "movie2",
      reserved: [0, 2, 5, 6, 14, 15, 18]
    },
    {
      id: "seance41",
      day: "12.04.2023",
      time: "16",
      movieId: "movie3",
      reserved: [0, 2, 5, 6, 14, 12, 18]
    },
    {
      id: "seance41",
      day: "12.04.2023",
      time: "16",
      movieId: "movie1",
      reserved: [1, 2, 5, 16, 14, 15, 18]
    },
    {
      id: "seance5",
      day: "13.04.2023",
      time: "18",
      movieId: "movie2",
      reserved: [0, 2, 5, 6, 14, 15, 18]
    },
    {
      id: "seance50",
      day: "13.04.2023",
      time: "12",
      movieId: "movie1",
      reserved: [0, 2, 5, 7, 16, 14, 15, 18]
    },
    {
      id: "seance51",
      day: "13.04.2023",
      time: "16",
      movieId: "movie3",
      reserved: [0, 2, 16, 14, 15, 18]
    },
    {
      id: "seance53",
      day: "13.04.2023",
      time: "18",
      movieId: "movie1",
      reserved: [0, 2, 16, 14, 15, 17]
    },
    {
      id: "seance6",
      day: "14.04.2023",
      time: "10",
      movieId: "movie3",
      reserved: [0, 2, 5, 7, 10]
    },
    {
      id: "seance7",
      day: "14.04.2023",
      time: "10",
      movieId: "movie1",
      reserved: [0, 3, 4, 8, 10]
    }
  ],
  movies: [
    {
      id: "movie1",
      name: "Аватар: шлях води",
      imgSrc: "1.jpeg"
    },
    {
      id: "movie2",
      name: "Вартові галактики 3",
      imgSrc: "2.jpeg"
    },
    {
      id: "movie3",
      name: "Мавка. Лісова пісня",
      imgSrc: "3.jpeg"
    }
  ]
}

/* add nearest 7 days as options for day select */
const checkAvailableDays = () => {
  const selectDay = document.querySelector("#tickets_date-select")

  for (let i = 0; i < 7; i++) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + i)
  
    selectDay.innerHTML += `<option>${tomorrow.toLocaleDateString()}</option>`
  }
}

checkAvailableDays()

const closeTicketsPopup = () => {
  const ticketsPopUp = document.querySelector("#tickets-pop-up")
  ticketsPopUp.classList.add("hidden")
}

const openSeatsPopUp = (event) => {
  const popup = document.querySelector(".tickets-pop-up")
  const popupSeats = document.querySelector(".tickets-pop-up_seats")
  const buyTicketsButton = document.querySelector("#buy-tickets-btn")
  const seanceId = event.currentTarget.getAttribute("data-seance-id")
  const seance = data.seances?.find((seanceData) => seanceData.id == seanceId)

  popup.classList.remove("hidden")
  buyTicketsButton.setAttribute("data-seance-id", seanceId)

  if (seance) {
    popupSeats.innerHTML = ""

    for (let i = 0; i < 20; i++) {
      const seatIsAlreadyReserved = seance.reserved.find((reservedSeat) => reservedSeat == i)

      popupSeats.innerHTML +=  seatIsAlreadyReserved
      ? `<input id="seats-${i}" class="tickets-pop-up_seats_input" type="checkbox" data-seat="${i}" disabled />
        <label for="seats-${i}" class="tickets-pop-up_seats_label"> ${i} </label>`
      : `<input id="seats-${i}" class="tickets-pop-up_seats_input" type="checkbox" />
        <label for="seats-${i}" class="tickets-pop-up_seats_label"> ${i} </label>`
    }
  }
}

const submitForm = (event) => {
  event.preventDefault()

  const chosenTime = event.target.elements["time"].value
  const chosenDay = event.target.elements["day"].value
  const availableSeances = data.seances.filter((seance) => (
    seance.day == chosenDay && seance.time == chosenTime
  ))

  const moviesSection = document.querySelector(".tickets_available-movies")

  moviesSection.innerHTML = ""
  if (availableSeances.length) {
    availableSeances.forEach((seance) => {
      const movie = data.movies.find((movieData) => movieData.id == seance.movieId)
      moviesSection.innerHTML += `
        <a
          class="tickets_available-movies_movie"
          data-movie-id="${movie.id}"
          data-seance-id="${seance.id}"
          onclick="openSeatsPopUp(event)"
        >
          <h3 class="tickets_available-movies_movie_name">${movie.name}</h3>
          <img class="tickets_available-movies_movie_img" src="./images/${movie.imgSrc}" />
        </a>
      `
    })
  } else {
    moviesSection.innerHTML = "<h3>No movies available for this time and date</h3>"
  }
}

const buyTickets = (event) => {
  const reservedSeats = Array.from(document.querySelectorAll(".tickets-pop-up_seats_input:checked"))
  const ticketsQuantity = reservedSeats.length
  const errorMessage = document.querySelector(".tickets-pop-up_error")

  /* if no error add to cart, otherwise show error message */
  if (ticketsQuantity && ticketsQuantity < 5) {
    const seanceId = event.currentTarget.getAttribute("data-seance-id")

    errorMessage.classList.add("hidden")
    alert(`${ticketsQuantity} tickets were reserved!`)

    /* Not sure about this now, not tested */
    document.cookie = [
      ...document.cookie,
      {
        seanceId,
        newReservedSeats: reservedSeats.map((reservedSeat) => reservedSeat.id.split('-')[1])
      }
    ];

    closeTicketsPopup()
  } else {
    errorMessage.classList.remove("hidden")
  }
}


