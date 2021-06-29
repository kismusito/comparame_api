const CategoryMethods = {};
import Permission from "../Middlewares/AccessControl";
import {
    EvalueFields
} from "../helpers";
import Category from "../Models/Category";
import User from "../Models/User";
import Product from "../Models/Product";

CategoryMethods.getCategory = async (req, res) => {
  try {
    const permissions = Permission.can(req.userRol).readAny("category").granted;
    if(permissions){
      const id = req.params;
      const checkCategory = await Category.findById(id);
      if (checkCategory) {
        return res.status(201).json({
          status: true,
          data: checkCategory,
          message: "Se han encontrado la categoria.",
        });
      }
      return res.status(400).json({
        status: false,
        message: "No se han encontrado la categoria..",
      });
    }
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

CategoryMethods.getCategories = async (req, res) => {
  try {
    const permissions = Permission.can(req.userRol).readAny("category").granted;
    if(permissions){
      const categories = await Category.find();
      if(categories){
        return res.status(201).json({
          status: true,
          data: categories,
          message: "Se han encontrado las categorias.",
        });
      }
      return res.status(400).json({
        status: false,
        message: "No se encontraron categorias.",
      });
    }
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};
CategoryMethods.updateCategory = async (req, res) => {  
  try {
    const permissions = Permission.can(req.userRol).updateAny("category").granted;
    if(permissions){
      const {
        CategoryId,
        category_name
      } = req.body;
      if(CategoryId){
        const getCategory = await Category.findById(CategoryId);
        if(getCategory){
          const newCategory = getCategory.updateOne({
            category_name: category_name,
            updated_at: new Date()
          });
          if(newCategory){
            return res.status(201).json({
              status: true,
              message: "La categoria ha sido actualizada correctamente.",
            });
          }
          return res.status(405).json({
            status: false,
            message: "No se logro actualizar, porfavor intentelo nuevamente.",
          });
        }
        return res.status(400).json({
          status: false,
          message: "No se encontro la categoria.",
        });
      }
      return res.status(400).json({
        status: false,
        message: "No ingreso categoria ca cambiar.",
      });
    }
    return res.status(400).json({
      status: false,
      message: "No tienes permiso para acceder a este recurso.",
    });
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

CategoryMethods.deleteCategory = async (req, res) => {
  try {
    const permissions = Permission.can(req.userRol).deleteAny("category").granted;
    if(permissions){
      const{
        CategoryId
      } = req.body;
      if(CategoryId){
        const getCategory = await Category.findById(CategoryId);
        if(getCategory){
          const checkProductsCategory = await Product.find({categories: CategoryId},{_id: true});
          if(checkProductsCategory.length > 0){
            return res.status(400).json({
              status: false,
              message: "Esta Categoria esta actualmente en uso por los siguientes productos.",
              data: checkProductsCategory
            });
          }
          if(await getCategory.remove()){
            return res.status(201).json({
              status: true,
              message: "Se elimino correctamente la categoria"
            });
          }
          return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente."
          });
        }
        return res.status(400).json({
          status: false,
          message: "No se encontro la categoria"
        });
      }
      return res.status(400).json({
        status: false,
        message: "No se ingreso categoria"
      });
    }
    return res.status(400).json({
      status: false,
      message: "No tienes permiso para acceder a este recurso.",
    });
  }catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente."
    });
  }
};

CategoryMethods.createCategory = async (req, res) => {
  try {
    const permissions = Permission.can(req.userRol).createAny("category").granted;
    if(permissions){
      const {
        category_name
      } = req.body
      if(category_name){
        const checkNameCategory = await Category.find({category_name: category_name},{_id: true});
        if(checkNameCategory.length > 0){
          return res.status(400).json({
            status: false,
            message: "El nombre ya se encuentra en uso en una categoria.",
          });
        }
        const data = {
          category_name: category_name,
          created_at: new Date()
        };
        const newCategory = new Category(data);
        if (await newCategory.save()) {
          return res.status(201).json({
            status: true,
            data: newCategory,
            message: "Ha creado una nueva categoria satisfactoriamente.",
          });
        } else {
          return res.status(405).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
          });
        }
      }
      return res.status(400).json({
        status: false,
        message: "No ha ingresado nombre para la categoria.",
      });
    }
    return res.status(400).json({
      status: false,
      message: "No tienes permiso para acceder a este recurso.",
    });
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

/*
CategoryMethods.getUsers = async (req, res) => {
  try {
    const products = await User.find();
    if(products){
      console.log(products);
      return res.status(201).json({
        status: true,
        data: products,
        message: "Se han encontrado productos de este supermercado.",
      });
    }
    return res.status(400).json({
      status: false,
      message: "No se encontraron usuarios"
    });
  } catch (error) {
    console.log(error);
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};
*/
export { CategoryMethods as CategoryController };