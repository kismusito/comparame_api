import AccessControl from "accesscontrol";
const ac = new AccessControl();

ac.grant("client").readAny("product");

ac.grant("client").readOwn("profile").updateOwn("profile");

ac.grant("supermaker").extend("client").readAny("plan");

ac.grant("supermaker")
    .readOwn("product")
    .createOwn("product")
    .updateOwn("product")
    .deleteOwn("product");

ac.grant("admin")
    .extend("supermaker")
    .createAny("plan")
    .updateAny("plan")
    .deleteAny("plan");

ac.grant("admin").createAny("rol").updateAny("rol").deleteAny("rol");

export default ac;
