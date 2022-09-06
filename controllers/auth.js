const {response} = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async  (req, res = response)=> {
    const {email, password} = req.body;

    try {
        const existedEmail = await Usuario.findOne({email: email});
        if(existedEmail) {
            return res.status(400).json({
                ok:false,
                msg:"El correo ya esta registrado"
            })
        }
        const usuario = new Usuario(req.body);

        // encriptar contrasena
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //generar json-web-token
        const token = await generarJWT(usuario.id);

    res.json({
        ok:true,
        usuario, 
        token
    })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false, msg:"Hable con el administrador"})
    }
}


//login controller
// {ok: true, msg: "login"}

const login = async  (req, res = response)=> {
    const {password, email} = req.body;
    try {
        const usuarioDB = await  Usuario.findOne({email});

        if(!usuarioDB) {
            return res.status(404).json({ok:false,msg:"Usuario no encontrado"});
        }

        // validar el password
        const validadPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validadPassword) {
            return res.status(400).json({ok:false,msg:"Contrasena no valida"});
        }

        // generar jsonwebtoken
        const token = await generarJWT(usuarioDB.id)
        return res.json({
            ok:true
            ,usuario:usuarioDB, 
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false, msg: "Hable con el adminstrador"}) 
    }
}

const renewToken = async (req,res)=> {
 // const uid del usuario
    const uid = req.uid;
 //generar un JWT, generar jwt... uid...
    const token = await generarJWT(uid);
 // generar el usuario por el uid, usuario.findById
    const usuario = await Usuario.findById(uid);
    return res.json({
        ok:true,
        usuario, 
        token
    });

   
}

module.exports= {crearUsuario, login, renewToken}