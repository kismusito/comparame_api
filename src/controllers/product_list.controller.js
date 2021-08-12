const UserListMethods = {};
import { EvalueFields } from "../helpers";
import ProductList from "../Models/User_Product_List";
import Product from "../Models/Product";

UserListMethods.getMyLists = async (req, res) => {
  const user = req.user;

  try {
    const lists = await ProductList.find({
      user: user.id,
    });
    return res.status(200).json({
      status: true,
      data: lists,
      message: "Se han encontrado listas.",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

UserListMethods.getList = async (req, res) => {
  try {
    const { id } = req.params;
    const checkList = await ProductList.findById(id).populate("products");
    if (checkList) {
      return res.status(200).json({
        status: true,
        data: checkList,
        message: "Se han encontrado la lista.",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "No se han encontrado la lista..",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

UserListMethods.createList = async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;
    const validateFields = EvalueFields([
      {
        name: "Nombre de la lista",
        value: name,
      },
    ]);
    if (validateFields.status) {
      const createdList = await ProductList.create({
        name,
        user: user.id,
      });
      await createdList.save();
      return res.status(200).json({
        status: true,
        data: createdList,
        message: "Se creado la lista.",
      });
    } else {
      return res.status(400).json({
        status: false,
        errors: validateFields.errors,
        message: "Los siguientes campos contienen errores.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

UserListMethods.addProductToList = async (req, res) => {
  try {
    const { listID, productID } = req.body;
    if (listID) {
      const checkList = await ProductList.findById(listID);
      if (checkList) {
        if (productID) {
          const checkProduct = await Product.findById(productID);
          if (checkProduct) {
            if (
              checkList.products.some(
                (product) => product.toString() === productID.toString()
              )
            ) {
              return res.status(400).json({
                status: false,
                message: "El producto ya se encuentra agregado a la lista.",
              });
            }
            await checkList.updateOne({
              products: [productID, ...checkList.products],
            });
            return res.status(200).json({
              status: true,
              message: "Se ha agregado el producto a la lista.",
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "No se encontro el producto.",
            });
          }
        } else {
          return res.status(400).json({
            status: false,
            message: "El ID del producto es requerido.",
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "No se encontro la lista.",
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "El id de la lista es requerido.",
      });
    }
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

UserListMethods.removeProductToList = async (req, res) => {
  try {
    const { listID, productID } = req.body;
    if (listID) {
      const checkList = await ProductList.findById(listID);
      if (checkList) {
        if (productID) {
          const checkProduct = await Product.findById(productID);
          if (checkProduct) {
            if (
              !checkList.products.some(
                (product) => product.toString() === productID.toString()
              )
            ) {
              return res.status(400).json({
                status: false,
                message: "El producto no se encuentra asociado a la lista.",
              });
            }
            const filterProducts = checkList.products.filter(
              (product) => product.toString() !== productID.toString()
            );
            await checkList.updateOne({
              products: filterProducts,
            });
            return res.status(200).json({
              status: true,
              message: "Se ha eliminado el producto a la lista.",
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "No se encontro el producto.",
            });
          }
        } else {
          return res.status(400).json({
            status: false,
            message: "El ID del producto es requerido.",
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "No se encontro la lista.",
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "El id de la lista es requerido.",
      });
    }
  } catch (error) {
    return res.status(405).json({
      status: false,
      message: "Ha ocurrido un error, por favor intentalo nuevamente.",
    });
  }
};

export { UserListMethods as UserListController };
