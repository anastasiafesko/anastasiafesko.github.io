$(document).ready(function() {
	$(".owl-carousel").owlCarousel({
		loop:true, //loop — зацикливаем наш слайдер
		items: 1, //items — количество элементов, которые будут отображаться одновременно
		margin: 130, //margin — это отступ справа у элемента слайдера
		stagePadding: 30, //stagePadding — данное свойство задает внутренние отступы слева и справа
		onTranslated: animateImgFunc, //onTranslated — функция, которая вызывается при полном появлении пункта (слайда) в активной области
		onChanged: animateImgClear //onChanged — еще одна функция, которая вызывается при смене слайда (пункта)
	});

	//Добавляем класс с анимацией изображения
	function animateImgFunc() {
		$(".owl-carousel .active .inner-testimonial img").addClass("animated bounceIn full-opacity");
	}

	//Удаляем класс с анимацией изображения
	function animateImgClear() {
		$(".owl-carousel .active .inner-testimonial img").removeClass("animated bounceIn full-opacity");
	}
});