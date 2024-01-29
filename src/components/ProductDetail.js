import React, { useEffect, useState } from 'react';
import ProductReviews from './reveiw/ProductReview';

const ProductDetail = () => {
  const shopifyApiKey = 'ef94f41ff623adc69c62e4f100c69b2c';
  const shopifyPassword = 'neliz737838292';
  const shopifyStore = 'neli-zarkova';
  const apiUrl = 'http://localhost:3001/getShopifyData';

  const [product, setProduct] = useState(null);

  const fetchProductFromShopify = async () => {
    try {
      const response = await fetch(`${apiUrl}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': `${shopifyApiKey}:${shopifyPassword}`,
        },
        mode: 'cors',
      });

      const data = await response.json();
      const firstProduct = data.products[0];
      setProduct(firstProduct);
    } catch (error) {
      console.error('Error fetching product from Shopify:', error);
    }
  };

  const extractTextFromHtml = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  useEffect(() => {
    fetchProductFromShopify();
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  const secondImage = product.images[1];
  const productDescription = extractTextFromHtml(product.body_html);

  return (
    <div className="section-product-details">
      <div
        key={product.id}
        className="product-detail-inner d-flex space-between"
      >
        <div className="product-images">
          <div className="product-images-wrapper">
            <div className="product-main-img">
              <img
                className="product-image"
                src={product.image.src}
                alt={product.title}
              />
            </div>
            <div className="product-img-variants">
              {secondImage && <img src={secondImage.src} alt={product.title} />}
            </div>
          </div>
        </div>
        <div className="product-details">
          <h1>{product.title}</h1>
          <h3 className='product-price'>${product.variants[0].price}</h3>
          <p className="title-description font-color--orange">BUTTER UP!</p>
          <p className="produc-description">{productDescription}</p>
        </div>
      </div>
      <ProductReviews />
    </div>
  );
};

export default ProductDetail;
