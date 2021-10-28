const {check, validationResult} = require('express-validator');
const User = require('../../../models/user/user.model')
module.exports.loginValidator = [
        check('email').not().isEmpty().withMessage((value, { req, location, path }) => {
                return  req.__('Email')+" : "+req.__('is not empty');
        }),
        check('password').not().isEmpty().withMessage((value, { req, location, path }) => {
            return  req.__('Password')+" : "+req.__('is not empty');
        }),
        (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
        next();
    },
];
module.exports.registerValidator = [
    check('email').not().isEmpty().withMessage((value, { req, location, path }) => {
            return  req.__('Email')+" : "+req.__('is not empty');
    }),
    check('email').isEmail().withMessage((value, { req, location, path }) => {
        return  req.__('Email')+" : "+req.__('Must be an email');
    }),
    check('email').isLength({ max: 50 }).withMessage((value, { req, location, path }) => {
        return  req.__('Email')+" : "+req.__mf('Maximum of {max} characters',{max:50});
    }),
    check('email').custom(async(value, { req, location, path }) => {
        let user =  await User.findOne({email:value}).exec();
        if(user){
            return Promise.reject( req.__('Email')+" : "+req.__mf('Already exist'));
        }
    }),
    check('password').not().isEmpty().withMessage((value, { req, location, path }) => {
        return  req.__('Password')+" : "+req.__('is not empty');
    }),
    check('password').isLength({ min: 6 }).withMessage((value, { req, location, path }) => {
        return  req.__('Password')+" : "+req.__mf('Must at least {min} characters',{min:6});
    }),
    check('password').isLength({ max: 50 }).withMessage((value, { req, location, path }) => {
        return  req.__('Password')+" : "+req.__mf('Maximum of {max} characters',{max:50});
    }),
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    next();
},
];