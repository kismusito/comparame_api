const planMethods = {};
import Permission from "../Middlewares/AccessControl";
import { EvalueFields } from "../helpers";
import Plan from "../Models/Plan";

/**
 * Author: Juan Araque
 * Last modified: 30/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.getPlans = async (req, res) => {};

/**
 * Author: Juan Araque
 * Last modified: 30/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.getPlan = async (req, res) => {};

/**
 * Author: Juan Araque
 * Last modified: 30/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.createPlan = async (req, res) => {
    const permission = Permission.can(req.user.rol.name).readAny("plan").granted;
    if (permission) {
        const { total_featured_products, plan_price, plan_name, duration } = req.body;
        const validateFields = EvalueFields([
            {
                name: "Plan price",
                value: plan_price,
            },
            {
                name: "Plan name",
                value: plan_name,
            },
            {
                name: "Duration",
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
                        message: "Plan created successfully.",
                    });
                }
            } catch (error) {
                return res.status(405).json({
                    status: false,
                    message: "There was an error, please try again.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                errors: validateFields.errors,
                message: "The following fields has errors.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You not have permissions for access.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 30/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.updatePlan = async (req, res) => {};

/**
 * Author: Juan Araque
 * Last modified: 30/03/2021
 *
 * @param {*} req
 * @param {*} res
 */
planMethods.deletePlan = async (req, res) => {};

export { planMethods as PlanController };
