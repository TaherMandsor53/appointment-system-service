import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      name: req.body.name,
      phone: req.body.phone,
      password: hashedPassword,
      confirmPassword: req.body.confirmPassword,
    });
    user
      .save()
      .then(user => {
        res.json({
          message: 'User Registered Successfully !',
        });
      })
      .catch(error => {
        res.json({
          message: 'An error Occured !',
        });
      });
  });
};

const login = (req, res, next) => {
  var phone = req.body.phone;
  var password = req.body.password;

  User.findOne({ $or: [{ phone: phone }] }).then(user => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ phone: user.phone }, 'verySecretValue', { expiresIn: '1h' });
          res.json({
            message: 'Login Successfully !',
            token,
          });
        } else {
          res.json({
            message: 'Password does not Match !',
          });
        }
      });
    } else {
      res.json({
        message: 'No user Found !',
      });
    }
  });
};

export default { register, login };
