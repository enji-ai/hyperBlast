const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Biar bisa diakses dari mana aja
        methods: ["GET", "POST"]
    }
});

let players = {}; // Data pemain online

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Tambahin player baru
    players[socket.id] = { x: 0, y: 0, score: 0 };
    io.emit("updatePlayers", players);

    // Update posisi player
    socket.on("updatePosition", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit("updatePlayers", players);
        }
    });

    // Player disconnect
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
