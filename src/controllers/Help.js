const ProductMethods = {};
import Permission from "../Middlewares/AccessControl";
import { EvalueFields } from "../helpers";
import Product from "../Models/Product";
import Supermarker from "../Models/Supermaker";
import Category from "../Models/Category";

ProductMethods.getProductsGen = async (req, res) => {
    try {
        const {SupermarkerID} = req.body;
        const Products = await Product.find(
            {},
            { _id: true, supermarker: true }
        )
            .where("supermarker")
            .ne(SupermarkerID);
        if (Products) {
            return res.status(200).json({
                status: true,
                data: Products,
                message: "Se han encontrado productos de este supermercado.",
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

ProductMethods.getProduct = async (req, res) => {
    try {
        const ProductId = req.params;
        const checkProduct = await Product.findById(ProductId);
        if (checkProduct) {
            return res.status(200).json({
                status: true,
                data: checkProduct,
                message: "Se han encontrado producto.",
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "No se han encontrado producto..",
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

ProductMethods.updateProduct = async (req, res) => {
    try {
        const permissions = Permission.can(req.user.rol.name).updateOwn(
            "product"
        ).granted;
        if (permissions) {
            const {
                SupermarkerID,
                ProductID,
                categoryID,
                product_name,
                product_price,
                product_status,
                product_discount,
                product_feautered,
            } = req.body;

            if (SupermarkerID) {
                if (ProductID) {
                    const checkSupermarker = await Supermarker.findById(
                        SupermarkerID
                    );
                    const checkProduct = await Product.findById(ProductId);
                    if (checkSupermarker._id == checkProduct.supermarker) {
                        const checkNewCategory = await Category.findById(
                            categoryID
                        );
                        if (checkNewCategory) {
                            const checkProductName = await Product.find({
                                product_name: product_name,
                                supermarker: Supermarker.findById(
                                    supermarkerID
                                ),
                            });
                            if (checkProductName) {
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "El Nombre del producto ya esta en uso.",
                                });
                            }
                            const newProduct = await checkProduct.updateOne({
                                categories: categoryID,
                                product_name: product_name,
                                product_price: product_price,
                                product_status: product_status,
                                product_discount: product_discount,
                                product_feautered: product_feautered,
                            });
                            if (newProduct) {
                                return res.status(201).json({
                                    status: true,
                                    message:
                                        "El Producto ha sido actualizado correctamente.",
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
                                message:
                                    "La Categoria a la que intenta cambiar no existe'",
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: false,
                            message:
                                "Este producto no pertenece a dicho supermercado",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "No se ah encontrado el producto.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No se encontro Supermercado",
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

ProductMethods.deleteProduct = async (req, res) => {
    try {
        const permissions = Permission.can(req.user.rol.name).deleteOwn(
            "product"
        ).granted;
        if (permissions) {
            const { ProductID } = req.body;
            if (ProductID) {
                const getProduct = await Product.findById(ProductID);
                if (getProduct) {
                    const checkCategorProduct = await Category.find(
                        { products: ProductID },
                        { _id: true }
                    );
                    if (checkCategorProduct.length > 0) {
                        return res.status(400).json({
                            status: false,
                            message:
                                "Este Producto esta en una categoria, no puedes eliminarlo.",
                        });
                    }
                    if (await getProduct.remove()) {
                        return res.status(200).json({
                            status: true,
                            message: "El rol ha sido eliminado correctamente.",
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
                        message: "El Producto no ha sido encontrado.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id del producto es requerido.",
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

ProductMethods.createProduct = async (req, res) => {
    try {
        const permission = Permission.can(req.user.rol.name).createOwn(
            "product"
        ).granted;
        if (permission) {
            const {
                supermarkerID,
                CategoryID,
                product_name,
                product_price,
                product_status,
                product_discount,
                product_feautered,
            } = req.body;
            const validateFields = EvalueFields([
                {
                    name: "Product name",
                    value: product_name,
                },
                {
                    name: "Product price",
                    value: product_price,
                },
                {
                    name: "Product status",
                    value: product_status,
                },
                {
                    name: "Product discount",
                    value: product_discount,
                },
                {
                    name: "Featured product",
                    value: product_feautered,
                },
            ]);
            if (validateFields.status) {
                const checkSupermarker = await Supermarker.findById(
                    supermarkerID
                );
                if (checkSupermarker) {
                    const checkCategory = await Category.findById(CategoryID);
                    if (checkCategory) {
                        const checkProductName = await Product.find({
                            product_name: product_name,
                            supermarker: Supermarker.findById(supermarkerID),
                        });
                        if (checkProductName) {
                            return res.status(400).json({
                                status: false,
                                message:
                                    "El Nombre del producto ya esta en uso.",
                            });
                        }
                        const product = new Product({
                            categories: CategoryID,
                            supermarker: supermarkerID,
                            product_name,
                            product_price,
                            product_status,
                            product_discount,
                            product_feautered,
                        });
                        if (await product.save()) {
                            return res.status(201).json({
                                status: true,
                                product,
                                message:
                                    "Ha creado un nuevo producto satisfactoriamente.",
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
                            message: "El id de la categoria es incorrecto.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "El id del supermercado es incorrecto.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    errors: validateFields.errors,
                    message: "Los siguientes campos contienen errores.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "No tiene permiso para acceder.",
            });
        }
    } catch (error) {
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

export { ProductMethods as ProductController };
