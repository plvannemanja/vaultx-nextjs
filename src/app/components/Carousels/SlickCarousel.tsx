"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";

export default function SlickCarousel(props: any) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = props.images;
  const slider = useRef(null);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Slider ref={slider} {...settings}>
        {images.map((image: string, index: number) => {
          return (
            <div key={index}>
              <img
                src={image}
                alt="NFT"
                style={{
                  margin: "auto",
                  height: "100vh",
                }}
              />
            </div>
          );
        })}
      </Slider>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "5px",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "100%",
        cursor: "pointer",
      }} onClick={() => (slider?.current as any)?.slickPrev()}>
        <img src="/images/image-left.png" alt="arrow"/>
      </div>
      <div style={{
        position: "absolute",
        top: "50%",
        right: "5px",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "100%",
        cursor: "pointer",
      }} onClick={() => (slider?.current as any)?.slickNext()}>
        <img src="/images/image-left.png" alt="arrow" style={{ transform: 'rotate(-180deg)' }}/>
      </div>
    </div>
  );
}
