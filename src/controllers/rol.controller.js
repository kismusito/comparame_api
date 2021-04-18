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
        const rols = await Rol.find({}, { _id: true, rolName: true })
            .where("rolName")
            .ne("admin");
        const changeRolName = rols.map((rol) => {
            rol.rolName = rolsFrontEndName[rol.rolName];
            return rol;
        });
        return res.status(200).json({
            status: true,
            data: changeRolName,
            message: "Se han encontrado roles.",
        });
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

                    console.log(rol);

                    if (await rol.save()) {
                        return res.status(201).json({
                            status: false,
                            message: "Rol registered successfully.",
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
                        message: "El nombre del rol no esta permitido.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El nombre del rol es requerido.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "No tienes permiso para acceder a este recurso.",
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
                                    message: "El rol ha sido actualizado correctamente.",
                                });
                            } else {
                                return res.status(405).json({
                                    status: false,
                                    message:
                                        "Ha ocurrido un error, por favor intentalo nuevamente.",
                                });
                            }
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: "El rolID es incorrecto.",
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: false,
                            message: "El nombre del rol no esta permitido.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "El nombre del rol es requerido.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id rel rol es requerido.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "No tienes permiso para acceder a este recurso.",
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
                                "Este rol esta en uso por otros usuarios, no puedes eliminarlo.",
                        });
                    }

                    if (await getRol.remove()) {
                        return res.status(200).json({
                            status: false,
                            message: "El rol ha sido eliminado correctamente.",
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
                        message: "El rol no ha sido encontrado.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id del rol es requerido.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "No tienes permiso para acceder a este recurso.",
            });
        }
    } catch (error) {
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

export { rolMethods as RolController };
