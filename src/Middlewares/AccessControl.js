import AccessControl from "accesscontrol";
const ac = new AccessControl();

ac.grant("client").readAny("product");

ac.grant("supermaker").readAny("plan");

ac.grant("admin")
    .extend("supermaker")
    .createAny("plan")
    .updateAny("plan")
    .deleteAny("plan");

ac.grant("admin").createAny("rol").updateAny("rol").deleteAny("rol");

export default ac;
