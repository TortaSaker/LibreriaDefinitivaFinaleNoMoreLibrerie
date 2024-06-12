    let bottoneCerca = document.getElementById("cerca");
    let container = document.getElementById("risultati-captati"); 
    bottoneCerca.addEventListener("click", function () {
        let input = document.getElementById("cerca-input").value;
        if (!input) {
            searchAllBooks();
        } else {
            searchBooksByQuery(input);
        }
    });
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
            .then(data => generaRisultati(data))
            .catch(error => mostraMessaggioErrore("Errore durante il recupero dei libri: " + error));
    }

    function searchBooksByQuery(input) {
        fetch(`/api/Libro/SearchBooks/${encodeURIComponent(input)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore durante la ricerca dei libri");
                }
                return response.json();
            })
            .then(data => generaRisultati(data))
            .catch(error => mostraMessaggioErrore(error.message));
    }
function generaRisultati(data) {
    libri = data.$values;
    container.innerHTML = "";

    if (!Array.isArray(libri)) {
            mostraMessaggioErrore("La risposta non è un array.");
            return;
        }
        if (libri === null || libri.length === 0) {
            mostraMessaggioErrore("Non sono stati trovati libri con queste caratteristiche.");
        } else {
            libri.forEach(libro => {
                let card = document.createElement("div");
                card.classList.add("card");

                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                let cardImg = document.createElement("img");
                cardImg.classList.add("card-img-top");
                cardImg.setAttribute("src", "../images/copertine/" + libro.titolo + ".jpg");
                cardImg.setAttribute("alt", libro.titolo);
                cardImg.onerror = function () {
                    this.src = "../images/icon.jpg";
                };

                let cardTitolo = document.createElement("h5");
                cardTitolo.classList.add("card-title");
                cardTitolo.textContent = libro.titolo;
                cardBody.appendChild(cardTitolo);

                let cardAutore = document.createElement("h6");
                cardAutore.classList.add("card-subtitle", "mb-2", "text-muted");
                cardAutore.textContent = libro.autore;
                cardBody.appendChild(cardAutore);

                let cardIsbn = document.createElement("p");
                cardIsbn.classList.add("card-text");
                cardIsbn.textContent = "ISBN: " + libro.isbn;
                cardBody.appendChild(cardIsbn);

                let cardGenere = document.createElement("p");
                cardGenere.classList.add("card-text");
                cardGenere.textContent = "Genere: " + libro.genere;
                cardBody.appendChild(cardGenere);

                let cardEdizione = document.createElement("p");
                cardEdizione.classList.add("card-text");
                cardEdizione.textContent = "Edizione: " + libro.edizione;
                cardBody.appendChild(cardEdizione);

                let cardPrezzo = document.createElement("p");
                cardPrezzo.classList.add("card-text");
                cardPrezzo.textContent = "Prezzo: " + libro.prezzo + " €";
                cardBody.appendChild(cardPrezzo);

                let cardQuantita = document.createElement("p");
                cardQuantita.classList.add("card-text");
                cardQuantita.textContent = "Quantità disponibile: " + libro.quantita;
                cardBody.appendChild(cardQuantita);

                card.appendChild(cardImg);
                card.appendChild(cardBody);
                container.appendChild(card);
            });
        }
    }

    function mostraMessaggioErrore(message) {
        container.innerHTML = "";
        let paragrafoErrore = document.createElement("p");
        paragrafoErrore.style.color = "red";
        paragrafoErrore.textContent = message;
        container.appendChild(paragrafoErrore);
    }