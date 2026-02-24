// Importamos express
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para que el servidor entienda archivos JSON y formularios
app.use(express.json());
app.use(express.static('.')); // Esto sirve para que index.html, style.css y script.js sean visibles

// Ruta principal para ver nuestra página
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Nuestra "base de datos" temporal
let libros = [
    { id: 1, titulo: "El Quijote", autor: "Miguel de Cervantes" },
    { id: 2, titulo: "Cien años de soledad", autor: "Gabriel García Márquez" }
];

// RUTA: Obtener todos los libros (READ)
app.get('/api/libros', (req, res) => {
    res.json(libros);
});

// RUTA: Agregar un libro (CREATE)
app.post('/api/libros', (req, res) => {
    const nuevoLibro = {
        id: Date.now(), // Generamos un ID único basado en el tiempo
        titulo: req.body.titulo,
        autor: req.body.autor
    };
    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
});
// RUTA: Eliminar un libro (DELETE)
app.delete('/api/libros/:id', (req, res) => {
    const { id } = req.params;
    // Filtramos el arreglo para quitar el libro con ese ID
    libros = libros.filter(libro => libro.id !== parseInt(id));
    res.json({ mensaje: "Libro eliminado con éxito" });
});

// RUTA: Editar un libro (UPDATE)
app.put('/api/libros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor } = req.body;
    
    // Buscamos la posición del libro en el arreglo
    const indice = libros.findIndex(l => l.id === parseInt(id));
    
    if (indice !== -1) {
        libros[indice] = { id: parseInt(id), titulo, autor };
        res.json(libros[indice]);
    } else {
        res.status(404).json({ mensaje: "No se encontró el libro" });
    }
});
// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});