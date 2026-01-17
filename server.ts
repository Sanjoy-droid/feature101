import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new SocketIOServer(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_APP_URL
          : "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Store user socket connections
  const userSockets = new Map<string, Set<string>>();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // User joins their personal notification room
    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);

      // Track socket for this user
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId)!.add(socket.id);

      console.log(`User ${userId} joined notification room`);
    });

    socket.on("disconnect", () => {
      // Clean up user socket tracking
      userSockets.forEach((sockets, userId) => {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(userId);
          }
        }
      });
      console.log("Client disconnected:", socket.id);
    });
  });

  // Make io accessible globally for API routes
  (global as any).io = io;

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
