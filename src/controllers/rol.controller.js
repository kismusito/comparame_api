import Rol from "../Models/Rol";
import User from "../Models/User";
import { allowedRols, rolsFrontEndName } from "../config";
import Permission from "../Middlewares/AccessControl";
const rolMethods = {};

/**
 * Author: Juan Araque
 * Last modified: 31/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
rolMethods.getRols = async (req, res) => {
    try {
        const rols = await Rol.find({}, { _id: true, rolName: true });
        const changeRolName = rols.map((rol) => {
            rol.rolName = rolsFrontEndName[rol.rolName];
            return rol;
        });
        return res.status(200).json({
            status: true,
            data: changeRolName,
            message: "Rols found",
        });
    } catch (error) {
        return res.status(405).json({
            status: false,
            message: "There was an error, please try again.",
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
rolMethods.createRol = async (req, res) => {
    try {
        const permission = Permission.can(req.userRol).createAny("rol").granted;
        if (permission) {
            const { rol_name } = req.body;
            if (rol_name) {
                const checkRolName = allowedRols.find(
                    (rol) => rol === rol_name
                );
                if (checkRolName) {
                    const rol = new Rol({
                        rolName: rol_name,
                    });

                    if (await rol.save()) {
                        return res.status(201).json({
                            status: false,
                            message: "Rol registered successfully.",
                        });
                    } else {
                        return res.status(405).json({
                            status: false,
                            message: "There was an error, please try again.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "The rol name is not allowed.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "The rol name is required.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "You not have permissions for access.",
            });
        }
    } catch (error) {
        return res.status(405).json({
            status: false,
            message: "There was an error, please try again.",
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
rolMethods.updateRol = async (req, res) => {
    try {
        const permissions = Permission.can(req.userRol).updateAny("rol")
            .granted;
        if (permissions) {
            const { rolID, rol_name } = req.body;
            if (rolID) {
                if (rol_name) {
                    const checkRolName = allowedRols.find(
                        (rol) => rol === rol_name
                    );
                    if (checkRolName) {
                        const getRol = await Rol.findById(rolID);
                        if (getRol) {
                            if (
                                await getRol.updateOne({
                                    rolName: rol_name,
                                })
                            ) {
                                return res.status(201).json({
                                    status: false,
                                    message: "Rol updated successfully.",
                                });
                            } else {
                                return res.status(405).json({
                                    status: false,
                                    message:
                                        "There was an error, please try again.",
                                });
                            }
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: "The rolID is incorrect.",
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: false,
                            message: "The rol name is not allowed.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "The rol name is required.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "The rol id is required.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "You not have permissions for access.",
            });
        }
    } catch (error) {
        return res.status(405).json({
            status: false,
            message: "There was an error, please try again.",
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
rolMethods.deleteRol = async (req, res) => {
    try {
        const permissions = Permission.can(req.userRol).deleteAny("rol")
            .granted;
        if (permissions) {
            const { rolID } = req.body;
            if (rolID) {
                const getRol = await Rol.findById(rolID);
                if (getRol) {
                    const checkIfUsersHasRol = await User.find(
                        { rol: rolID },
                        { _id: true }
                    );
                    if (checkIfUsersHasRol.length > 0) {
                        return res.status(400).json({
                            status: false,
                            message:
                                "This role is used by other users, you can delete it.",
                        });
                    }

                    if (await getRol.remove()) {
                        return res.status(200).json({
                            status: false,
                            message: "The rol was removed successfully.",
                        });
                    } else {
                        return res.status(405).json({
                            status: false,
                            message: "There was an error, please try again.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "The rol was not found.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "The rolID is required.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "You not have permissions for access.",
            });
        }
    } catch (error) {
        return res.status(405).json({
            status: false,
            message: "There was an error, please try again.",
        });
    }
};

export { rolMethods as RolController };
