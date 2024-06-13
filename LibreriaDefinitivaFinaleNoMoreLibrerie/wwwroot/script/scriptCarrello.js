/*document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tableBody = document.querySelector('#carrello tbody');
    const totalElement = document.querySelector('#totale-carrello h3');

    let total = 0;

    cart.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="/images/copertine/${book.titolo}.jpg" alt="${book.titolo}" width="50"></td>
            <td>${book.titolo}</td>
            <td>€${book.prezzo}</td>
            <td>€${book.prezzo}</td>
        `;
        tableBody.appendChild(row);
        total += book.prezzo;
    });

    totalElement.textContent = `Totale: €${total.toFixed(2)}`;

    document.querySelector('#totale-carrello button').addEventListener('click', function () {
        proceedToCheckout(cart);
    });
});

function proceedToCheckout(cart) {
    const requests = cart.map(book => {
        return fetch(`/api/Libro/SearchBooks/${book.isbn}/1`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });

    Promise.all(requests)
        .then(responses => {
            for (let response of responses) {
                if (!response.ok) {
                    throw new Error('Errore durante l\'acquisto');
                }
            }
            localStorage.removeItem('cart');
            alert('Acquisto completato con successo!');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error during checkout:', error);
            alert('Si è verificato un errore durante l\'acquisto.');
        });
}
*/