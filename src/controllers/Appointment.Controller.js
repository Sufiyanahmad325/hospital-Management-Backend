import { Appointment } from "../models/appointmentSchema.js"
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";
import ApiResponse from "../utils/ApiResponse.js";
import { isDateWithin20Days } from "../utils/dateAvailableHelper.js";
import { getDayFromDate } from "../utils/getDayFromDate.js";
import { getNextFreeSlot } from "../utils/getFirstAvailableTimeSlot.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const userid = req.user._id;


    //  Patient profile find (User ID se)
    const patient = await Patient.findOne({ user_id: userid });
    if (!patient) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Patient profile not found"));
    }

    //  Doctor find (Doctor ID se)
    const doctor = await Doctor.findOne({ _id: doctorId });
    if (!doctor) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Doctor not found"));
    }




    // Day availability check (Doctor availableDays me wo day hai ki nahi)
    const isAvailableDate = await isDateWithin20Days(date);
    if (!isAvailableDate) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Selected date is not available for booking")
        );
    }

    // check in doctor available-days the day is available or not
    const appointmentDayName = await getDayFromDate(date);

    if (!doctor.availableDays.includes(appointmentDayName)) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, `Doctor is not available on ${appointmentDayName}s`)
        );
    }

    //  Time slot availability check (Doctor ke availableSlots me se ek free slot do)
    const isAvailableTime = await getNextFreeSlot(doctor._id, date);

    if (!isAvailableTime) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "No available time slots for the selected date")
        );
    }

    // hare in finding total appointments for that date for that doctor
    // if more than equal to 40 then no more appointments can be booked
    const appointmentCount = await Appointment.countDocuments({
      doctorId,
      date,
      status: "pending",
    }); // it will check how many appointments are there for that doctor on that date

    if (appointmentCount >= 40) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Doctor has reached maximum appointments for this day")
        );
    }

    // booking check
    const existingAppointment = await Appointment.findOne({
      patientId: patient._id,
      doctorId,
      date,
      dayName: appointmentDayName,
      status: "pending",
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "You already have an appointment with this doctor on the selected date")
        );
    }



    //  Create appointment
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      timeSlot: isAvailableTime,
      dayName: appointmentDayName,
      date,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, appointment, "Appointment booked successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, error.message));
  }
};











// get my appointments
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(userId)

    // Patient profile find (User ID se)
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Patient not found"));
    }

    //  Appointments find (Patient PROFILE ID se)
    const appointments = await Appointment.find({
      patientId: patient._id,   
      status: "pending",

    })
      .populate("doctorId", "experience specialization ")  // doctor details ke liye
      .sort({ date: -1 }); // latest pehle

      if (appointments.length === 0) {
        return res
          .status(200)
          .json(new ApiResponse(200, [], "No upcoming appointments found"));
      }

    return res
      .status(200)
      .json(
        new ApiResponse(200, appointments, "Appointments fetched successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, error.message));
  }
};




// get cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    console.log('appointment ===========>' , appointmentId)
    const userId = req.user._id;

    const patient = await Patient.findOne({ user_id: userId });
    if (!patient) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Patient not found"));
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: patient._id,
    });

    if (!appointment) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Appointment not found"));
    }

    if (appointment.status !== "pending") {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Only pending appointments can be cancelled"
          )
        );
    }

    appointment.status = "cancelled";
    await appointment.save({validateBeforeSave: false});

    return res
      .status(200)
      .json(
        new ApiResponse(200, appointment, "Appointment cancelled successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, error.message));
  }
};