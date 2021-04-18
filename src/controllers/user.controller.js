import { EvalueFields } from "../helpers";
import jwt from "jsonwebtoken";
import User from "../Models/User";
import Rol from "../Models/Rol";

const userMethods = {};

/**
 * Author: Juan Araque
 * Last modified: 31/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
userMethods.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateFields = EvalueFields([
            {
                name: "Email",
                value: email,
            },
            {
                name: "password",
                value: password,
            },
        ]);
        if (validateFields.status) {
            const findUserEmail = await User.findOne({ email });
            if (findUserEmail) {
                const verifyPassword = await findUserEmail.confirmPassword(
                    password
                );
                if (verifyPassword) {
                    const token = await jwt.sign(
                        {
                            id: findUserEmail._id,
                        },
                        process.env.PRIVATE_KEY,
                        {
                            expiresIn: "1h",
                        }
                    );
                    if (token) {
                        const user = await User.findById(findUserEmail._id, {
                            first_name: true,
                            last_name: true,
                            email: true,
                            username: true,
                            rol: true,
                            profileImage: true,
                        });
                        return res.status(200).json({
                            status: true,
                            user,
                            token,
                            message: "Credenciales correctas.",
                        });
                    } else {
                        return res.status(405).json({
                            status: false,
                            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "El email o la contraseña son incorrectas.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El email o la contraseña son incorrectas.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                errors: validateFields.errors,
                message: "Los siguientes campos contienen errores.",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 31/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
userMethods.register = async (req, res) => {
    try {
        const {
            rolID,
            username,
            email,
            password,
            first_name,
            last_name,
        } = req.body;
        const validateFields = EvalueFields([
            {
                name: "Username",
                value: username,
            },
            {
                name: "Email",
                value: email,
            },
            {
                name: "password",
                value: password,
            },
            {
                name: "First name",
                value: first_name,
            },
            {
                name: "Last name",
                value: last_name,
            },
        ]);
        if (validateFields.status) {
            const validateRol = await Rol.findById(rolID);
            if (validateRol) {
                const checkEmail = await User.findOne({ email });
                if (checkEmail) {
                    return res.status(400).json({
                        status: false,
                        message: "El email ya esta en uso.",
                    });
                }

                const checkUsername = await User.findOne({ username });
                if (checkUsername) {
                    return res.status(400).json({
                        status: false,
                        message: "El nombre de usuario ya esta en uso.",
                    });
                }

                const user = new User({
                    rol: rolID,
                    username,
                    email,
                    password,
                    first_name,
                    last_name,
                });
                user.password = await user.encryptPassword(password);

                if (await user.save()) {
                    return res.status(201).json({
                        status: true,
                        message: "Te has registrado correctamente.",
                    });
                } else {
                    return res.status(405).json({
                        status: false,
                        message: "Ha ocurrido un error, por favor intentalo nuevamente.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id del rol es incorrecto.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                errors: validateFields.errors,
                message: "Los siguientes campos contienen errores.",
            });
        }
    } catch (error) {
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 31/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
userMethods.authenticate = async (req, res) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(200).json({
                status: false,
                message: "El token es requerido.",
            });
        }

        const verify = await jwt.verify(token, process.env.PRIVATE_KEY);
        if (verify) {
            const user = await User.findById(verify.id, {
                first_name: true,
                last_name: true,
                email: true,
                username: true,
                rol: true,
                profileImage: true,
            });
            return res.status(200).json({
                status: true,
                token,
                user,
                message: "El token es correcto",
            });
        } else {
            return res.status(200).json({
                status: false,
                message: "El token es incorrecto.",
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

export { userMethods as UserController };
