import Admins from "../models/adminModel.js";
import catchAsync from "../utils/catchAsync.js";

import jwt from "jsonwebtoken";
import { hash, check } from "../utils/crypt.js";
import { config } from "dotenv";
import bcrypt from "bcrypt"
const { hashSync } = bcrypt
config();

import { sendEmail, UniqueKey } from "../utils/emailSender.js";
import otpModel from "../models/otpModel.js";
import emailOTPBody from "../utils/emailOtp.js";

export const add = catchAsync(async (req, res, next) => {
    const existing = await Admins.findOne({ email: req.body.email });
    if (existing) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Email already exists"
        })
    }

    const { password: pass } = req.body;
    console.log(req.body);

    const password = hash(pass);

    const admin = await Admins.create({ ...req.body, password });
    if (!admin) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Admin could not be added"
        })
    } else {
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Admin added successfully",
            admin,
        });
    }
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const admin = await Admins.findOne({ email });
    if (!admin) return res.status(400).json({
        success: false,
        status: 400,
        message: "Incorrect Email"
    })
    if (!check(password, admin.password))
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Incorrect Password"
        })

    const token = jwt.sign(
        { id: admin._id, email: admin.email, role: "ADMIN" },
        process.env.JWT_SECRET,
        { expiresIn: "700h" }
    );

    return res.json({
        success: true,
        status: 200,
        message: "Admin logged in successfully",
        admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            token,
        },
    });
});

export const updatePassword = catchAsync(async (req, res, next) => {

    const { id, prevPassword, password } = req.body;

    const existing = await Admins.findOne({ _id: id });
    if (!existing) return res.json({
        success: false,
        status: 404,
        message: "Admin not found"
    })

    if (prevPassword) {
        if (!check(password, existing.password))
            return res.json({
                success: false,
                status: 400,
                message: "Provided Old Password is Incorrect"
            })
    }

    const admin = await Admins.findByIdAndUpdate(
        id,
        {
            password: hash(password),
        },
        { new: true }
    );

    if (!admin) {
        return res.json({
            success: false,
            status: 500,
            message: "Password could not be added"
        })
    }

    res.json({
        success: true,
        status: 200,
        message: "Password updated successfully",
        admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
        },
    });
});


export const getByEmail = catchAsync(async (req, res, next) => {


    const admin = await Admins.findOne({
        email: req.body.email,

    });
    if (!admin) return res.status(404).json({
        success: false,
        status: 404,
        message: "Email not found"
    })

    const otp = UniqueKey();

    await otpModel.create({ userId: admin._id, otp: otp });
    const style = emailOTPBody(otp, "Chimmbo")
    await sendEmail(admin.email, style, "Forgot Password")

    return res.status(200).json({
        success: true,
        status: 200,
        message: `Verification Email Sent to ${admin.email}`,
        admin,
    });
});


export const verifyOtp = catchAsync(async (req, res, next) => {

    console.log(req.body);


    const data = await otpModel.findOne({ userId: req.body.adminId, otp: req.body.otp })
    // const user = await getUser({
    //     email: req.body.email,
    //     isBlocked: false,
    // });
    if (!data) return res.status(404).json({
        success: false,
        status: 404,
        message: "Invalid Code Entered"
    })

    // const otp = UniqueKey();

    await otpModel.deleteOne({ _id: data._id });


    return res.status(200).json({
        success: true,
        status: 200,
        message: `Otp Verified`,

    });
});


export const changePassword = catchAsync(async (req, res, next) => {


    const data = await Admins.findOne({ _id: req.body.adminId })
    // const user = await getUser({
    //     email: req.body.email,
    //     isBlocked: false,
    // });
    if (!data) return res.status(404).json({
        success: false,
        status: 404,
        message: "Admin Not Found"
    })

    // const otp = UniqueKey();
    const newPassword = hashSync(req.body.newPassword, 10)
    data.password = newPassword;
    // await otpModel.deleteOne({ _id: data._id });
    await data.save();

    return res.status(200).json({
        success: true,
        status: 200,
        message: `Password Changed`,

    });
});
export const uploadPfp = catchAsync(async (req, res) => {
    console.log(req.file);
    if (!req.file) res.status(500).json({
        success: false,
        message: "Profile Picture not uploaded."
    });

    const pfp = req.file.path;

    res.status(200).json({ success: true, message: "Profile Picture Uploaded", pfp });

})

export const getByID = catchAsync(async (req, res, next) => {


    const admin = await Admins.findOne({
        _id: req.params.id,

    });
    if (!admin) return res.status(404).json({
        success: false,
        status: 404,
        message: "Admin not found"
    })

    return res.status(200).json({
        success: true,
        status: 200,
        message: `Found`,
        admin,
    });
});

export const update = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const existing = await Admins.findOne({ _id: req.body.id });
    console.log(existing);
    if (!existing) return res.status(404).json({
        success: false,
        message: "Admin not found"
    })

    const { id, email } = req.body;
    if (email) {
        if (email !== existing.email) {
            const admin = await Admins.findOne({
                email: req.body.email,

            });
            if (admin) return res.status(500).json({
                success: false,
                status: 500,
                message: "Email Already Exists"
            })
        }
    }

    // const data = JSON.parse(JSON.stringify(req.body));

    // if (data.password) {
    //     delete data.password
    // }

    const admin = await Admins.updateOne({ _id: req.body.id }, { email: req.body?.email, phoneNo: req.body?.phoneNo, pfp: req.body?.pfp })

    if (admin) {
        return res.status(200).json({
            success: true,
            message: "Admin Credentials updated successfully",
            status: 200,
            admin,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Admin could not be updated",
    });
});
