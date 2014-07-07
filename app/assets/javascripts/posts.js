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

function setBlockquoteTop (ele, beforeTop){
	var parent = ele.parentNode
	if (($(parent).attr('class').indexOf('text_left_panel')) || ($(parent).attr('class').indexOf('text_right_panel'))){
		$(ele).css({'top':beforeTop});
		var catchSafe = 0
		while(checkOverlap(ele, parent)){
			$(ele).css({'top': $(ele).offset().top + 10})
			catchSafe += 1
			if (catchSafe == 400) {
				break
			}
		}
	}
}

function checkOverlap (ele, parent){
	var overlap;
	$.each($(parent).find('blockquote'), function(i, block){
		if (!(block ==  ele)){
			var eleDim = ele.getBoundingClientRect();
			var blockDim = block.getBoundingClientRect();
			overlap = !(eleDim.bottom < blockDim.top || 
	                eleDim.top > blockDim.bottom)
			if (overlap){
				return false;
			}
		}
	})
	return overlap;
}

function getSectionParent(selection){
	var parent = selection.anchorNode;
	var catchSafe = 0;
	while(!($(parent).is('section'))){
		if (parent == null){
			break
		} else {
			parent = parent.parentNode;
			if (catchSafe > 5){
				break;
			}
			catchSafe += 1
		}
	}
	return parent;
}

function boldChoiceButtons(section){
	var classes = $(section).attr('class').split(' ')
	$.each($('.outlined'), function(i, ele){
		$(ele).removeClass('outlined');
	})
	$.each(classes, function(i, elClass){
		if (elClass == 'text_left_panel'){
			$('#left_panel').addClass('outlined');
		}
		if (elClass == 'text_center_panel'){
			$('#center_panel').addClass('outlined');
		}
		if (elClass == 'text_right_panel'){
			$('#right_panel').addClass('outlined');
		}
		if (elClass == 'classic_font'){
			$('#classic_font').addClass('outlined');
		}
		if (elClass == 'graceful_font'){
			$('#graceful_font').addClass('outlined');
		}
	})
}

//text_editor code. runs on every page with the class .edit-box
$(document).ready(function(){
	if ($('.page_identifier').attr('id') == 'logged_in_post'){

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
						text: $('.edit-box').val(),
						url: $('.url_input').val()
					}}, function(response){
						if (response['yes'] == '1'){
							$('.save_success').attr('style','display:block;')
							$('.save_success').html('saved!')
							$('#post_error').hide();
							var title = encodeURIComponent($('.edit-title').val().replace(/ /g, '-').toLowerCase());
							$('.edit-title').attr('datatitle', title)
							$('.edit_back_button').attr('href','/' + $('.edit-title').attr('data_author') + '/'+title)

							var user = $('.page_identifier').attr('data-username')
							if (document.URL.split('/'+user+'/')[1] != response['url']){
								location.href = '/'+user+'/'+response['url']
							}
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
				           width : '100%',
				           'margin-left': 'auto',
				           'margin-right': 'auto',
				           '-webkit-transition': 'all 100ms ease-in-out',
									 '-moz-transition': 'all 100ms ease-in-out',
									 '-o-transition': 'all 100ms ease-in-out',
									 '-ms-transition': 'all 100ms ease-in-out',
									 'transition': 'all 100ms ease-in-out'
				       }
				   }).appendTo(containerDiv).get(0);
				   // opening and closing the editor is a workaround to solve issue in Firefox
				   editor.contentWindow.document.open();
				   editor.contentWindow.document.close();
				   editor.contentWindow.document.designMode="on";
				   editor.scrolling="no";
				   // stylings
				   var importFont = '@import url(http://fonts.googleapis.com/css?family=Source+Sans+Pro:400italic,700italic,400,700);';
				   var textLinkStyle = '.text_link{text-decoration:none; border-bottom:1px solid #2980b9;color:#202020;} .text_link:link {color:#202020;border-bottom: 1px solid #202020;}.text_link:visited {color:#202020;border-bottom: 1px solid #202020;}.text_link:active {color:red;}'
				   var selectionStyle = '::selection {background: #D8D8D8; color:black;} ::-moz-selection {background: #D8D8D8;color:black;}'
				   var sectionStyle = 'section{width: 100%; padding-top: 50px; padding-bottom:30px;position:relative; min-height: 90px;}'
				   var moverStyle = '.mover{position: absolute;top: 0px;right: 0px;height: 20px;width: 20px !important;background: blue; cursor:pointer;}'
				   var stretcherStyle = '.stretcher{position: absolute;bottom: 50%;left: 0px;height: 20px;margin:0px !important;width: 20px !important;background: red; cursor:pointer;}'



				   var text_left_panelStyle = '.text_left_panel div, .text_left_panel h1{ margin-left:9%; max-width:40%; width: 625px;} .text_left_panel blockquote, .text_left_panel .pullquote{right:7%; max-width:30%; width: 535px; float:right; padding-left: 20px; padding-right:20px; position: absolute; margin: 0px;} .text_left_panel h1{text-align:center;margin-bottom:15px; margin-top: 30px;} .text_left_panel figure {right:7%; max-width:50%; float:right; padding:0px; position: absolute; margin: 0px;} .text_left_panel img {width: 100%;} .text_left_panel blockquote{line-height:1.4; padding:20px;} .text_left_panel .pullquote{border:0px;font-style:italic;}'
				   var text_center_panelStyle = '.text_center_panel div{width: 625px;margin-left:auto;margin-right:auto;} .text_center_panel figure{text-align: center;} .text_center_panel h1{text-align:center; margin-bottom:15px; margin-top: 30px;} .text_center_panel blockquote{position: relative;top:0px !important;margin:30px; margin-left: auto;margin-right: auto;padding:20px; font-size: 20px; line-height: 1.4;  width:625px;} .text_center_panel .pullquote{width: 70%;margin-left: 12%; border-top: 0px solid black; border-bottom: 0px solid black;padding-right: 40px;padding-left:40px; text-align: center; font-size: 35px; font-style:italic; margin-bottom: 5px; margin-top: 5px;}'
				   var text_right_panelStyle= '.text_right_panel div, .text_right_panel h1{ margin-left:51%; max-width:40%; width: 625px;} .text_right_panel blockquote, .text_right_panel .pullquote{right:63%; max-width:30%; width: 535px; float:left; padding-left: 20px; padding-right:20px; position: absolute; margin: 0px;color:#95a5a6;} .text_right_panel h1{text-align:center;margin-bottom:15px; margin-top: 30px;} .text_right_panel figure {right:50%; max-width:50%; float:left; padding:0px; position: absolute; margin: 0px;} .text_right_panel img {width: 100%;} .text_right_panel blockquote{line-height:1.4; padding:20px;} .text_right_panel .pullquote{border:0px;font-style:italic; text-align: center;}'


				   var graceful_fontStyle = '.graceful_font div{font-family:source sans pro, sans-serif; font-size: 21px; letter-spacing:-0.005em;} .graceful_font blockquote{font-family: georgia,times new roman, times, serif; font-size: 20px;} .graceful_font h1 {font-family:georgia,times new roman, times, serif; font-size: 2.2em;line-height:1.3;} .graceful_font .pullquote{font-family: georgia,times new roman, times, serif; font-size: 35px;}'
				   var classic_fontStyle = '.classic_font {font-family:georgia; font-size: 20px; } .classic_font blockquote{font-family:source sans pro; font-size:18px;} .classic_font h1{font-family:source sans pro; font-size:2.5em;line-height:1.3;}.classic_font .pullquote{font-family:source sans pro; font-size: 35px;}'

				   var color_whiteStyle = '.color_white {background: white;} .color_white div, .color_white h1{ color: #383838; } .color_white blockquote{color: #7f8c8d; border-top: 8px solid #bdc3c7;border-bottom: 8px solid #bdc3c7;} .color_white .pullquote{border: 0px;} .color_white .text_link{text-decoration:none; border-bottom:1px solid #2980b9;color:#202020;} .color_white .text_link:link {color:#202020;border-bottom: 1px solid #202020;} .color_white .text_link:visited {color:#202020;border-bottom: 1px solid #202020;} .color_white .text_link:active {color:red;}'

				   var color_lightgreyStyle = '.color_lightgrey {background: rgb(246, 246, 239); color: black} .color_lightgrey div, .color_lightgrey h1 { color: black; } .color_lightgrey blockquote {color:#7f8c8d; border-top: 8px solid #7f8c8d;border-bottom: 8px solid #7f8c8d;} .color_lightgrey .text_link{text-decoration:none; border-bottom:1px solid #2980b9;color:#202020;} .color_lightgrey .text_link:link {color:#202020;border-bottom: 1px solid #202020;} .color_lightgrey .text_link:visited {color:#202020;border-bottom: 1px solid #202020;} .color_lightgrey .text_link:active {color:red;}' 

				   var color_lightblueStyle = '.color_lightblue {background: #ecf0f1; color: black} .color_lightblue div, .color_lightblue h1 { color: black; } .color_lightblue blockquote {color:#7f8c8d; border-top: 8px solid #7f8c8d;border-bottom: 8px solid #7f8c8d;} .color_lightblue .text_link{text-decoration:none; border-bottom:1px solid #2980b9;color:#202020;} .color_lightblue .text_link:link {color:#202020;border-bottom: 1px solid #202020;} .color_lightblue .text_link:visited {color:#202020;border-bottom: 1px solid #202020;} .color_lightblue .text_link:active {color:red;}'

				   var color_slategreyStyle = '.color_slategrey {background: #708090;} .color_slategrey div {color: white} .color_slategrey h1 { color: white; } .color_slategrey blockquote {color:#bdc3c7; border-top: 8px solid #A0A0A0;border-bottom: 8px solid #A0A0A0;} .color_slategrey .text_link{text-decoration:none; border-bottom:1px solid white;color:white;} .color_slategrey .text_link:link {color:white;border-bottom: 1px solid white;} .color_slategrey .text_link:visited {color:white;border-bottom: 1px solid white;} .color_slategrey .text_link:active {color:red;}'

				   var color_blackStyle = '.color_black {background: #181818;} .color_black div {color: white} .color_black h1 { color: white; } .color_black blockquote {color:#909090; border-top: 8px solid #A0A0A0;border-bottom: 8px solid #A0A0A0;} .color_black .text_link{text-decoration:none; border-bottom:1px solid white;color:white;} .color_black .text_link:link {color:white;border-bottom: 1px solid white;} .color_black .text_link:visited {color:white;border-bottom: 1px solid white;} .color_black .text_link:active {color:red;}'

				   var color_darkblueStyle = '.color_darkblue {background: #2980b9;} .color_darkblue div {color: white} .color_darkblue h1 { color: white; } .color_darkblue blockquote {color:#ADD8E6; border-top: 8px solid #87CEFA;border-bottom: 8px solid #87CEFA;} .color_darkblue .text_link{text-decoration:none; border-bottom:1px solid white;color:white;} .color_darkblue .text_link:link {color:white;border-bottom: 1px solid white;} .color_darkblue .text_link:visited {opacity: .5;} .color_darkblue .text_link:active {color:red;}'

				   var color_darkredStyle = '.color_darkred {background: #c0392b;} .color_darkred div {color: white} .color_darkred h1 { color: white; } .color_darkred blockquote {color:#FFA07A; border-top: 8px solid #E9967A;border-bottom: 8px solid #E9967A;} .color_darkred .text_link{text-decoration:none; border-bottom:1px solid white;color:white;} .color_darkred .text_link:link {color:white;border-bottom: 1px solid white;} .color_darkred .text_link:visited {opacity: .5;} .color_darkred .text_link:active {color:red;}'

				   var color_darkpurpleStyle = '.color_darkpurple {background: #8e44ad;} .color_darkpurple div {color: white} .color_darkpurple h1 { color: white; } .color_darkpurple blockquote {color:#D8BFD8; border-top: 8px solid #DDA0DD;border-bottom: 8px solid #DDA0DD;} .color_darkpurple .text_link{text-decoration:none; border-bottom:1px solid white;color:white;} .color_darkpurple .text_link:link {color:white;border-bottom: 1px solid white;} .color_darkpurple .text_link:visited {opacity: .5;} .color_darkpurple .text_link:active {color:red;}'

				   var color_darktealStyle = '.color_darkteal {background: #008080;} .color_darkteal div {color: white} .color_darkteal h1 { color: white; } .color_darkteal blockquote {color:#B0E0E6; border-top: 8px solid #87CEEB;border-bottom: 8px solid #87CEEB;} .color_darkteal .text_link{text-decoration:none; border-bottom:1px solid white;color:white;} .color_darkteal .text_link:link {color:white;border-bottom: 1px solid white;} .color_darkteal .text_link:visited {opacity: .5;} .color_darkteal .text_link:active {color:red;}'

				   var color_imageStyle = '.color_image {background: white;} .color_image div {color: inherit} .color_image h1 { color: inherit; } .color_image blockquote {color:grey; border-top: 8px solid grey;border-bottom: 8px solid grey;} .color_image .text_link{text-decoration:none; border-bottom:1px solid inherit;color:inherit;} .color_image .text_link:link {color:inherit;border-bottom: 1px solid inherit;} .color_image .text_link:visited {opacity: .5;} .color_image .text_link:active {color:red;}'


				   $('iframe').contents().find('body').attr('spellcheck','false')
					 $('iframe').contents().find('head').append($('<style>').html(importFont+textLinkStyle+selectionStyle+sectionStyle+classic_fontStyle+graceful_fontStyle+text_center_panelStyle+text_left_panelStyle+text_right_panelStyle+color_whiteStyle+color_lightgreyStyle+color_lightblueStyle+color_blackStyle+color_slategreyStyle+color_darkblueStyle+color_darkredStyle+color_darkpurpleStyle+color_darktealStyle+color_imageStyle+moverStyle+stretcherStyle))
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
					    text : "add image",
					    data : {
					        commandName : "insertImage",
					        argument : ""
					    },
					    click : getImageLink 
					}).appendTo($('body'));

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
					    text : "\'\'",
					    data : {
					        commandName : "formatBlock",
					        argument: "<BLOCKQUOTE>",
					        type: "normal"
					    },
					    click : execCommand
					}).appendTo(buttonPane);

					var btnQuote = $("<a/>",{
						"class": "quote-btn",
					    href : "#",
					    text : "!",
					    data : {
					        commandName : "formatBlock",
					        argument: "<BLOCKQUOTE>",
					        type: "pullquote"
					    },
					    click : execCommand
					}).appendTo(buttonPane);

					// $('iframe').contents().find('body').attr('style','background:white;width:620px;margin:0px;padding-left:75px;padding-right:75px;font-family:"open sans";font-size:18px;line-height:1.45;word-wrap:break-word; border:0px;-webkit-font-smoothing: antialiased;-webkit-text-stroke-width: .2px;-webkit-text-stroke-color: #2c3e50;height:'+$('iframe').contents().height()+';')
					$('iframe').contents().find('body').css(css($('.post_text')))
					$('iframe').contents().find('body').css({'border':'0px', 'padding':'0px', 'margin':'0px', 'width':'100%'})
					// $('iframe').after('<div class="below-edit-border"></div>')
					// $('.share_buttons').appendTo($('.txt_editor'))
					// $('.end_post_archive').appendTo($('.txt_editor'))
					// $('.txt_editor').css({height: settings.height})
					// $('.txt_editor').css({left: (screen.width - 700)/2})
					// $('.txt_editor').css({left: $('.edit-title').offset().left - 75})
					$('.editor-btns').css({left: $('iframe').offset().left - 30})

					function execCommand (e) {
						if (e){
							e.preventDefault()
						}

						var beforeFormat;
						var beforeTop;
						$('iframe').contents().find('.mover').remove();
						$('iframe').contents().find('.stretcher').remove();

						if ($(this).data("commandName") == "formatBlock"){
				    	beforeFormat = $('iframe').contents()[0].getSelection().baseNode.parentNode
				    	beforeClass = $(beforeFormat).attr('class')
				    	beforeTop = $(getSectionParent($('iframe').contents()[0].getSelection())).offset().top - $($('iframe').contents()[0].getSelection().baseNode.parentNode).offset().top
				    }

				    if ($(this).data("commandName") == "insertImage"){
				    	var prevTop = $($('iframe').contents()[0].getSelection().baseNode.parentNode).offset().top
				    	var newFigure = $('<figure>').html('<br>')
				    	var section = getSectionParent($('iframe').contents()[0].getSelection());

				    	if (!($(section).attr('class').indexOf('text_center_panel') > -1)){
			    			$(section).prepend(newFigure.css({'top':prevTop})[0])
				    	} else {
				    		$($('iframe').contents()[0].getSelection().baseNode).replaceWith(newFigure);
				    	}
				    	newFigure = newFigure[0]
			    		var s = window.getSelection(),
							    r = document.createRange();
							r.setStart(newFigure, 0);
							r.setEnd(newFigure, 0);
							s.removeAllRanges();
							s.addRange(r);
				    }

				    var contentWindow = editor.contentWindow;
				    contentWindow.focus();
				    contentWindow.document.execCommand($(this).data("commandName"), false, $(this).data("argument") || "");
				    contentWindow.focus();

				    if ($(this).data("commandName") == "insertImage"){
				    	setTimeout(function(){
				    		$('iframe').contents().find('img').load(function(){
				    			autoSetEditorHeight();
				    		})
				    	} , 0)
				    }

				    if ($(this).data("commandName") == "formatBlock"){
				    	var ele = $('iframe').contents()[0].getSelection().baseNode.parentNode
				    	if ($(ele).is('section')){
				    		ele = $('iframe').contents()[0].getSelection().baseNode
				    	}
				    	if ($(this).data("argument") == "<BLOCKQUOTE>"){
				    		if ($(this).data("type") == "pullquote"){
				    			$(ele).attr('class','pullquote')
				    		} else {
				    			$(ele).attr('class','')
				    		}
				    	}

				    	var afterFormat = ele
				    	var afterClass = $(afterFormat).attr('class')
				    	if ((beforeFormat == afterFormat) && (beforeClass == afterClass)){
				    		$(ele).attr('style','');
				    		contentWindow.document.execCommand('formatBlock', false, 'div')
				    	}

				    	if ($(ele).css('position') == 'absolute'){
				    		setBlockquoteTop(ele, beforeTop);
				    	}
				    }
				    autoSetEditorHeight();
				    return false;
					}

					function getImageLink(){
						var that = this;
						$('.image_getter').fadeIn(200);
						$('.post_image_getter').keyup(function(){
							var input = $(this).val()
							if (input.length > 6){
								$(that).data("argument", input)
								var boundExec = execCommand.bind(that)
								boundExec();
								$('.post_image_getter').remove();
							}
						})
						$('iframe').contents().find('body').focus(function(){
							$('.image_getter').fadeOut(200);
						})
						return false;
					}

					function getLink(){
						var that = this;
						$('.editor-btns').append('<input class="text_link_getter" placeholder="link here. press enter when done"></input>');
						// $('.text_link_getter').css({position: 'absolute', right: 1, width: 200, padding: '5px', top:70})
						$('.text_link_getter').focus()
						$('.text_link_getter').keydown(function(ev){
							if (ev.keyCode == 13){
								var link = $('.text_link_getter').val()
								if ((link.indexOf('http://')) > 0 || (link.indexOf('http://') > 0)) {
									link = link
								} else {
									link = 'http://' + link
								}
								$(that).data('argument', link)
								execCommand.bind(that)();
								$('.text_link_getter').remove();
								$('iframe').contents().find('a').attr('class','text_link')
							}
						})
						return false;
					}

					$('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {
				  	$('.hidden_image_holder').html(
				    	$.cloudinary.image(data.result.public_id, 
				      { format: data.result.format, version: data.result.version})
				    );
				    var link = $('.hidden_image_holder img').attr('src');
				    if ($('.image_getter').attr('data-color-background') == '1'){
				    	var dummy = $('iframe').contents().find('#dummy')
							if ($(dummy).length == 0){
								dummy = $('iframe').contents().find('#being_edited')
							}
				    	$(dummy).css({'background-image':'url('+link+')', 'background-size':'cover'})
				    	$('.font-color-chooser').fadeIn(100);
							$('.image_getter').fadeOut(100);
				    } else {
					    $('.image-btn').data('argument',link);
					    var boundExec = execCommand.bind($('.image-btn')[0])
							boundExec();
				    }
					  // return true;
					});




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
					if ($('.editor-btns').offset().left < 0){
						$('.editor-btns').css({'left':'0px'})
					}
					$('.editor-btns').hide().fadeIn(100);
				} else {
					$('.editor-btns').fadeOut(100);
					$('.text_link_getter').remove();
				}
			}, 0)
		})
		var isCtrl = false;
		setTimeout(function(){
			autoSetEditorHeight();
		},500);
		textBody.find('img').load(function(){
			autoSetEditorHeight();
		})

		textBody.on('keydown',function(ev){
			$('.editor-btns').hide();
			if(ev.keyCode == 17) isCtrl=true;
	    if(ev.keyCode == 83 && isCtrl == true) {
	      $('.edit-submit').trigger('click')
	      ev.preventDefault();
	    }
	    if(ev.keyCode == 8){
    		var parent = getSectionParent($('iframe').contents()[0].getSelection())
    		var empty_child;
    		if (parent.children.length == 1){
    			if ($(parent.children[0]).html() == '<br>'){
    				empty_child = true;
    			}
    		}
    		if ($(parent).html() == '' || (empty_child) || ($(parent).html() == '<br>')){
    			ev.preventDefault();
    			var newDiv = $('<div>').html('<br>')[0]
    			$(parent).html(newDiv)
	    			var s = window.getSelection(),
					    	r = document.createRange();
					r.setStart(newDiv, 0);
					r.setEnd(newDiv, 0);
					s.removeAllRanges();
					s.addRange(r);
    		}
    		setTimeout(function(){
    			var parent = getSectionParent($('iframe').contents()[0].getSelection())
	    		var empty_child;
	    		if (parent.children.length == 1){
	    			if ($(parent.children[0]).html() == '<br>'){
	    				empty_child = true;
	    			}
	    		}
	    		if ($(parent).html() == '' || (empty_child) || ($(parent).html() == '<br>')){
	    			ev.preventDefault();
	    			var newDiv = $('<div>').html('<br>')[0]
	    			$(parent).html(newDiv)
		    			var s = window.getSelection(),
						    	r = document.createRange();
						r.setStart(newDiv, 0);
						r.setEnd(newDiv, 0);
						s.removeAllRanges();
						s.addRange(r);
	    		}
    		},0)
	    }

	    if(ev.keyCode == 13){
	    	var beforeBlock = $('iframe').contents()[0].getSelection().anchorNode.parentNode
		    	setTimeout(function(){
		    		//won't duplicate blockquote if pressing enter
		    		$('iframe').contents().find('.mover').remove()
			    	var block = $('iframe').contents()[0].getSelection().anchorNode
		  			var newDiv = $('<div>').html('<br>')[0];
		  			if ($(block).html() == "<br>"){
				    	block.parentNode.replaceChild(newDiv, block)
		    			var s = window.getSelection(),
							    r = document.createRange();
							r.setStart(newDiv, 0);
							r.setEnd(newDiv, 0);
							s.removeAllRanges();
							s.addRange(r);
		  			}

		  			//random spans showing up. replacing them with text.
		  			$.each($('iframe').contents().find('span'), function(i, span){
		  				var span_html = $(span).html()
		  				$(span).replaceWith(span_html)
		  			})
		    	}, 0)
		  }
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
		})
		$('.edit_section_btn').hover(function(){
			if ($(this).css('height') != '200px'){
				var section = getSectionParent($('iframe').contents()[0].getSelection())
				if (section == null){
					section = $('iframe').contents().find('section')[0]
				}
				$(section).css({'opacity':'.4'})
			}
		}, function(){
			if ($(this).css('height') != '200px'){
				var section = getSectionParent($('iframe').contents()[0].getSelection())
				if (section == null){
					section = $('iframe').contents().find('section')[0]
				}
				$(section).css({'opacity':'1'})
			}
		})
		$('.edit_section_btn').on('click', function(){
			if ($(this).css('height') != '200px'){
				var section = getSectionParent($('iframe').contents()[0].getSelection())
				if (section == null){
					section = $('iframe').contents().find('section')[0]
				}
				boldChoiceButtons(section);

				$(section).attr('data-beforeclass', $(section).attr('class'))
				$(section).attr('id','being_edited');
				$(this).append('<div class="cancel_edit_section">cancel</div>');
				$(this).append('<div class="confirm_edit_section">save</div>');
				$(this).append($('.details_panel'));

				$(this).css({'width':'100%', 'height':'200px', 'background':'#7f8c8d','color':'white','bottom':'0px','top':'auto','border':'5px','padding-left':'15px','cursor':'default'})
				$('#edit_section_text').html('editing section');
			}
		})

		textBody.on('mouseenter','blockquote, figure', function(e){
			if ($(this).css('position') == 'absolute'){
				if ($(textBody).find('.mover').length == 0){
					$(this).append('<div class="mover" contenteditable="false" moving="0"></div>')
				}
				if ($(this).is('figure')){
					if ($(textBody).find('.stretcher').length == 0){
						$(this).append('<div class="stretcher" contenteditable="false" stretching="0"></div>')
					}
				}
			}
		}).on('mouseleave', 'blockquote, figure', function(e){
				if ($(textBody).find('.mover').attr('moving') == '0'){
					$(textBody).find('.mover').remove()
				}
				if ($(textBody).find('.stretcher').attr('stretching') == '0'){
					$(textBody).find('.stretcher').remove()
				}
		})

		textBody.on('click','.mover', function(e){
			var that = this;
			if ($(this).attr('moving') == '1'){
				$(this).attr('moving','0');
				$(this).css({'background':'blue', 'cursor':'pointer'})
			} else {
				$(this).css({'background':'green', 'cursor':'n-resize'})
				$(this).attr('moving','1');

				var mouseHandler = function(ev){
					if ($(that).attr('moving') == '1'){
						var parent = $($(that)[0].parentNode)
						var parentTop = $(parent[0].parentNode).offset().top
						if ((parent.attr('class') == 'pullquote') || (parent.is('figure'))){
							var newTop = (ev.clientY - 10) - parentTop
						} else {
							var newTop = (ev.clientY - 20) - parentTop
						}
						if (parent.is('figure')){
							var newRight = (($(document).width() - ev.clientX - 10) / $(document).width())*100
							parent.css({'right': newRight+'%'})
						}
						parent.css({'top':newTop})
					} else {
						textBody[0].removeEventListener('mousemove', mouseHandler);
					}
				}
				textBody.on('mousemove', mouseHandler);
			}
		})

		textBody.on('click','.stretcher', function(e){
			var that = this;
			if ($(this).attr('stretching') == '1'){
				$(this).attr('stretching','0');
				$(this).css({'background':'red', 'cursor':'pointer'})
			} else {
				$(this).css({'background':'green', 'cursor':'n-resize'})
				$(this).attr('stretching','1');


				var mouseHandler = function(ev){
					var parent = that.parentNode
					if ($(that).attr('stretching') == '1'){
						var right = $(parent)[0].getBoundingClientRect().right
						var newWidth = (right - ev.clientX + 10)/$(document).width()
						$(parent).width(newWidth*100 + '%')
					} else {
						textBody[0].removeEventListener('mousemove',mouseHandler)
					}
				}
				textBody.on('mousemove', mouseHandler)
			}
		})

		$('body').on('click','.add_section', function(){
			if (!($(this).attr('style'))){
			// 	$(this).attr('style','');
			// 	$('#add_section_text').html('add section');
			// } else {
				$(this).css({'width':'100%', 'height':'200px', 'background':'#7f8c8d','color':'white','bottom':'0px','top':'auto','border':'5px','padding-left':'15px','cursor':'default'})
				$('iframe').contents().find('body').css({'border-bottom':'200px solid white'})
				$('#add_section_text').html('creating new section!');
				$(this).append('<div class="cancel_add_section">cancel</div>');
				$(this).append('<div class="confirm_add_section">add</div>');
				$(this).append($('.details_panel'));
		
				var dummySection = $('<section>').html('<blockquote style="top:100px;">This is a profound quote</blockquote><div>Isaacson said Steve Jobs would pick a couple of things that were important and brutally reject everything that he didn\'t care about. Strong intuition.</div> <blockquote style="top:400px" class="pullquote">This is some emphasized text</blockquote><h1>This is an Example Header</h1><div>Brutally honest meetings where everyone said what needed to be said. Would constantly go over his products with his hands and get a sense of them; get a sense of their essence, almost their soul; then iterating them. focused on building a great team.</div>')[0]
				$(dummySection).attr('id','dummy');
				$(dummySection).attr('style','height:900px');
				$(dummySection).attr('class','text_center_panel classic_font color_white');
				boldChoiceButtons(dummySection);
				$('iframe').contents().find('body').append(dummySection)
				var s = $('iframe')[0].contentWindow.getSelection(),
				    r = $('iframe').contents()[0].createRange();
				r.setStart(dummySection, 0);
				r.setEnd(dummySection, 0);
				s.removeAllRanges();
				s.addRange(r);
				autoSetEditorHeight();

				setTimeout(function(){
					// $(document).scrollTop($(document).height())
					$('html,body').animate({ scrollTop: $(document).height() }, 500)
				},300)
			}

		})
		$('body').on('click','.cancel_add_section',function(){
			console.log('g')
			setTimeout(function(){
				$('.add_section').attr('style','');
				$('#add_section_text').html('add section');
				$('.cancel_add_section').remove();
				$('iframe').contents().find('#dummy').remove();
				$('.image_getter').fadeOut(100);
				$('.font-color-chooser').fadeOut(100);
				autoSetEditorHeight();
			},0)
		})
		$('body').on('click','.confirm_add_section', function(){
			var classes = $('iframe').contents().find('#dummy').attr('class')
			$('.cancel_add_section').trigger('click');
			var newSection = $('<section>').html('<div><br></div>')[0];
			$(newSection).attr('class', classes);
			$('iframe').contents().find('body').append(newSection);
			$('.image_getter').fadeOut(100);
			$('.font-color-chooser').fadeOut(100);
			autoSetEditorHeight();
		})
		$('body').on('click','.cancel_edit_section',function(){
			var beingEdited = $('iframe').contents().find('#being_edited')
			beingEdited.fadeOut(100);
			setTimeout(function(){
				$('.edit_section_btn').attr('style','');
				$('#edit_section_text').html('edit section');
				$('.cancel_edit_section').remove();
				$('.confirm_edit_section').remove();
				var beforeClass = beingEdited.attr('data-beforeclass');
				beingEdited.attr('data-beforeclass','');
				beingEdited.attr('class', beforeClass);
				beingEdited.attr('id','');
				beingEdited.fadeIn(100);
				$('.image_getter').fadeOut(100);
				$('.font-color-chooser').fadeOut(100);
				autoSetEditorHeight();
			},100)
		})
		$('body').on('click','.confirm_edit_section', function(){
			$('.edit_section_btn').attr('style','');
			$('#edit_section_text').html('edit section');
			var beingEdited = $('iframe').contents().find('#being_edited')
			beingEdited.attr('id','');
			beingEdited.attr('data-beforeclass','');
			$('.confirm_edit_section').remove();
			$('.cancel_edit_section').remove();
			$('.image_getter').fadeOut(100);
			$('.font-color-chooser').fadeOut(100);
			autoSetEditorHeight();
		})

		textBody.on('click','section', function(){
			setTimeout(function(){
				if ($('.edit_section_btn').height() == 200){

					var section = getSectionParent($('iframe').contents()[0].getSelection())
					if (section == null){
						section = $('iframe').contents().find('section')[0]
					}

					if (!($(section).attr('id') == 'being_edited')){
						$('.cancel_edit_section').trigger('click')
						setTimeout(function(){
							$('.edit_section_btn').trigger('click')
						},200)
					}
				}
			},0)
		})

		$('body').on('click','.chooser_choice',function(){
			var choice;
			var anti_choice;
			var dummy = $('iframe').contents().find('#dummy')
			if ($(dummy).length == 0){
				dummy = $('iframe').contents().find('#being_edited')
			}
			dummy.fadeOut(100);
			var that = this;

			setTimeout(function(){
				console.log($(that).attr('data-choice'))
				//if they chose font
				if ($(that).attr('data-choice') == 'font'){
					choice = $(that).attr('data-font')+'_font'
					dummy.removeClass('classic_font')
					dummy.removeClass('graceful_font')
					dummy.addClass(choice);
				}

				//if they chose a panel
				if ($(that).attr('data-choice') == 'panel'){
					choice = 'text_'+$(that).attr('data-panel')+'_panel'
					dummy.removeClass('text_left_panel')
					dummy.removeClass('text_center_panel')
					dummy.removeClass('text_right_panel')
					dummy.addClass(choice);
				}

				//if they chose a color
				if ($(that).attr('data-choice') == 'color'){
					choice = 'color_'+$(that).attr('data-color');
					$.each(dummy.attr('class').split(' '), function(i, checkClass){
						if (checkClass.indexOf('color_') > -1){
							anti_choice = checkClass
						}
					})
					dummy.attr('class', dummy.attr('class').replace(anti_choice, choice))
					console.log(choice);

					if (choice == 'color_image'){
						$('.image_getter').attr('data-color-background','1');
						$('.image_getter').fadeIn(200);
						$('.image_getter').css({'bottom':'30px','left':'46%','top':'auto','z-index':'599'})
						$('.post_image_getter').keyup(function(){
							var input = $(this).val()
							if (input.length > 6){
								$('.post_image_getter').remove();
							}
						})
						$('iframe').contents().find('body').focus(function(){
							$('.image_getter').fadeOut(200);
						})
					} else {
						$(dummy).css({'background-image':'', 'color':'', 'background-size':''})
					}
				}
				dummy.fadeIn(100);
				boldChoiceButtons(dummy);
			},101)
		})

		$('body').on('click','.font-color-choice', function(){
    	var dummy = $('iframe').contents().find('#dummy')
			if ($(dummy).length == 0){
				dummy = $('iframe').contents().find('#being_edited')
			}
			var color = $(this).attr('data-color')
			$(dummy).css({'color':color})
		})

		$('body').on('click','.view_mode_button',function(){
			$('iframe').contents()[0].designMode = 'off';
			$('.batman_toolbelt').attr('class','batman_toolbelt view_mode')
			$(this).attr('class','edit_mode_button control_button');
			$(this).html('edit mode')
			$('.post-date-left').fadeIn(200);
			$('.sfooter').fadeIn(200);
			$('.save_success').attr('style','display:block;background:#34495e;')
			$('.save_success').html('preview mode on')
			var lastSectionColor = $($('iframe').contents().find('section').find('div').slice(-1)[0]).css('color')
			$('.sfooter').css({'background': $($('iframe').contents().find('section').slice(-1)[0]).css('background')})
			$('.footer_name').css({'color': lastSectionColor, 'border':'3px solid '+lastSectionColor })
			$('.share_buttons').show()
			setTimeout(function(){
				$('.save_success').attr('style','display:none')
			}, 2000)
		})

		$('body').on('click','.edit_mode_button',function(){
			$('iframe').contents()[0].designMode = 'on';
			$('.batman_toolbelt').attr('class','batman_toolbelt')
			$(this).attr('class','view_mode_button control_button');
			$(this).html('preview post')
			$('.post-date-left').fadeOut(200);
			$('.sfooter').fadeOut(200);
			$('.save_success').attr('style','display:block;background:#34495e;')
			$('.save_success').html('now editing')
			$('.share_buttons').hide()
			setTimeout(function(){
				$('.save_success').attr('style','display:none')
			}, 2000)
		})

		$('.edit-title').keypress(function(ev){
	    if (ev.keyCode == 10 || ev.keyCode == 13) 
	        ev.preventDefault();
	  });

	  $('.batman_toolbelt').hover(function(){
	  	$(this).height($('.hidden_toolbelt').height())
	  }, function(){
	  	$(this).height(100)
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

		$.cloudinary.config({"api_key":"579372528537872","cloud_name":"sailnote"});
	  


		// $('.cover-box').css({'width': $(document).width()})
		// $('.cover-box img').css({'width': screen.width})
		if ($('#the_editor').length > 0){
			$('.post_text').hide();
		}

		//focus on txt_editor
		setTimeout(function(){
			$('iframe')[0].contentWindow.document.body.focus()
		}, 200)
		autoSetEditorHeight();

		//transition effects
		$('.edit-title').css({'opacity':'1'})
		$('.author_link_wrapper').css({'opacity':'.2'})
		$('.post-date-left').css({'opacity':'.3'})
		$('.circle-divider').css({'width':'65%'})
		$($('.circle-divider')[1]).css({'margin-top':'-5px'})
		setTimeout(function(){
			$('.edit-title').autosize();
		},300)
	}
})

//runs if viewing post and not logged in
function centerImage(img_index){
	var img = $('.post_text img')[img_index]
	$(img).css({'margin-left': (550 - $(img).width())/2})
}


function goToSource(img_index){
	var src = $($('.post_text img')[img_index]).attr('src');
	window.location.href = src;
}
$(document).ready(function(){
	if ($('.page_identifier').attr('id') == 'guest_view_post'){
		$('.twitter_share').attr('href', 'https://twitter.com/intent/tweet?url='+encodeURIComponent(document.URL)+'&text="'+$('.post_title').html()+'"')
		$('.facebook_share').attr('href','http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL))

		if (!($('.control_button').length > 0)){
			setTimeout(function(){
				var user = $('.page_identifier').attr('data-username');
				var title = document.URL.split('/'+user+'/')[1]
				$.post('/'+user+'/'+title+'/increment_viewcount')
			}, 1000)
		}
		// $('.cover-box').css({'width': $(document).width()})
		// $('.cover-box img').css({'width': screen.width})

		$.each($('.post_text img'), function(i, img){
			$(img).attr('onClick','goToSource('+i+')')
			$(img).css({'max-width': $(document).width()/1.6})
			$(img).attr('onload','centerImage('+i+')');
			$(img).css({'opacity':'1'})
			centerImage(i);
		})

		$('.post_text a').attr('class','text_link')
		var lastSectionColor = $($('.post_text').find('section').find('div').slice(-1)[0]).css('color')
		$('.sfooter').css({'background': $($('.post_text').find('section').slice(-1)[0]).css('background')})
		$('.footer_name').css({'color': lastSectionColor, 'border':'3px solid '+lastSectionColor })

		//transition effects
		$('.post_title').css({'margin-top':'00px', 'opacity':'1'})
		$('.author_link_wrapper').css({'opacity':'.2'})
		$('.post-date-left').css({'opacity':'.3'})
		$('.circle-divider').css({'width':'65%'})
		$($('.circle-divider')[1]).css({'margin-top':'-5px'})
	}
})