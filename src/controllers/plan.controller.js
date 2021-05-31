const planMethods = {};
import Permission from "../Middlewares/AccessControl";
import {
    EvalueFields
} from "../helpers";
import Plan from "../Models/Plan";
import Supermarket from "../Models/Supermarket";

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.getPlans = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).readAny("plan").granted;
    if (permission) {
        try {
            return res.status(200).json({
                status: true,
                data: await Plan.find(),
                message: "Planes disponibles",
            });
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

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.getPlan = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).readAny("plan").granted;
    if (permission) {
        try {
            const {
                planID
            } = req.body;
            if (planID) {
                const findPlan = await Plan.findById(planID);
                if (findPlan) {
                    return res.status(200).json({
                        status: true,
                        data: findPlan,
                        message: "Plan encontrado",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado ningun plan con este ID.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id del plan es requerido.",
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

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.createPlan = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).createAny("plan").granted;
    if (permission) {
        const {
            total_featured_products,
            plan_price,
            plan_name,
            duration,
        } = req.body;
        const validateFields = EvalueFields([
            {
                name: "Productos destacados",
                value: total_featured_products,
            },
            {
                name: "Plan price",
                value: plan_price,
            },
            {
                name: "Nombre del plan",
                value: plan_name,
            },
            {
                name: "Duración",
                value: duration,
            },
        ]);
        if (validateFields.status) {
            try {
                const findPlanName = await Plan.find({
                    plan_name: plan_name
                });
                if (findPlanName) {
                    return res.status(400).json({
                        status: false,
                        message: "El Nombre del Plan ya esta en uso.",
                    });
                }

                const plan = new Plan({
                    plan_total_featured_projects: total_featured_products,
                    plan_price,
                    plan_name,
                    duration,
                });

                if (await plan.save()) {
                    return res.status(201).json({
                        status: true,
                        plan,
                        message: "El plan ha sido creado correctamente.",
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
                errors: validateFields.errors,
                message: "Los siguientes campos contienen errores.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};
planMethods.updatePlan = async (req, res) => {
    try {
        const permissions = Permission.can(req.user.rol.name).updateAny("plan").granted
        if (permissions) {
            const {
                PlanId,
                plan_total_featured_projects,
                plan_price,
                plan_name,
                duration
            } = req.body;

            if (PlanId) {
                const checkPlan = await Plan.findById(PlanId);
                if (checkPlan) {
                    if(checkPlan.plan_name != plan_name){
                        const checkPlanName = await Plan.find({
                            plan_name: plan_name
                        });
                        if (checkPlanName) {
                            return res.status(400).json({
                                status: false,
                                message: "El Nombre del plan ya esta en uso.",
                            });
                        }
                    }                    
                    
                    const newPlan = await checkPlan.updateOne({
                        plan_total_featured_projects,
                        plan_price,
                        plan_name,
                        duration
                    });
                    if (newPlan) {
                        return res.status(201).json({
                            status: true,
                            message: "El Plan ha sido actualizado correctamente.",
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
                        message: "No se ah encontrado el Plan al que se desea hacer el cambio.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No ah ingresado un Plan.",
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

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.deletePlan = async (req, res) => {
    try {
        const permissions = Permission.can(req.user.rol.name).deleteAny("plan").granted
        if (permissions) {
            const {
                PlanId
            } = req.body;
            if (PlanId) {
                const getPlan = await Plan.findById(PlanId);
                if (getPlan) {
                    const checkPlanInUser = await Supermarket.find({
                        plans: PlanId
                    }, {
                        _id: true
                    });
                    if (checkPlanInUser.length > 0) {
                        return res.status(400).json({
                            status: false,
                            message: "Este Plan actualmente esta en uso por uno o mas supermercados, no puedes eliminarlo.",
                        });
                    }
                    if (await getPlan.remove()) {
                        return res.status(200).json({
                            status: true,
                            message: "El Plan ha sido eliminado correctamente.",
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
                        message: "El Plan no ha sido encontrado.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El id del Plan es requerido.",
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

export {
    planMethods as PlanController
};