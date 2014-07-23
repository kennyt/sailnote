//Place all the behaviors and hooks related to the matching controller here.
//All this logic will automatically be available in application.js.
//You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


function findPost(postId){
	var selectedPost;
	$.each($('.essay-title'), function(i, title){
		if ($(title).attr('href').split('/')[2] == postId){
			selectedPost = title
		}
	})
	return selectedPost
}

function createConfirmBox(button, method){
	var postId = $(button.parentNode.parentNode).attr('href').split('/')[2]
	var title = '"'+$(button.parentNode.parentNode).find('.essay-text').html()+'"'
	var confirmClass;
	if (method == 'publish'){
		confirmClass = 'confirm-publish';
	}
	if (method == 'delete'){
		confirmClass = 'confirm-delete';
	}
	if (method == 'unpublish'){
		confirmClass = 'confirm-unpublish';
	}

	$('body').append('<div class="confirm-box"><div class="confirm-message">'+method+' '+title+'?</div><span class="confirm-button '+confirmClass+'" data-method="'+method+'" data-title="'+postId+'" data-unencoded="'+postId+'">'+method+'</span><span class="confirm-cancel">cancel</span></div>')

	// var right = $(document).width() - ($(button).offset().left - 70)
	var left = $('.archive').offset().left - 3
	var top = $(button).offset().top - $('.confirm-box').height() - 46;
	if (top < 0){
		top = 0;
	}
	$('.confirm-box').css({'left':left,'top':top})
}

function saveProfilePic(link){
	var username = $('.page_identifier').attr('data-username');
	$.post('/'+username+'/update_pic',{
		link: link
	}, function(response){
		if (response['yes'] == '1'){
			$('.save_success').attr('style','display:block;')
			$('.save_success').html('saved!')

			setTimeout(function(){
				$('.save_success').hide();
			}, 1000)
		}
	})
}

function rollInPostList(){
	var posts = $('.post_line');
	var startingTimeout = 0;
	$.each(posts, function(i, post){
		setTimeout(function(){
			$(post).css('opacity','1');
		}, startingTimeout);
		startingTimeout += 20;
	})
}


//this is for the user show page
$(document).ready(function(){
	if ($('.page_identifier').attr('id') == 'user_view') {
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

		$('.archive').hover(function(){
			$(this).attr('hovered','1');
		}, function(){
			$(this).attr('hovered','0');
		})

		$(".new_post_input").keydown(function(){
			setTimeout(function(){
			  if ($('.new_post_input').val().length > 0){
			  	$('.new_post_input').css({'background-position':'25% 3000%'})
					$('.press_enter_info').css({'opacity':'1'});
			  } else {
			  	$('.new_post_input').css({'background-position':'25% 30%'})
					$('.press_enter_info').css({'opacity':'0'});
			  }
			},0)
		})

		$(".new_post_input").focusout(function(){
			if ($('.archive').attr('hovered') == '0'){
				$('.new_post_input').height(40);
				$('.press_enter_info').css({'opacity':'0'});
			}
		})

		$(".new_post_input").focus(function(){
			$(this).height(100);
			if ($('.new_post_input').val().length > 0){
				setTimeout(function(){
					$('.press_enter_info').css({'opacity':'1'});
				}, 100)
			}
		})

		$(".new_post_input").keyup(function (e) {
	    if (e.keyCode == 13) {
				var title = $('.new_post_input').val()
				if (title.length > 0){
					if (title.indexOf('-') == -1){
						$.post('/posts',{post:{
							id: $('.page_identifier').attr('data-username'),
							title: title
						}}, function(response){
							if (response['yes']){
								$('.new_post_input').val('')
								var date = response['date'];
								var href = '/'+$('.page_identifier').attr('data-username')+'/'+response['url'];
								var prependTitle = title;
								$('.unpublished_list').prepend('<a class="essay-title" href="'+href+'"><div class="post_line"><div class="publish_button"><div class="left-hover-tag">publish</div></div><div class="delete_button"><div class="right-hover-tag">delete</div></div><span class="essay-text">'+prependTitle+'</span></div></a>')
								$('.post_line').css({'width':$('.new_post_input').width() - 140})
								$('#unpublished_empty').remove();
								$('.press_enter_info').css({'opacity':'0'});
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
	    	$('.new_post_input').attr('placeholder', 'enter new post title')
				$('.new_post_input').attr('class','new_post_input')
				var input = $(this).val();
				
	    }
		});

		$('body').on('click','.publish_button',function(ev){
			ev.preventDefault()
			$('.confirm-box').remove();
			createConfirmBox(this, 'publish')
		})

		$('body').on('click','.unpublish_button',function(ev){
			ev.preventDefault()
			$('.confirm-box').remove();
			createConfirmBox(this, 'unpublish')
		})

		$('body').on('click','.delete_button',function(ev){
			ev.preventDefault()
			$('.confirm-box').remove();
			createConfirmBox(this, 'delete')
		})

		$('body').on('click','.confirm-cancel',function(){
			$('.confirm-box').remove();
		})

		$('body').on('click','.confirm-button',function(){
			//confirm publishing
			if ($(this).attr('data-method') == 'publish'){
				var postId = $(this).attr('data-title')
				var unencoded = $(this).attr('data-unencoded')
				$('.confirm-box').html('publishing...');
				$.post('/posts/'+postId+'/publish', function(data){
					$('#empty-published').remove();
					$('.confirm-box').remove();
					if (data['yes'] == '1'){
						var post = findPost(unencoded);
						var post_line = $(post).find('.post_line')
						$(post_line).find('.publish_button').remove();
						$(post_line).append('<div class="essay-date">'+data['pub_date']+'</div>')
						$(post_line).append('<div class="unpublish_button"><div class="left-hover-tag">unpublish</div></div>')
						$(post_line).append('<span class="view-count">'+data['views']+' views</span>')

						$(post_line).css({'opacity':'0'})
						setTimeout(function(){
							$('.published_list').prepend(post);
							setTimeout(function(){
								$(post_line).css({'opacity':'1'});
							},10)
						}, 350)
					}
				})
			}

			//confirm unpublish
			if ($(this).attr('data-method') == 'unpublish'){
				var postId = $(this).attr('data-title')
				var unencoded = $(this).attr('data-unencoded')
				$('.confirm-box').html('unpublishing...');

				$.post('/posts/'+postId+'/unpublish', function(data){
					$('.confirm-box').remove();
					if (data['yes'] == '1'){
						var post = findPost(unencoded);
						var post_line = $(post).find('.post_line')

						$(post_line).find('.essay-date').remove();
						$(post_line).find('.view-count').remove();
						$(post_line).find('.unpublish_button').remove();
						$(post_line).append('<div class="publish_button"><div class="left-hover-tag">publish</div></div>')

						$(post_line).css({'opacity':'0'})
						setTimeout(function(){
							$('.unpublished_list').prepend(post);
							setTimeout(function(){
								$(post_line).css({'opacity':'1'});
							},10)
						}, 350)
					}
				})
			}

			//confirm delete
			if ($(this).attr('data-method') == 'delete'){
				var postId = $(this).attr('data-title')
				var unencoded = $(this).attr('data-unencoded')
				$('.confirm-box').html('deleting...');

				$.post('/posts/'+postId+'/delete_post_json', function(data){
					$('.confirm-box').remove();
					if (data['yes'] == '1'){
						var post = findPost(unencoded);
						var post_line = $(post).find('.post_line')

						$(post_line).css({'opacity':'0'})
						setTimeout(function(){
							$(post).remove();
						}, 350)
					}
				})
			}
		})

		$('body').on('click','.preview_user',function(){
			$(this.parentNode).hide()
			$('.hidden_toolbelt').prepend('<li><span class="exit_preview_mode control_button">exit preview</span></li>')

			$('.unpublished_list').css({'opacity':'0'})
			$('.new_post_input').css({'opacity':'0'})
			$('.line-break').css({'opacity':'0'})
			// $('.post_list_header').css({'opacity':'0'})
			$('.batman_toolbelt').attr('class','batman_toolbelt view_mode')
			$('.bio_text').attr('contentEditable','false')
			$('.change_pic_btn').fadeOut(200);

			setTimeout(function(){
				$('.view-count').hide()
				$('.unpublished_list').hide()
				$('.new_post_input').hide()
				$('.line-break').hide()
				// $('.post_list_header').hide()
				$('.unpublish_button').hide()
				$('.delete_button').hide()
				// $('.archive').css({'border-top':'5px solid #345A6B'});
			},600)
		})

		$('body').on('click','.exit_preview_mode',function(){
			$(this.parentNode).remove()
			$($('li .preview_user')[0].parentNode).show();

			$('.unpublished_list').show()
			$('.new_post_input').show()
			$('.line-break').show()
			$('.post_list_header').show()
			$('.view-count').show()
			$('.unpublish_button').attr('style','')
			$('.delete_button').attr('style','')
			$('.archive').css({'border-top':'0px'});
			$('.bio_text').attr('contentEditable','true')
			$('.change_pic_btn').fadeIn(200);

			setTimeout(function(){
				$('.unpublished_list').css({'opacity':'1'})
				$('.new_post_input').css({'opacity':'1'})
				$('.line-break').css({'opacity':'1'})
				$('.post_list_header').css({'opacity':'1'})
			},50)
			$('.batman_toolbelt').attr('class','batman_toolbelt')
		})

		$('body').on('click','.essay-title', function(){
			//only happens if you click through to link
			setTimeout(function(){
				if ($('.confirm-box').length < 1 && !(document.queryCommandSupported('insertBrOnReturn'))){
					$('.archive').css({'opacity':'0'})
					$('.bio_text').css({'opacity':'0'})
					$('.cover-box').css({'opacity':'0'})
				}
			},10)
		})

		$('body').on('click','.change_pic_btn', function(e){
			$('.image_getter').fadeIn(200);
			$('.image_getter').css('top','50px')
		})

		$('body').on('click','.cancel_pic', function(e){
			$('.image_getter').fadeOut(200);
		})

		$('.post_image_getter').keyup(function(){
			var input = $(this).val()
			if (input.length > 6){
	    	$('#cover-pic').attr('src', input);
	    	$(this).val('');
				$('.image_getter').fadeOut(200);
				saveProfilePic(input);
			}
		})

		$('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {
	  	$('.hidden_image_holder').html(
	    	$.cloudinary.image(data.result.public_id, 
	      { format: data.result.format, version: data.result.version})
	    );
	    var link = $('.hidden_image_holder img').attr('src');
	    $('#cover-pic').attr('style', 'background-image:url('+link+')');
			$('.image_getter').fadeOut(200);
			saveProfilePic(link);
		  // return true;
		});

		$('.archive').css({'width': '570px'})
		$('.new_post_input').css({'width': $('.archive').width()})

		if ($('.new_post_input').length > 0){
			$('.post_line').css({'width': '430px'})
		} else {
			$('.post_line').css({'width': '430px'})
		}
		

    $('div[data-placeholder]').on('keydown keypress input', function() {
      if (this.textContent) {
        this.dataset.divPlaceholderContent = 'true';
      }
      else {
        delete(this.dataset.divPlaceholderContent);
      }
    });

    $('.bio_text').on('keydown', function(){
    	var changed = parseInt($(this).attr('data-changed'))
    	$(this).attr('data-changed', changed+1)

    	setTimeout(function(){
    		if ($('.bio_text').attr('data-changed') == changed+1){
    			var username = $('.page_identifier').attr('data-username')
    			var save_text = Autolinker.link($('.bio_text').text().replace(/&nbsp;/, ''), {className:'text_link'})
    			$('.bio_text').html(save_text)
    			$.post('/'+username+'/change_bio', {
    				user: {
    					bio:save_text
    				}
    			}, function(response){
    				if (response['yes'] == '1'){
    					$('.save_success').attr('style','display:block;')
							$('.save_success').html('saved!')

							setTimeout(function(){
								$('.save_success').hide();
							}, 1000)
    				}
    			})
    		}
    	},1000)
    })

    $('.post_line').css('opacity','0');
    setTimeout(function(){
    	$('.post_line').attr('class','post_line insta_transition');
    	$('.list_loading_bar').width(570);
    	setTimeout(function(){
    		$('.list_loading_bar').css('opacity','0');
   			rollInPostList();
    	}, 400)
    },0)
	}
})