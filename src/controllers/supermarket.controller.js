import { EvalueFields, convertToJson } from "../helpers";
import AccessControl from "../Middlewares/AccessControl";
import Supermarket from "../Models/Supermarket";
import Product from "../Models/Product";
import { Types } from "mongoose";
const supermarketMethods = {};
import fs from "fs";
import Plan from "../Models/Plan";

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
          message: "Ha ocurrido un error, por favor intentalo nuevamente.",
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
 * Last modified: 25/06/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarketMethods.getSupermarketProducts = async (req, res) => {
  const { supermarketID } = req.params;
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

  if (supermarketID) {
    try {
      const products = await Product.find({
        supermarket: supermarketID,
        ...filters,
      });
      return res.status(200).json({
        status: true,
        products,
        message: "Products found",
      });
    } catch (error) {
      return {
        status: false,
        message: "Id invalido",
      };
    }
  } else {
    return res.status(400).json({
      status: false,
      message: "El Id del supermercado es requerido",
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
              supermarketItem._id.toString() === headsquareID.toString()
          );
          if (supermarketHeadsquare) {
            return res.status(200).json({
              status: true,
              data: {
                headsquare: supermarketHeadsquare,
              },
              message: "Se ha encontrado la sede del supermercado.",
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "No se ha encontrado la sede del supermercado.",
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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Author: Juan Araque
 * Last modified: 25/06/2021
 *
 * @param {*} req
 * @param {*} res
 */
supermarketMethods.getSupermarketHeadsquareByGeoLocation = async (req, res) => {
  try {
    const { supermarketID } = req.params;
    const { lon, lat, distance } = req.query;
    if (!lon && !lat && !distance) {
      return res.status(400).json({
        status: false,
        message: "La longitud, latitud y distancia son requeridos.",
      });
    }
    if (supermarketID) {
      const supermarket = await Supermarket.findById(supermarketID);
      if (supermarket) {
        const supermarketHeadsquare = supermarket.headsquares.filter(
          (supermarketItem) => {
            const distanceHeadsquare = getDistanceFromLatLonInKm(
              lon,
              lat,
              supermarketItem.headsquareLocation.longitude,
              supermarketItem.headsquareLocation.latitude
            );
            if (distanceHeadsquare < Number(distance)) {
              return supermarketItem;
            }
          }
        );
        if (supermarketHeadsquare) {
          return res.status(200).json({
            status: true,
            data: {
              headsquare: supermarketHeadsquare,
            },
            message: "Se ha encontrado la sede del supermercado.",
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "No se ha encontrado la sede del supermercado.",
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
  const permission = AccessControl.can(req.userRol).createOwn(
    "headsquare"
  ).granted;
  if (permission) {
    try {
      const { supermarketID, headsquareName, headsquareLocation } = req.body;
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
              const supermarket = await Supermarket.findById(supermarketID);
              if (supermarket) {
                if (supermarket.userID.toString() === req.user._id.toString()) {
                  const headSquareInfo = {
                    _id: Types.ObjectId(),
                    headsquareName,
                    headsquareLocation: locationConvert,
                  };

                  if (req.file) {
                    headSquareInfo.headSquareImage = {
                      path: "/assets/uploads/supermarket/headsquares/",
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
                    message: "La sede se ha registrado correctamente.",
                  });
                } else {
                  if (req.file) {
                    fs.unlinkSync(req.file.path);
                  }
                  return res.status(400).json({
                    status: false,
                    message: "No tienes acceso a este supermercado.",
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
                errors: validateFieldsLocation.errors,
                message: "Los siguientes campos contienen errores.",
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
        message: "Ha ocurrido un error, por favor intentalo nuevamente.",
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
  const permission = AccessControl.can(req.userRol).updateOwn(
    "supermarket"
  ).granted;
  if (permission) {
    try {
      const { supermarketID, supermarketName } = req.body;
      if (supermarketID) {
        const supermarket = await Supermarket.findById(supermarketID);
        if (supermarket) {
          if (supermarket.userID.toString() === req.user._id.toString()) {
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
                message: "Se ha actualizado correctamente el supermercado.",
              });
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
              message: "No tienes permiso para editar este supermercado.",
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
        message: "Ha ocurrido un error, por favor intentalo nuevamente.",
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
  const permission = AccessControl.can(req.userRol).updateOwn(
    "headsquare"
  ).granted;
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
          if (supermarket.userID.toString() === req.user._id.toString()) {
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
                    headsquareItem._id.toString() === headsquareID.toString()
                );
                if (getHeadSquare) {
                  getHeadSquare.headsquareName = headsquareName;

                  if (headsquareLocation) {
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
                      if (validateFieldsLocation) {
                        getHeadSquare.headsquareLocation = locationConvert;
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
                        message: "La ubicación no tiene un formato valido.",
                      });
                    }
                  }

                  if (req.file) {
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
                    getHeadSquare.headSquareImage = {
                      path: "/assets/uploads/supermarket/headsquares/",
                      name: req.file.filename,
                    };
                  }

                  await supermarket.updateOne({
                    headsquares: supermarket.headsquares,
                  });
                  return res.status(200).json({
                    status: true,
                    message: "Se ha actualizado correctamente la sede.",
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
                  message: "Los siguientes campos contienen errores.",
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
              message: "No tienes permiso para editar este supermercado.",
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
        message: "Ha ocurrido un error, por favor intentalo nuevamente.",
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
  const permission = AccessControl.can(req.userRol).deleteOwn(
    "headsquare"
  ).granted;
  if (permission) {
    try {
      const { supermarketID, headsquareID } = req.body;
      if (supermarketID) {
        const supermarket = await Supermarket.findById(supermarketID);
        if (supermarket) {
          if (supermarket.userID.toString() === req.user._id.toString()) {
            if (headsquareID) {
              const getHeadSquare = supermarket.headsquares.find(
                (headsquareItem) =>
                  headsquareItem._id.toString() === headsquareID.toString()
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

                const deleteHeadSquareFromSupermarket =
                  supermarket.headsquares.filter(
                    (headsquareItem) =>
                      headsquareItem._id.toString() !== headsquareID.toString()
                  );

                await supermarket.updateOne({
                  headsquares: deleteHeadSquareFromSupermarket,
                });
                return res.status(200).json({
                  status: true,
                  message: "Se ha eliminado correctamente la sede.",
                });
              } else {
                return res.status(400).json({
                  status: false,
                  message: "Esta sede no pertenece a el supermercado.",
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
              message: "No tienes permiso para editar este supermercado.",
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
        message: "Ha ocurrido un error, por favor intentalo nuevamente.",
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
                const plan = await Plan.findById(planID);
                const supermarket = await Supermarket.findById(supermarketID);
                if(supermarket.plans != planID){
                    //Pedir confirmacion cambio de plan. ( de ser asi continuar con lo de abajo)
                    const cantProductsFeatured = Product.count({ supermarket: supermarketID, product_feautered: true });
                    const cantMaxPlan = plan.plan_total_featured_projects;
                    if(cantProductsFeatured > cantMaxPlan){
                        return res.status(400).json({
                            status: false,
                            message: "No puede comprar este plan. Los productos destacados actuales sobrepasan el numero maximo admitido por el plan que desea comprar",
                        }); 
                    }
                    const UptadedPlan = await supermarket.updateOne({
                        plans: [{
                            plan : planID,
                            start_date: new Date()
                        }],                        
                        updated_at: new Date(),
                    })
                    if (UptadedPlan) {
                        //mandarlo a seleccionar nuevos productos destacados
                        return res.status(201).json({
                            status: true,
                            message:
                                "El Plan ha sido comprado correctamente.",
                        });
                    } else {
                        return res.status(405).json({
                            status: false,
                            message: "Ha ocurrido un error, por favor intentelo nuevamente.",
                        });
                    }
                }else{
                    /*
                    Decirle al cliente que ya tiene comprado y activo dicho plan
                    No se si optar por:
                        1. Directamente negarle la compra hasta que se le
                         acabe la duracion del plan actual que tiene.
                        2. de alguna forma dejar que el cliente compre el plan,
                        y que cuando se le acabe la duracion del que tiene activo
                        se le active directamente el que acaba de comprar.                    
                    */
          return res.status(400).json({
            status: false,
            message: "No puede comprar este plan.",
          });
        }
      }
    } catch (error) {
      return res.status(405).json({
        status: false,
        message: "Ha ocurrido un error, por favor intentalo nuevamente.",
      });
    }
  }
};

export { supermarketMethods as SupermarketController };
