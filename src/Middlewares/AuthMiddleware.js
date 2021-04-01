import jwt from "jsonwebtoken";
import User from "../Models/User";

export const AuthMiddleware = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (token) {
        try {
            const verify = jwt.verify(token, process.env.PRIVATE_KEY);
            if (verify) {
                const verifyUser = await User.findById(verify.id).populate("rol");
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
            // console.log(error)
            return res.status(400).json({
                status: false,
                message: "There was an error, please try again.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "Token is required.",
        });
    }
};
