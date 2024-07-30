import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css"; // Import your global styles or additional CSS files here
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper";
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API);
        if (data?.success) {
          setReviews(data?.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    })();
  }, []);

  return (
    <div className="text-white">
      <div className="flex justify-center">
        <div className="w-full max-w-maxContentTab lg:max-w-maxContent">
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[FreeMode, Pagination, Autoplay]}
            className="w-full"
          >
            {reviews.map((review, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-3 bg-gray-800 p-5 text-sm text-gray-200 rounded-md items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={review?.user?.image ? review?.user?.image : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-white">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-xs font-medium text-gray-300">{review?.course?.courseName}</h2>
                    </div>
                  </div>
                  <p className="font-medium text-gray-300 text-center">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <h3 className="font-semibold text-yellow-300">{review.rating.toFixed(1)}</h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default ReviewSlider;
