const planMethods = {};
import Permission from "../Middlewares/AccessControl";
import { EvalueFields } from "../helpers";
import Plan from "../Models/Plan";

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.getPlans = async (req, res) => {
    const permission = Permission.can(req.userRol).readAny("plan").granted;
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
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.getPlan = async (req, res) => {
    const permission = Permission.can(req.userRol).readAny("plan").granted;
    if (permission) {
        try {
            const { planID } = req.body;
            if (planID) {
                const findPlan = await Plan.findById(planID);
                if (findPlan) {
                    return res.status(200).json({
                        status: true,
                        data: findPlan,
                        message: "Se ha encontrado el plan.",
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
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.createPlan = async (req, res) => {
    const permission = Permission.can(req.userRol).createAny("plan").granted;
    if (permission) {
        const {
            total_featured_products,
            plan_price,
            plan_name,
            duration,
        } = req.body;
        const validateFields = EvalueFields([
            {
                name: "Precio",
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
                const plan = new Plan({
                    plan_price,
                    plan_name,
                    duration,
                });

                if (total_featured_products) {
                    plan.plan_total_featured_projects = total_featured_products;
                }

                if (await plan.save()) {
                    return res.status(201).json({
                        status: false,
                        plan,
                        message: "El plan ha sido creado correctamente.",
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

/**
 * Author: Juan Araque
 * Last modified: 06/04/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.updatePlan = async (req, res) => {
    const permission = Permission.can(req.userRol).updateAny("plan").granted;
    if (permission) {
        const {
            planID,
            total_featured_products,
            plan_price,
            plan_name,
            duration,
        } = req.body;
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
planMethods.deletePlan = async (req, res) => {
    const permission = Permission.can(req.userRol).deleteAny("plan").granted;
    if (permission) {
        const {planID} = req.body
    } else {
        return res.status(400).json({
            status: false,
            message: "No tienes permiso para acceder a este recurso.",
        });
    }
};

export { planMethods as PlanController };
