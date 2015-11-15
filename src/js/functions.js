var SliderTool = {
	defaults: {
		navClass: 'slidertool-nav',
		navActiveClass: 'current',
		navElement: 'li',
		mainCnt: 'slidertool',
		mainCntInner: 'slidertool__inner',
		mainSlideClass: 'main-slide',
		activeClass: 'active',
		startSlide: 1,
		btnNextClass: 'btn--next',
		btnPrevClass: 'btn--prev'
	},
	parameters: {

	},
	_setParameters: function(argumentObj){
		$.each(this.defaults, function(index, value){
			if( index in argumentObj ){
				SliderTool.parameters[index] = argumentObj[index]; 
			}	else{
				SliderTool.parameters[index] = SliderTool.defaults[index];
			}
		});
	},
	layout:{
		_highestArrayVal: function(arr){
			return Math.max.apply(Math, arr);
		},
		_lowestArrayVal: function(arr){
			return Math.min.apply(Math, arr);
		},
		calculateHeights: function(){
			var main_slide = SliderTool.parameters.mainSlideClass,
				main_heights = [],
				high_height;

			$('.'+main_slide)
				.css('height','')
				.each(function(){				
					var this_height = $(this).outerHeight(true);
					main_heights.push(this_height);
				});

			//hoogste value berekenen
			high_height = SliderTool.layout._highestArrayVal(main_heights);

			//container de hoogte van de hoogste value meegeven
			$('.'+SliderTool.parameters.mainCnt).height(high_height);

			//slide 100% hoogte maken
			$('.'+main_slide).css('height','100%');
		},
		calculateSizes: function(){
			var cnt = $('.'+SliderTool.parameters.mainCntInner),
			slide_width = $('.'+SliderTool.parameters.mainCnt).width(),
			cnt_width = slide_width;

			//bij het laden van de pagina is cnt_width even breed als een slide
			if( cnt_width === slide_width){
				//de daadwerkelijke breedte berekenen
				cnt.children().each(function(){
					cnt_width = cnt_width+$(this).width();
				});
			//slidewidth blijft hetzelfde, dus die hoeft niet berekend te worden
			} else{
				//bij een resize van de pagina is slide_width groter/kleiner dan de cnt/width -> opnieuw berekenen
				slide_width = $('.'+SliderTool.parameters.mainCnt).width();

				//ook de container opnieuw berekenen
				cnt.children().each(function(){
					cnt_width = cnt_width+$(this).width();
				});
			}

			$('.'+SliderTool.parameters.mainSlideClass).width(slide_width);
		}
	},
	forms: {
		validateEmail: function(emailAddress){
			var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	    return pattern.test(emailAddress);
		}
	},
	slider: {
		_getHighestMainSlide: function(direction){
			var main_nrs = [];

			$('.'+SliderTool.parameters.mainSlideClass).each(function(){				
				var this_nr = $(this).attr('data-mainslide');
				main_nrs.push(this_nr);
			});

			if( typeof direction === 'undefined' || direction === "forward" ){
				return SliderTool.layout._highestArrayVal(main_nrs);
			}	else{
				return SliderTool.layout._lowestArrayVal(main_nrs);
			}
		},
		_getActiveSubslides: function(direction){
			var activeNr = $('.'+SliderTool.parameters.mainSlideClass+'.active').data('mainslide'),
				subslideNrs = [];

			$('.'+SliderTool.parameters.mainSlideClass+'[data-mainslide='+activeNr+']').each(function(){
				subslideNrs.push($(this).attr('data-subslide'));
			});

			if( typeof direction === 'undefined' || direction === "forward" ){
				return SliderTool.layout._highestArrayVal(subslideNrs);
			}	else{
				return SliderTool.layout._lowestArrayVal(subslideNrs);
			}
		},
		_getSubslide: function(index, location){
			var subslideNrs = [];

			$('.'+SliderTool.parameters.mainSlideClass+'[data-mainslide="'+index+'"]').each(function(){
				subslideNrs.push($(this).attr('data-subslide'));
			});

			if( location === "high"){
				return SliderTool.layout._highestArrayVal(subslideNrs);
			}	else{
				return SliderTool.layout._lowestArrayVal(subslideNrs);
			}
		},
		_selectScreen: function(direction){
			var active_main = parseInt($('.'+SliderTool.parameters.activeClass).attr('data-mainslide'), 10),
				active_sub = $('.'+SliderTool.parameters.activeClass).attr('data-subslide'),
				slide_width = $('.'+SliderTool.parameters.mainCnt).width(),
				highTotal = this._getHighestMainSlide(direction),
				subTotal = this._getActiveSubslides(direction),
				this_index,
				subLocation;

			if( $('.'+SliderTool.parameters.mainSlideClass+'[data-mainslide='+highTotal+'][data-subslide='+subTotal+']').is('.active') ){
				return false;
			}
				else{
					//als het de laatste subslide van een mainslide, de volgende mainslide pakken
					if( $('.main-slide.active[data-subslide="'+subTotal+'"]').is('.active') ){
						
						if( typeof direction === 'undefined' || direction === "forward"){
							this_index = (parseInt(active_main, 10)+1);
							subLocation = "low";
						} 	else{
								this_index = (parseInt(active_main, 10)-1),
								slide_width = -(slide_width);
								subLocation = "high";
						}

						var ss = this._getSubslide(this_index, subLocation);
						var firstSlide = $('.'+SliderTool.parameters.mainSlideClass+'[data-mainslide="'+this_index+'"][data-subslide="'+ss+'"]');

						firstSlide
							.css({'left': slide_width, 'z-index': '1'})
							.detach();

						if( typeof direction === 'undefined' || direction === "forward"){
							firstSlide.insertAfter('.'+SliderTool.parameters.activeClass);
							this.animateScreen("forward");
						} 	else{
							firstSlide.insertBefore('.'+SliderTool.parameters.activeClass);
								this.animateScreen("back");
						}
					}	else{
							
							//variabelen zetten op basis van richting
							if( typeof direction === 'undefined' || direction === "forward"){
								this_index = (parseInt(active_sub, 10)+1);
								
							} 	else{
									this_index = (parseInt(active_sub, 10)-1),
									slide_width = -(slide_width);
							}

							//de juiste slide pakken
							var justSlide = $('.main-slide[data-mainslide="'+active_main+'"][data-subslide="'+this_index+'"]');

							//klaarmaken van animatie
							justSlide
								.css({'left': slide_width, 'z-index': '1'})
								.detach();

							//gaan
							if( typeof direction === 'undefined' || direction === "forward"){
								justSlide.insertAfter('.'+SliderTool.parameters.activeClass);
								this.animateScreen("forward");
							} 	else{
								justSlide.insertBefore('.'+SliderTool.parameters.activeClass);
									this.animateScreen("back");
							}
					}
				}
		},
		setSizes:function(){
			$('.'+SliderTool.parameters.mainSlideClass).css({
				'position':'absolute',
				'left': '0',
				'top': '0',
				'opacity':'0'
			});
		},
		setActive: function(){
			var adjustedStart = (SliderTool.parameters.startSlide - 1);

			$('.'+SliderTool.parameters.mainSlideClass)
				.eq(adjustedStart)
				.addClass(SliderTool.parameters.activeClass)
				.css('opacity', '1');
		},
		animateScreen: function(direction){
			var slide_width = parseInt($('.'+SliderTool.parameters.mainCnt).width()),
				activeScreen = $('.'+SliderTool.parameters.activeClass),
				slideAmount,
				screenComing;

			if( typeof direction === 'undefined' || direction === "forward"){
				slideAmount = -slide_width;
				screenComing = activeScreen.next();
			}	else{
				slideAmount = slide_width;
				screenComing = activeScreen.prev();
			}

			activeScreen.velocity({
				"left": slideAmount,
				"opacity":0
			},{
				duration: 500,
				complete: function(){
					$(this).css('opacity','');
				}
			});

			activeScreen.removeClass('active');

			screenComing
				.velocity({
					"left": 0,
					"opacity": 1
				},{
					duration:500,
					complete: function(){
						SliderTool.layout.calculateHeights();
						$('body').velocity("scroll", {duration: 200});
						
						$(this).addClass('active');
					}
				});
		},
		eventHandlers: function(){
			$('body')
				.on('click', '.'+SliderTool.parameters.btnNextClass, function(e){
					e.preventDefault();
					SliderTool.slider._selectScreen("forward");
					
				})
				.on('click', '.'+SliderTool.parameters.btnPrevClass, function(e){
					e.preventDefault();
					SliderTool.slider._selectScreen("back");					
				});
		}
	},
	resize: function(){
		this.layout.calculateHeights();
		this.layout.calculateSizes();
	},
	init: function(argumentObj){
		this._setParameters(argumentObj);

		this.layout.calculateHeights();
		this.layout.calculateSizes();
		this.slider.setSizes();
		this.slider.setActive();
		this.slider.eventHandlers();
	}
};