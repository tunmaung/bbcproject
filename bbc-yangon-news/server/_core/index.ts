
import "dotenv/config";
import express from "express";
import { createServer } from "https";
import fs from "node:fs";
import path from "node:path";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

import uploadRouter from "../upload";
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.close(() => resolve(true));
    });

    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();

  const server = createServer(
    {

key: fs.readFileSync(
  path.join(process.cwd(), "cert", "key.pem")
),
cert: fs.readFileSync(
  path.join(process.cwd(), "cert", "cert.pem")
),
    },
    app
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/upload", uploadRouter);
  registerStorageProxy(app);
  registerOAuthRoutes(app);


  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server as any);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 HTTPS Server running`);
    console.log(`Local   : https://localhost:${port}`);
    console.log(`Network : https://192.168.1.19:${port}`);
  });
}

startServer().catch(console.error);
