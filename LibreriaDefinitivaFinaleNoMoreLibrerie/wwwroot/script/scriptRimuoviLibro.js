﻿let bottoneRimuovi = document.getElementById("rimuovi");
let container = document.getElementById("contenitore");
bottoneRimuovi.addEventListener("click", function () {
    let isbn = document.getElementById("Isbn").value;
    let quantita = document.getElementById("Quantita").value;
        if (controlloCampoIsEmpty("Isbn", "inserisci questo campo")) {
            return;
        };
        if (isbn.length != 13 && isbn.length != 10) {
            mostraErroreInput("Isbn", "ISBN deve essere lungo 10 o 13 caratteri");
            return;
        }

        if (quantita <= 0) {
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
    fetch(`/api/Libro/RemoveBooks/${encodeURIComponent(isbn)}/${quantita}`, {
            method: "PATCH"
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 204) {
                    return null;
                } else {
                    return response.json().then(errorData => { throw new Error(errorData.error);});
                }
            })
        .then(data => {
            container.innerHTML = "";
            let paragrafoRimosso = document.createElement("p");
            paragrafoRimosso.style.color = "green";
            paragrafoRimosso.textContent = "Hai correttamente eseguito la rimozione del libro";
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