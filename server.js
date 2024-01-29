const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

app.use(cors());

// Маршрут за извличане на данни за продукти от Shopify
app.get('/getShopifyData', async (req, res) => {
  try {
    const response = await fetch(
      'https://neli-zarkova.myshopify.com/admin/api/2024-01/products.json',
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': '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',
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from Shopify:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Маршрут за извличане на metafields за продукт от Shopify
app.get('/getShopifyMetafields/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const response = await fetch(
      `https://neli-zarkova.myshopify.com/admin/api/2024-01/products/${productId}/metafields.json?namespace=custom&key=reviews`,

      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': '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',
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching metafields from Shopify:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
