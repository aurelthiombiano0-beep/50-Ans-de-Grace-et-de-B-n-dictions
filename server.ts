import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db_store.json");

// Increase limit to allow larger base64 photo uploads seamlessly
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Default fallback database state
interface DBState {
  custom_photo_1: string | null;
  custom_photo_2: string | null;
  ouaga_50_rsvps: any[];
  custom_youtube_tracks: any[];
}

const DEFAULT_STATE: DBState = {
  custom_photo_1: null,
  custom_photo_2: null,
  ouaga_50_rsvps: [],
  custom_youtube_tracks: [
    { id: "y4PtN9L-78g", name: "Manu Dibango - Soul Makossa", genre: "Afro-Jazz Classic" },
    { id: "ukLoF8u8C0E", name: "Hugh Masekela - Grazing In The Grass", genre: "Legendary South-African Brass" },
    { id: "B8pA6-e8pBM", name: "Fela Kuti - Water No Get Enemy", genre: "Afrobeat Jazz Masterpiece" }
  ]
};

// Ensure db_store.json exists and read it safely
function readDB(): DBState {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_STATE, null, 2), "utf-8");
      return DEFAULT_STATE;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    if (!raw.trim()) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      custom_photo_1: parsed.custom_photo_1 ?? null,
      custom_photo_2: parsed.custom_photo_2 ?? null,
      ouaga_50_rsvps: Array.isArray(parsed.ouaga_50_rsvps) ? parsed.ouaga_50_rsvps : [],
      custom_youtube_tracks: Array.isArray(parsed.custom_youtube_tracks) ? parsed.custom_youtube_tracks : DEFAULT_STATE.custom_youtube_tracks
    };
  } catch (error) {
    console.warn("Could not read db_store.json, resetting to default:", error);
    return DEFAULT_STATE;
  }
}

function writeDB(data: DBState) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Could not write to db_store.json:", error);
  }
}

// API endpoint to fetch global invitation state
app.get("/api/data", (req, res) => {
  const data = readDB();
  res.json(data);
});

// API endpoint to update global state in real-time
app.post("/api/data", (req, res) => {
  try {
    const changes = req.body;
    const current = readDB();

    if ("custom_photo_1" in changes) current.custom_photo_1 = changes.custom_photo_1;
    if ("custom_photo_2" in changes) current.custom_photo_2 = changes.custom_photo_2;
    if ("ouaga_50_rsvps" in changes && Array.isArray(changes.ouaga_50_rsvps)) {
      current.ouaga_50_rsvps = changes.ouaga_50_rsvps;
    }
    if ("custom_youtube_tracks" in changes && Array.isArray(changes.custom_youtube_tracks)) {
      current.custom_youtube_tracks = changes.custom_youtube_tracks;
    }

    writeDB(current);
    res.json({ status: "success", message: "Data synchronized successfully" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ status: "error", error: msg });
  }
});

// Setup Vite Dev Server / Static files handler
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

setupServer().catch((error) => {
  console.error("Vite/Express initialization failed:", error);
});
