import React from 'react';

const options = {
    nav: false,
    navText: [
      '<img src="assets/img/round_arrow_icon_1.svg" alt="">',
      '<img src="assets/img/round_arrow_icon_2.svg" alt="">',
    ],
    dots: true,
    autoplay: true,
    smartSpeed: 1000,
    autoplayTimeout: 3000,
    items: 1,
    margin: 8,
    slideToScroll: 1,
    center: false,
    autoplayHoverPause: true,
  };

export default function OwlCarousel({children}: {children: React.ReactNode}) {
  return (
    <OwlCarousel {...options}>
        {children}
    </OwlCarousel>
  )
}
