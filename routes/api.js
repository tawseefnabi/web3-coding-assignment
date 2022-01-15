const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post('/user', async(req, res) => {
    try {
        const {
            user_id,
            login,
            password
        } = req.body;
        if(login == '' ||  password == '' || user_id == '') {
            res.status(400).send({error: 'All fields are required'});
        }
        const newUser = new User({
            user_id,
            login,
            password
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        newUser.save().then( result =>{
            res.status(201).json({"message": "user added successfully"});
        }).catch( error =>{
            // res.send(error);
            console.log(error);
            res.status(400).json({"message": "error in adding user"});
        })
    } catch (error) {
        res.send(error);
        res.status(400).json({"message": "error in adding user"});
    }
})

router.post('/authenticate', async(req, res) => {
    try {
        const { login, password } = req.body;
        if(login == '' ||  password == '') {
            res.status(400).send({error: 'All fields are required'});
        }
      let user = await User.findOne({
        login
      });
      if (!user)
        return res.status(404).json({
          message: "User Not Exist"
        });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid Credentials"
        });
      }
      const payload = {
        user: {
            id: login
        }
    };

    jwt.sign(
        payload,
        "randomString", {
            expiresIn: 10000
        },
        (err, token) => {
            if (err) throw err;
            res.status(200).json({
                "message": "user auth  token",
                token
            });
        }
    );
        
    } catch (error) {
        console.log(error);
        res.status(400).json({"message": "error in authenticating user"});
    }
})
router.post('/logout', async(req, res) => {
    try {
        const { token } = req.body;
        if(token == '') {
            return res.status(400).send({error: 'All fields are required'});
        }
        jwt.verify(token, "randomString", (err, decoded) => {
            if (err) {
                res.status(401).json({"message": "error in logout"});
            }
            res.status(200).json({"message": "logout successfully"});
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({"message": "error in logout"});
    }
})
router.post('/articles', async(req, res) => {
    try {
        const token  = req.headers['token'];
        const { article_id, title, content, visibility } = req.body;
        if(token == '' || article_id == '' || title == '' || content == '' ||visibility == '') {
            return res.status(400).send({error: 'All fields are required'});
        }
        
        jwt.verify(token, "randomString", (err, decoded) => {
            if (err) {
                return res.status(401).json({"message": "invalid token"});
            }
            console.log(decoded);
            user_id = decoded.user.id;
            const newArticle = new Article({
                article_id,
                title,
                content,
                visibility,
                user_id
            })
            console.log('newArticle', newArticle);
            newArticle.save().then( result =>{
                res.status(201).json({"message": "article added successfully"});
            }).catch( error =>{
                // res.send(error);
                console.log(error);
                res.status(400).json({"message": "error in adding article"});
            })
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({"message": "error in article"});
    }
})
router.get('/articles', async(req, res) => {
    try {
        const token  = req.headers['token'];
        if(token == '') {
            return res.status(400).send({error: 'Token field is required'});
        }
        jwt.verify(token, "randomString", (err, decoded) => {
            if (err) {
                Article.find({
                    "visibility": "public"
                }).then( result =>{
                    res.status(200).json(result);
                }).catch( error =>{
                    console.log(error);
                    res.status(400).json({"message": "error in getting articles"});
                })
            }
            user_id = decoded.user.id;
            Article.find({
                "visibility": {"$in":['logged_in', 'public']},
            }).then( result =>{
                res.status(200).json(result);
            }).catch( error =>{
                // res.send(error);
                console.log(error);
                res.status(400).json({"message": "error in getting articles"});
            })
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({"message": "error in getting articles"});
    }
})

module.exports = router;
