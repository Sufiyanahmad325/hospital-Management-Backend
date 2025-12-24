import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    date: { type: String, required: true }, // "2025-12-12"

    timeSlot: { type: String, required: true }, // "10:00 AM"

    dayName: { type: String, required: true }, // "Mon", "Tue"

    status: { 
      type: String,
      enum: ["pending", "cancelled", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Appointment = mongoose.model('Appointment' , appointmentSchema)