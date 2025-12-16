import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "doctor", "patient"], default: "patient" },
    },
    { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};


userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


export const User = mongoose.model("User", userSchema);