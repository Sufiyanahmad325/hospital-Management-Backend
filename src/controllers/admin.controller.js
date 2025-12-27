import { Appointment } from "../models/appointmentSchema.js";
import { Department } from "../models/departmentSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";
import { User } from "../models/userSchema.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const createDepartment = async (req, res) => {
  try {
    const { nameOfDepartment, description } = req.body;

    if (!nameOfDepartment || nameOfDepartment.trim() === "") {
      return res.status(400).json({ message: "Department name is required" });
    }

    const existingDept = await Department.findOne({ nameOfDepartment });
    if (existingDept) {
      return res.status(409).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      nameOfDepartment,
      description,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addDoctor = async (req, res) => {
  try {
    const { name, email, phone, departmentId, specialization, description, experience, availableDays, availableSlots } = req.body;

    if (
      !name || !email || !phone || !departmentId || !specialization || specialization.trim() === "" || !description || description.trim() === "" || !experience || !Array.isArray(availableDays) || availableDays.length === 0 || !Array.isArray(availableSlots) || availableSlots.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    // check department
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // check user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Doctor already exists" });
    }

    // 🔐 generate temp password
    const tempPassword = "Doc@" + Math.floor(1000 + Math.random() * 9000);

    // 1️⃣ create login account
    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role: "doctor",
    });

    // 2️⃣ create doctor profile
    const doctor = await Doctor.create({
      user_id: user._id,
      phone,
      description,
      experience: experience,
      specialization: specialization,
      department: departmentId,
      availableDays,
      availableSlots
    });

    return res.status(201).json({
      message: "Doctor added successfully",
      loginCredentials: {
        email,
        password: tempPassword, // admin doctor ko dega
      },
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("department", "nameOfDepartment") // doctor me user_id hai doctor ki to kya ham usme se user ka name and email lana chahte hai to ham populate kr skte hai
      .populate("doctorId", "name email"); // ye user se name and email le aayega

    res.status(200).json({
      total: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json({
      total: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllDoctorAppointments = asyncHandler(async (req, res) => {
  const { _id } = req.user; // it is coming from verifyJWT middleware
  // 1️⃣ Find doctor profile
  const admin = await User.findOne({ _id: _id });
  if (!admin) {
    return res.status(404).json({ message: "Admin profile not found" });
  }
  // 2️⃣ Get appointments for this doctor
  const appointments = await Appointment.find()
    .populate({
      path: "patientId",
      populate: { path: "user_id", select: "name email" },
    })
    .sort({ createdAt: 1 }); // it will sort by ascending order of creation time means older appointment will come first

  if (!appointments || appointments.length === 0) {
    return res.status(404).json({ message: "No appointments found" });
  }

  return res.status(200).json({
    message: "Doctor appointments fetched successfully",
    appointments,
  });
});


export const getAllCompleteAppointment = asyncHandler(async (req, res) => {

  const isAvailableAdmin = await User.find({
    _id: req.user._id,
    role: 'admin'
  })

  if (!isAvailableAdmin) {
    return res.status(403).json({ message: 'Access denied , you are not admin' })
  }

  const completeAppointment = await Appointment.find({ status: 'completed' })

  if (!completeAppointment || completeAppointment.length === 0) {
    return res.status(404).json({ message: 'No completed appointment found' })
  }

  return res.status(200).json(
    new ApiResponse(200, 'Completed appointments fetched successfully', completeAppointment)
  )

})










