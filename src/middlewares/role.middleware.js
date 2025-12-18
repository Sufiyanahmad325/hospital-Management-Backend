export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }
    next();
  };
  
  export const isDoctor = (req, res, next) => {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Doctor only access" });
    }
    next();
  };
  
  export const isPatient = (req, res, next) => {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Patient only access" });
    }
    next();
  };
  