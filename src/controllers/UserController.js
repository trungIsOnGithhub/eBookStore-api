// const User = require(../models/UserSchema.js);
const genToken = require('../utils/genToken.js');
const hashPassword = require('../utils/hashPassword.js');
const { validateEmail, validatePhone } = require('../validation/user.js');

const getAllUsers = async (req, res, next) => { //[GET] /api/users
    User.find({})
        .then((users) => res.status(201).json(users))
        .catch(next);
};


const registerUser = async (req, res, next) => { //[POST] /api/user
    const { name, email, password, phone, confirmPassword } = req.body;

    res.status(400);

    if (!name || !email || !password || !phone || !confirmPassword) {                     
        return next(new Error('Must fill in all information'));
    }

    if (!validateEmail(email)) {
        return next(new Error('Invalid email'));
    }

    if (!validatePhone(phone)) {
        return next(new Error('Invalid phone number'));
    }

    if (password !== confirmPassword) {
        return next(new Error('Password and confirm password do not match'));
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        return next(new Error('Email has already existed!'));
    }
    const checkPhone = await User.findOne({ phone: phone });

    if (checkPhone) {
        return next( new Error('Phone number has already existed') );
    }

    const user = new User({
        name,
        email,
        password,
        phone,
        avatar: '',
        address: '',
    });
    user.save()
        .then((user) => {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                createdAt: user.createdAt,
                role: user.role,
                token: genToken(user._id),
            });
        })
        .catch(next);
};

//[POST] /api/user/login
export const authUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        return next(new Error('Must fill in email and password'));
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: genToken(user._id),
        });
    } else {
        res.status(400);
        return next(new Error('Invalid email or password'));
    }
};

//[PATCH] /api/user/update
export const updateProfile = async (req, res, next) => {
    let userId = req.user._id;
    const { name, phone, address } = req.body;
    let updateObj = {};
    if (phone) {
        if (validatePhone(phone)) {
            updateObj = { ...updateObj, phone: phone };
        } else {
            res.status(400);
            return next(new Error('Invalid phone number'));
        }
    }
    if (address) {
        if (address.length < 1000) {
            updateObj = { ...updateObj, address: address };
        } else {
            res.status(400);
            return next(
                new Error('Address length must be less than 1000 characters')
            );
        }
    }
    if (name) {
        if (name.length >= 6 && name.length <= 50) {
            updateObj = { ...updateObj, name: name };
        } else {
            res.status(400);
            return next( new Error('Length of name must be in range [6, 50]') );
        }
    }
    if (Object.keys(updateObj).length == 0) {
        res.status(400);
        return next( new Error('No changes detected') );
    }

    try {
        let user = await User.findOneAndUpdate( { _id: userId }, updateObj, { new: true } )
                                .select('_id email name phone avatar role createdAt address')
                                .exec();
        res.status(200).json({ message: 'Update successfully', user: user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

//[PATCH] /api/user/update-password
export const updatePassword = async (req, res, next) => {
    let userId = req.user._id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
        res.status(400);
        return next(new Error('All fields must be filled'));
    }
    if (newPassword.length < 8) {
        res.status(400);
        return next(new Error('Passwrod length must be greater than 7'));
    }
    if (newPassword !== confirmNewPassword) {
        res.status(400);
        return next(new Error('Password and Confirm Password do not match'));
    }
    let user = await User.findOne({ _id: userId });
    if (user && (await user.matchPassword(oldPassword))) {
        let hashPass = await hashPassword(newPassword);
        User.findOneAndUpdate(
            { _id: userId },
            { password: hashPass },
            { new: false },
            (error) => {
                if (error) {
                    res.status(500);
                    return next(
                        new Error('Update password has Internal error')
                    );
                } else {
                    res.status(200).json({
                        message: 'Update password successfully',
                    });
                }
            }
        );
    } else {
        res.status(400);
        return next(new Error('Wrong Old Password'));
    }
};

//[GET] /api/user/profile
const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select(
            '_id email phone name avatar createdAt role'
        );

        return res.status(200).json({ status: true, data: user });
    } catch (error) {
        res.status(400);

        return next(new Error(`Error: ${error.message}`));
    }
};


module.exports = {
    getAllUsers,
    registerUser,
    authUser,
    updateProfile,
    updatePassword,
    getMyProfile
}