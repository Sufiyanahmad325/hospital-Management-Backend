import { Department } from "../models/departmentSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";
import { User } from "../models/userSchema.js";



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
    const { name, email, phone, departmentId, specialization , description ,experience } = req.body;

    if (!name || !email || !phone || !departmentId || !specialization || specialization.trim() === "" || description.trim() === "" || !experience) {
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
      userId: user._id,
      phone,
      description,
      experience: experience,
      specialization: specialization,
      department: departmentId, 
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







