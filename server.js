import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("send-to-display", (content, roomId) => {
      io.to(roomId).emit("content-change", content);
    });

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });

    if (process.env.NODE_ENV === 'production') {
      console.log('La aplicación está corriendo en un entorno de producción.');
    } else {
      console.log('La aplicación NO está corriendo en un entorno de producción, está corriendo en ' + process.env.NODE_ENV);
    }
});
