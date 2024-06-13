/*document.addEventListener('DOMContentLoaded', function () {
    const query = JSON.parse(localStorage.getItem('selectedBook'));
    let div1 = document.getElementById('book-cover');
    let div2 = document.getElementById('book-info');
    let img1 = document.createElement('img');
    let p1 = document.createElement('p');

    if (query != null && query !== "") {
        fetch(`/api/Libro/SearchBooks/${query}`)
            .then(response => response.json())
            .then(da => {
                console.log(da);
                div1.innerHTML = `
                <img src="/images/copertine/${da.titolo}.jpg" alt=""/>
                `;
                div2.innerHTML = `
                <h1>${da.titolo}</h1>
                <p>Autore: ${da.autore}</p>
                <p>Prezzo: €${da.prezzo}</p>
                `;
                document.getElementById('aggiungi-al-carrello').addEventListener('click', function () {
                    addToCart(da);
                });
            })
            .catch(error => console.error('Error fetching book details:', error));
    } else {
        document.getElementById('book-detail').innerText = 'Nessun ISBN fornito';
    }
});

function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(book);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'carrello.html';
}
*/