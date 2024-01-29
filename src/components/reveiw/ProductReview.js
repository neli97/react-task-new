import React, { useEffect, useState } from 'react';
import LeaveReview from './LeaveReviews';

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortBy, setSortBy] = useState('HighestRating');
  const [count, setCount] = useState(0);

  const drawAndColorStars = (number) => {
    let starStyle = 'icon-star';
    let coloredStarStyle = 'icon-star-colored';

    number = Math.min(Math.max(number, 0), 5);

    let stars = Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < number ? coloredStarStyle : starStyle}
      ></span>
    ));

    return <div>{stars}</div>;
  };

  const forceRerender = () => {
    setCount(count + 1);
  };

  const handleSelectChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleLike = (reviewId, newLikes) => {
    handleReaction(reviewId, newLikes, 'likes');
  };

  const handleDislike = (reviewId, newDislikes) => {
    handleReaction(reviewId, newDislikes, 'dislikes');
  };

  const handleModalSubmit = (e, reviewToCreate) => {
    e.preventDefault();

    let author = e.target[0].value;
    let email = e.target[1].value;
    let rating = e.target[2].value;
    let title = e.target[3].value;
    let content = e.target[4].value;
    let photo = e.target[5].files;
    let latestReviewId = reviews.reduce((prev, current) => (prev.id > current.id) ? prev : current);

    let reviewToAdd = {
      "id": latestReviewId.id*1+1,
      "author": author,
      "body": content,
      "date": (new Date()).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      "dislikes": 0,
      "likes": 0,
      "rating": rating*1,
      "title": title,
      "photo": photo.length > 0 ? photo : '',
    };

    reviews.push(reviewToAdd);
    reviewsToShow.push(reviewToAdd);
    forceRerender();
  };

  const handleReaction = (reviewId, newReactions, reactionType) => {
    let foundReview = reviewsToShow.find((review) => review.id === reviewId);
    if (reactionType == 'likes') {
      reviews.find((rw) => rw.id === reviewId).likes = newReactions;
      foundReview.likes = newReactions;
    } else {
      reviews.find((rw) => rw.id === reviewId).dislikes = newReactions;
      foundReview.dislikes = newReactions;
    }

    const storageKey = `${reactionType}_${reviewId}`;
    localStorage.setItem(storageKey, newReactions);

    forceRerender();
  };

  const filterReviews = (sortOption) => {
    switch (sortOption) {
      case 'HighestRating':
        return reviews.slice().sort((a, b) => b.rating - a.rating);
      case 'LowestRating':
        return reviews.slice().sort((a, b) => a.rating - b.rating);
      case 'OnlyPictures':
        return reviews.slice().sort((a, b) => {
          if (a.photo && !b.photo) {
            return -1;
          } else if (!a.photo && b.photo) {
              return 1;
          } else {
              return 0;
          }
        });
      case 'MostHelpful':
        return reviews
          .slice()
          .sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes));
      default:
        return reviews;
    }
  };

  const reviewsToShow = filterReviews(sortBy);

  useEffect(() => {
    const productId = '8984804688158';
    const endpoint = `http://localhost:3001/getShopifyMetafields/${productId}`;
    const accessToken = 'ef94f41ff623adc69c62e4f100c69b2c';

    fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.metafields && data.metafields.length > 0) {
          const firstMetafield = data.metafields[0];

          if (firstMetafield.value) {
            const parsedReviews = JSON.parse(firstMetafield.value);
            if (parsedReviews && parsedReviews.reviews) {
              setReviews(parsedReviews.reviews);

              setReviews((prevReviews) => {
                return prevReviews.map((review, index) => {
                  const storedLikes = localStorage.getItem(
                    'likes_' + review.id
                  );

                  if (storedLikes !== null) {
                    return { ...review, likes: storedLikes };
                  }

                  return review;
                });
              });

              setReviews((prevReviews) => {
                return prevReviews.map((review, index) => {
                  const storedDislikes = localStorage.getItem(
                    'dislikes_' + review.id
                  );

                  if (storedDislikes !== null) {
                    return { ...review, dislikes: storedDislikes };
                  }

                  return review;
                });
              });

              const totalRating = parsedReviews.reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              );
              const average =
                parsedReviews.reviews.length > 0
                  ? totalRating / parsedReviews.reviews.length
                  : 0;

              setAverageRating(average);
              
              setTotalReviews(parsedReviews.reviews.length);
            } else {
              console.error('Invalid reviews format:', parsedReviews);
            }
          } else {
            console.error('No value in the metafield:', firstMetafield);
          }
        } else {
          console.error('No metafields found in the data:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching product reviews:', error);
      });
  }, []);

  return (
    <div className="section-customer-reviews">
      <h2>Customer reviews</h2>
      <div className="customer-reviews-wrapper d-flex space-between">
        <div className="based-on-reviews">
          <div className='stars-rating d-flex align-item-c'>
            {drawAndColorStars(5)}
            <span className='average-rating'>{averageRating}</span>
          </div>
          <span className='based-on-reviews-txt'>Based on {totalReviews} reviews</span>
        </div>
        <div className="based-on-starts-reviews">
        {[...Array(5).keys()].map((rowIndex) => (
        <div key={rowIndex} className="star-row d-flex align-item-c mb-14">
          {[...Array(5).keys()].map((colIndex) => (
          
              <span
                key={colIndex}
                className={
                  colIndex <= 4 - rowIndex
                    ? 'icon-star-colored'
                    : 'icon-star'
                }
              ></span>
           
          ))}
            
            <span class="progress" ><span  className="progress-bar" style={{ width: `${(reviews.filter((rw) => rw.rating === 5 - rowIndex).length / reviews.length) * 100}%` }}></span></span>
            <div >
              {reviewsToShow.filter((rw) => rw.rating === 5 - rowIndex).length}
            </div>
         
        </div>
      ))}
        </div>
        <div>
          <LeaveReview handleModalSubmit={handleModalSubmit} />
        </div>
      </div>
      <div className='custom-select'>
        <label>Sort by:</label>
        <select id="selectSort" value={sortBy} onChange={handleSelectChange}>
          <option value="HighestRating"> Highest Rating</option>
          <option value="LowestRating">Lowest Rating</option>
          <option value="OnlyPictures">Only Pictures</option>
          <option value="MostHelpful">Most helpful</option>
        </select>
        <div className="arrow-down down"></div>
      </div>

      <div className="table">
        {reviewsToShow.map((review, index) => (
          <div className="row header-row" key={index}>
            <div className="cell">
              <div className="review">
                <p className='review-author'>{drawAndColorStars(review.rating)}</p>
                <h3 className='review-author'>{review.author}</h3>
                <p>{review.date}</p>
              </div>
            </div>
            <div className="cell">
              <div className="review">
                <h4>{review.title}</h4>
                <p className='review-comments'>{review.body}</p>
                
                {
                  (review.photo && review.photo[0] !== 'undefined' && review.photo !== null) &&
                  <img 
                    className="review-photo"
                    src={URL.createObjectURL(review.photo[0])} 
                    alt="Selected Image" 
                    style={{ maxWidth: '100%' }}
                  />
                }
              </div>
              <div className="review-like d-flex align-item-c">
                Was this helpful{' '}
                <span
                  className="icon-thumbsup"
                  onClick={() => handleLike(review.id, review.likes * 1 + 1)}
                ></span>
                {review.likes}
                <span
                  className="icon-thumbsdown"
                  onClick={() =>
                    handleDislike(review.id, review.dislikes * 1 + 1)
                  }
                ></span>
                {review.dislikes}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-none">{count}</div>
    </div>
  );
};

export default ProductReviews;
