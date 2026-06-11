const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function registerUserController(req, res){
    const {username, email, password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and passwordd"
        })
    }
    const alreadyuserexits = await userModel.findOne({
        $or: [{username},{email}]
    })

    if(alreadyuserexits){
        return res.status(400).json({
            message: "Acount already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })


    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token, { httpOnly: true, sameSite: 'lax' })

    res.status(201).json({
        message: "User registered Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
    })


}

async function loginUserController(req, res){
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid email or Password"
        })
    }

    const isValidpassword = await bcrypt.compare(password, user.password)

    if(!isValidpassword){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
    {expiresIn: "1d"}
    )

    res.cookie("token", token, { httpOnly: true, sameSite: 'lax' })
    res.status(200).json({
        message: "User logged in Successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function logoutUserController(req, res){
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out Successfully"
    })
}

async function getmeController(req,res){
    const user = await userModel.findById(req.user.id)
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json({
        message:"User data Fetched Successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getmeController
}