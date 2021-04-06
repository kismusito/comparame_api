const productMethods = {};
import Permission from "../Middlewares/AccessControl";
// import { EvalueFields } from "../helpers";
// import Product from "../Models/Product";

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
productMethods.getProducts = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).readAny("product")
        .granted;
    if (permission) {
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
productMethods.getProduct = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).readOwn("product")
        .granted;
    if (permission) {
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
productMethods.createProduct = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).createOwn("product")
        .granted;
    if (permission) {
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
productMethods.updateProduct = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).updateOwn("product")
        .granted;
    if (permission) {
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
productMethods.deleteProduct = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).deleteOwn("product")
        .granted;
    if (permission) {
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

export { productMethods as ProductController };
