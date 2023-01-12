import User from "../models/UserModel.js";
import argon2 from "argon2";
import { where } from "sequelize";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  // validate form
  if (password !== confPassword)
    return res.status(400).json({
      msg: "Password dan Confirm Password tidak cocok",
    });

  const hashPassword = await argon2.hash(password);

  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });

    res.status(201).json({
      msg: "Register Berhasil!",
    });
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user)
    return res.status(404).json({
      msg: "User Tidak ditemukan!",
    });

  const { name, email, password, confPassword, role } = req.body;

  let hashPassword;

  // check if user request change password
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  // validate form
  if (password !== confPassword)
    return res.status(400).json({
      msg: "Password dan Confirm Password tidak cocok",
    });

  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.status(200).json({
      msg: "User Updated!",
    });
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user)
    return res.status(404).json({
      msg: "User Tidak ditemukan!",
    });

  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });

    res.status(200).json({
      msg: "User Deleted!",
    });
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};
