import React, { useEffect, useState } from 'react';
import ProductDetail from './ProductDetail';
import LeaveReview from './reveiw/LeaveReviews';

// styles
import '.././assets/styles/ProductDetails.css';
import '.././assets/styles/branding.css';
import '.././assets/styles/icons.css';
import '.././assets/styles/CustomerReview.css';

const Home = () => {
  return (
    <div className="content-main">
      <ProductDetail />
    </div>
  );
};

export default Home;
