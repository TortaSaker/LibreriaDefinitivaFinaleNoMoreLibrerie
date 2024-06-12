//Aggiugni un libro alla lista
    let bottoneCarica = document.getElementById("carica");
    let container = document.getElementById("contenitore");
    bottoneCarica.addEventListener("click", function () {
        let isbn = document.getElementById("Isbn").value;
        let titolo = document.getElementById("Titolo").value;
        let autore = document.getElementById("Autore").value;
        let genere = document.getElementById("Genere").value;
        let prezzo = parseFloat(document.getElementById("Prezzo").value);
        let quantita = parseInt(document.getElementById("Quantita").value);
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
        alert("finiti i controlli di nullita");
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
        alert("finiti anche gli altri");
        addBook(isbn, titolo, autore, genere, prezzo, quantita, edizione);
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

    function addBook(isbn, titolo, autore, genere, prezzo, quantita, edizione) {
        alert("pre fetch");
        fetch(`/api/Libro/AddBook/${isbn}/${titolo}/${autore}/${genere}/${prezzo}/${quantita}/${edizione}`, {
            method: "POST"
        })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                } else {
                    return response.json().then(errorData => { throw new Error(errorData.error); });
                }
            })
            .then(data => {
                container.innerHTML = "";
                let paragrafoRimosso = document.createElement("p");
                paragrafoRimosso.style.color = "green";
                paragrafoRimosso.textContent = "Hai correttamente eseguito l'aggiunta del libro";
                container.appendChild(paragrafoRimosso);
            })
            .catch(error => mostraMessaggioErrore(error.message));
    }

function mostraMessaggioErrore(message) {
    container.innerHTML = "";
    let paragrafoErrore = document.createElement("p");
    paragrafoErrore.style.color = "red";
    paragrafoErrore.textContent = message;
    container.appendChild(paragrafoErrore);
}
