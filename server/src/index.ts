import { Server as IoServer, Server } from "socket.io";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import http from "http";
const app: Express = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const port = 8001;

app.get("/", (req: Request, res: Response) => {
  res.send("Express is working");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const clients = new Map();

io.on("connection", (socket) => {
  console.log("socket: ", socket.id);
  const clientId = `user_${new Date()}`;

  clients.set(clientId, { socket, x: 0, y: 0 });
//   io.on("broadcast", (event: string, ...args: any[]) => {
//     io.emit(event, ...args);
//   });
    socket.on("pointerMove", (data) => {
        socket.broadcast.emit("pointerMove",  { id: clientId, position: data });
    })

//   io.emit("cursor-update", (clientId: string, x:any, y:any) => {
//     const data = { clientId, x, y };
//     io.emit("cursor-update", data);
//   });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});
