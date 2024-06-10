document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const movies = document.querySelectorAll('.movie-item');
    movies.forEach(movie => {
        const title = movie.getAttribute('data-title').toLowerCase();
        if (title.includes(query)) {
            movie.style.display = 'block';
            // movie.style.marginLeft = '110%';
        } else {
            movie.style.display = 'none';
        }
    });
});
