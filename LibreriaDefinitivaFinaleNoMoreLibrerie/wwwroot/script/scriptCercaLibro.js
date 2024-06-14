let bottoneCerca = document.getElementById("cerca");
let container = document.getElementById("risultati-captati");
let currentPage = 1;
const booksPerPage = 20;

bottoneCerca.addEventListener("click", function () {
    currentPage = 1; // Resetta la pagina corrente alla ricerca
    ricercaLibri();
});

function ricercaLibri() {
    let input = document.getElementById("cerca-input").value.trim();
    if (!input) {
        searchAllBooks();
    } else {
        searchBooksByQuery(input);
    }
}

function controlloCampoIsEmpty(id, errorMessage) {
    let field = document.getElementById(id);
    if (field.value.trim() === "") {
        mostraErroreInput(id, errorMessage);
        return true;
    } else {
        rimuoviErroreInput(id);
        return false;
    }
}

function mostraErroreInput(id, message) {
    let field = document.getElementById(id);
    field.classList.add("input-error");
    field.placeholder = message;
    field.value = "";
}

function rimuoviErroreInput(id) {
    let field = document.getElementById(id);
    field.classList.remove("input-error");
    field.placeholder = "";
}

function searchAllBooks() {
    fetch("https://localhost:7268/api/Libro/GetAllBooks/GetAllLibri")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante il recupero dei libri");
            }
            return response.json();
        })
        .then(data => {
            generaRisultati(data);
        })
        .catch(error => mostraMessaggioErrore("Errore durante il recupero dei libri: " + error));
}

function searchBooksByQuery(input) {
    fetch(`/api/Libro/SearchBooks/${encodeURIComponent(input)}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error);
                });
            }
            return response.json();
        })
        .then(data => {
            generaRisultati(data);
        })
        .catch(error => mostraMessaggioErrore(error.message));
}

function generaRisultati(data) {
    const libri = data.$values;
    container.innerHTML = "";

    if (!Array.isArray(libri)) {
        mostraMessaggioErrore("La risposta non è un array.");
        return;
    }
    if (libri === null || libri.length === 0) {
        mostraMessaggioErrore("Non sono stati trovati libri con queste caratteristiche.");
    } else {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const currentBooks = libri.slice(startIndex, endIndex);

        currentBooks.forEach(libro => {
            let card = document.createElement("div");
            card.classList.add("card");

            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            let link = document.createElement('a');
            link.href = "libroAperto.html?isbn=" + libro.isbn;
            let cardImg = document.createElement("img");
            cardImg.classList.add("card-img-top");
            cardImg.setAttribute("src", "../images/copertine/" + libro.titolo + ".jpg");
            cardImg.setAttribute("alt", libro.titolo);
            cardImg.onerror = function () {
                this.src = "../images/icon.png";
            };
            link.appendChild(cardImg);

            let cardTitolo = document.createElement("h5");
            cardTitolo.classList.add("card-title");
            cardTitolo.textContent = libro.titolo;
            cardBody.appendChild(cardTitolo);

            let cardAutore = document.createElement("h6");
            cardAutore.classList.add("card-subtitle", "mb-2", "text-muted");
            cardAutore.textContent = libro.autore;
            cardBody.appendChild(cardAutore);

            let cardPrezzo = document.createElement("p");
            cardPrezzo.classList.add("card-text");
            cardPrezzo.textContent = "Prezzo: " + libro.prezzo + " €";
            cardBody.appendChild(cardPrezzo);

            card.appendChild(link);
            card.appendChild(cardBody);
            container.appendChild(card);

            link.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.setItem('isbn', JSON.stringify(libro.isbn));
                localStorage.setItem('titolo', JSON.stringify(libro.titolo));
                localStorage.setItem('prezzo', JSON.stringify(libro.prezzo));
                localStorage.setItem('genere', JSON.stringify(libro.genere));
                localStorage.setItem('trama', JSON.stringify(libro.trama));
                localStorage.setItem('edizione', JSON.stringify(libro.edizione));
                localStorage.setItem('quantita', JSON.stringify(libro.quantita));
                localStorage.setItem('autore', JSON.stringify(libro.autore));
                window.location.href = link.href;
            });
        });

        // Aggiunta delle frecce per la navigazione tra le pagine
        const navigationDiv = document.createElement("div");
        navigationDiv.classList.add("pagination");

        if (currentPage > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "← Precedente";
            prevButton.addEventListener("click", () => {
                currentPage--;
                generaRisultati(data);
            });
            navigationDiv.appendChild(prevButton);
        }

        if (libri.length > endIndex) {
            const nextButton = document.createElement("button");
            nextButton.textContent = "Successiva →";
            nextButton.addEventListener("click", () => {
                currentPage++;
                generaRisultati(data);
            });
            navigationDiv.appendChild(nextButton);
        }

        container.appendChild(navigationDiv);
    }
}

function mostraMessaggioErrore(message) {
    container.innerHTML = "";
    let paragrafoErrore = document.createElement("p");
    paragrafoErrore.style.color = "red";
    paragrafoErrore.textContent = message;
    container.appendChild(paragrafoErrore);
}
