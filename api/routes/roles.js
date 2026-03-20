var express = require('express');
var router = express.Router();
const Roles = require('../db/models/Roles');
const RolesPriviLeges = require('../db/models/RolesPriviLeges'); // Model ismi tutarlı olmalı
const Response = require('../lib/Response');
const ENUM = require('../config/enum');
const CustomError = require('../lib/Error');
const role_privilleges = require('../config/role_privilleges');

router.get('/', async (req, res, next) => {
    try {
        let roles = await Roles.find({});
        res.json(Response.successResponse(roles));
    }
    catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.post('/add', async (req, res, next) => {
    let body = req.body;
    try {
        if (!body.role_name)
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "parametre hatası", "role_name is required");
        
      
        if (!body.permissions|| !Array.isArray(body.permissions) || body.permissions.length === 0)
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "parametre hatası", "permıssınons should be array and not empty");

        let role = new Roles({
            role_name: body.role_name,
            is_active: true,
            created_by: req.user?.id
        });

        await role.save();

        for (let i = 0; i < body.permissions.length; i++) {
            // Hata Düzeltme: Model ismi RolesPriviLeges olarak düzeltildi
            let priv = new RolesPriviLeges({
                role_id: role._id,
                permission: body.permissions[i],
                created_by: req.user?.id
            });
            await priv.save();
        }

        res.json(Response.successResponse({ success: true }));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.put('/update', async (req, res, next) => {
    let body = req.body;
    try {
        if (!body._id)
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "parametre hatası", "id is required");
        
        let updates = {};
        if (body.role_name) updates.role_name = body.role_name;
        if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

        // Hata Düzeltme: Mantıksal kontrol düzeltildi (Dizi ise işlem yap)
        if (body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0) {
            let permissions = await RolesPriviLeges.find({ role_id: body._id });
            
            // Silinecekler: Veritabanında olup yeni listede olmayanlar
            let removedPermissions = permissions.filter(x => !body.permissions.includes(x.permission));
            // Eklenecekler: Yeni listede olup veritabanında olmayanlar
            let newPermissions = body.permissions.filter(x => !permissions.map(p => p.permission).includes(x));

            if (removedPermissions.length > 0) {
                await RolesPriviLeges.deleteMany({ _id: { $in: removedPermissions.map(x => x._id) } });
            }

            if (newPermissions.length > 0) {
                for (let i = 0; i < newPermissions.length; i++) {
                    let priv = new RolesPriviLeges({
                        role_id: body._id,
                        permission: newPermissions[i],
                        created_by: req.user?.id
                    });
                    await priv.save();
                }
            }
        }

        await Roles.updateOne({ _id: body._id }, updates);
        res.json(Response.successResponse({ success: true }));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.delete('/delete', async (req, res, next) => {
    let body = req.body;
    try {
        if (!body._id)
            throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST, "parametre hatası", "id is required");

        // Model içindeki static removed metodunu çağırıyoruz ki bağlı yetkiler de silinsin
        await Roles.removed({ _id: body._id });

        res.json(Response.successResponse({ success: true }));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(error.code || ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
});

router.get('/role_privileges', async (req, res, next) => {
    res.json(role_privilleges);
});

module.exports = router;