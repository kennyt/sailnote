//Place all the behaviors and hooks related to the matching controller here.
//All this logic will automatically be available in application.js.
//You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


//this is for the user show page
$(document).ready(function(){
	if ($('.archive').attr('user-show') == "1"){
		$('body').on('click', '.change_image_button', function(){
			$('.image_insert').show()
			$('.imgur_text').show()
			$('.submit_image_url').focus();
			$(this).hide();
		})

		$('body').on('keyup','.submit_image_url', function(){
		  	var link = $('.submit_image_url').val();
		  	if (link.length > 7){
		  		var username = $(this).attr('data-username');
			  	$.post('/'+username+'/update_pic',{
			  		link: link
			  	}, function(response){
			  		if (response['yes'] == '1'){
			  			$('img').attr('src',link)
			  			$('.change_image_button').show()
			  			$('.image_insert').hide()
							$('.imgur_text').hide()
							$('.submit_image_url').val('')
			  		}
			  	})
			  }
		  })

		$('body').on('click','.submit_email_button', function(){
			var email = $('.email_input').val();
			var user = $(this).attr('data-user')
			$.post('/'+user+'/add_email_follower', {
				email: email
			}, function(response){
				if (response['yes'] == '1'){
					$('.email_call').html('done')
				}
			})
		})

		$(".new_post_input").keyup(function (e) {
	    if (e.keyCode == 13) {
				var title = $('.new_post_input').val()
				if (title.length > 0){
					if (title.indexOf('-') == -1){
						$.post('/posts',{post:{
							id: $('.cover-header').html(),
							title: title
						}}, function(response){
							if (response['yes']){
								$('.new_post_input').val('')
								var date = response['date'];
								var href = '/'+$('.cover-header').html()+'/'+encodeURIComponent(title.toLowerCase().replace(/ /g, '-'));
								var prependTitle = title;
								$('.unpublished_list').prepend('<a class="essay-title" href="'+href+'"><li class="post_line">'+prependTitle+'</li></a>')
								$('.post_line').css({'width':$('.new_post_input').width()})
								$('#unpublished_empty').remove();
							}else {
								if (response['no']){
									$('.new_post_input').attr('placeholder', response['no'])
									$('.new_post_input').val('')
									$('.new_post_input').attr('class','new_post_input input-error')
								}
							}
						})
					} else {
						$('.new_post_input').attr('placeholder', 'title cannot have hyphen')
						$('.new_post_input').val('')
						$('.new_post_input').attr('class','new_post_input input-error')
					}
				}
	    } else {
	    	$('.new_post_input').attr('placeholder', 'enter new post idea')
				$('.new_post_input').attr('class','new_post_input')
				var input = $(this).val();
	    }
		});

		$('.new_post_input').focus(function(){
			$('.new_post_input').css({'background':'#ecf0f1'})
		})

		$('.new_post_input').focusout(function(){
			$('.new_post_input').css({'background':'white'})
		})

		$('.archive').css({'width': '550px'})
		$('.new_post_input').css({'width': $('.archive').width()-4})

		if ($('.new_post_input').length > 0){
			$('.post_line').css({'width':$('.new_post_input').width() - 10})
		} else {
			$('.post_line').css({'width':$('.archive').width() - 10})
		}


		// $('.break-top').css({'width':$('.post_line').width()+2})
		$('.cover-box').css({'width': $(document).width()})
		$('.cover-box img').css({'width': screen.width})
		
		$('.sidebar_nav').css({'background':'#e74c3c', 'width':'20px'})
		setTimeout(function(){
			$('.sidebar_nav').attr('style','')
		}, 300)
	}
})