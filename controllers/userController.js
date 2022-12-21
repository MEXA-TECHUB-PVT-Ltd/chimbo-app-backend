
import Users from "../models/userModel.js";
import mongoose from "mongoose"
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import { hash, check } from "../utils/crypt.js";
import bcrypt from "bcrypt"
const { hashSync } = bcrypt
import { config } from "dotenv";
import { sendEmail, UniqueKey } from "../utils/emailSender.js";
import otpModel from "../models/otpModel.js";
import emailOTPBody from "../utils/emailOtp.js";
import genderModel from "../models/genderModel.js";
config();

//Login
export const login = catchAsync(async (req, res, next) => {
    //     const { email, password } = req.body;

    //     const user = await Users.findOne({ email });
    //     if (!user) return res.status(400).json({
    //         success: false,
    //         status: 400,
    //         message: "Incorrect Email"
    //     })

    //     // if (!check(password, user.password))
    //     if (!bcrypt.compareSync(password, user.password)){
    // console.log('data')
    //     }else{
    //         console.log(' no data')

    //     }
    //         return res.status(400).json({
    //             success: false,
    //             status: 400,
    //             message: "Incorrect Password"
    //         });

    //     const token = jwt.sign(
    //         { id: user._id, email: user.email, role: "USER" },
    //         process.env.JWT_SECRET,
    //         { expiresIn: "700h" }
    //     );

    //     return res.json({
    //         success: true,
    //         status: 200,
    //         message: "User logged in successfully",
    //         user: {
    //             id: user._id,
    //             email: user.email,
    //             name: user.name,
    //             token,
    //         },
    //     });

    // const {email,password}= req.body
    const findUser = {
        email: req.body.email
    }
    Users.findOne(findUser, (error, result) => {
        if (error) {
            res.json(error)
        } else {
            if (result) {
                console.log(result)
                if (result.loginType === 'gmail' || result.loginType === 'fb') {
                    if (req.body.password===result.password) {
                        console.log('trye')
                        res.json({
                            success: true,
                            status: 200,
                            message: "User logged in successfully",
                            user: {
                                id: result._id,
                                email: result.email,
                                name: result.name,
                                // token,
                            },
                        });
                    } else {
                        res.json({ message: "Invalid Password" })

                    }
                } else {
                    if (bcrypt.compareSync(req.body.password, result.password)) {
                        res.json({
                            success: true,
                            status: 200,
                            message: "User logged in successfully",
                            user: {
                                id: result._id,
                                email: result.email,
                                name: result.name,
                                // token,
                            },
                        });

                    } else {
                        res.json({ message: "Invalid Password" })
                    }
                }
                // if (bcrypt.compareSync(req.body.password, result.password)) {
                //     res.json({
                //                 success: true,
                //                 status: 200,
                //                 message: "User logged in successfully",
                //                 user: {
                //                     id: user._id,
                //                     email: user.email,
                //                     name: user.name,
                //                     token,
                //                 },
                //             });

                // } else {
                //     res.json({message:"Invalid Password"})
                // }
            } else {
                res.json({ message: "Email Not Found" })
            }
        }
    })

});

//Add
export const add = catchAsync(async (req, res, next) => {
    const isEmailUnique = await checkEmail(req.body.email);
    if (!isEmailUnique) return res.json({
        success: false,
        status: 400,
        message: "Email already exists"
    })

    const userData = JSON.parse(JSON.stringify(req.body))
    console.log(userData.loginType)
    if (userData.loginType === 'gmail' || userData.loginType === 'fb') {
        console.log('matched')

        const user = await Users.create(userData);
        if (!user) {
            return res.json({
                success: false,
                status: 500,
                message: "User could not be added"
            })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username, role: "USER" },
            process.env.JWT_SECRET,
            { expiresIn: "700h" }
        );

        return res.json({
            success: true,
            status: 200,
            message: "User signed up successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                // name: `${user.firstName} ${user.lastName}`,
                token,
            },
        });
    } else {
        console.log('matched ddd')
        userData.password = hashSync(userData.password, 10)

        const user = await Users.create(userData);
        if (!user) {
            return res.json({
                success: false,
                status: 500,
                message: "User could not be added"
            })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username, role: "USER" },
            process.env.JWT_SECRET,
            { expiresIn: "700h" }
        );

        return res.json({
            success: true,
            status: 200,
            message: "User signed up successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                // name: `${user.firstName} ${user.lastName}`,
                token,
            },
        });
    }


    // userData.password = hashSync(userData.password, 10)

    // const user = await Users.create(userData);
    // if (!user) {
    //     return res.json({
    //         success: false,
    //         status: 500,
    //         message: "User could not be added"
    //     })
    // }

    // const token = jwt.sign(
    //     { id: user._id, email: user.email, username: user.username, role: "USER" },
    //     process.env.JWT_SECRET,
    //     { expiresIn: "700h" }
    // );

    // return res.json({
    //     success: true,
    //     status: 200,
    //     message: "User signed up successfully",
    //     user: {
    //         id: user._id,
    //         email: user.email,
    //         name: user.name,
    //         // name: `${user.firstName} ${user.lastName}`,
    //         token,
    //     },
    // });
});

const updateUser = async (id, user) => {
    let updatedUser = null;
    const result = await Users.findByIdAndUpdate(id, user, { new: true });
    if (result) updatedUser = await getUser({ _id: result._id });
    return updatedUser;
};

//Update updateUserData
export const updateUserData = async (req, res) => {
    console.log(req.body.name)
    const updateData = {
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        address: req.body.address,
        pfp: req.body.pfp,
        description: req.body.description,

    }
    const options = {
        new: true
    }
    Users.findByIdAndUpdate(req.body._id, updateData, options, (error, result) => {
        if (error) {
            res.json(error.message)
        } else {
            res.send({ data: result, message: "Updated Successfully" })
        }
    })
}
export const update = async (req, res) => {
    // const existing = await Users.findOne({ _id: req.body.id });
    // if (!existing) return res.json({
    //     success: false,
    //     message: "User not found"
    // })

    // const { id, email } = req.body;
    // if (email) {
    //     if (email !== existing.email) {
    //         const isEmailUnique = await checkEmail(email);
    //         if (!isEmailUnique) return res.json({
    //             success: false,
    //             message: "Email already exists"
    //         })
    //     }
    // }

    // const data = JSON.parse(JSON.stringify(req.body));

    // if (data.password) {
    //     delete data.password
    // }

    // const user = await updateUser(id, data);

    // if (user) {
    //     return res.json({
    //         success: true,
    //         message: "User updated successfully",
    //         user,
    //     });
    // }

    // return res.json({
    //     success: false,
    //     message: "User could not be updated",
    // });

    // const updateData = {
    //     name:req.body.name,
    //     genderId:req.body.genderId,
    //     phoneNo:req.body.phoneNo,
    //     address:req.body.address,
    //     pfp: req.body.pfp,
    //     description: req.body.description

    // }
    // const options = {
    //     new: true
    // }
    // Users.findByIdAndUpdate(req.body.id, updateData, options, (error, result) => {
    if (error) {
        res.json(error.message)
    } else {
        res.send({ data: result, message: "Updated Successfully" })
    }
    // })
}
// end 
//Get All
export const getAll = async (_, res) => {
    const users = await Users.find();
    if (users.length > 0) {
        return res.json({
            success: true,
            status: 200,
            message: "Users found",
            users,
        });
    }
    return res.json({
        success: false,
        status: 404,
        message: "Users not found"
    })
};

//Get One
export const get = catchAsync(async (req, res, next) => {
    const user = await getUser({
        _id: mongoose.Types.ObjectId(req.params.id)
    });
    if (!user) return res.json({
        success: false,
        status: 404,
        message: "User not found"
    })
    const gender = await genderModel.findOne({ _id: user.genderId });
    if (gender) {
        user.gender = gender.name;
    }
    return res.json({
        success: true,
        status: 200,
        message: "User found",
        user,
    });
});

//Delete
export const del = catchAsync(async (req, res, next) => {
    const existing = await Users.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 200,
            message: "User not found"
        })
    }

    const deletedUser = await Users.findOneAndDelete({ _id: req.params.id });
    if (!deletedUser) return res.json({
        success: false,
        status: 404,
        message: "User not found"
    })

    return res.json({
        success: true,
        status: 200,
        message: "User deleted successfully",
        user: deletedUser,
    });
});

export const block = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const existing = await Users.findOne({ _id: req.body.id });
    if (!existing) return res.json({
        success: false,
        status: 404,
        message: "User not found"
    })
    if (existing.isBlocked) return res.json({
        success: false,
        status: 400,
        message: "User already blocked"
    })

    const blockedUser = await updateUser(req.body.id, { isBlocked: true });
    if (!blockedUser) return res.json({
        success: false,
        status: 400,
        message: "User could not be blocked"
    })

    res.json({
        success: true,
        status: 200,
        message: "User blocked successfully",
        user: blockedUser,
    });
});

export const unblock = catchAsync(async (req, res, next) => {
    const existing = await Users.findOne({ _id: req.body.id });
    if (!existing) return res.json({
        success: false,
        status: 404,
        message: "User not found"
    })
    if (!existing.isBlocked)
        return res.json({
            success: false,
            status: 400,
            message: "User already unblocked"
        })

    const user = await updateUser(req.body.id, { isBlocked: false });
    if (!user) return res.json({
        success: false,
        status: 400,
        message: "User could not be unblocked"
    })

    res.json({
        success: true,
        status: 200,
        message: "User unblocked successfully",
        user,
    });
});

export const updatePassword = catchAsync(async (req, res, next) => {
    const existing = await Users.findOne({ _id: req.body.id });
    if (!existing) return res.json({
        success: false,
        status: 404,
        message: "User not found"
    })

    console.log(req.body.newPassword);

    const user = await Users.findByIdAndUpdate(req.body.id, {
        password: hashSync(req.body.newPassword, 10),
    }, { new: true });

    if (!user) return res.json({
        success: false,
        status: 400,
        message: "Password could not be updated"
    })

    res.json({
        success: true,
        status: 200,
        message: "Password updated successfully",
        user,
    });
});

export const uploadPfp = catchAsync(async (req, res) => {
    if (!req.file) res.json({
        success: false,
        message: "Profile Picture not uploaded."
    });

    const pfp = req.file.path;
    res.json({ success: true, message: "Profile Picture Uploaded", pfp });
})

async function checkEmail(email) {
    let result = await Users.find({ email });
    return !result.length;
}

async function getUsers(query = null) {
    let users = [];
    if (query) {
        users = await Users.aggregate(
            [
                {
                    $match: { ...query },
                },
            ]
        )
    } else users = await Users.find()

    return users;
}

async function getUser(query) {
    const users = await getUsers(query);
    return users[0];
}

export const getByEmail = catchAsync(async (req, res, next) => {


    const user = await getUser({
        email: req.body.email,
        isBlocked: false,
    });
    if (!user) return res.json({
        success: false,
        status: 404,
        message: "User not found"
    })

    const otp = UniqueKey();

    await otpModel.create({ userId: user._id, otp: otp });
    const style = emailOTPBody(otp, "Chimmbo")
    await sendEmail(user.email, style, "Forgot Password")

    return res.json({
        success: true,
        status: 200,
        message: `Verification Email Sent to ${user.email}`,
        user,
    });
});


export const verifyOtp = catchAsync(async (req, res, next) => {




    const data = await otpModel.findOne({ userId: req.body.userId, otp: req.body.otp })
    // const user = await getUser({
    //     email: req.body.email,
    //     isBlocked: false,
    // });
    if (!data) return res.json({
        success: false,
        status: 404,
        message: "Invalid Code Entered"
    })

    // const otp = UniqueKey();

    await otpModel.deleteOne({ _id: data._id });


    return res.json({
        success: true,
        status: 200,
        message: `Otp Verified`,

    });
});


export const changePassword = catchAsync(async (req, res, next) => {


    const data = await Users.findOne({ _id: req.body.userId })
    // const user = await getUser({
    //     email: req.body.email,
    //     isBlocked: false,
    // });
    if (!data) return res.json({
        success: false,
        status: 404,
        message: "User Not Found"
    })

    // const otp = UniqueKey();
    const newPassword = hashSync(req.body.newPassword, 10)
    data.password = newPassword;
    // await otpModel.deleteOne({ _id: data._id });
    await data.save();

    return res.json({
        success: true,
        status: 200,
        message: `Password Changed`,

    });
});