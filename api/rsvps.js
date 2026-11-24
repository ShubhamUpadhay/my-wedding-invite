import mongoose from "mongoose";

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

const Rsvp = mongoose.models.Rsvp || mongoose.model("Rsvp", rsvpSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
    const phone = typeof request.body?.phone === "string" ? request.body.phone.trim() : "";
    const attendance = request.body?.attendance;
    const note = typeof request.body?.note === "string" ? request.body.note.trim() : "";
    const guests = Number(request.body?.guests);

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

    await connectToDatabase();
    const rsvp = await Rsvp.create({
      name,
      phone,
      attendance,
      guests: attendance === "yes" ? guests : undefined,
      note,
    });

    response.status(201).json({ id: rsvp.id });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "We could not save your RSVP. Please try again." });
  }
}
