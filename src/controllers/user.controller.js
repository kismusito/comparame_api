import { EvalueFields } from "../helpers";
import jwt from "jsonwebtoken";
import User from "../Models/User";
import Rol from "../Models/Rol";
import Supermarket from "../Models/Supermarket";
import Product from "../Models/Product";
import AccessControl from "../Middlewares/AccessControl";
import fs from "fs";

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
                            expiresIn: "12h",
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
                            message:
                                "Ha ocurrido un error, por favor intentalo nuevamente.",
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
        const { rolID, username, email, password, first_name, last_name } =
            req.body;
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
                        message:
                            "Ha ocurrido un error, por favor intentalo nuevamente.",
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
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 02/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
userMethods.upgradeToSupermarker = async (req, res) => {
    const permission = AccessControl.can(req.userRol).createOwn(
        "supermarket"
    ).granted;
    if (permission) {
        try {
            const { supermarketName } = req.body;
            const validateFields = EvalueFields([
                {
                    name: "Nombre del supermercado",
                    value: supermarketName,
                },
            ]);
            if (validateFields.status) {
                if (req.userRol === "client") {
                    const getSuperMarketRol = await Rol.findOne()
                        .where("rolName")
                        .equals("supermarket");
                    if (getSuperMarketRol) {
                        const updateUserRol = await User.findById(
                            req.user._id
                        ).updateOne({
                            rol: getSuperMarketRol._id,
                        });
                        if (updateUserRol) {
                            const supermarket = new Supermarket({
                                userID: req.user._id,
                                supermarketName,
                            });

                            if (req.file) {
                                supermarket.supermarketLogo = {
                                    path: "/assets/uploads/supermarket/",
                                    name: req.file.filename,
                                };
                            }

                            if (await supermarket.save()) {
                                return res.status(200).json({
                                    status: true,
                                    message:
                                        "El cliente ha sido actualizado a supermercado correctamente",
                                });
                            } else {
                                await User.findById(req.user._id).updateOne({
                                    rol: req.user.rol._id,
                                });

                                if (req.file) {
                                    fs.unlinkSync(req.file.path);
                                }

                                return res.status(400).json({
                                    status: true,
                                    message:
                                        "Ha ocurrido un error, por favor intentalo nuevamente.",
                                });
                            }
                        } else {
                            await User.findById(req.user._id).updateOne({
                                rol: req.user.rol._id,
                            });
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(400).json({
                                status: false,
                                message:
                                    "Ha ocurrido un error, por favor intentalo nuevamente.",
                            });
                        }
                    } else {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message: "El rol de supermercado no existe.",
                        });
                    }
                } else {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message:
                            "El usuario debe ser un cliente para cambiar a supermercado.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    status: false,
                    errors: validateFields.errors,
                    message: "Los siguientes campos contienen errores.",
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
 * Last modified: 17/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
userMethods.getFavoriteProduct = async (req, res) => {
    const permission = AccessControl.can(req.userRol).readOwn(
        "favoriteProduct"
    ).granted;
    if (permission) {
        try {
            const products = await User.findById(req.user._id, {
                favorite_products: true,
            }).populate("favorite_products");
            return res.status(200).json({
                status: 200,
                products,
                message: "Productos favoritos del usuario",
            });
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

/**
 * Author: Juan Araque
 * Last modified: 17/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
userMethods.addFavoriteProduct = async (req, res) => {
    const permission = AccessControl.can(req.userRol).createOwn(
        "favoriteProduct"
    ).granted;
    if (permission) {
        try {
            const { productID } = req.body;
            const validateFields = EvalueFields([
                {
                    name: "ID del supermercado",
                    value: productID,
                },
            ]);
            if (validateFields.status) {
                const product = await Product.findById(productID);
                if (product) {
                    const user = await User.findById(req.user._id);
                    if (user) {
                        await user.updateOne({
                            favorite_products: [
                                productID,
                                ...user.favorite_products,
                            ],
                        });
                        return res.status(200).json({
                            status: 200,
                            message: "Se ha agregado el producto a favoritos",
                        });
                    } else {
                        return res.status(400).json({
                            status: false,
                            message: "No se ha encontrado el usuario.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado el producto.",
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
 * Last modified: 17/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
userMethods.removeFavoriteProduct = async (req, res) => {
    const permission = AccessControl.can(req.userRol).createOwn(
        "favoriteProduct"
    ).granted;
    if (permission) {
        try {
            const { productID } = req.body;
            const validateFields = EvalueFields([
                {
                    name: "ID del supermercado",
                    value: productID,
                },
            ]);
            if (validateFields.status) {
                const user = await User.findById(req.user._id);
                if (user) {
                    const findProduct = user.favorite_products.find(
                        (product) => product.toString() === productID.toString()
                    );
                    if (findProduct) {
                        const product = await Product.findById(productID);
                        if (product) {
                            const productsFiltered =
                                user.favorite_products.filter(
                                    (product) =>
                                        product.toString() !==
                                        productID.toString()
                                );
                            await user.updateOne({
                                favorite_products: productsFiltered,
                            });
                            return res.status(200).json({
                                status: 200,
                                message:
                                    "Se ha removido el producto de favoritos",
                            });
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: "No se ha encontrado el producto.",
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: false,
                            message:
                                "El usuario no tiene agregado este producto en sus favoritos.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado el usuario.",
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

export { userMethods as UserController };
