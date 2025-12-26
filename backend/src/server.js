import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (_, res) => {
  res.json({ status: "OK" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("*", (_, res) => {
    res.sendFile(
      path.join(__dirname, "../admin/dist/index.html")
    );
  });
}

const start = async () => {
  await connectDB();

  const PORT = ENV.PORT || 10000;
  app.listen(PORT, () => {
    console.log("Server running on", PORT);
  });
};

start();
