import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },

    experience: { type: Number, required: true },

    // availableDays: [{ type: String, required: true }], // ["Mon", "Tue", "Fri"]

    // availableSlots: [{ type: String, required: true }] // ["10:00 AM", "11:00 AM"]
    availableDays: ["Mon", "Tue", "Fri"],
    availableSlots: ["10:00 AM", "11:00 AM"]

  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema)