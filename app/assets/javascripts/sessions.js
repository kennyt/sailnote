// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


$(document).ready(function(){
	if ($('.page_identifier').attr('id') == 'new_session') {

		$('.essaii_big').css({'margin-top':'12%'})// transition effect
		setTimeout(function(){
			$('.essaii_big').css({'opacity':'1'})
		}, 200)
		$('.hero_blog_wrapper').css({'top':$('.below_big').offset().top})

		$('body').on('click','.word_join', function(){
			$('.user_form').css({'background':'#bdc3c7','height':'250px'})
			$('.new_user').css({'display':'block','opacity':'1'})
			$(this).css({'background':'#bdc3c7','cursor':'default','color':'#2c3e50','border':'0px','text-decoration':'none'})
			$(this).html('creating account!')
		})
	}
})