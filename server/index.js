import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config({ path: new URL("./.env", import.meta.url) });
dotenv.config();

const { MONGODB_URI, PORT = "8787", CORS_ORIGIN } = process.env;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required. Add it to server/.env before starting the API.");
}

const allowedOrigins = CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins?.length || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("This origin is not allowed to submit RSVPs."));
    },
  }),
);
app.use(express.json({ limit: "20kb" }));

const rsvpSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    attendance: { type: String, required: true, enum: ["yes", "no"] },
    guests: { type: Number, min: 1, max: 6 },
    note: { type: String, trim: true, maxlength: 2000, default: "" },
  },
  { timestamps: true },
);

const Rsvp = mongoose.model("Rsvp", rsvpSchema);

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/rsvps", async (request, response, next) => {
  try {
    const name = typeof request.body.name === "string" ? request.body.name.trim() : "";
    const phone = typeof request.body.phone === "string" ? request.body.phone.trim() : "";
    const attendance = request.body.attendance;
    const note = typeof request.body.note === "string" ? request.body.note.trim() : "";
    const guests = Number(request.body.guests);

    console.info("[RSVP] Request received", {
      hasName: name.length > 0,
      hasPhone: phone.length > 0,
      attendance,
      guests: attendance === "yes" ? guests : undefined,
      hasNote: note.length > 0,
    });

    if (name.length < 2 || name.length > 120) {
      response.status(400).json({ message: "Please enter your full name." });
      return;
    }

    if (!/^[+\d][\d\s()\-]{6,28}$/.test(phone)) {
      response.status(400).json({ message: "Please enter a valid phone number." });
      return;
    }

    if (attendance !== "yes" && attendance !== "no") {
      response.status(400).json({ message: "Please choose whether you can attend." });
      return;
    }

    if (attendance === "yes" && (!Number.isInteger(guests) || guests < 1 || guests > 6)) {
      response.status(400).json({ message: "Please select a valid guest count." });
      return;
    }

    if (note.length > 2000) {
      response.status(400).json({ message: "Your note is too long." });
      return;
    }

    const rsvp = await Rsvp.create({
      name,
      phone,
      attendance,
      guests: attendance === "yes" ? guests : undefined,
      note,
    });

    console.info("[RSVP] Saved", { id: rsvp.id });

    response.status(201).json({ id: rsvp.id });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error("[RSVP] API error", error);
  response.status(500).json({ message: "We could not save your RSVP. Please try again." });
});

await mongoose.connect(MONGODB_URI);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`RSVP API listening on port ${PORT}`);
});
