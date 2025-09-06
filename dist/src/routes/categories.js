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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Yeni kategori oluşturulurken bir hata oluştu." });
    }
});
// PATCH => KATEGORİ GÜNCELLEME
router.patch("/:id", async (req, res) => {
    try {
        // urlden id alma işlemi
        const { id } = req.params;
        // body den yeni veriyi alma işlemi
        const { name, description } = req.body;
        // veri varmı ?
        if (!name || !description) {
            return res.status(400).json({ message: "İsim ve açıklama gereklidir." });
        }
        // veriyi güncelleme işlemi
        const updatedCategory = await db("categories")
            .where({ id }) // hangi id li veriyi güncelleyeceğimizi belirtiyoruz
            .update({ name, description, updated_at: new Date() }) // güncellenecek veriler
            .returning("*"); // güncellenen veriyi döndürüyoruz
        // güncellenen veri var mı ?
        if (updatedCategory.length > 0) {
            res.status(200).json(updatedCategory[0]);
        }
        else {
            res.status(404).json({ message: "Kategori bulunamadı." });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Kategori güncellenirken bir hata oluştu." });
    }
});
export default router;
//# sourceMappingURL=categories.js.map