    let bottoneCerca = document.getElementById("cerca");
    let container = document.getElementById("risultati-captati"); 
    //cerca libro
    bottoneCerca.addEventListener("click", function () {
        let input = document.getElementById("cerca-input").value;
        if (!input) {
            searchAllBooks();
        } else {
            searchBooksByQuery(input);
        }
    });
    //Messo in tutti e tre 
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

    //MEsso in tutti 
    function rimuoviErroreInput(id) {
        let field = document.getElementById(id);
        field.classList.remove("input-error");
        field.placeholder = "";
    }
    //Cerca libro 
    function searchAllBooks() {
        fetch("/api/Libro/GetAllBooks")
            .then(response => response.json())
            .then(data => generaRisultati(data))
            .catch(error => mostraMessaggioErrore("Errore durante il recupero dei libri: " + error));
    }

    //Cerca libro 
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
    //tutti e tre 
    function generaRisultati(data) {
        container.innerHTML = "";

        if (data=== null || data.length === 0) {
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

    //tutti e tre
    function mostraMessaggioErrore(message) {
        container.innerHTML = "";
        let paragrafoErrore = document.createElement("p");
        paragrafoErrore.style.color = "red";
        paragrafoErrore.textContent = message;
        container.appendChild(paragrafoErrore);
    }