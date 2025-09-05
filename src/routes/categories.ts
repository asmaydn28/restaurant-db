import { Router } from "express";
import db from "../db.js";

const router = Router();

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

export default router;
