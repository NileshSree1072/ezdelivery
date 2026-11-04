import styled from "styled-components";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import StarsRating from "@/components/StarsRating";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {border, muted} from "@/lib/colors";

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -.02em;
  margin: 0 0 16px;
`;
const Subtitle = styled.h3`
  font-size: 1.05rem;
  margin: 0 0 12px;
`;
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;
const StarsRow = styled.div`
  margin-bottom: 12px;
`;
const ReviewWrapper = styled.div`
  border-top: 1px solid ${border};
  padding: 14px 0;
  h3{
    margin: 6px 0 4px;
    font-size: 1rem;
  }
  p{
    margin: 0;
    font-size: 14px;
    color: #475569;
  }
`;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  time{
    font-size: 13px;
    color: ${muted};
  }
`;
const Empty = styled.p`
  color: ${muted};
  margin: 0;
`;

export default function ProductReviews({product}) {
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [stars,setStars] = useState(0);
  const [reviews,setReviews] = useState([]);
  const [reviewsLoading,setReviewsLoading] = useState(false);
  function submitReview() {
    const data = {title,description,stars,product:product._id};
    axios.post('/api/reviews', data).then(res => {
      setTitle('');
      setDescription('');
      setStars(0);
      loadReviews();
    });
  }
  useEffect(() => {
    loadReviews();
  }, []);
  function loadReviews() {
    setReviewsLoading(true);
    axios.get('/api/reviews?product='+product._id).then(res => {
      setReviews(res.data);
      setReviewsLoading(false);
    });
  }
  return (
    <section>
      <Title>Ratings &amp; reviews</Title>
      <ColsWrapper>
        <WhiteBox>
          <Subtitle>Write a review</Subtitle>
          <StarsRow>
            <StarsRating onChange={setStars} />
          </StarsRow>
          <Input
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            aria-label="Review title"
            placeholder="Title" />
          <Textarea
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            aria-label="Review"
            placeholder="Was it fresh? How was the taste?" />
          <Button primary onClick={submitReview}>Submit review</Button>
        </WhiteBox>
        <WhiteBox>
          <Subtitle>All reviews {reviews.length > 0 && `(${reviews.length})`}</Subtitle>
          {reviewsLoading && (
            <Spinner fullWidth={true} />
          )}
          {!reviewsLoading && reviews.length === 0 && (
            <Empty>No reviews yet. Be the first to review this product.</Empty>
          )}
          {reviews.length > 0 && reviews.map(review => (
            <ReviewWrapper key={review._id}>
              <ReviewHeader>
                <StarsRating size={'sm'} disabled={true} defaultHowMany={review.stars} />
                <time>{(new Date(review.createdAt)).toLocaleDateString('en-IN')}</time>
              </ReviewHeader>
              <h3>{review.title}</h3>
              <p>{review.description}</p>
            </ReviewWrapper>
          ))}
        </WhiteBox>
      </ColsWrapper>
    </section>
  );
}
