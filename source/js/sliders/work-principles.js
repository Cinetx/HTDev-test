try {
  const workPrinciplesSliderElement = document.querySelector('.work-principles__slider');
  const workPrinciplesSwiper = workPrinciplesSliderElement.querySelector('.swiper');
  const workPrinciplesSwiperButton = workPrinciplesSliderElement.querySelector('.slider-button');

  const swiper = new Swiper(workPrinciplesSwiper, {
    loop: true,
    navigation: {
      nextEl: workPrinciplesSwiperButton,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
  });

} catch {

}
