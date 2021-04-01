const User = require("../Models/User");
const jwt = require("jsonwebtoken");

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.Email })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "User not found",
                });
            }
            bcrypt.compare(
                req.body.Password,
                user[0].Password,
                (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Incorrect Password",
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user[0].Email,
                                username: user[0].Username,
                            },
                            process.env.PRIVATE_KEY,
                            {
                                expiresIn: "1h",
                            }
                        );
                        return res.status(200).json({
                            message: "Welcome",
                            token: token,
                        });
                    }
                    res.status(401).json({
                        message: "Auth failed",
                    });
                }
            );
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};
