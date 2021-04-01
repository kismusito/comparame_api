const User = require("../Models/User");

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.Email })
        .exec()
        .then((user) => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail already exists",
                });
            } else {
                User.find({ username: req.body.Username })
                    .exec()
                    .then((user) => {
                        if (user.length >= 1) {
                            return res.status(409).json({
                                message: "Username already exists",
                            });
                        } else {
                            var Correct = Array(3);
                            var counter = 1;
                            if (req.body.Email.includes("@")) {
                                Correct[0] = 1;
                            } else {
                                Correct[0] = 0;
                            }
                            if (req.body.Email.includes(".com")) {
                                Correct[1] = 1;
                            } else {
                                Correct[1] = 0;
                            }
                            if (!req.body.Email.includes(" ")) {
                                Correct[2] = 1;
                            } else {
                                Correct[2] = 0;
                            }
                            if (
                                req.body.Username.length >= 4 ||
                                req.body.Username.length > 25
                            ) {
                                Correct[0] = 1;
                            } else {
                                Correct[0] = 0;
                            }
                            Correct.forEach((element) => {
                                counter = counter * element;
                            });
                            if (counter != 0) {
                                bcrypt.hash(
                                    req.body.password,
                                    10,
                                    (err, hash) => {
                                        if (err) {
                                            return res.status(500).json({
                                                error: err,
                                            });
                                        } else {
                                            const user = new User({
                                                rols: req.body.Rol,
                                                username: req.body.Username,
                                                email: req.body.Email,
                                                name: req.body.Name,
                                                lastname: req.body.Lastname,
                                                password: hash,
                                            });
                                            user.save()
                                                .then((result) => {
                                                    console.log(result);
                                                    res.status(201).json({
                                                        message: "User created",
                                                        // Imagino que aqui va el Token que se envia, pero no se como mandarlo
                                                    });
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    res.status(500).json({
                                                        error: err,
                                                    });
                                                });
                                        }
                                    }
                                );
                            } else {
                                return res.status(400).json({
                                    message: "Invalid Data",
                                });
                            }
                        }
                    });
            }
        });
};
