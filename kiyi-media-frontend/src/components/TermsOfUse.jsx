import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="legal-page-container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Kullanım Şartları</h1>
      <p><strong>Lütfen web sitemizi kullanmadan önce bu "Kullanım Şartları"nı dikkatlice okuyunuz.</strong></p>

      <h3>1. Taraflar ve Amaç</h3>
      <p>
        Bu web sitesi (<code>kiyimedya.com</code>), <strong>Kıyı Medya</strong>'ya aittir ve siteyi ziyaret eden her kullanıcı, bu kullanım şartlarını kabul etmiş sayılır.
      </p>

      <h3>2. Fikri Mülkiyet Hakları</h3>
      <p>
        İşbu web sitesinde yer alan her türlü içerik (logo, metin, tasarım, yazılım kodları); Kıyı Medya'nın mülkiyetindedir. Kıyı Medya'nın yazılı izni olmaksızın kopyalanamaz veya çoğaltılamaz.
      </p>

      <h3>3. Kullanıcının Sorumlulukları</h3>
      <p>
        Kullanıcı, site üzerindeki iletişim formlarını doldururken verdiği bilgilerin doğru olduğunu kabul eder. Siteye zarar verecek virüs veya kötü amaçlı yazılım göndermek yasaktır.
      </p>

      <h3>4. Değişiklikler</h3>
      <p>
        Kıyı Medya, web sitesinde sunduğu hizmetleri ve bilgileri önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar.
      </p>

      <h3>5. Yetkili Mahkeme</h3>
      <p>
        İşbu kullanım şartlarından doğacak uyuşmazlıklarda Türk Hukuku uygulanacak olup, <strong>Samsun Mahkemeleri</strong> yetkilidir.
      </p>
    </div>
  );
};

export default TermsOfUse;