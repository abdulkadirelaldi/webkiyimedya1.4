const Transaction = require('../models/Transaction');

// 1. İşlemleri Getir
exports.getTransactions = async (req, res) => {
    try {
        const filter = {};
        if (req.query.customerId) filter.customerId = req.query.customerId;
        if (req.query.month) filter.month = req.query.month;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.isPaid !== undefined) filter.isPaid = req.query.isPaid === 'true';

        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 2. Yeni İşlem Ekle
exports.addTransaction = async (req, res) => {
    try {
        const { type, contactName, date, dueDate, status, category, items, description } = req.body;

        // Hesaplamalar
        let subTotal = 0;
        let taxTotal = 0;

        const calculatedItems = items.map(item => {
            const lineTotal = item.quantity * item.unitPrice;
            const lineTax = lineTotal * (item.taxRate / 100);
            subTotal += lineTotal;
            taxTotal += lineTax;
            return { ...item, total: lineTotal };
        });

        const grandTotal = subTotal + taxTotal;

        const transaction = await Transaction.create({
            type, contactName, date, dueDate, status, category, items: calculatedItems,
            subTotal, taxTotal, grandTotal, description
        });

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 3. İstatistikleri Getir (GÜNCELLENDİ: Bekleyenler Kasaya Dahil Edilmiyor)
exports.getStats = async (req, res) => {
    try {
        const transactions = await Transaction.find();

        let totalIncome = 0;     // Kasa Girişi (Sadece Ödenenler)
        let totalExpense = 0;    // Kasa Çıkışı (Sadece Ödenenler)
        
        let pendingIncome = 0;   // Alacaklar (Bekleyen Gelir)
        let pendingExpense = 0;  // Borçlar (Bekleyen Gider)
        
        let totalVAT = 0;        // KDV Dengesi (Genelde tahakkuk esaslı hesaplanır ama burada kasaya göre yapalım)

        transactions.forEach(t => {
            if (t.type === 'gelir') {
                if (t.status === 'odendi') {
                    // Tahsil edildiyse kasaya ekle
                    totalIncome += t.grandTotal;
                    totalVAT += t.taxTotal; 
                } else {
                    // Bekliyorsa Alacaklara ekle
                    pendingIncome += t.grandTotal;
                }
            } else {
                if (t.status === 'odendi') {
                    // Ödendiyse kasadan düş
                    totalExpense += t.grandTotal;
                    totalVAT -= t.taxTotal;
                } else {
                    // Bekliyorsa Borçlara ekle
                    pendingExpense += t.grandTotal;
                }
            }
        });

        const netProfit = totalIncome - totalExpense; // Sadece gerçekleşen nakit akışı

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netProfit,
                pendingIncome,
                pendingExpense,
                totalVAT
            }
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 4. İşlem Güncelle (YENİ EKLENDİ - Düzenleme İçin)
exports.updateTransaction = async (req, res) => {
    try {
        const { items } = req.body;
        
        // Yeniden Hesaplama Yap (Fiyatlar değişmiş olabilir)
        let subTotal = 0;
        let taxTotal = 0;

        const calculatedItems = items.map(item => {
            const lineTotal = item.quantity * item.unitPrice;
            const lineTax = lineTotal * (item.taxRate / 100);
            subTotal += lineTotal;
            taxTotal += lineTax;
            return { ...item, total: lineTotal };
        });

        const grandTotal = subTotal + taxTotal;

        // Veriyi güncelle
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { ...req.body, items: calculatedItems, subTotal, taxTotal, grandTotal },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedTransaction });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 5. İşlem Sil
exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Silindi' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};