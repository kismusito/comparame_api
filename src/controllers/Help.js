const ProductMethods = {};
import Permission from "../Middlewares/AccessControl";
import { EvalueFields } from "../Helpers";
import Product from "../Models/Product";
import Supermarker from "../Models/Supermaker";
import Category from "../Models/Category";

ProductMethods.getProductsGen = async (req, res) => {
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
ProductMethods.getProduct = async (req, res) => {};
ProductMethods.updateProduct = async (req, res) => {};
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