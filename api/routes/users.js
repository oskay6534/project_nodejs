var express = require('express');
var router = express.Router();
var Users = require('../db/models/Users');
var Roles = require('../db/models/Roles'); // Eksikti, eklendi
var UserRoles = require('../db/models/UserRoles'); // Eksikti, eklendi
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const bcrypt = require('bcrypt-nodejs'); 
const ENUM = require('../config/enum');
const is = require("is_js");

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
        let users = await Users.find({});
        res.json(Response.successResponse(users));
    }
    catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.post('/add', async (req, res, next) => {
    let body = req.body;
    try {
        if (!body.email || !is.email(body.email) || !body.password) {
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "Parametre hatası", "Email and password are required");
        }
        
        if(!body.roles || !Array.isArray(body.roles) || body.roles.length == 0){
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "validation error", "roles field must be array"); // Enum düzeltildi
        }

        let roles = await Roles.find({_id: { $in: body.roles } });
        if(roles.length == 0){
             throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "validation error", "No valid roles found");
        }

        let salt = bcrypt.genSaltSync(8);
        let passwordHash = bcrypt.hashSync(body.password, salt, null);
        
        // created_user tanımı eklendi
        let created_user = await Users.create({
            email: body.email,
            password: passwordHash,
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number
        });

        for(let role of roles){
            await UserRoles.create({
                user_id: created_user._id,
                role_id: role._id,
                created_by: req.user?._id // created_by için güvenli bir değer
            });
        }

        res.status(ENUM.HTTP_CODES.CREATED).json(Response.successResponse("user created successfully"));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.put("/update", async(req, res, next) => { 
    try {
        let body = req.body;
        let updates = {};

        if(!body._id) throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id is required");

        if(body.password && body.password.length >= ENUM.PASS_LENGTH){ // Mantık düzeltildi
            updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
        }

        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
        if(body.first_name) updates.first_name = body.first_name;
        if(body.last_name) updates.last_name = body.last_name;
        if(body.phone_number) updates.phone_number = body.phone_number;

        if(Array.isArray(body.roles) && body.roles.length > 0){
            let userRoles = await UserRoles.find({user_id: body._id});
            let removedRoles = userRoles.filter(x => !body.roles.includes(x.role_id.toString()));
            let newRoles = body.roles.filter(x => !userRoles.map(y => y.role_id.toString()).includes(x));

            if (removedRoles.length > 0) {
                await UserRoles.deleteMany({ _id: { $in: removedRoles.map(x => x._id) } });
            }
            
            if (newRoles.length > 0) {
                for (let roleId of newRoles) {
                    await UserRoles.create({
                        role_id: roleId,
                        user_id: body._id,
                        created_by: req.user?._id // Added created_by
                    });
                }
            }
        }

        await Users.updateOne({_id: body._id}, updates);
        res.json(Response.successResponse({success: true}));

    } catch (error) { 
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.delete("/delete", async(req, res, next) => {
    try {
        let body = req.body;
        if(!body._id) {
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "validation error", "_id is required");
        }
        await Users.deleteOne({_id: body._id});
        await UserRoles.deleteMany({user_id: body._id});
        res.json(Response.successResponse({success: true}));
    } catch (error) { 
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.post('/register', async (req, res, next) => {
    let body = req.body;
    try {
        let userCheck = await Users.findOne({});
        if(userCheck) {
            // Eğer sistemde kullanıcı varsa register kapalı olabilir (isteğine göre)
            return res.status(ENUM.HTTP_CODES.BAD_REQUEST).json(Response.errorResponse("Registration is only for the first user"));
        }

        if (!body.email || !is.email(body.email) || !body.password) {
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "Parametre hatası", "Email and password are required");
        }

        let salt = bcrypt.genSaltSync(8);
        let passwordHash = bcrypt.hashSync(body.password, salt, null);
        
        let created_user = await Users.create({
            email: body.email,
            password: passwordHash,
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number
        });

        let role = await Roles.create({
            role_name: ENUM.SUPER_ADMIN, // Changed 'name' to 'role_name'
            is_active: true,
            created_by: created_user._id
        });

        await UserRoles.create({   
            user_id: created_user._id,
            role_id: role._id,
            created_by: created_user._id
        }); 

        res.status(ENUM.HTTP_CODES.CREATED).json(Response.successResponse("user created successfully"));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

module.exports = router;