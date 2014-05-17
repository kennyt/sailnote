//Place all the behaviors and hooks related to the matching controller here.
//All this logic will automatically be available in application.js.
//You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

function autoSetEditorHeight(){
	var beforeScrollTop = $(document).scrollTop();
	var lastChild = $($('iframe').contents().find('body').children()[$('iframe').contents().find('body').children().length - 1])
	if ($('iframe').contents().find('body').children().length > 0){
		$('iframe').height(lastChild.offset().top + lastChild.height() + 70)
	} else {
		$('iframe').height($('iframe').contents().height())
	}
	setTimeout(function(){
		$(document).scrollTop(beforeScrollTop)
	},0)
}

//text_editor code. runs on every page with the class .edit-box
$(document).ready(function(){
	if ($('.edit-box').length > 0){
		$('body').on('click','.edit-submit',function(ev){
			if ($(this).attr('datasubmit').length){
				ev.preventDefault();
				ev.stopPropagation();
				var user = $('.edit-title').attr('data_author');
				var title = encodeURIComponent($('.edit-title').attr('datatitle').toLowerCase());

				$('.edit-box').val($('iframe').contents().find('body').html())
				$('.save_success').attr('style','display:block;background:#c0392b;');
				$('.save_success').html('saving..')

				if ($('.edit-title').val().indexOf('-') == -1){
					$.post('/'+user+'/'+title+'/update_post_json',{post:
					{	id: $('.edit-submit').attr('data_id'),
						title: $('.edit-title').val(),
						text: $('.edit-box').val()
					}}, function(response){
						if (response['yes'] == '1'){
							$('.save_success').attr('style','display:block;')
							$('.save_success').html('saved!')
							$('#post_error').hide();
							var title = encodeURIComponent($('.edit-title').val().replace(/ /g, '-').toLowerCase());
							$('.edit-title').attr('datatitle', title)
							$('.edit_back_button').attr('href','/' + $('.edit-title').attr('data_author') + '/'+title)
							setTimeout(function(){
								$('.save_success').hide();
							}, 300)
						} else {
							$('.save_success').html(response['no'])
						}
					})
				} else {
					$('.save_success').html('Title cannot have hyphen');
				}

			}
		})

		$.fn.myTextEditor = function(options){
		    // extend the option with the default ones
		    var settings = $.extend({
		        width : "770px"
		    },options);
		    return this.each(function(){
		       var $this = $(this).hide();
				   // create a container div on the fly
				   var containerDiv = $("<div/>").attr('class','txt_editor');
				   $this.after(containerDiv); 
				   var editor = $("<iframe/>",{
				       frameborder : "0",
				       id : "the_editor",
				       css : {
				           width : 770,
				           'margin-left': 'auto',
				           'margin-right': 'auto',
				           'font-family': 'open sans'
				       }
				   }).appendTo(containerDiv).get(0);
				   // opening and closing the editor is a workaround to solve issue in Firefox
				   editor.contentWindow.document.open();
				   editor.contentWindow.document.close();
				   editor.contentWindow.document.designMode="on";
				   editor.scrolling="no";
				   // $('iframe').contents().find('body').attr('spellcheck','false')
					 $('iframe').contents().find('head').append($('<style>').html('@import url(http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,700|Hammersmith+One|Droid+Sans:700|Merriweather:700); text-decoration:none;border-bottom: 1px solid #2980b9;.text_link:link {color:#2980b9;}.text_link:visited {color:#95a5a6; border-bottom: 1px solid #95a5a6;}.text_link:active {color:red;} blockquote{position: relative;margin-left: 0px;margin-right: 0px;border-left: 60px solid #7f8c8d; padding:20px;text-align:left; font-family: georgia, serif; font-size: 24px; background:#efefef; color: #282828;-webkit-font-smoothing: antialiased;-webkit-text-stroke-width: 0px;-webkit-text-stroke-color: #202020;}blockquote::before {content: ",,";font-size: 100px;color: white;position: absolute;left:-53px;margin-top: 0px;top: -70px;font-family: georgia;vertical-align: 25px;} h1{font-family:Merriweather;} .text_link{text-decoration:none; border-bottom:1px solid #2980b9;'))
					var buttonPane = $("<div/>",{
					    "class" : "editor-btns"
					}).prependTo($('body'));

					var btnBold = $("<a/>",{
							"class": "bold-btn",
					    href : "javascript:void(0)",
					    text : "B",
					    data : {
					        commandName : "bold"
					    },
					    click : execCommand 
					}).appendTo(buttonPane);

					var btnItalics = $("<a/>",{
						"class": "italic-btn",
					    href : "#",
					    text : "I",
					    data : {
					        commandName : "italic"
					    },
					    click : execCommand 
					}).appendTo(buttonPane);

					var btnImage = $("<a/>",{
						"class": "image-btn",
					    href : "#",
					    text : "+image",
					    data : {
					        commandName : "insertImage",
					        argument : ""
					    },
					    click : getImageLink 
					}).appendTo($('.sidebar_nav'));

					var btnLink = $("<a/>",{
						"class": "link-btn",
					    href : "#",
					    text : "link",
					    data : {
					        commandName : "createLink",
					        argument: ""
					    },
					    click : getLink 
					}).appendTo(buttonPane);

					var btnH1 = $("<a/>",{
						"class": "h1-btn",
					    href : "#",
					    text : "h1",
					    data : {
					        commandName : "formatBlock",
					        argument: "<H1>"
					    },
					    click : execCommand
					}).appendTo(buttonPane);

					var btnQuote = $("<a/>",{
						"class": "quote-btn",
					    href : "#",
					    text : "\"\"",
					    data : {
					        commandName : "formatBlock",
					        argument: "<BLOCKQUOTE>"
					    },
					    click : execCommand
					}).appendTo(buttonPane);

					// $('iframe').contents().find('body').attr('style','background:white;width:620px;margin:0px;padding-left:75px;padding-right:75px;font-family:"open sans";font-size:18px;line-height:1.45;word-wrap:break-word; border:0px;-webkit-font-smoothing: antialiased;-webkit-text-stroke-width: .2px;-webkit-text-stroke-color: #2c3e50;height:'+$('iframe').contents().height()+';')
					$('iframe').contents().find('body').css(css($('.post_text')))
					$('iframe').contents().find('body').css({'border-bottom':'0px', 'padding-bottom':'0px'})
					$('iframe').after('<div class="below-edit-border"></div>')
					$('.share_buttons').appendTo($('.txt_editor'))
					$('.end_post_archive').appendTo($('.txt_editor'))
					// $('.txt_editor').css({height: settings.height})
					// $('.txt_editor').css({left: (screen.width - 700)/2})
					// $('.txt_editor').css({left: $('.edit-title').offset().left - 75})
					$('.editor-btns').css({left: $('iframe').offset().left - 30})

					function execCommand (e) {
						e.preventDefault()
						var beforeFormat;
						if ($(this).data("commandName") == "formatBlock"){
				    	beforeFormat = $('iframe').contents()[0].getSelection().baseNode.parentNode
				    }

				    var contentWindow = editor.contentWindow;
				    contentWindow.focus();
				    contentWindow.document.execCommand($(this).data("commandName"), false, $(this).data("argument") || "");
				    contentWindow.focus();

				    if ($(this).data("commandName") == "insertImage"){
				    	setTimeout(function(){
				    		$('iframe').contents().find('img').css({'max-width':'550px'})
				    	}, 50)
				    }

				    if ($(this).data("commandName") == "formatBlock"){
				    	var afterFormat = $('iframe').contents()[0].getSelection().baseNode.parentNode
				    	if (beforeFormat == afterFormat){
				    		console.log('hi')
				    		contentWindow.document.execCommand('formatBlock', false, 'div')
				    	}
				    }
				    // $('iframe').height($('iframe').contents().height() + 50)
				    autoSetEditorHeight();

				    return false;
					}

					function getImageLink(){
						$('body').append('<input class="post_image_getter" placeholder="paste image URL (use imgur)"></input>')
						$('.post_image_getter').css({position: 'absolute', left: $('.image-btn').offset().left - 150, width: 200, padding: '5px', top:'350px'})
						var that = this;
						$('.post_image_getter').focus();
						$('.post_image_getter').keyup(function(){
							var input = $(this).val()
							if (input.length > 6){
								$(that).data("argument", input)
								var boundExec = execCommand.bind(that)
								boundExec();
								$('.post_image_getter').remove();
							}
						})
					}

					function getLink(){
						var that = this;
						$('.link-div').append('<input class="text_link_getter" placeholder="link here. press enter when done"></input>');
						$('.text_link_getter').css({position: 'absolute', right: 1, width: 200, padding: '5px', top:70})
						$('.text_link_getter').focus()
						$('.text_link_getter').keydown(function(ev){
							if (ev.keyCode == 13){
								$(that).data('argument', $('.text_link_getter').val())
								execCommand.bind(that)();
								$('.text_link_getter').remove();
							}
						})
					}

					function h1Format(){
						console.log('gg')
						return false;
					}
		    });
		}




		$('.edit-box').myTextEditor();
		var textBody = $('iframe').contents().find('body')
		textBody.html($('.edit-box').val())
		textBody.find('img').attr('onload', function(){ this.setAttribute('loaded','1') })
		textBody.find('a').attr('class','text_link')
		// textBody.height($('iframe').contents().height())
		autoSetEditorHeight();
		textBody.on('mouseup', function(ev){
			setTimeout(function(){
				if ($('iframe').contents()[0].getSelection().toString().length > 0){
					$('.editor-btns').show();
					$('.editor-btns').css({top: $(document).scrollTop() +ev.screenY - 170})
					$('.editor-btns').css({left: ev.screenX - $('.editor-btns').width()/2})
					$('.editor-btns').hide().fadeIn(100);
				} else {
					$('.editor-btns').fadeOut(100);
					$('.text_link_getter').remove();
				}
			}, 0)
		})
		var isCtrl = false;

		$('iframe').height($('iframe').contents().height())
		var setHeight = setInterval(function(){
			if (textBody.find('img').length > 0){
				var allLoaded = true;
				$.each(textBody.find('img'), function(i, image){
					if (!($(image).attr('loaded') == 1)){
						allLoaded = false;
					}
				})
				if (allLoaded){
					autoSetEditorHeight();
					textBody.find('img').attr('loaded','0')
					clearInterval(setHeight)
				}
			} else {
				autoSetEditorHeight();
				clearInterval(setHeight)
			}
			console.log('zzzz')
		}, 1000)

		textBody.on('keydown',function(ev){
			if (ev.keyCode == 8){
				$('.editor-btns').hide();
			}
			if(ev.keyCode == 17) isCtrl=true;
	    if(ev.keyCode == 83 && isCtrl == true) {
	      $('.edit-submit').trigger('click')
	      ev.preventDefault();
	    }
	    // $('iframe').height($('iframe').contents().height() - 26)
	    // if (ev.keyCode == 13){
	    // 	$('iframe').height($('iframe').height() + 26)
	    // }
		})
		textBody.on('paste', function(e){
			setTimeout(function(){
				autoSetEditorHeight();
			},0)
		})
		textBody.on('keyup',function(e){
		  if(e.keyCode == 17) isCtrl=false;
		  setTimeout(function(){
		    autoSetEditorHeight();
		  },0)
		  // textBody.height($('iframe').height())
	   //  // $('iframe').height($('iframe').contents().height() - 30)
	   //  if ($('iframe').contents().find('html').width() < 700){
	   //  	$('iframe').height($('iframe').contents().height())
	   //  }
		})


		document.onkeyup=function(e){
		    if(e.keyCode == 17) isCtrl=false;
		}

		document.onkeydown=function(e){
	    if(e.keyCode == 17) isCtrl=true;
	    if(e.keyCode == 83 && isCtrl == true) {
	      $('.edit-submit').trigger('click')
	      e.preventDefault();
	    }
		}

		$('.cover-box').css({'width': $(document).width()})
		$('.cover-box img').css({'width': screen.width})
		if ($('#the_editor').length > 0){
			$('.post_text').hide();
		}
	}
})