import { Router } from "express";
import db from "../db.js";

const router = Router();

// POST => ÜRÜN OLUŞTURMA
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res
        .status(400)
        .json({ message: "İsim, fiyat ve kategori ID'si gereklidir." });
    }

    const newProduct = await db("products")
      .insert({ name, description, price, category_id })
      .returning("*");

    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Yeni ürün oluşturulurken bir hata oluştu." });
  }
});

// GET => TÜM ÜRÜNLERİ LİSTELEME (FİLTRELİ)
router.get("/", async (req, res) => {
  try {
    const { category, showDeleted, onlyDeleted } = req.query;

    let query = db("products");

    // Kategoriye göre filtrele
    if (category) {
      query.where({ category_id: category });
    }

    // Silinme durumuna göre filtrele
    if (onlyDeleted === 'true') {
      query.whereNotNull("deleted_at");
    } else if (showDeleted === 'true') {
      // Tümünü getir (filtreleme yapma)
    } else {
      // Varsayılan: sadece aktif olanları getir
      query.whereNull("deleted_at");
    }

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürünler getirilirken bir hata oluştu." });
  }
});

// GET => TEK BİR ÜRÜNÜ GÖRÜNTÜLEME
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db("products").where({ id }).first();

    if (!product || product.deleted_at) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürün getirilirken bir hata oluştu." });
  }
});

// PATCH => ÜRÜN GÜNCELLEME
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;

    const product = await db("products").where({ id }).first();

    if (!product || product.deleted_at) {
      return res
        .status(404)
        .json({ message: "Güncellenecek ürün bulunamadı." });
    }
    if (!name && !description && !price && !category_id) {
      return res
        .status(400)
        .json({ message: "Güncellemek için en az bir alan gereklidir." });
    }

    const updatedProduct = await db("products")
      .where({ id })
      .update({
        name,
        description,
        price,
        category_id,
        updated_at: new Date(),
      })
      .returning("*");

    res.status(200).json(updatedProduct[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürün güncellenirken bir hata oluştu." });
  }
});

// DELETE => ÜRÜN SİLME (SOFT DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db("products").where({ id }).first();

    if (!product) {
      return res.status(404).json({ message: "Silinecek ürün bulunamadı." });
    }

    if (product.deleted_at) {
      return res.status(400).json({ message: "Bu ürün zaten silinmiş." });
    }

    await db("products").where({ id }).update({ deleted_at: new Date() });

    res.status(200).json({ message: "Ürün başarıyla silindi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürün silinirken bir hata oluştu." });
  }
});

export default router;