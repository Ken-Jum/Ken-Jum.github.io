const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Import file kết nối MySQL

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ API: Lấy danh sách xe đang đỗ
app.get('/api/vehicles', (req, res) => {
    const sql = "SELECT * FROM xe_vao_bai WHERE trang_thai = 'DANG_DO'";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ API: Thêm xe mới vào bãi
app.post('/api/vehicles', (req, res) => {
    const { bien_so, loai_xe, vi_tri_do } = req.body;
    const sql = "INSERT INTO xe_vao_bai (bien_so, loai_xe, vi_tri_do) VALUES (?, ?, ?)";
    db.query(sql, [bien_so, loai_xe, vi_tri_do], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Xe đã được thêm vào bãi", id: result.insertId });
    });
});

// ✅ API: Xóa xe khi rời bãi
app.delete('/api/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE xe_vao_bai SET trang_thai = 'DA_RA' WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Xe đã rời bãi" });
    });
});

// ✅ API: Lấy số lượng chỗ trống
app.get('/api/parking-spots', (req, res) => {
    const sql = "SELECT COUNT(*) AS so_cho_trong FROM vi_tri_bai_do WHERE trang_thai = 'TRONG'";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
