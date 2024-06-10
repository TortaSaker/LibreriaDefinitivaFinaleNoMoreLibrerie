document.addEventListener("DOMContentLoaded", function () {
    let bottoneRimuovi = document.getElementById("rimuovi");
    let container = document.getElementById("risultati-captati");

    bottoneRimuovi.addEventListener("click", function () {
        let isbn = document.getElementById("Isbn");
        let quantita = document.getElementById("Quantità");

        if (!controlloCampoIsEmpty("Isbn", "inserisci questo campo")) {
            return;
        };

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



    //Aggiungi libro


    //Rimuovi libro
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

    //tutti e tre 
    

    //tutti e tre
    function mostraMessaggioErrore(message) {
        container.innerHTML = "";
        let paragrafoErrore = document.createElement("p");
        paragrafoErrore.style.color = "red";
        paragrafoErrore.textContent = message;
        container.appendChild(paragrafoErrore);
    }
});