// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type = 'website', schema }) => {
  
  const siteTitle = "Kıyı Medya | Dijital Performans Ajansı";
  const defaultDescription = "Samsun merkezli reklam ajansı. Web tasarım, sosyal medya yönetimi, SEO ve video prodüksiyon hizmetleri ile markanızı büyütün.";
  const defaultKeywords = "samsun reklam ajansı, web tasarım, seo, sosyal medya, dijital pazarlama";
  const domain = "https://kiyimedya.com"; // Canlı domainini buraya yaz
  const currentUrl = url ? `${domain}${url}` : domain;
  const metaImage = image ? `${domain}${image}` : `${domain}/logo.png`;

  return (
    <Helmet>
      {/* Standart Meta Etiketleri */}
      <title>{title ? `${title} | Kıyı Medya` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Kıyı Medya" />

      {/* Facebook / Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Kıyı Medya" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Google Schema.org Verisi */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;