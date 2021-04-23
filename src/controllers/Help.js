const ProductMethods = {};
import Permission from "../Middlewares/AccessControl";
import { EvalueFields } from "../Helpers";
import Product from "../Models/Product";
import Supermarker from "../Models/Supermaker";
import Category from "../Models/Category";

ProductMethods.getProductsGen = async (req, res) => {
    try {
        const SupermarkerID = req.body;
        const Products = await Product.find({}, { _id: true, supermarker: true })
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
}

ProductMethods.getProduct = async (req, res) => {
    try {
        const ProductId = req.params;
        const checkProduct = await Product.findById(ProductId);
        if(checkProduct){
            return res.status(200).json({
                status: true,
                data: checkProduct,
                message: "Se han encontrado producto.",
            });
        }else{
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
        const permissions = Permission.can(req.user.rol.name).updateOwn("product").granted
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
                    const checkSupermarker = await Supermarker.findById(SupermarkerID);
                    const checkProduct = await Product.findById(ProductId);
                    if (checkSupermarker == checkProduct.supermarker) {
                        
                    }else{
                        return res.status(400).json({
                            status: false,
                            message: "Este producto no pertenece a dicho supermercado",
                        });
                    }



                    if (checkProduct) {
                        const CheckCategories = await Category.findById(categoryID)
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
    }catch(error) {
        return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

ProductMethods.deleteProduct = async (req, res) => {};

ProductMethods.createProduct = async (req, res) => {
    try {
        const permission = Permission.can(req.user.rol.name).createOwn("product").granted;
        if (permission) {
            const { supermarkerID, 
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
                const checkSupermarker = await Supermarker.findById(supermarkerID);
                if(checkSupermarker){
                    const checkCategory = await Category.findById(CategoryID);
                    if(checkCategory){
                        const checkProductName = await Product.find({product_name: product_name, supermarker: Supermarker.findById(supermarkerID)});
                        if(checkProductName){
                            return res.status(400).json({
                                status: false,
                                message: "El Nombre del producto ya esta en uso.",
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
                                status: false,
                                product,
                                message: "Ha creado un nuevo producto satisfactoriamente.",
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
                            message: "El id de la categoria es incorrecto.",
                        });
                    }
                }else{
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