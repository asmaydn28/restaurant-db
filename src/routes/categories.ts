import { Router } from "express";
import db from "../db.js";

const router = Router();

// POST => KATEGORİ OLUŞTURMA
router.post("/", async (req, res) => {
  try {
    // veriyi alma işlemi
    const { name, description } = req.body;

    // veriyi doğrulama işlemi
    if (!name || !description) {
      return res.status(400).json({ message: "İsim ve açıklama gereklidir." });
    }

    // veriyi veritabanına ekleme işlemi
    const newCategory = await db("categories")
      .insert({ name, description })
      .returning("*");

    // başarılı yanıt gönderme işlemi
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Yeni kategori oluşturulurken bir hata oluştu." });
  }
});

// PATCH => KATEGORİ GÜNCELLEME
router.patch("/:id", async (req, res) => {
  try {
    // 1. id'yi alalım
    const { id } = req.params;
    const { name, description } = req.body;

    // 2. Önce kategoriyi bulalım
    const category = await db("categories").where({ id }).first();

    // 3. Kontrolleri yapalım
    if (!category) {
      return res
        .status(404)
        .json({ message: "Güncellenecek kategori bulunamadı." });
    }
    if (category.deleted_at) {
      return res
        .status(400)
        .json({ message: "Silinmiş bir kategori güncellenemez." });
    }
    if (!name || !description) {
      return res.status(400).json({ message: "İsim ve açıklama gereklidir." });
    }

    // 4. Güncelleme işlemini yapalım
    const updatedCategory = await db("categories")
      .where({ id })
      .update({ name, description, updated_at: new Date() })
      .returning("*");

    res.status(200).json(updatedCategory[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Kategori güncellenirken bir hata oluştu." });
  }
});

// DELETE => KATEGORİ SİLME (SOFT DELETE)
router.delete("/:id", async (req, res) => {
  try {
    // Adım 1: ID'yi al
    const { id } = req.params;

    // Adım 2: Kategoriyi veritabanından oku
    const category = await db("categories").where({ id }).first();

    // Adım 3: Kategorinin varlığını kontrol et
    if (!category) {
      return res
        .status(404)
        .json({ message: "Silinecek kategori bulunamadı." });
    }

    // Adım 4: Kategorinin zaten silinip silinmediğini kontrol et
    if (category.deleted_at) {
      return res.status(400).json({ message: "Bu kategori zaten silinmiş." });
    }

    // Adım 5: Silme (Update) işlemini yap
    await db("categories").where({ id }).update({ deleted_at: new Date() });

    res.status(200).json({ message: "Kategori başarıyla silindi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kategori silinirken bir hata oluştu." });
  }
});

// GET => TÜM KATEGORİLERİ GETİRME (SİLİNENLER HARİÇ)
router.get("/", async (req, res) => {
  try {
    // Sadece deleted_at null olanları getir
    const categories = await db("categories").where({ deleted_at: null });
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Kategoriler getirilirken bir hata oluştu." });
  }
});

// GET => TEK KATEGORİ GETİRME (SİLİNENLER HARİÇ)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // id'yi al
    const category = await db("categories").where({ id }).first(); // kategoriyi bul

    // kategori var mı kontrol et
    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    // kategori silinmiş mi kontrol et
    if (category.deleted_at) {
      return res.status(404).json({ message: "Kategori silinmiş." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Kategori getirilirken bir hata oluştu." });
  }
});

export default router;
