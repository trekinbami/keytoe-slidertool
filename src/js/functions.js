var SliderTool = {
	defaults: {
		navigation: {
			cntClass: 'slidertool-nav',
			currentClass: 'current',
			cntEl: 'li'
		},
		slider: {
			mainCnt: 'slidertool',
			mainCntInner: 'slidertool__inner',
			mainSlideClass: 'main-slide',
			subSlideClass: 'sub-slide',
			activeClass: 'active',
			startSlide: 1,
			btnNextClass: 'btn--next',
			btnPrevClass: 'btn--prev'
		}
	},
	layout:{
		_highestArrayVal: function(arr){
			return Math.max.apply(Math, arr);
		},
		_lowestArrayVal: function(arr){
			return Math.min.apply(Math, arr);
		},
		calculateHeights: function(){
			var main_slide = SliderTool.defaults.slider.mainSlideClass,
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
			$('.'+SliderTool.defaults.slider.mainCnt).height(high_height);

			//slide 100% hoogte maken
			$('.'+main_slide).css('height','100%');
		},
		calculateSizes: function(){
			var cnt = $('.'+SliderTool.defaults.slider.mainCntInner),
			slide_width = $('.'+SliderTool.defaults.slider.mainCnt).width(),
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
				slide_width = $('.'+SliderTool.defaults.slider.mainCnt).width();

				//ook de container opnieuw berekenen
				cnt.children().each(function(){
					cnt_width = cnt_width+$(this).width();
				});
			}

			$('.'+SliderTool.defaults.slider.mainSlideClass).width(slide_width);
		}
	},
	forms: {
		validateEmail: function(emailAddress){
			var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	    return pattern.test(emailAddress);
		}
	},
	slider: {
		_getHightestMainSlide: function(direction){
			var main_nrs = [];

			$('.'+SliderTool.defaults.slider.mainSlideClass).each(function(){				
				var this_nr = $(this).attr('data-mainslide');
				main_nrs.push(this_nr);
			});

			if( direction === undefined || direction === "forward" ){
				return SliderTool.layout._highestArrayVal(main_nrs);
			}	else{
				return SliderTool.layout._lowestArrayVal(main_nrs);
			}
		},
		_getActiveSubslides: function(direction){
			var activeNr = $('.'+SliderTool.defaults.slider.mainSlideClass+'.active').data('mainslide'),
				subslideNrs = [];

			$('.'+SliderTool.defaults.slider.mainSlideClass+'[data-mainslide='+activeNr+']').each(function(){
				subslideNrs.push($(this).attr('data-subslide'));
			});

			if( direction === undefined || direction === "forward" ){
				return SliderTool.layout._highestArrayVal(subslideNrs);
			}	else{
				return SliderTool.layout._lowestArrayVal(subslideNrs);
			}
		},
		_getSubslide: function(index, location){
			var subslideNrs = [];

			$('.'+SliderTool.defaults.slider.mainSlideClass+'[data-mainslide="'+index+'"]').each(function(){
				subslideNrs.push($(this).attr('data-subslide'));
			});

			if( location === "high"){
				return SliderTool.layout._highestArrayVal(subslideNrs);
			}	else{
				return SliderTool.layout._lowestArrayVal(subslideNrs);
			}
		},
		_selectScreen: function(direction){
			var active_main = parseInt($('.'+SliderTool.defaults.slider.activeClass).attr('data-mainslide'), 10),
				active_sub = $('.'+SliderTool.defaults.slider.activeClass).attr('data-subslide'),
				slide_width = $('.'+SliderTool.defaults.slider.mainCnt).width(),
				highTotal = this._getHightestMainSlide(direction),
				subTotal = this._getActiveSubslides(direction),
				this_index,
				subLocation;

			if( $('.'+SliderTool.defaults.slider.mainSlideClass+'[data-mainslide='+highTotal+'][data-subslide='+subTotal+']').is('.active') ){
				return false;
			}
				else{
					//als het de laatste subslide van een mainslide, de volgende mainslide pakken
					if( $('.main-slide.active[data-subslide="'+subTotal+'"]').is('.active') ){
						
						if( direction === undefined || direction === "forward"){
							this_index = (parseInt(active_main, 10)+1);
							subLocation = "low";
						} 	else{
								this_index = (parseInt(active_main, 10)-1),
								slide_width = -(slide_width);
								subLocation = "high";
						}

						var ss = this._getSubslide(this_index, subLocation);
						var firstSlide = $('.'+SliderTool.defaults.slider.mainSlideClass+'[data-mainslide="'+this_index+'"][data-subslide="'+ss+'"]');

						firstSlide
							.css({'left': slide_width, 'z-index': '1'})
							.detach();

						if( direction === undefined || direction === "forward"){
							firstSlide.insertAfter('.'+SliderTool.defaults.slider.activeClass);
							this.animateScreen("forward");
						} 	else{
							firstSlide.insertBefore('.'+SliderTool.defaults.slider.activeClass);
								this.animateScreen("back");
						}
					}	else{
							
							//variabelen zetten op basis van richting
							if( direction === undefined || direction === "forward"){
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
							if( direction === undefined || direction === "forward"){
								justSlide.insertAfter('.'+SliderTool.defaults.slider.activeClass);
								this.animateScreen("forward");
							} 	else{
								justSlide.insertBefore('.'+SliderTool.defaults.slider.activeClass);
									this.animateScreen("back");
							}
					}
				}
		},
		setSizes:function(){
			$('.'+SliderTool.defaults.slider.mainSlideClass).css({
				'position':'absolute',
				'left': '0',
				'top': '0',
				'opacity':'0'
			});
		},
		setActive: function(){
			var adjustedStart = (SliderTool.defaults.slider.startSlide - 1);

			$('.'+SliderTool.defaults.slider.mainSlideClass)
				.eq(adjustedStart)
				.addClass(SliderTool.defaults.slider.activeClass)
				.css('opacity', '1');
		},
		animateScreen: function(direction){
			var slide_width = parseInt($('.'+SliderTool.defaults.slider.mainCnt).width()),
				activeScreen = $('.'+SliderTool.defaults.slider.activeClass),
				slideAmount,
				screenComing;

			if( direction === undefined || direction === "forward"){
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
				.on('click', '.'+SliderTool.defaults.slider.btnNextClass, function(e){
					e.preventDefault();
					SliderTool.slider._selectScreen("forward");
					
				})
				.on('click', '.'+SliderTool.defaults.slider.btnPrevClass, function(e){
					e.preventDefault();
					SliderTool.slider._selectScreen("back");					
				});
		}
	},
	resize: function(){
		this.layout.calculateHeights();
		this.layout.calculateSizes();
	},
	init: function(){
		this.layout.calculateHeights();
		this.layout.calculateSizes();
		this.slider.setSizes();
		this.slider.setActive();
		this.slider.eventHandlers();
	}
};