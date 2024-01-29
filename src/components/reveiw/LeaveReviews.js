import React, { useState } from 'react';
import Modal from '../modals/Modal';
import { FaStar } from 'react-icons/fa';

const LeaveReview = ({handleModalSubmit}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
    setRating(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleModalSubmit(e);
    closeModal();
  };

  const handleStarClick = (starValue) => {
    const newRating = rating === starValue ? 0 : starValue;
    setRating(newRating);
  };

  return (
    <div className="leave-review">
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h3 className='h3-s'>Leave a review</h3>
        <form className="form-leave-review" onSubmit={handleSubmit}>
          <label className="d-block mb-20">
            Name:
            <input className="d-block mt-8" type="text" name="name" required/>
          </label>
          <br />
          <label className="d-block mb-20">
            Email:
            <input className="d-block mt-8" type="email" name="email" />
          </label>
          <br />
          <label className='mb-20'>
            Rating:
            <div className="rating mt-8">
              {[...Array(5)].map((star, index) => {
                const starValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="star"
                    color={rating >= starValue ? '#ffc107' : '#e4e5e9'}
                    size={25}
                    onClick={() => handleStarClick(starValue)}
                  />
                );
              })}
            </div>
            <input className="d-none mt-8" type="text" name="rating" value={rating}/>
          </label>
          <br />
          <label className="d-block mb-20">
            Rating Title:
            <input className="d-block mt-8" type="text" name="ratingTitle"/>
          </label>
          <br />
          <label className="d-block mb-20">
            Rating Content:
            <textarea className="d-block mt-8" name="ratingContent" rows="4" />
          </label>
          <br />
          <label className="d-flex custom-upload-img mb-20">
          Upload a photo of how it looks (optional)
            <input
              className="d-none mt-8"
              type="file"
              name="photo"
              accept="image/*"
            />
            <span className='icon-upload-img mt-8'></span>
          </label>
          <div className='sbm-btn d-flex justify-content-c'>
            <button className="button--md" type="submit">Submit reviews</button>
          </div>
        </form>
      </Modal>
      <button className="button--md" onClick={openModal}>
        Leave a review
      </button>
    </div>
  );
};

export default LeaveReview;
