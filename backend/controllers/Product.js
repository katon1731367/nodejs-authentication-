import { response } from "express";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;

    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product)
      return res.status(401).json({
        msg: "Product tidak ditemukan!",
      });

    let response;
    if (req.role === "admin") {
      response = await Product.findOne({
        where: { id: product.id },
        attributes: ["uuid", "name", "price"],
        include: {
          model: User,
          attributes: ["name", "email"],
        },
      });
    } else {
      response = await Product.findOne({
        where: { [Op.and]: [{ id: product.id }, { userId: req.userId }] },
        attributes: ["uuid", "name", "price"],
        include: {
          model: User,
          attributes: ["name", "email"],
        },
      });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });

    res.status(201).json({
      msg: "Product Created Successfuly!",
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product)
      return res.status(401).json({
        msg: "Product tidak ditemukan!",
      });

    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang!" });
      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }

    res.status(200).json({
      msg: "Product updated successfully!",
    });
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product)
      return res.status(401).json({
        msg: "Product tidak ditemukan!",
      });

    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang!" });
      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }

    res.status(200).json({
      msg: "Product Deleted successfully!",
    });
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
};
