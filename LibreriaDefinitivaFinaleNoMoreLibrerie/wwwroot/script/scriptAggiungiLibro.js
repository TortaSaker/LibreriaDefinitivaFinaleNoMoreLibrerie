// File: script/aggiungiLibro.js

let bottoneCarica = document.getElementById("carica");
let immagineInput = document.getElementById("Immagine");
let contenitore = document.getElementById("contenitore");
let immagineAnteprima = document.getElementById("immagineAnteprima");

bottoneCarica.addEventListener("click", function () {
    let isbn = document.getElementById("Isbn").value;
    let titolo = document.getElementById("Titolo").value;
    let autore = document.getElementById("Autore").value;
    let genere = document.getElementById("Genere").value;
    let prezzo = parseFloat(document.getElementById("Prezzo").value);
    let quantita = parseInt(document.getElementById("Quantita").value);
    let edizione = document.getElementById("Edizione").value;
    let immagine = immagineInput.files[0];

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

    if (prezzo < 0 || prezzo >= 100) {
        mostraErroreInput("Prezzo", "Il prezzo deve essere compreso tra 0 e 100 Euro");
        return;
    }

    if (quantita <= 0) {
        mostraErroreInput("Quantita", "La quantità deve essere positiva");
        return;
    }

    if (!immagine) {
        mostraErroreInput("Immagine", "Seleziona un'immagine");
        return;
    }

    let estensione = immagine.name.split('.').pop().toLowerCase();

    if (estensione !== 'jpg') {
        mostraErroreInput("Immagine", "Solo file con estensione .jpg sono accettati.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        immagineAnteprima.src = e.target.result;

        // Converti l'immagine in base64 per salvare nel localStorage
        let libro = {
            isbn: isbn,
            titolo: titolo,
            autore: autore,
            genere: genere,
            prezzo: prezzo,
            quantita: quantita,
            edizione: edizione,
            immagine: e.target.result
        };

        salvaLibroNelLocalStorage(libro);
    }
    reader.readAsDataURL(immagine);
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

function salvaLibroNelLocalStorage(libro) {
    let libriSalvati = JSON.parse(localStorage.getItem('libri')) || [];
    libriSalvati.push(libro);
    localStorage.setItem('libri', JSON.stringify(libriSalvati));
    // Salva anche l'URL dell'immagine
    localStorage.setItem(`immagine_${libro.isbn}`, libro.immagine);
}


function addBook(isbn, titolo, autore, genere, prezzo, quantita, edizione) {
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
            mostraMessaggioSuccesso("Hai correttamente eseguito l'aggiunta del libro");
        })
        .catch(error => mostraMessaggioErrore(error.message));
}

function mostraMessaggioErrore(message) {
    contenitore.innerHTML = "";
    let paragrafoErrore = document.createElement("p");
    paragrafoErrore.style.color = "red";
    paragrafoErrore.textContent = message;
    contenitore.appendChild(paragrafoErrore);
}


function mostraMessaggioSuccesso(message) {
    contenitore.innerHTML = "";
    let paragrafoSuccesso = document.createElement("p");
    paragrafoSuccesso.style.color = "green";
    paragrafoSuccesso.textContent = message;
    contenitore.appendChild(paragrafoSuccesso);
}
