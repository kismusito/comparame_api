import User from "../Models/User";
import AccessControl from "../Middlewares/AccessControl";
import { EvalueFields, checkEmail, checkUsername } from "../helpers";
import fs from "fs";
const profileMethods = {};

/**
 * Author: Juan Araque
 * Last modified: 05/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
profileMethods.getUserProfile = async (req, res) => {
    const permission = AccessControl.can(req.userRol).readOwn("profile")
        .granted;
    if (permission) {
        console.log(req.user)
        return res.status(200).json({
            status: true,
            data: req.user,
            message: "Se ha encontrado el perfil.",
        });
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 05/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
profileMethods.updateProfile = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
            const { email, username, first_name, last_name, age } = req.body;
            const validateFields = EvalueFields([
                {
                    name: "Email",
                    value: email,
                },
                {
                    name: "Nombre de usuario",
                    value: username,
                },
                {
                    name: "Nombre",
                    value: first_name,
                },
                {
                    name: "Apellido",
                    value: last_name,
                },
            ]);
            if (validateFields.status) {
                const userID = req.user._id;
                if (userID) {
                    const getUser = await User.findById(userID);
                    if (getUser) {
                        if (email !== getUser.email) {
                            const verifyEmail = await checkEmail(email);
                            if (verifyEmail) {
                                if (req.file) {
                                    fs.unlinkSync(req.file.path);
                                }
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "Lo sentimos pero el email ya esta tomado.",
                                });
                            }
                        }

                        if (username !== getUser.username) {
                            const verifyUsername = await checkUsername(
                                username
                            );
                            if (verifyUsername) {
                                if (req.file) {
                                    fs.unlinkSync(req.file.path);
                                }
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "Lo sentimos pero el nombre de usuario ya esta tomado.",
                                });
                            }
                        }

                        const dataToUpdate = {
                            email,
                            username,
                            first_name,
                            last_name,
                            age,
                        };

                        if (req.file) {
                            if (getUser.photo) {
                                const file_location =
                                    __dirname +
                                    "/../../public" +
                                    getUser.photo.path +
                                    getUser.photo.name;
                                if (fs.existsSync(file_location)) {
                                    fs.unlinkSync(file_location);
                                }
                            }
                            dataToUpdate.photo = {
                                path: "/assets/uploads/users/",
                                name: req.file.filename,
                                size: req.file.size,
                            };
                        }

                        await getUser.updateOne(dataToUpdate);
                        return res.status(200).json({
                            status: true,
                            message:
                                "Se ha actualizado correctamente el usuario.",
                        });
                    } else {
                        return res.status(400).json({
                            status: false,
                            message:
                                "No encontramos el usuario, revisa el token que suministraste.",
                        });
                    }
                } else {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message:
                            "No encontramos el usuario, revisa el token que suministraste.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    errors: validateFields.errors,
                    message: "Uno o mas campos son requeridos",
                });
            }
        } catch (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(405).json({
                status: false,
                message:
                    "Ha ocurrido un error, por favor intentalo nuevamente.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 05/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
profileMethods.updateGeolocation = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
            const { latitude, longitude } = req.body;
            const validateFields = EvalueFields([
                {
                    name: "Latitud",
                    value: latitude,
                },
                {
                    name: "Logitud",
                    value: longitude,
                },
            ]);
            if (validateFields.status) {
                const userID = req.user._id;
                if (userID) {
                    const getUser = await User.findById(userID);
                    if (getUser) {
                        await getUser.updateOne({
                            location: { latitude, longitude },
                        });
                        return res.status(200).json({
                            status: true,
                            message:
                                "Se ha actualizado correctamente la geolocalización.",
                        });
                    } else {
                        return res.status(400).json({
                            status: false,
                            message:
                                "Lo sentimos pero no se ha encontrado el usuario.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message:
                            "No encontramos el usuario, revisa el token que suministraste.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    errors: validateFields.errors,
                    message: "Uno o mas campos son requeridos",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(405).json({
                status: false,
                message:
                    "Ha ocurrido un error, por favor intentalo nuevamente.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

export { profileMethods as ProfileController };
