﻿document.addEventListener("DOMContentLoaded", function () {
    let bottoneCerca = document.getElementById("cerca");
    let bottoneCarica = document.getElementById("carica");
    let bottoneRimuovi = document.getElementById("rimuovi");
    let container = document.getElementById("risultati-captati");

    bottoneCerca.addEventListener("click", function () {
        let input = document.getElementById("cerca-input").value;
        if (!input) {
            searchAllBooks();
        } else {
            searchBooksByQuery(input);
        }
    });

    bottoneCarica.addEventListener("click", function () {
        let isbn = document.getElementById("Isbn").value;
        let titolo = document.getElementById("Titolo").value;
        let autore = document.getElementById("Autore").value;
        let genere = document.getElementById("Genere").value;
        let prezzo = document.getElementById("Prezzo").value;
        let quantita = document.getElementById("Quantita").value;
        let edizione = document.getElementById("Edizione").value;

        if (
            controlloCampoIsEmpty("Isbn", "Inserisci questo campo") ||
            controlloCampoIsEmpty("Titolo", "Inserisci questo campo") ||
            controlloCampoIsEmpty("Autore", "Inserisci questo campo") ||
            controlloCampoIsEmpty("Genere", "Inserisci questo campo") ||
            controlloCampoIsEmpty("Prezzo", "Inserisci questo campo") ||
            controlloCampoIsEmpty("Quantita", "Inserisci questo campo") ||
            controlloCampoIsEmpty("Edizione", "Inserisci questo campo")
        ) {
            return;
        }

        if (isbn.length != 13 && isbn.length != 10) {
            mostraErroreInput("Isbn", "ISBN deve essere lungo 10 o 13 caratteri");
            return;
        }

        if (prezzo < 0) {
            mostraErroreInput("Prezzo", "Il prezzo deve essere positivo");
            return;
        }

        if (quantita <= 0) {
            mostraErroreInput("Quantita", "La quantità deve essere positiva");
            return;
        }

        addBook(isbn, titolo, autore, genere, prezzo, quantita, edizione);
    });

bottoneRimuovi.addEventListener("click", function () {
    let isbn = document.getElementById("Isbn");
    let titolo = document.getElementById("Titolo").value;
    let autore = document.getElementById("Autore").value;
    let genere = document.getElementById("Genere").value;
    let prezzo = document.getElementById("Prezzo");
    let quantita = document.getElementById("Quantità");
    let edizione = document.getElementById("Edizione").value;

    if (!controlloCampoIsEmpty("Isbn", "inserisci questo campo")) {
        return;
    };*/

        if (isbn.length != 13 && isbn.length != 10) {
            mostraErroreInput("Isbn", "ISBN deve essere lungo 10 o 13 caratteri");
            return;
        }

        if (quantita < 0) {
            mostraErroreInput("Quantita", "La quantità deve essere positiva");
            return;
        }

        removeBook(isbn, quantita);
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
        fetch("/api/Libro/GetAllBooks")
            .then(response => response.json())
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

    function addBook(isbn, titolo, autore, genere, prezzo, quantita, edizione) {
        fetch("/api/Libro/AddBook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isbn: isbn,
                titolo: titolo,
                autore: autore,
                genere: genere,
                prezzo: prezzo,
                quantita: quantita,
                edizione: edizione
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore durante l'aggiunta del libro");
                }
                return response.json();
            })
            .then(data => alert("Libro aggiunto con successo!"))
            .catch(error => mostraMessaggioErrore(error.message));
    }

    function removeBook(isbn, quantita) {
        fetch(`/api/Libro/RemoveBooks?isbn=${isbn}&quantita=${quantita}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore durante la rimozione del libro");
                }
                return response.json();
            })
            .then(data => alert("Libro rimosso con successo!"))
            .catch(error => mostraMessaggioErrore(error.message));
    }

    function generaRisultati(data) {
        container.innerHTML = "";

        if (!data || data.length === 0) {
            mostraMessaggioErrore("Non sono stati trovati libri con queste caratteristiche.");
        } else {
            data.forEach(libro => {
                let card = document.createElement("div");
                card.classList.add("card");

                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

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
});

