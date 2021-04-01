export const EvalueFields = (fields) => {
    let errors = [];
    fields.forEach((field) => {
        if (field["value"]) {
            switch (typeof field["value"]) {
                case "string":
                    if (field["value"].length < 1) {
                        errors.push(field["name"]);
                    }
                    break;
                default:
                    break;
            }
        } else {
            errors.push(field["name"]);
        }
    });

    if (errors.length > 0) {
        return {
            status: false,
            errors,
        };
    }

    return {
        status: true,
    };
};
