const {check, validationResult} = require('express-validator');
const User = require('../../../models/user/user.model')
module.exports.loginValidator = [
        check('email').not().isEmpty().withMessage((value, { req, location, path }) => {
                return req.__('LANG_00006');
        }),
        check('password').not().isEmpty().withMessage((value, { req, location, path }) => {
            return  req.__('LANG_00006');
        }),
        (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const msg = req.__("LANG_00039");
            return res.status(422).error(errors.array(),msg);
        }
        next();
    },
];
module.exports.registerValidator = [
    check('fullname').not().isEmpty().withMessage((value, { req, location, path }) => {
        return  req.__('LANG_00006');
    }),
    check('fullname').isLength({ max: 50 }).withMessage((value, { req, location, path }) => {
        return  req.__mf('LANG_00013',{max:50});
    }),
    check('email').not().isEmpty().withMessage((value, { req, location, path }) => {
            return  req.__('LANG_00006');
    }),
    check('email').isEmail().withMessage((value, { req, location, path }) => {
        return  req.__('Must be an email');
    }),
    check('email').isLength({ max: 50 }).withMessage((value, { req, location, path }) => {
        return  req.__mf('LANG_00013',{max:50});
    }),
    check('email').custom(async(value, { req, location, path }) => {
        let user =  await User.findOne({email:value}).exec();
        if(user){
            return Promise.reject(req.__mf('LANG_00014'));
        }
    }),
    check('password').not().isEmpty().withMessage((value, { req, location, path }) => {
        return  req.__('LANG_00006');
    }),
    check('password').isLength({ min: 6 }).withMessage((value, { req, location, path }) => {
        return  req.__mf('LANG_00012',{min:6});
    }),
    check('password').isLength({ max: 50 }).withMessage((value, { req, location, path }) => {
        return  req.__mf('LANG_00013',{max:50});
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const msg = req.__("LANG_00039");
            return res.status(422).error(errors.array(),msg);
        }
        next();
    },
];
module.exports.accountVerificationValidator = [
    check('activationKey').not().isEmpty().withMessage((value, { req, location, path }) => {
            return req.__('LANG_00006');
    }),
    check('activationKey').custom(async(value, { req, location, path }) => {
        let user =  await User.findOne({activationKey:value}).exec();
        if(!user){
            return Promise.reject(req.__mf('LANG_00022'));
        }
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const msg = req.__("LANG_00039");
            return res.status(422).error(errors.array(),msg);
        }
        next();
    },
];
module.exports.forgotPasswordValidator = [
    check("company_code").not().isEmpty().withMessage((value, { req, location, path }) => {
        return req.__('LANG_00050')+":"+req.__("LANG_00006");
    }),
    check("email").not().isEmpty().withMessage((value, { req, location, path }) => {
        return req.__('LANG_00001')+":"+req.__("LANG_00006");
    }),
    check("email").isEmail().withMessage((value, { req, location, path }) => {
        return req.__('LANG_00001')+":"+req.__("LANG_00011");
    }),
    check("email").custom(async (value, { req, location, path }) => {
        let user = await User.findOne({ email: value,company_code:req.body.company_code }).exec();
        if (!user) {
            return Promise.reject(
                req.__('LANG_00001')+":"+req.__mf("LANG_00032")
            );
        }
    }),
    check("url").not().isEmpty().withMessage((value, { req, location, path }) => {
        return req.__('LANG_00034')+":"+req.__("LANG_00006");
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msg = req.__("LANG_00039");
            return res.status(422).error(errors.array(),msg);
        }
        next();
    },
]
module.exports.checkRememberValueValidator = [
    check("remember_value").not().isEmpty().withMessage((value, { req, location, path }) => {
        return req.__("LANG_00006");
    }),
    check("remember_value").custom(async (value, { req, location, path }) => {
        let user = await User.findOne({ remember_value: value }).exec();
        if (user) {
            let remember_datetime = moment(user.remember_datetime).format('YYYYMMDDHHmm') ;
            var datetimeCurrent = moment(new Date()).format('YYYYMMDDHHmm');
            if (Number(datetimeCurrent) >Number(remember_datetime)) {
                console.log(Number(datetimeCurrent),">",Number(remember_datetime));
                return Promise.reject(
                    req.__mf("LANG_00037")
                );
            }
        }else{
            return Promise.reject(
                req.__mf("LANG_00022")
            );
        }
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msg = req.__("LANG_00039");
            return res.status(422).error(errors.array(),msg);
        }
        next();
    },
]
module.exports.changePasswordValidator = [
    check("remember_value").not().isEmpty().withMessage((value, { req, location, path }) => {
        return req.__("LANG_00006");
    }),
    check("remember_value").custom(async (value, { req, location, path }) => {
        let user = await User.findOne({ remember_value: value }).exec();
        if (user) {
            let remember_datetime = moment(user.remember_datetime).format('YYYYMMDDHHmm') ;
            var datetimeCurrent = moment(new Date()).format('YYYYMMDDHHmm');
            if (Number(datetimeCurrent) >Number(remember_datetime)) {
                console.log(Number(datetimeCurrent),">",Number(remember_datetime));
                return Promise.reject(
                    req.__mf("LANG_00037")
                );
            }
        }else{
            return Promise.reject(
                req.__mf("LANG_00022")
            );
        }
    }),
    check("password")
        .not()
        .isEmpty()
        .withMessage((value, { req, location, path }) => {
            return req.__('LANG_00002')+":"+req.__("LANG_00006");
        }),
    check("password")
        .isLength({ min: 6 })
        .withMessage((value, { req, location, path }) => {
            return  req.__('LANG_00002')+":"+req.__mf("LANG_00012", { min: 6 });
        }),
    check("password")
        .isLength({ max: 50 })
        .withMessage((value, { req, location, path }) => {
            return req.__('LANG_00002')+":"+req.__mf("LANG_00013", { max: 50 });
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
         const msg = req.__("LANG_00039");
         return res.status(422).error(errors.array(),msg);
        }
        next();
    },
]
module.exports.refreshValidator = [
    check('refreshToken').not().isEmpty().withMessage((value, { req, location, path }) => {
            return req.__('LANG_00040')+":"+req.__('LANG_00006');
    }),
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const msg = req.__("LANG_00039");
        return res.status(422).error(errors.array(),msg);
    }
    next();
},
];

