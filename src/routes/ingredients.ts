import { Router } from "express";
import db from "../db.js";

const router = Router();

// POST => MALZEME OLUŞTURMA
router.post("/", async (req, res) => {
  try {
    const { name, is_allergen } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Malzeme adı gereklidir." });
    }

    const newIngredient = await db("ingredients")
      .insert({ name, is_allergen })
      .returning("*");

    res.status(201).json(newIngredient[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Yeni malzeme oluşturulurken bir hata oluştu." });
  }
});

// GET => TÜM MALZEMELERİ LİSTELEME
router.get("/", async (req, res) => {
  try {
    const ingredients = await db("ingredients").where({ deleted_at: null });
    res.status(200).json(ingredients);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Malzemeler getirilirken bir hata oluştu." });
  }
});

// GET => TEK BİR MALZEMEYİ GÖRÜNTÜLEME
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await db("ingredients").where({ id }).first();

    if (!ingredient || ingredient.deleted_at) {
      return res.status(404).json({ message: "Malzeme bulunamadı." });
    }

    res.status(200).json(ingredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Malzeme getirilirken bir hata oluştu." });
  }
});

// PATCH => MALZEME GÜNCELLEME
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_allergen } = req.body;

    const ingredient = await db("ingredients").where({ id }).first();

    if (!ingredient || ingredient.deleted_at) {
      return res.status(404).json({ message: "Güncellenecek malzeme bulunamadı." });
    }

    const updatedIngredient = await db("ingredients")
      .where({ id })
      .update({ name, is_allergen, updated_at: new Date() })
      .returning("*");

    res.status(200).json(updatedIngredient[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Malzeme güncellenirken bir hata oluştu." });
  }
});

// DELETE => MALZEME SİLME (SOFT DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await db("ingredients").where({ id }).first();

    if (!ingredient) {
      return res.status(404).json({ message: "Silinecek malzeme bulunamadı." });
    }

    if (ingredient.deleted_at) {
      return res.status(400).json({ message: "Bu malzeme zaten silinmiş." });
    }

    await db("ingredients").where({ id }).update({ deleted_at: new Date() });

    res.status(200).json({ message: "Malzeme başarıyla silindi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Malzeme silinirken bir hata oluştu." });
  }
});

export default router;