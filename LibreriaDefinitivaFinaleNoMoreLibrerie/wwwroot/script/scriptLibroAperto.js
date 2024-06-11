document.addEventListener('DOMContentLoaded', function () {
    let t = document.getElementById('immg');
    fetch('/api/LibroAPI')
        .then(response => response.json())
        .then(data => {
            data.forEach(b => {
                let l = document.createElement('a');
                l.href = pages / novita.html ? isbn = ${ b.isbn };  // Pass ISBN via query string
                let m = document.createElement('img');
                m.src = ${ b.url };
                m.id = "g";
                m.alt = ${ b.url };
                l.appendChild(m);
                t.appendChild(l);

                l.addEventListener('click', function (e) {
                    e.preventDefault();
                    localStorage.setItem('selectedBook', JSON.stringify(b.isbn));
                    window.location.href = l.href;
                });
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});