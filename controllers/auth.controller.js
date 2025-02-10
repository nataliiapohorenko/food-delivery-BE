const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    try{
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            throw new Error('User already exists!');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({id: user._id, email: user.email}, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(201).json(token);
    }
    catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            const error = new Error('Incorrect password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ 
                email: user.email,
                id: user._id.toString() 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(200).json(token);
    } 
    catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.authWithGoogle = async (req, res) => {
    const { token } = req.body;
    let newUser;
    let userId;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId
        });

        const payload = ticket.getPayload();

        const user = await User.findOne({ email: payload.email })
        if (!user) {
            newUser = new User({
                name: payload.name || payload.given_name + ' ' + payload.family_name || '',
                email: payload.email,
            });
            await newUser.save();
            userId = newUser._id;
        } else {userId = user._id}

        const authToken = jwt.sign(
            { id: userId, email: payload.email, name: payload.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json(authToken);

    } catch (error) {
        console.error('Invalid Google token:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

exports.authWithFacebook = async (req, res) => {
const { token } = req.body;
    try {
        const fbUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`;
        const response = await axios.get(fbUrl);
        const payload = response.data;
        let newUser;
        let userId;

        if (!payload || !payload.id) {
            return res.status(401).json({ error: "Invalid Facebook token" });
        }
        const user = await User.findOne({ email: payload.email })
        if (!user) {
            newUser = new User({
                name: payload.name || '',
                email: payload.email,
                picture: payload.picture?.data?.url,
            });
            await newUser.save();
            userId = newUser._id;
        } else { userId = user._id; }

        const authToken = jwt.sign(
            { id: userId, email: newUser.email, name: newUser.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json(authToken);

    } catch (error) {
        console.error('Invalid Google token:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};