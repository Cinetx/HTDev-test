try {
  const staffOfferSliderElement = document.querySelector('.staff-offer__slider');
  const staffOfferSwiper = staffOfferSliderElement.querySelector('.swiper');
  const staffOfferSwiperButton = staffOfferSliderElement.querySelector('.slider-button');

  const swiper = new Swiper(staffOfferSwiper, {
    loop: true,
    navigation: {
      nextEl: staffOfferSwiperButton,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
  });

} catch {

}
