import AccessControl from "../Middlewares/AccessControl";
const supermarkerMethods = {};

/**
 * Author: Juan Araque
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.getSupermarkers = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.getSupermarkerHeadsquares = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.getSupermarker = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.getSupermarkerHeadsquare = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.createSupermarkerHeadsquare = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.updateSupermarker = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.updateSupermarkerHeadsquare = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarkerMethods.deleteSupermarkerHeadsquare = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("profile")
        .granted;
    if (permission) {
        try {
        } catch (error) {
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

export { supermarkerMethods as SupermarkerController };
