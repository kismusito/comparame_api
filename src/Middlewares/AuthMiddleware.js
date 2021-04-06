import jwt from "jsonwebtoken";
import User from "../Models/User";

export const AuthMiddleware = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (token) {
        try {
            const verify = jwt.verify(token, process.env.PRIVATE_KEY);
            if (verify) {
                const verifyUser = await User.findById(verify.id, {
                    _id: true,
                    username: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    created_at: true,
                    updated_at: true,
                    age: true,
                    photo: true,
                    location: true,
                }).populate("rol");
                if (verifyUser) {
                    req.user = verifyUser;
                    req.userRol = verifyUser.rol.rolName;
                    next();
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "User not found.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Invalid token.",
                });
            }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    status: false,
                    message: "El token ha expirado",
                });
            }

            return res.status(400).json({
                status: false,
                message:
                    "Ha ocurrido un error, por favor intentalo nuevamente.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "Token is required.",
        });
    }
};
