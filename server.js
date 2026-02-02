const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir conexiones desde cualquier origen
        methods: ["GET", "POST"]
    }
});

const messages = []; // Almacena mensajes en memoria (puedes usar una BD)

// Servir una ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor Socket.IO en funcionamiento 🚀");
});

// Manejar conexión de clientes
io.on("connection", (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Enviar mensajes antiguos al usuario que se conecta
    socket.emit("loadMessages", messages);

    // Manejar envío de mensajes
    socket.on("sendMessage", (data) => {
        console.log("Mensaje recibido:", data);

        // Agregar hora al mensaje
        const mensajeConHora = {
            remitente: data.remitente,
            texto: data.texto,
            hora: new Date().toLocaleTimeString()
        };

        messages.push(mensajeConHora); // Guardar mensaje
        io.emit("newMessage", mensajeConHora); // Enviar a todos los clientes
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Servidor Socket.IO corriendo en http://0.0.0.0:3000");
});
