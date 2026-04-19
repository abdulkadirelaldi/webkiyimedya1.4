// controllers/customerController.js
const Customer = require('../models/Customer');
const fs = require('fs');
const path = require('path');

// --- Müşterileri Getir ---
exports.getCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Veriler çekilemedi.' });
    }
};

// --- Yeni Müşteri Ekle ---
exports.addCustomer = async (req, res, next) => {
    try {
        let logoPath = '';

        // Eğer resim yüklendiyse
        if (req.file) {
            logoPath = `/uploads/${req.file.filename}`;
        }

        const customer = await Customer.create({
            name: req.body.name,
            logo: logoPath
        });

        res.status(201).json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Müşteri eklenemedi.' });
    }
};

// --- Müşteri Sil ---
exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ success: false, error: 'Müşteri bulunamadı.' });
        }

        // Varsa Logoyu da klasörden sil
        if (customer.logo && customer.logo.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../public', customer.logo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await customer.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Silme işlemi başarısız.' });
    }
};