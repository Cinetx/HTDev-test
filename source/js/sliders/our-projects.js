try {
  const ourProjectsSliderElement = document.querySelector('.our-projects__slider');
  const ourProjectsSwiper = ourProjectsSliderElement.querySelector('.swiper');
  const ourProjectsSwiperButton = ourProjectsSliderElement.querySelector('.slider-button');

  const swiper = new Swiper(ourProjectsSwiper, {
    loop: true,
    navigation: {
      nextEl: ourProjectsSwiperButton,
    },

    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
  });

} catch {

}
