/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Image } from "antd";
import Slider from "react-slick";

export const SliderComponent = ({ arrImages }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed :3000 ,
    autoplay: true,
  };

  return (
    <div> 
      <Slider {...settings}>
        {arrImages.map((image, index) => (
          <div key={index} style={{alignItems : "center", justifyContent: "center"}}>
            <Image src={image} alt="slider" width="100%" height={350} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
