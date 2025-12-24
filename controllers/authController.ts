const HTTP_RES_CODE = require('../lib/constants');
import { Request, Response } from 'express';
import { User, Roles } from '../models/models';
const login = async (req: Request, res: Response) => {
  const username = req.body.username || '';
  const password = req.body.password || '';

  const requiredFields = {
      username,
      password,
    }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key); 

    if (missingFields.length > 0) {
      return res.status(HTTP_RES_CODE.HTTP_BAD_REQUEST).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    try {
      const user = await User.findOne({ username: username, password: password });
      if (!user) {
        return res.status(HTTP_RES_CODE.HTTP_UNAUTHORIZED).json({ message: 'Invalid username or password' });
      }

      const token = require('crypto').randomBytes(64).toString('hex');
      const date = new Date();
      date.setHours(date.getHours() + 24);
      user.refreshToken = token;
      user.sassionTime = date;
      await user.save();
      return res.status(HTTP_RES_CODE.HTTP_OK).json({ success: true, message: 'Login successful', date: {token: token, useruid: user.useruid }});
    } catch (error) {
      return res.status(HTTP_RES_CODE.HTTP_SERVER_ERROR).json({ message: 'Error during login', error });
    }
};

const register = async (req: Request, res: Response) => {
  const username = req.body.username || '';
  const password = req.body.password || '';
  const email = req.body.email || '';
  const name = req.body.name || '';
  const mobile = req.body.mobile || '';
  const address = req.body.address || '';
  const profile = req.body.profile || '';
  const roleuid = req.body.roleuid || '';

  const requiredFields = {
      username,
      password,
      email,
      name,
      mobile,
  };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);
    if (missingFields.length > 0) {
      return res.status(HTTP_RES_CODE.HTTP_BAD_REQUEST).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

  try {
    const roledb = await Roles.findOne({ roleuid: roleuid });
    if (!roledb) {
      return res.status(HTTP_RES_CODE.HTTP_BAD_REQUEST).json({
         message: 'Invalid role UID' 
        });
    };
    const newUser = new User({
      useruid: require('crypto').randomBytes(64).toString('hex'),
      username: username,
      password: password,
      email: email,
      name: name,
      mobile: mobile,
      address: address,
      profile: profile,
      roles: roledb._id
    });
    await newUser.save();
    return res.status(HTTP_RES_CODE.HTTP_CREATED).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    return res.status(HTTP_RES_CODE.HTTP_SERVER_ERROR).json({ message: 'Error creating user', error });
  }
}

const getUsers = async (req: Request, res: Response) => {
  
    try {
    const users = await User.find({}, { _id: 0, __v: 0 , password: 0, createdAt: 0, updatedAt: 0, refreshToken: 0, sassionTime: 0})
    .select("-password -createdAt -updatedAt")
    .populate({
      path: "roles",
      select: "roleName roleuid description -_id",
    });
    res.status(HTTP_RES_CODE.HTTP_OK).json({ message: 'Users retrieved successfully', data: users });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(HTTP_RES_CODE.HTTP_SERVER_ERROR).json({ message: 'Error retrieving users', error });
  }
}

const roleCreate = async (req: Request, res: Response) => {
  const rolename = req.body.rolename || '';
  const description = req.body.description || '';
  const room = req.body.room || {};
  const user = req.body.user || {};
  const booking = req.body.booking || {};
  const inventory = req.body.inventory || {};
  const reports = req.body.reports || {};
  try {
    const newRole = new Roles({
      roleName: rolename,
      roleuid: require('crypto').randomBytes(64).toString('hex'),
      description: description,
      room: room,
      user: user,
      booking: booking,
      inventory: inventory,
      reports: reports
    });
    await newRole.save();
    res.status(HTTP_RES_CODE.HTTP_CREATED).json({ message: 'Role created successfully', data: newRole });
  } catch (error) {
    res.status(HTTP_RES_CODE.HTTP_SERVER_ERROR).json({ message: 'Error creating role', error });
  }
  
}

export default {
  login,
  register,
  getUsers,
  roleCreate
};