import AccessControl from "accesscontrol";
const ac = new AccessControl();

ac.grant("client")
    .readAny("product")
    .createOwn("supermarket")
    .readOwn("favoriteProduct")
    .createOwn("favoriteProduct")
    .deleteOwn("favoriteProduct");

ac.grant("client").readOwn("profile").updateOwn("profile");

ac.grant("supermarket").extend("client").readAny("plan");

ac.grant("supermarket")
    .readOwn("product")
    .createOwn("product")
    .updateOwn("product")
    .deleteOwn("product");

ac.grant("supermarket")
    .createOwn("headsquare")
    .updateOwn("headsquare")
    .updateOwn("supermarket")
    .deleteOwn("headsquare");

ac.grant("admin")
    .extend("supermarket")
    .createAny("plan")
    .updateAny("plan")
    .deleteAny("plan");

ac.grant("admin").createAny("rol").updateAny("rol").deleteAny("rol");

export default ac;
