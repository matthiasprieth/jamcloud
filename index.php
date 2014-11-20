<html>
	<head>
		<title>JamCloud by Prieth Matthias</title>

	<link rel="stylesheet" type="text/css" media="screen, projection" href="css/style.css" /> <!--CSS-Style für JamCloud-->
	<link rel="stylesheet" type="text/css" media="screen, projection" href="css/slider.css" /> <!--CSS-Style speziell für die Slider-->

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script> 		 <!--jQuery-->
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script> <!--jQuery-UI-->
	<script type="text/javascript" src="js/jamcloud.js"></script>									 <!--js File für mein JamCloud-->
	<script type="text/javascript" src="js/presets.js"></script>									 <!--presets für digitale Signale und mathematische Funktionen für das generieren digitaler Signale, welche nicht von mir selbst geschrieben wurden-->
	<script src="js/Three.js"></script>																		 <!--derzeit beliebteste library Three.js für WebGl(zum zeichnen der WebGl Notenspur/Feld) -->

	<script type"text/javascript">
		
		function myInit(){ // meine Init Funktion, welche nach body onload ausgeführt wird 
		
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////jQuery show und hide Funktionen für anzuzeigende Tabs
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
			$(".dropArea").hide(1500);
			$(".fxSlider").hide(1500);
			$(".synthSlider").show(1500); //am Anfang sollen nur die Synthslider und Elemente angezeigt werden.
			
			$("#synth").click(function () { 
			  $(".dropArea").hide(1500);
			  $(".fxSlider").hide(1500);
			  $(".synthSlider").show(1500);// nur synthSlider Elemente anzeigen
			  myJamCloud.disconnect(myJamCloud.fileSource); //falls bereits eine mp3. Datei als fürs Keyboard zu spielende Datei bestimmt ist, wird diese disconnected.
			  myJamCloud = new JamCloud(); // wenn man auf den tab Synth clickt, wird JamCloud wieder neu initialisiert.	
			});
			$("#loops").click(function () {
			  $(".synthSlider").hide(1500);
			  $(".fxSlider").hide(1500);
			  $(".dropArea").show(1500);//nur DropArea-Elemente anzeigen
			});
			$("#fx").click(function () {
			  $(".dropArea").hide(1500);
			  $(".synthSlider").hide(1500);
			  $(".fxSlider").show(1500);// nur fxSlider-Elemente anzeigen
			});
			
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////JamCloud initialisieren
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
			myJamCloud = new JamCloud();// JamCloud wird initialisiert	
			
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////WebGl für Notenspur mit Three.js
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
			var camera, scene, renderer, geometry, material, meshes, change_note = -1, block_reset = 0; change_z = 0; 

			function init() {
				
				scene = new THREE.Scene(); //neue Szene erzeugen

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 ); //Kamera erzeugen mit bestimmten Blickwinkel und wie weit die Objekte in der Z-Richtung (1 bis 10000) noch im Blickfeld liegen.
				camera.position.z = 1000; //Kameratiefe
				camera.position.y = 500; //Kamerahöhe
				scene.add( camera ); //Kamera zur Szene hinzufügen

				geometry = new THREE.CubeGeometry( 50, 50, 300 ); //Würfelmaße (x,y,z)
				material = new THREE.MeshBasicMaterial( { color: 0x65A3B9, wireframe: false } ); //Material in bestimmter Farbe und Wireframedarstellung (Ränder des Objektes ohne Füllung) ausschalten.
				
				//mehrere Würfel/Rechtecke erstellen diese in x-Richtung verschoben anzeigen und in Array abspeichern
				var k = -1400;
				meshes = new Array();;
				for(var i=0;i<29;i++){
					meshes[i] = new THREE.Mesh( geometry, material ); //Das Material dem Würfel/Rechteck zuordnen und in Array an gewisser Stelle abspeichern.
					meshes[i].position.x = k;
					scene.add( meshes[i] );
					k+=100;
				}	
				
				renderer = new THREE.CanvasRenderer(); //Renderer definieren
				renderer.setSize(1122, 250); //Größe des Renderer definieren

				var fenster = document.getElementById('webGl'); 
				fenster.appendChild(renderer.domElement); //das WebGl-div dem Renderer zuweisen
				
				function animate() {
					requestAnimationFrame( animate ); //animate immerwieder nach gewisser Zeit aufrufen
					render(); //render-Funktion wird hier deshalb auch immer wieder aufgerufen -> Bewegunng/Animation
				}

				function render() { 
					if(change_note != -1){ //wenn eine Taste gedrückt wird, wird change_note auf einen Wert != -1 gesetzt.
						
						if(block_reset != change_note){ //wenn neue Note gespielt wird den alten Block wieder auf 0 setzen, sonst würde er irgendwo derweile stehen bleiben
							meshes[block_reset].position.z = 0;
							meshes[block_reset].position.y = 0;
						}	
						block_reset = change_note;
						
						if(meshes[change_note].position.z > -6000){ //solange Blöcke noch im sichtbaren Bereich, oder gleiche Taste nicht erneut gedrückt wird, Block nach oben und in die Tiefe "werfen"
							meshes[change_note].position.y += 300;
							meshes[change_note].position.z -= 300;
						}else{
							meshes[change_note].position.z = 0; // Blöcke nach einer bestimmten Tiefe wieder auf die Ausgangsposition zurücksetzen
							meshes[change_note].position.y = 0;
							change_note = -1;
						}
						
					}
					renderer.render( scene, camera ); //Szene mit ausgewählter Kamera rendern.
				}
				
				
				animate(); //Animate aufrufen

			}
			
			init(); //init ausführen
			
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////Funktionen damit die entsprechenden Events ausgeführt werden können, wenn Tasten des Pianos geklickt werden oder bei Druck der Tastaturtasten
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
			cursorPoint = function(obj){ //cursorPoint Funktion welche Position bei Mausklick, die Position relativ zum Element bestimmt 
				clickX = window.event.x-obj.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft; //Mausposition(x) - Position vom Element(x) + Scrollpixel(x)
				clickY = window.event.y-obj.offsetTop + document.body.scrollTop + document.documentElement.scrollTop; //Mausposition(y) - Position vom Element(y) + Scrollpixel(y)
				playNote({ 'x': clickX, 'y': clickY }, true); //als Objekt returnen
			}
			
			window.onkeydown = function(ev){ //Bei Tastaturdruck
				playNote(ev, false); //playNote aufrufen mit Event und false, da mouseEvent = false
			}
			
			playNote = function(ev, mouseEvent){ 
				var note = 666; //keycode für Abbruch
				var pitch = 1; //Standardabspieltempo für samples bei höherem pitch -> höhere Note 
				//-----------------------------------C1 bis C2
				if(ev.keyCode == 89 || (mouseEvent == true && ev.x > 244 && ev.x < 277 && ev.y > 75  )){  //Y-Taste
					note = 0;
					myJamCloud.pitch= 1.012; //Abspieltempo ~1
					meshes[note].position.z = 0; //WebGl Block für diese Note zuerst auf die Ausgangsposition setzen.
					change_note = note; //change_note für WebGl auf die aktuell gedrückte Note setzen
				}
				if(ev.keyCode == 83 || (mouseEvent == true && ev.x > 267 && ev.x < 286 && ev.y < 75  )){  //S-Taste
					note = 1;
					myJamCloud.pitch= 1.075;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 88 || (mouseEvent == true && ev.x > 277 && ev.x < 311 && ev.y > 75  )){  //X-Taste
					note = 2;
					myJamCloud.pitch= 1.15;	
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 68 || (mouseEvent == true && ev.x > 302 && ev.x < 321 && ev.y < 75  )){  //D-Taste
					note = 3;
					myJamCloud.pitch= 1.225;		
					meshes[note].position.z = 0;
					change_note = note;					
				}
				if(ev.keyCode == 67 || (mouseEvent == true && ev.x > 313 && ev.x < 345 && ev.y > 75  )){  //C-Taste
					note = 4;
					myJamCloud.pitch= 1.30;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 86 || (mouseEvent == true && ev.x > 347 && ev.x < 381 && ev.y > 75  )){  //V-Taste
					note = 5;
					myJamCloud.pitch= 1.375;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 71 || (mouseEvent == true && ev.x > 371 && ev.x < 391 && ev.y < 75  )){  //G-Taste
					note = 6;
					myJamCloud.pitch= 1.45;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 66 || (mouseEvent == true && ev.x > 383 && ev.x < 415 && ev.y > 75  )){  //B-Taste
					note = 7;
					myJamCloud.pitch= 1.525;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 72 || (mouseEvent == true && ev.x > 406 && ev.x < 425 && ev.y < 75  )){ //H-Taste
					note = 8;
					myJamCloud.pitch= 1.60;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 78 || (mouseEvent == true && ev.x > 417 && ev.x < 449 && ev.y > 75  )){ //N-Taste
					note = 9;
					myJamCloud.pitch= 1.70;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 74 || (mouseEvent == true && ev.x > 441 && ev.x < 459 && ev.y < 75  )){ //J-Taste
					note = 10;
					myJamCloud.pitch= 1.80;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 77 || (mouseEvent == true && ev.x > 452 && ev.x < 483 && ev.y > 75  )){ //M-Taste
					note = 11;
					myJamCloud.pitch= 1.90;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 188 || (mouseEvent == true && ev.x > 486 && ev.x < 518 && ev.y > 75  )){ //,-Taste
					note = 12;
					myJamCloud.pitch= 2.0;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 81 || (mouseEvent == true && ev.x > 486 && ev.x < 518 && ev.y > 75  )){ //Q-Taste
					note = 12;
					myJamCloud.pitch= 2.0;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 50 || (mouseEvent == true && ev.x > 509 && ev.x < 528 && ev.y < 75  )){ //2-Taste
					note = 13;
					myJamCloud.pitch= 2.15;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 87 || (mouseEvent == true && ev.x > 522 && ev.x < 552 && ev.y > 75  )){ //W-Taste
					note = 14;
					myJamCloud.pitch= 2.25;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 51  || (mouseEvent == true && ev.x > 545 && ev.x < 563 && ev.y < 75  )){ //3-Taste
					note = 15;
					myJamCloud.pitch= 2.4;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 69 || (mouseEvent == true && ev.x > 556 && ev.x < 588 && ev.y > 75  )){ //E-Taste
					note = 16;
					myJamCloud.pitch= 2.5;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 82 || (mouseEvent == true && ev.x > 591 && ev.x < 623 && ev.y > 75  )){//R-Taste
					note = 17;
					myJamCloud.pitch= 2.7;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 53 || (mouseEvent == true && ev.x > 614 && ev.x < 634 && ev.y < 75  )){//5-Taste
					note = 18;
					myJamCloud.pitch= 2.8;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 84 || (mouseEvent == true && ev.x > 625 && ev.x < 660 && ev.y > 75  )){//T-Taste
					note = 19;
					myJamCloud.pitch= 3.0;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 54 || (mouseEvent == true && ev.x > 649 && ev.x < 668 && ev.y < 75  )){//6-Taste
					note = 20;
					myJamCloud.pitch= 3.2;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 90 || (mouseEvent == true && ev.x > 660 && ev.x < 690 && ev.y > 75  )){//Z-Taste
					note = 21;
					myJamCloud.pitch= 3.4;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 55 || (mouseEvent == true && ev.x > 684 && ev.x < 703 && ev.y < 75  )){//7-Taste
					note = 22;
					myJamCloud.pitch= 3.6;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 85 || (mouseEvent == true && ev.x > 695 && ev.x < 729 && ev.y > 75  )){//U-Taste
					note = 23;
					myJamCloud.pitch= 3.8;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 73 || (mouseEvent == true && ev.x > 730 && ev.x < 762 && ev.y > 75  )){//I-Taste
					note = 24;
					myJamCloud.pitch= 4;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 57 || (mouseEvent == true && ev.x > 753 && ev.x < 772 && ev.y < 75  )){//9-Taste
					note = 25;
					myJamCloud.pitch= 4.3;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 79 || (mouseEvent == true && ev.x > 764 && ev.x < 796 && ev.y > 75  )){//O-Taste
					note = 26;
					myJamCloud.pitch= 4.6;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 48 || (mouseEvent == true && ev.x > 788 && ev.x < 807 && ev.y < 75  )){//0-Taste
					note = 27;
					myJamCloud.pitch= 4.9;
					meshes[note].position.z = 0;
					change_note = note;
				}
				if(ev.keyCode == 80 || (mouseEvent == true && ev.x > 799 && ev.x < 831 && ev.y > 75  )){//P-Taste
					note = 28;
					myJamCloud.pitch= 5.2;
					meshes[note].position.z = 0;
					change_note = note;
				}
				
				 if( note==666 ) return; //Abbruch

				myJamCloud.noteOn( note ); //abspielen der gewünschten Note 
				
			}
			
			
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////Slider mit jQueryevents bestücken
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
			$( "#volumeSlider" ).slider({ //Lautstärkenregler
			animate: true,
			range: "min", 
			value: 30, //Ausgangsvalue
			min: 0, //minimal Value
			max: 100, //maximal Value
			step: 5, //in 5er Schritte Regler verschiebbar
			
				slide: function( event, ui ) { //beim verschieben des Reglers
					myJamCloud.gainValue = ui.value; //Reglervalue in Variable gainValue innerhalb myJamCloud speichern
					$( "#slider-result1" ).html( ui.value ); //Reglervalue anpassen/überschreiben
				},
			
			});
			
			$( "#presetSlider" ).slider({ //Synth-Presets
			animate: true,
			range: "min",
			value: 1,
			min: 1,
			max: 20,
			step: 1,
			
				slide: function( event, ui ) {
					myJamCloud.preset = ui.value;
					$( "#slider-result2" ).html( ui.value );
					myJamCloud.newSound();
				},
			
			});
			
			$( "#filterType" ).slider({ //Filtertypen (Tiefpassfilter, Hochpassfilter...)
			animate: true,
			range: "min",
			value: -1,
			min: -1,
			max: 7,
			step: 1,

				slide: function( event, ui ) {
					myJamCloud.filter_type = ui.value;
					$( "#slider-result3" ).html( ui.value+1 );
				},

			});
			
			$( "#filterFrequency" ).slider({  //Filtergrenzfrequenz
			animate: true,
			range: "min",
			value: 100,
			min: 50,
			max: 20000,
			step: 50,

				slide: function( event, ui ) {
					myJamCloud.filter_freq = ui.value;
					$( "#slider-result4" ).html( ui.value+"Hz" );
				},

			});
			
			$( "#filterQuality" ).slider({ //Filterqualitätsfaktor
			animate: true,
			range: "min",
			value: 1,
			min: 0,
			max: 1,
			step: 0.1,

				slide: function( event, ui ) {
					myJamCloud.filter_quality = ui.value;
					$( "#slider-result5" ).html( ui.value );
				},

			});
			
			$( "#volumePlayFileSlider" ).slider({ //Lautstärkenregler für Audiofiles, welche übers Keyboard gespielt werden können
			animate: true,
			range: "min",
			value: 30,
			min: 0,
			max: 100,
			step: 5,
			
				slide: function( event, ui ) {
					myJamCloud.gainValue = ui.value;
					$( "#slider-result6" ).html( ui.value );
				},
			
			});

			$( "body" ).append("<script type='text/javascript' src='http://s7.addthis.com/js/300/addthis_widget.js#pubid=xa-4f03b873767beca5'><\/script>"); //javascript für social Buttons erst ganz am Ende laden, da diese nicht die Funktion von JamCloud beinträchtigen sollen.
		}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////HTML
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
		
	</script>
	</head>
	<body onload="myInit()"> <!--javascript nach Seitenaufbau laden-->

		<h1>JamCloud</h1>
		<!-- blog links... -->
			<div id="bloglinks">
				<div class="addthis_toolbox addthis_default_style ">
					<a class="addthis_button_facebook_like"></a>
					<a class="addthis_button_tweet"></a>
					<a class="addthis_button_google_plusone"></a>
					<a class="addthis_counter addthis_pill_style"></a>
				</div>
			</div>
		<!-- blog links end... -->
		<p id="info" ><a class="myBlogLink" href="http://multimediatechnology.at/~fhs33735/">© PRIETH MATTHIAS</a></p> <!--Link zum eigenen Blog-->
		<div class="seperator"></div>
		<div id="content">
			<div id="sidebar">
				<div id="synth" class="tabs">
					<p>SYNTH</p>
				</div>
				<div id="loops" class="tabs">
					<p>LOOPS</p>
				</div>
				<div id="fx" class="tabs">
					<p>FX</p>	
				</div>
				<div id="sliders">
					<div class="synthSlider">
						<h2>Vol.</h2>
						<div class="slider"  id="volumeSlider"></div><!--Lautstärkenregler-->
						<div id="slider-result1" class="slider-results">30</div>
						<input type="hidden" id="hidden1"/>
					</div>
					<div class="synthSlider">
						<h2>Presets</h2>
						<div class="slider"  id="presetSlider"></div> <!--Synth-Presets-->
						<div id="slider-result2" class="slider-results">1</div>
						<input type="hidden" id="hidden2"/>
					</div>
					
					<div class="fxSlider">
						<h2>Filtertyp</h2>
						<div class="slider"  id="filterType"></div> <!--Filtertypen (Tiefpassfilter, Hochpassfilter...)-->
						<div id="slider-result3" class="slider-results">0</div>
						<input type="hidden" id="hidden3"/>
					</div>
					<div class="fxSlider">
						<h2>Filterfrequenz</h2>
						<div class="slider"  id="filterFrequency"></div><!--Filtergrenzfrequenz-->
						<div id="slider-result4" class="slider-results">50Hz</div>
						<input type="hidden" id="hidden4"/>
					</div>
					<div class="fxSlider">
						<h2>Q-Factor</h2>
						<div class="slider" id="filterQuality"></div> <!--Filterqualitätsfaktor-->
						<div id="slider-result5" class="slider-results">1</div>
						<input type="hidden" id="hidden5"/>
					</div>
					
				</div>		
				
				<div id="loopArea" class="dropArea"> <!--dropArea für Files welche immer wieder als beat abgespielt werden (loop)-->
					<h2>DRAG</h2>
					<h2>&</h2>
					<h2>DROP</h2>
					<p>lots of .mp3 or .wav files here to loop them</p>
				</div>
				<div id="playFileArea" class="dropArea"> <!--dropArea für Files welche der Tonhöhe angepasst werden und somit am virtuellen Keyboard spielbar sind-->
					<h2>DRAG</h2>
					<h2>&</h2>
					<h2>DROP</h2>
					<p>.mp3 or .wav file here to play it on the keyboard</p>
				</div>
				<div class="dropArea">
						<h2>Vol.</h2>
						<div class="slider"  id="volumePlayFileSlider"></div> <!--Lautstärkenregler für Audiofiles, welche übers Keyboard gespielt werden können-->
						<div id="slider-result6" class="slider-results">30</div>
						<input type="hidden" id="hidden6"/>
				</div>
			</div>
			
			<div id="webGl"> <!--WebGl-Notenspur-->
			</div>
			
			<canvas id="piano" width="1122" height="128" onclick="cursorPoint(this)">Your browser does not support Canvas</canvas> <!--Canvas Piano-->

		</div>		
		
		</body>
	
	
</html>
