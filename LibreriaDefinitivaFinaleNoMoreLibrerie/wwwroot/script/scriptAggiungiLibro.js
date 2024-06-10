//Aggiugni un libro alla lista
document.addEventListener("DOMContentLoaded", function () {
    let bottoneCarica = document.getElementById("carica");
    let container = document.getElementById("risultati-captati"); 
    bottoneCarica.addEventListener("click", function () {
        let isbn = document.getElementById("Isbn").value;
        let titolo = document.getElementById("Titolo").value;
        let autore = document.getElementById("Autore").value;
        let genere = document.getElementById("Genere").value;
        let prezzo = parseFloat(document.getElementById("Prezzo").value);
        let quantita = parseInt(document.getElementById("Quantità").value);
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

    //tutti e tre
    function mostraMessaggioErrore(message) {
        container.innerHTML = "";
        let paragrafoErrore = document.createElement("p");
        paragrafoErrore.style.color = "red";
        paragrafoErrore.textContent = message;
        container.appendChild(paragrafoErrore);
    }
)};