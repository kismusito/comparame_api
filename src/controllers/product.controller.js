const ProductMethods = {};
import Permission from "../Middlewares/AccessControl";
import { EvalueFields } from "../helpers";
import Product from "../Models/Product";
import Supermarket from "../Models/Supermarket";
import Category from "../Models/Category";

ProductMethods.getProducts = async (req, res) => {
  const { minPrice, maxPrice, name, feature } = req.query;
  const filters = {};

  if (minPrice) {
    if (Number.isNaN(Number(minPrice))) {
      return res.status(400).json({
        status: false,
        message: "El precio minimo debe ser un numero",
      });
    }
    filters.product_price = {
      ...filters.product_price,
      $gte: minPrice,
    };
  }

  if (maxPrice) {
    if (Number.isNaN(Number(maxPrice))) {
      return res.status(400).json({
        status: false,
        message: "El precio maximo debe ser un numero",
      });
    }
    filters.product_price = {
      ...filters.product_price,
      $lte: Number(maxPrice),
    };
  }

  if (name) {
    filters.product_name = { $regex: ".*" + name + ".*", $options: "i" };
  }

  if (feature) {
    filters.product_feautered = feature;
  }

  try {
    const products = await Product.find({
      ...filters,
    }).populate("categories");
    return res.status(200).json({
      status: true,
      data: products,
      message: "Se han encontrado productos de este supermercado.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

ProductMethods.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const checkProduct = await Product.findById(id)
      .populate("categories")
      .populate("supermarket");
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

ProductMethods.compareProducts = async (req, res) => {
  try {
    const { id, difference } = req.params;
    const checkProduct = await Product.findById(id);
    if (checkProduct) {
      const filters = {};
      const productPrice = Number(checkProduct.product_price);
      let priceDifference = 10000;

      if (difference) priceDifference = Number(difference);

      filters.product_price = {
        $gte: productPrice - priceDifference,
        $lte: productPrice + priceDifference,
      };
      filters.product_name = {
        $regex: ".*" + checkProduct.product_name + ".*",
        $options: "i",
      };

      const products = await Product.find({
        ...filters,
      });

      if (products.length > 0) {
        return res.status(200).json({
          status: true,
          data: products,
          message: "Se han encontrado producto.",
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "No hay productos similares.",
        });
      }
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
    const permissions = Permission.can(req.userRol).updateOwn(
      "product"
    ).granted;
    if (permissions) {
      const {
        supermarketID,
        productID,
        product_name,
        product_price,
        //"product_status" Falta meter para cambiar el estado del producto.
        product_discount,
      } = req.body;

      if (supermarketID) {
        if (productID) {
          const checkProduct = await Product.findById(productID);
          if (supermarketID == checkProduct.supermarket) {
            if (product_name != checkProduct.product_name) {
              const checkProductName = await Product.findOne({
                product_name: product_name,
                supermarket: supermarketID,
              });
              if (checkProductName) {
                return res.status(400).json({
                  status: false,
                  message: "El Nombre del producto ya esta en uso.",
                });
              }
            }

            const newProduct = await checkProduct.updateOne({
              product_name: product_name,
              product_price: product_price,
              product_discount: product_discount,
              updated_at: new Date(),
            });
            if (newProduct) {
              return res.status(201).json({
                status: true,
                message: "El Producto ha sido actualizado correctamente.",
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
              message: "Este producto no pertenece a dicho supermercado",
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

ProductMethods.TakeAwayProductCategory = async (req, res) => {
  try {
    const permissions = Permission.can(req.userRol).updateOwn(
      "product"
    ).granted;
    if (permissions) {
      const { CategoryID, ProductID } = req.body;
      if (CategoryID) {
        if (ProductID) {
          const getProduct = await Product.findById(ProductID);
          const getCategory = await Category.findById(CategoryID);
          if(getProduct){
            if(getCategory){
              const checkCategoryProduct = await Product.find(
                {_id: ProductID, categories: CategoryID},
                {_id: true});
              if(checkCategoryProduct){
                //Quitar la categoria del producto, Pero manteniendo las demas categorias del producto
                const TakeAwayCategory = await getProduct.updateOne(
                  {
                    updated_at: new Date()
                  },
                  {
                    $pull: { categories: { _id: CategoryID} } 
                  },
                );
                if(!TakeAwayCategory){
                  return res.status(400).json({
                    status: false,
                    message:
                      "no se pudo actualizar el cambio de categoria en el producto",
                  });
                }
                return res.status(200).json({
                  status: true,
                  message:
                    "Se elimino la categoria del producto",
                });
              }
              return res.status(400).json({
                status: false,
                message: "El producto no pertenece a dicha categoria",
              });
            }
            return res.status(400).json({
              status: false,
              message: "No se encontro la categoria",
            });
          }
          return res.status(400).json({
            status: false,
            message: "No encontro producto",
          });
        }
        return res.status(400).json({
          status: false,
          message: "No se ingreso producto",
        });
      }
      return res.status(400).json({
        status: false,
        message: "permisos",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

ProductMethods.InsertProductCategory = async (req, res) => {
  try {
    const permissions = Permission.can(req.userRol).updateOwn(
      "product"
    ).granted;
    if (permissions) {
      const { CategoryID, ProductID } = req.body;
      if (CategoryID) {
        if (ProductID) {
          const getProduct = await Product.findById(ProductID);
          const getCategory = await Category.findById(CategoryID);
          if (getProduct) {
            if (getCategory) {
              const checkCategoryProduct = await Category.find(
                { _id: CategoryID, products: ProductID },
                { _id: true }
              );
              if (!checkCategoryProduct) {
                //Añadir la categoria al producto, Pero manteniendo las demas categorias del producto
                const InsertCategory = await getProduct.updateOne(
                  {
                    updated_at: new Date()
                  },
                  {
                    $push: { categories: { _id: CategoryID} } 
                  },
                  );
                if(!InsertCategory){
                  return res.status(400).json({
                    status: false,
                    message:
                      "no se pudo actualizar el cambio de categoria en el producto",
                  });
                }
                return res.status(200).json({
                  status: true,
                  message:
                    "Se añadio la categoria al producto",
                });
              }
              return res.status(400).json({
                status: false,
                message: "El producto ya pertenece a dicha categoria",
              });
            }
            return res.status(400).json({
              status: false,
              message: "No se encontro la categoria",
            });
          }
          return res.status(400).json({
            status: false,
            message: "No encontro producto",
          });
        }
        return res.status(400).json({
          status: false,
          message: "No se ingreso producto",
        });
      }
      return res.status(400).json({
        status: false,
        message: "permisos",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

ProductMethods.deleteProduct = async (req, res) => {
  try {
    const permissions = Permission.can(req.userRol).deleteOwn(
      "product"
    ).granted;
    if (permissions) {
      const { ProductID } = req.body;
      if (ProductID) {
        const getProduct = await Product.findById(ProductID);
        if (getProduct) {
          const checkCategorProduct = await Category.find(
            {
              products: ProductID,
            },
            {
              _id: true,
            }
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
              message: "El Producto ha sido eliminado correctamente.",
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
    const permission = Permission.can(req.userRol).createOwn("product").granted;
    if (permission) {
      const {
        supermarketID,
        CategoryID,
        product_name,
        product_price,
        product_discount,
        product_feautered,
      } = req.body;
      const validateFields = EvalueFields([
        {
          name: "ID del supermercado",
          value: supermarketID,
        },
        {
          name: "Product name",
          value: product_name,
        },
        {
          name: "Product price",
          value: product_price,
        },
      ]);
      if (validateFields.status) {
        const checkSupermarket = await Supermarket.findById(supermarketID);
        if (checkSupermarket) {
          if (CategoryID) {
            const checkCategory = await Category.findById(CategoryID);
            if (!checkCategory) {
              return res.status(400).json({
                status: false,
                message: "El id de la categoria es incorrecto.",
              });
            }
          }

          const checkProductName = await Product.findOne({
            product_name: product_name,
            supermarket: checkSupermarket._id,
          });
          if (checkProductName) {
            return res.status(400).json({
              status: false,
              message: "El nombre del producto ya esta en uso.",
            });
          }

          if (product_feautered == true) {
            const IDSuperPlan = checkSupermarket.plans;
            const PlanSupermarket = await Plan.findById(IDSuperPlan);
            const SupermarketFeaturedProducts = Product.count({
              supermarket: supermarketID,
              product_feautered: true,
            });
            if (
              PlanSupermarket.plan_total_featured_projects <=
              SupermarketFeaturedProducts
            ) {
              return res.status(400).json({
                status: false,
                message:
                  "El Producto no puede ser destacado, no tiene plazas libres dentro de su plan.",
              });
            }
          }

          const newProduct = {
            supermarket: supermarketID,
            product_name,
            product_price,
            product_status: true,
            product_discount: product_discount ? product_discount : 0,
            product_feautered,
            created_at: new Date(),
          };

          if (CategoryID) {
            newProduct.categories = [CategoryID];
          }

          const product = new Product(newProduct);
          if (await product.save()) {
            return res.status(201).json({
              status: true,
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

ProductMethods.searchProductNameSupermarket = async (req, res) => {
  try {
    const { product_name } = req.body;
    if (product_name) {
      const checkProduct = await Product.find(
        { product_name: product_name },
        { _id: true }
      )
        .populate("categories")
        .populate("supermarket");
      if (checkProduct) {
        return res.status(200).json({
          status: true,
          data: checkProduct,
          message: "Se encontro este producto en este supermercado.",
        });
      }
    }
    return res.status(400).json({
      status: false,
      message: "No se encontro un producto por dicho nombre",
    });
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

ProductMethods.searchProductNameGen = async (req, res) => {
  try {
    const {
      product_name
    } = req.body;
    if(product_name){
      const checkProduct = await Product.find({product_name: product_name},{_id: true})
      .populate("categories");     
      if(checkProduct){
        return res.status(200).json({
          status: true,
          data: checkProduct,
          message: "Se encontraron estos productos",
        });
      }
    }
    return res.status(400).json({
      status: false,
      message: "No se encontro un producto por dicho nombre",
    });
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

export { ProductMethods as ProductController };
