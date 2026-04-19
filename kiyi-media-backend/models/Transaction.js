const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // İşlem Türü: Satış (Gelir) veya Alış (Gider)
    type: { 
        type: String, 
        enum: ['gelir', 'gider'], 
        required: true 
    },
    
    // Fatura / İşlem Numarası
    invoiceNo: { type: String, default: () => 'FTR-' + Math.floor(Math.random() * 100000) },

    // Cari (Müşteri veya Tedarikçi Adı)
    contactName: { type: String, required: true },

    // Fatura Tarihi
    date: { type: Date, default: Date.now },
    
    // Vade Tarihi (Ödeme ne zaman?)
    dueDate: { type: Date },

    // Tahsilat Durumu
    status: { 
        type: String, 
        enum: ['odendi', 'bekliyor', 'iptal', 'gecikmis'], 
        default: 'bekliyor' 
    },

    // Kategorizasyon (Örn: Yazılım Geliri, Sunucu Gideri, Ofis Kirası)
    category: { type: String, default: 'Genel' },

    // Fatura Kalemleri (Paraşüt Mantığı)
    items: [{
        description: String, // Hizmet/Ürün adı
        quantity: Number,    // Miktar
        unitPrice: Number,   // Birim Fiyat
        taxRate: Number,     // KDV Oranı (0, 10, 20)
        total: Number        // Satır Toplamı
    }],

    // Genel Toplamlar
    subTotal: { type: Number, default: 0 }, // KDV Hariç
    taxTotal: { type: Number, default: 0 }, // Toplam KDV
    grandTotal: { type: Number, default: 0 }, // KDV Dahil

    description: String, // Genel Açıklama

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);