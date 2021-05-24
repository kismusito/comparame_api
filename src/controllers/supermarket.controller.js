import { EvalueFields, convertToJson } from "../helpers";
import AccessControl from "../Middlewares/AccessControl";
import Supermarket from "../Models/Supermarket";
import { Types } from "mongoose";
const supermarketMethods = {};
import fs from "fs";

/**
 * Author: Juan Araque
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarketMethods.getSupermarkets = async (req, res) => {
    try {
        const supermarkets = await Supermarket.find();
        return res.status(200).json({
            status: true,
            data: {
                supermarkets,
            },
            message: "Se han encontrado supermercados.",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
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
supermarketMethods.getSupermarketHeadsquares = async (req, res) => {
    try {
        const { supermarketID } = req.params;
        if (supermarketID) {
            const supermarket = await Supermarket.findById(supermarketID);
            if (supermarket) {
                return res.status(200).json({
                    status: true,
                    data: {
                        headsquares: supermarket.headsquares,
                    },
                    message:
                        "Ha ocurrido un error, por favor intentalo nuevamente.",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No se ha encontrado el supermercado.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "El id del supermercado es requerido.",
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarketMethods.getSupermarket = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const supermarket = await Supermarket.findById(id);
            if (supermarket) {
                return res.status(200).json({
                    status: true,
                    data: {
                        supermarket,
                    },
                    message: "Se ha encontrado el supermercado.",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No se ha encontrado el supermercado.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "El id del supermercado es requerido.",
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarketMethods.getSupermarketHeadsquare = async (req, res) => {
    try {
        const { supermarketID, headsquareID } = req.params;
        if (supermarketID) {
            if (headsquareID) {
                const supermarket = await Supermarket.findById(supermarketID);
                if (supermarket) {
                    const supermarketHeadsquare = supermarket.headsquares.find(
                        (supermarketItem) =>
                            supermarketItem._id.toString() ===
                            headsquareID.toString()
                    );
                    if (supermarketHeadsquare) {
                        return res.status(200).json({
                            status: true,
                            data: {
                                headsquare: supermarketHeadsquare,
                            },
                            message:
                                "Se ha encontrado la sede del supermercado.",
                        });
                    } else {
                        return res.status(400).json({
                            status: false,
                            message:
                                "No se ha encontrado la sede del supermercado.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado el supermercado.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id de la sede es requerido.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "El id del supermercado es requerido.",
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
 * Last modified: 01/05/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarketMethods.createSupermarketHeadsquare = async (req, res) => {
    const permission = AccessControl.can(req.userRol).createOwn("headsquare")
        .granted;
    if (permission) {
        try {
            const {
                supermarketID,
                headsquareName,
                headsquareLocation,
            } = req.body;
            if (supermarketID) {
                const validateFields = EvalueFields([
                    {
                        name: "Nombre de la sede",
                        value: headsquareName,
                    },
                    {
                        name: "Ubicación de la sede",
                        value: headsquareLocation,
                    },
                ]);
                if (validateFields.status) {
                    const locationConvert = convertToJson(headsquareLocation);
                    if (locationConvert) {
                        const validateFieldsLocation = EvalueFields([
                            {
                                name: "Latitud de la ubicación",
                                value: locationConvert.latitude,
                            },
                            {
                                name: "Longitud de la ubicación",
                                value: locationConvert.longitude,
                            },
                        ]);
                        if (validateFieldsLocation.status) {
                            const supermarket = await Supermarket.findById(
                                supermarketID
                            );
                            if (supermarket) {
                                if (
                                    supermarket.userID.toString() ===
                                    req.user._id.toString()
                                ) {
                                    const headSquareInfo = {
                                        _id: Types.ObjectId(),
                                        headsquareName,
                                        headsquareLocation: locationConvert,
                                    };

                                    if (req.file) {
                                        headSquareInfo.headSquareImage = {
                                            path:
                                                "/assets/uploads/supermarket/headsquares/",
                                            name: req.file.filename,
                                        };
                                    }

                                    const updateHeadsquares = [
                                        headSquareInfo,
                                        ...supermarket.headsquares,
                                    ];

                                    await supermarket.updateOne({
                                        headsquares: updateHeadsquares,
                                    });

                                    return res.status(201).json({
                                        status: false,
                                        message:
                                            "La sede se ha registrado correctamente.",
                                    });
                                } else {
                                    if (req.file) {
                                        fs.unlinkSync(req.file.path);
                                    }
                                    return res.status(400).json({
                                        status: false,
                                        message:
                                            "No tienes acceso a este supermercado.",
                                    });
                                }
                            } else {
                                if (req.file) {
                                    fs.unlinkSync(req.file.path);
                                }
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "No se ha encontrado el supermercado.",
                                });
                            }
                        } else {
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(400).json({
                                status: false,
                                errors: validateFieldsLocation.errors,
                                message:
                                    "Los siguientes campos contienen errores.",
                            });
                        }
                    } else {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message: "La ubicación no tiene un formato valido.",
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
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    status: false,
                    message: "El ID del supermercado es requerido.",
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
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
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
supermarketMethods.updateSupermarket = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("supermarket")
        .granted;
    if (permission) {
        try {
            const { supermarketID, supermarketName } = req.body;
            if (supermarketID) {
                const supermarket = await Supermarket.findById(supermarketID);
                if (supermarket) {
                    if (
                        supermarket.userID.toString() ===
                        req.user._id.toString()
                    ) {
                        const validateFields = EvalueFields([
                            {
                                name: "Nombre del supermercado",
                                value: supermarketName,
                            },
                        ]);
                        if (validateFields.status) {
                            const toUpdateData = {
                                supermarketName,
                                updated_at: new Date(),
                            };
                            if (req.file) {
                                if (supermarket.supermarketLogo) {
                                    const file_location =
                                        __dirname +
                                        "/../../public" +
                                        supermarket.supermarketLogo.path +
                                        supermarket.supermarketLogo.name;
                                    if (fs.existsSync(file_location)) {
                                        fs.unlinkSync(file_location);
                                    }
                                }
                                toUpdateData.supermarketLogo = {
                                    path: "/assets/uploads/supermarket/",
                                    name: req.file.filename,
                                };
                            }

                            await supermarket.updateOne(toUpdateData);
                            return res.status(200).json({
                                status: true,
                                message:
                                    "Se ha actualizado correctamente el supermercado.",
                            });
                        } else {
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(400).json({
                                status: false,
                                errors: validateFields.errors,
                                message:
                                    "Los siguientes campos contienen errores.",
                            });
                        }
                    } else {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message:
                                "No tienes permiso para editar este supermercado.",
                        });
                    }
                } else {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado el supermercado.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    status: false,
                    message: "El id del supermercado es requerido.",
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
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
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
supermarketMethods.updateSupermarketHeadsquare = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("headsquare")
        .granted;
    if (permission) {
        try {
            const {
                supermarketID,
                headsquareID,
                headsquareName,
                headsquareLocation,
            } = req.body;
            if (supermarketID) {
                const supermarket = await Supermarket.findById(supermarketID);
                if (supermarket) {
                    if (
                        supermarket.userID.toString() ===
                        req.user._id.toString()
                    ) {
                        if (headsquareID) {
                            const validateFields = EvalueFields([
                                {
                                    name: "Nombre de la sede",
                                    value: headsquareName,
                                },
                            ]);
                            if (validateFields.status) {
                                const getHeadSquare = supermarket.headsquares.find(
                                    (headsquareItem) =>
                                        headsquareItem._id.toString() ===
                                        headsquareID.toString()
                                );
                                if (getHeadSquare) {
                                    getHeadSquare.headsquareName = headsquareName;

                                    if (headsquareLocation) {
                                        const locationConvert = convertToJson(
                                            headsquareLocation
                                        );
                                        if (locationConvert) {
                                            const validateFieldsLocation = EvalueFields(
                                                [
                                                    {
                                                        name:
                                                            "Latitud de la ubicación",
                                                        value:
                                                            locationConvert.latitude,
                                                    },
                                                    {
                                                        name:
                                                            "Longitud de la ubicación",
                                                        value:
                                                            locationConvert.longitude,
                                                    },
                                                ]
                                            );
                                            if (validateFieldsLocation) {
                                                getHeadSquare.headsquareLocation = locationConvert;
                                            } else {
                                                if (req.file) {
                                                    fs.unlinkSync(
                                                        req.file.path
                                                    );
                                                }
                                                return res.status(400).json({
                                                    status: false,
                                                    errors:
                                                        validateFields.errors,
                                                    message:
                                                        "Los siguientes campos contienen errores.",
                                                });
                                            }
                                        } else {
                                            if (req.file) {
                                                fs.unlinkSync(req.file.path);
                                            }
                                            return res.status(400).json({
                                                status: false,
                                                message:
                                                    "La ubicación no tiene un formato valido.",
                                            });
                                        }
                                    }

                                    if (req.file) {
                                        if (getHeadSquare.headSquareImage) {
                                            const file_location =
                                                __dirname +
                                                "/../../public" +
                                                getHeadSquare.headSquareImage
                                                    .path +
                                                getHeadSquare.headSquareImage
                                                    .name;
                                            if (fs.existsSync(file_location)) {
                                                fs.unlinkSync(file_location);
                                            }
                                        }
                                        getHeadSquare.headSquareImage = {
                                            path:
                                                "/assets/uploads/supermarket/headsquares/",
                                            name: req.file.filename,
                                        };
                                    }

                                    await supermarket.updateOne({
                                        headsquares: supermarket.headsquares,
                                    });
                                    return res.status(200).json({
                                        status: true,
                                        message:
                                            "Se ha actualizado correctamente la sede.",
                                    });
                                } else {
                                    if (req.file) {
                                        fs.unlinkSync(req.file.path);
                                    }
                                    return res.status(400).json({
                                        status: false,
                                        message:
                                            "El id de la sede no pertenece a este supermercado.",
                                    });
                                }
                            } else {
                                if (req.file) {
                                    fs.unlinkSync(req.file.path);
                                }
                                return res.status(400).json({
                                    status: false,
                                    errors: validateFields.errors,
                                    message:
                                        "Los siguientes campos contienen errores.",
                                });
                            }
                        } else {
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(400).json({
                                status: false,
                                message: "El id de la sede es requerida.",
                            });
                        }
                    } else {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message:
                                "No tienes permiso para editar este supermercado.",
                        });
                    }
                } else {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado el supermercado.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    status: false,
                    message: "El id del supermercado es requerido.",
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
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
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
supermarketMethods.deleteSupermarketHeadsquare = async (req, res) => {
    const permission = AccessControl.can(req.userRol).deleteOwn("headsquare")
        .granted;
    if (permission) {
        try {
            const { supermarketID, headsquareID } = req.body;
            if (supermarketID) {
                const supermarket = await Supermarket.findById(supermarketID);
                if (supermarket) {
                    if (
                        supermarket.userID.toString() ===
                        req.user._id.toString()
                    ) {
                        if (headsquareID) {
                            const getHeadSquare = supermarket.headsquares.find(
                                (headsquareItem) =>
                                    headsquareItem._id.toString() ===
                                    headsquareID.toString()
                            );
                            if (getHeadSquare) {
                                if (getHeadSquare.headSquareImage) {
                                    const file_location =
                                        __dirname +
                                        "/../../public" +
                                        getHeadSquare.headSquareImage.path +
                                        getHeadSquare.headSquareImage.name;
                                    if (fs.existsSync(file_location)) {
                                        fs.unlinkSync(file_location);
                                    }
                                }

                                const deleteHeadSquareFromSupermarket = supermarket.headsquares.filter(
                                    (headsquareItem) =>
                                        headsquareItem._id.toString() !==
                                        headsquareID.toString()
                                );

                                await supermarket.updateOne({
                                    headsquares: deleteHeadSquareFromSupermarket,
                                });
                                return res.status(200).json({
                                    status: true,
                                    message:
                                        "Se ha eliminado correctamente la sede.",
                                });
                            } else {
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "Esta sede no pertenece a el supermercado.",
                                });
                            }
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: "El id de la sede es requerida.",
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: false,
                            message:
                                "No tienes permiso para editar este supermercado.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado el supermercado.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id del supermercado es requerido.",
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

supermarketMethods.buyPlan = async (req, res) => {
    const permission = AccessControl.can(req.userRol).updateOwn("supermarket")
    .granted;
    if (permission) {
        try {            
            const {
                supermarketID,
                planID
            } = req.body;
            if (supermarketID) {
                const supermarket = await Supermarket.findById(supermarketID);
                /*
                Verificar si tiene un plan anterior{
                    Pedir confirmacion de cambio de Plan{
                        Mirar si los productos destacados que ya posee
                        el supermercado son menos que el numero Maximo
                        del nuevo plan{
                            Hacer el Update al nuevo plan
                            Pedir que seleccione los nuevos productos a destacar
                        }si no{                        
                            Return: No puede porque sobrepasa el # de productos destacados

                            o

                            Cambiar todos los productos destacados a no destacados
                            Hacer el Update al nuevo plan
                            Pedir que seleccione los nuevos productos a destacar
                            
                        }
                    }        
                }
                */
            }
        } catch (error) {
            return res.status(405).json({
                status: false,
                message:
                    "Ha ocurrido un error, por favor intentalo nuevamente.",
            });
        }
    }
}

export { supermarketMethods as SupermarketController };
