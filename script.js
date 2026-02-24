const booksContainer = document.getElementById('books-container');
const bookForm = document.getElementById('book-form');

async function obtenerLibros() {
    const res = await fetch('/api/libros');
    const libros = await res.json();
    
    booksContainer.innerHTML = '';
    libros.forEach(l => {
        booksContainer.innerHTML += `
            <div class="book-card">
                <h3>${l.titulo}</h3>
                <p>By ${l.autor}</p>
                <div class="book-actions">
                    <button class="btn-edit" onclick="prepararEdicion(${l.id}, '${l.titulo}', '${l.autor}')">Editar</button>
                    <button class="btn-delete" onclick="eliminarLibro(${l.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

function prepararEdicion(id, titulo, autor) {
    document.getElementById('book-id').value = id;
    document.getElementById('title').value = titulo;
    document.getElementById('author').value = autor;
    document.getElementById('form-title').innerText = "Modificar Ejemplar";
    document.getElementById('submit-btn').innerText = "Confirmar Cambios";
}

bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const body = {
        titulo: document.getElementById('title').value,
        autor: document.getElementById('author').value
    };

    const config = {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    await fetch(id ? `/api/libros/${id}` : '/api/libros', config);
    
    bookForm.reset();
    document.getElementById('book-id').value = '';
    document.getElementById('form-title').innerText = "Registrar Nuevo Ejemplar";
    document.getElementById('submit-btn').innerText = "Añadir a Galería";
    obtenerLibros();
});

async function eliminarLibro(id) {
    if (confirm('¿Retirar este ejemplar de la colección?')) {
        await fetch(`/api/libros/${id}`, { method: 'DELETE' });
        obtenerLibros();
    }
}

obtenerLibros();