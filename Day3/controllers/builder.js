const Builder = require("../model/builder");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = (req, res) => {
    const { name, email, password, dob, certificateNo } = req.body;
    if (!name || !email || !password || !dob || !certificateNo) {
        return res.status(400).json({ message: "please enter all fieds" });
    }
    Builder.findOne({ email: email }).then((builder) => {
        if (builder) {
            return res.status(400).json({ message: "builer already exist" });
        } else {
            //create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    const newBuilder = new Builder({
                        name: name,
                        email: email,
                        password: hash,
                        dob: dob,
                        certificateNo: certificateNo
                    });
                    newBuilder
                        .save()
                        .then((builder) => {
                            // console.log(builder);
                            return res.status(201).json({ message: "Builder saved successfully." });
                        })
                        .catch((error) => {
                            return res.status(500).json({ message: error.message });
                        });
                });
            });
        }
    });
};

module.exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all the fields." });
    }
    Builder.findOne({ email: email }).then((builder) => {
        if (!builder) {
            return res.status(400).json({ message: "User does not exist." });
        }
        //password validation
        bcrypt.compare(password, builder.password).then((isMatch) => {
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password." });
            }
            jwt.sign(
                { id: builder._id },
                process.env.JWT_KEY,
                {
                    /*expiresIn: 3600*/
                },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    return res
                        .status(200)
                        .json({ token: token, builder: { id: builder._id, name: builder.name, email: builder.email } }); //remove user later
                }
            );
        });
    });
};