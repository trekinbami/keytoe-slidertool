# keytoe-slidertool
v0.2 van de slidertool. Ik gebruik Velocity library (https://github.com/julianshapiro/velocity) voor de animatie.

Init:
```
SliderTool.init();
```

Je kunt hier een object meegeven als parameter, waarin je met key/value pairs classes kunt aanpassen. De waarden die hieronder staan zijn de default waarden.

```
SliderTool.init({
	mainCnt: 'slidertool', 						//wrapper container
	mainCntInner: 'slidertool__inner',			//inner wrapper container
	mainSlideClass: 'main-slide',				//class van de slide
	activeClass: 'active',						//actieve class van de mainslide
	startSlide: 1,								//op welke slide de slider moet starten
	btnNextClass: 'btn--next',					//class van de next knop
	btnPrevClass: 'btn--prev'					//class van de back knop
});
```


Op de window.resize kun je deze method gebruiken, waarbij hij automatisch alle afmetingen aanpast (voor responsive);

```
SliderTool.resize();
```


Dit is de HTML die je kunt gebruiken. Markup is compleet optioneel zolang de opbouw maar klopt. Dus cnt -> inner -> slide[data-mainslide][data-subslide]. Ook de volgorde in de HTML maakt niet uit. De code kijkt naar de volorde van de data-attributen. 

De buttons gaan af op de actieve slide, dus het maakt niet uit waar ze staan. Je mag de buttons per slide zetten, de buttons buiten de slide zetten, de next button in de slide en de back button buiten de slide, etc.

```
<div class="slidertool">
	<div class="slidertool__inner">
		<article class="main-slide" data-mainslide="1" data-subslide="1">
			<p>Your content</p>
		</article>
		<article class="main-slide" data-mainslide="1" data-subslide="2">
			<p>Your content</p>
		</article>
		<article class="main-slide" data-mainslide="2" data-subslide="1">
			<p>Your content</p>
		</article>
		<button class="btn btn--prev">Previous</button>
		<button class="btn btn--next">Next</button>
	</div>
</div>
```


