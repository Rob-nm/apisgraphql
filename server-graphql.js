const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const app = express();
const PORT = 3000;

const typeDefs = gql`
    type Libro {
        id: ID!
        titulo: String
        autor: String
    }

    type Query {
        libros: [Libro]
        libro(id: ID!): Libro
    }

    type Mutation {
        agregarLibro(titulo: String!, autor: String!): Libro
        actualizarLibro(id: ID!, titulo: String, autor: String): Libro
        eliminarLibro(id: ID!): Libro
    }
`;

let libros = [
    { id: 1, titulo: "El Quijote", autor: "Miguel de Cervantes" },
    { id: 2, titulo: "Cien años de soledad", autor: "Gabriel García Márquez" },
    { id: 3, titulo: "Dune", autor: "Frank Herbert" }

];


const resolvers = {
    // Cambio: "query" por "Query" para que coincida con typeDefs
    Query: { 
        libros: () => libros,
        libro: (parent, args) => libros.find(libro => libro.id === parseInt(args.id))
    },
    Mutation: {
        agregarLibro: (parent, args) => {
            const nuevoLibro = {
                id: Date.now(),
                titulo: args.titulo,
                autor: args.autor
            };
            libros.push(nuevoLibro);
            return nuevoLibro;
        },
        actualizarLibro: (parent, args) => {
            const libro = libros.find(l => l.id === parseInt(args.id));
            if (libro) {
                libro.titulo = args.titulo || libro.titulo;
                libro.autor = args.autor || libro.autor;
                return libro;
            }
            return null;
        },
        eliminarLibro: (parent, args) => {
            const indice = libros.findIndex(l => l.id === parseInt(args.id));
            if (indice !== -1) {
                const eliminado = libros.splice(indice, 1);
                return eliminado[0];
            }
            return null;
        }
    }

    
};

async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Servidor GraphQL corriendo en http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();
