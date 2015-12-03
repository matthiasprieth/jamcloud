function JamCloud(){

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////Überprüfung ob Web Audio API unterstützt wird
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if( window.AudioContext ) //wenn nur html5 Audio unterstützt wird, html5 AudioContext erstellen
		this.mAudioContext = new AudioContext();

	if( this.mAudioContext==null ){ //volle Unterstützung der Web Audio API
		if( window.webkitAudioContext )
			this.mAudioContext = new webkitAudioContext();
	}

	if( this.mAudioContext==null ) //keine Unterstützung
    {
		alert("This site requires a Web Audio API-enabled browser like Chrome or Safari");
        return;
    }

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////Setzen der Parameter/Membervariablen von JamCloud
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	this.mCanvasPiano = document.getElementById("piano");//CanvasPiano

	this.mSampleRate = 44100;//Samplerate
    this.mNumNotes = 32 + 12*2;//4 Oktaven + Halbnoten = 4*8+12*2
    this.mSamples = new Array(this.mNumNotes); //jede Note/Taste als Array speichern (für ein Ton müssen verschiedene Abtastpunkte z.B. von einem Sinus Signal gespeichert werden)
    this.mSLen = 1*this.mSampleRate; //Arraylänge ergibt sich aus Samplerate
    this.mOctave = 1; //Aktuelle Oktave (0-2 Oktaven = insgesamt 3 Oktaven)
	this.mBuffer = new Array( 8 ); //0-7 -> Acht Töne(Oktave) in einem Array speichern
	this.mActiveNote = new Array( 8 ); //0-7 welche Noten gerade aktiv ist
	this.mId = 0; //gerade gespielte Note

	this.gain = null; //gainNode für die Lautstärke des Pianos
	this.gainValue = 30; //Lautstärke des Pianos (default 30%)
	this.filter = null; //Filter auf das Pianosounds (z.B. Tiefpass- oder Hochpassfilter)
	this.filter_type = -1 //Filtertyp z.B. Tiefpass- oder Hochpassfilter (-1=kein Filter)
	this.filter_freq = 50 //Filtergrenzfrequenz (50Hz)
	this.filter_quality = 1 //Filterqualitätsfaktor
	this.preset = 1; //Synthesizerpreset
	this.playFile = false;//wenn wir (.mp3, .wav Dateien) mit dem virtuellen Keyboard spielen möchten und nicht selbst generierte Synthesizeraudiosignale verwenden möchten
	this.looping = true;//wenn z.B. ein Beat durchgehend hintereinander abgespielt werden soll
	this.pitch = 1.00; //Abspielgeschwindigkeit eines Samples (1=normal, 2=doppelt..)

	for( j=0; j<8; j++ )
	{
		this.mBuffer[j] = this.mAudioContext.createBuffer( 1, this.mSLen, this.mSampleRate ); //für jeden Ton in der Oktave einen Buffer anlegen
		this.mActiveNote[j] = { mNote:666, mTo:0.0 }; //jede Note besitzt einen Keycode und wie lange sie gespielt wird
	}

	for( j=0; j<this.mNumNotes; j++ )
    {
        this.mSamples[j] = new Float32Array(this.mSLen); //Container wo nun alle Tonarrays hineinkommen
    }

	this.newSound();// Presets laden und Synthesizer initialisieren
	this.drawPiano();// drawPiano wird aufgerufen, welche einen Timer enthält und das virtuelle Keyboard immer neu zeichnet.

	me = this; //Um in Prototypen auf diese Klasse zugreifen zu können

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////spezielle Parameter/Membervariablen für das spielen von Files (also nicht mit den selbst erzeugten Synthesizertönen)
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	this.context = new (window.AudioContext || window.webkitAudioContext)(); //Web Audiocontext
	this.source = null; //sourceNode (hier wird später unsere Audiofile drangehängt)
	this.loopSource = null; //sourceNode welche immer wieder abgespielt(looped) wird
	this.fileSource = null; //sourceNode für Audiofiles, welche über das Keyboard abgespielt werden
	this.loopData = null; //unsere Audiofiles werden später decodiert und hier als Array hineingespeichert (loop)
	this.playFileData = null; //unsere Audiofiles werden später decodiert und hier als Array hineingespeichert (kein loop)

	var dropLoop = document.getElementById('loopArea');
	dropLoop.addEventListener('drop', this.loopEvent, false); //bei Filedrop in der loopArea this.loopEvent aufrufen
	dropLoop.addEventListener('dragover', this.dragOver, false); //bei dragover wird in this.dragOver das Standardevent abgebrochen

	var dropFile = document.getElementById('playFileArea');
	dropFile.addEventListener('drop', this.dropFileEvent, false);  //bei Filedrop in der playFileArea this.dropFileEvent aufrufen
	dropFile.addEventListener('dragover', this.dragOver, false); //bei dragover wird in this.dragOver das Standardevent abgebrochen

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////noteOn(note) -> Abspielen der Note und setzen der Variablen für drawPiano()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.noteOn = function( note ){
	var id = this.mId;//gerade aktive Note

	note += this.mOctave*12; //Notenbereich: 7 Ganztöne + 5 Halbtöne * Oktave

	this.mId = (this.mId+1) % 8; //geht immer von 0 bis 7

	if(this.playFile == true){  //möchten wir mit soundfiles auf dem Piano spielen, müssen wir grundlegend anders verfahren

		this.looping=false;

		this.initAudio(this.playFileData); //initAudio mit dem Array, welches aus der Audiofile generiert wurde

	}else{

		var num = this.mSLen; //Anzahl der Abtastpunkte für einen bestimmten Ton
		var sbuf = this.mSamples[note]; //Array wo alle Abtastpunkte aller Noten abgespeichert sind
		var dbuf = this.mBuffer[id].getChannelData(0); //zu spielendes Array

	   for( i=0; i<num; i++ )
		{
			dbuf[i] = sbuf[i]; //alle Abtastpunkte einer Note ins zu spielende Array kopieren
		}

		var sourceNode = this.mAudioContext.createBufferSource(); //Audiobuffer erstellen
		sourceNode.buffer = this.mBuffer[id]; //Abtastpunkte der zu spielenden Note ins Array kopieren

		var gainNode = this.mAudioContext.createGain();
		sourceNode.connect(gainNode);
		gainNode.gain.value = this.gainValue/100; //Lautstärke der zu spielenden Note festlegen (durch 100 da gain von 0 bis 1 geht)

		if (this.filter_type >= 0 && this.filter_type <= 8){ //Wenn Filter ausgewählt einen Filter erstellen
			var filterTypes = [
				"lowpass",
				"highpass",
				"bandpass",
				"lowshelf",
				"highshelf",
				"peaking",
				"notch",
				"allpass"
			];
			this.filter = this.mAudioContext.createBiquadFilter();
			this.filter.type = filterTypes[this.filter_type]; // Typ des Filters z.B. 0 = Tiefpassfilter, 1 = Hochpassfilter
			this.filter.frequency.value = this.filter_freq// Den cutoff vom Filter bei 440 HZ setzen.
			this.filter.Q = this.filter_quality; //der Qualitätsfaktor (kann bei gewissen Filtern angewandt werden)

			gainNode.connect(this.filter); //Unsern Ausgangston an den Filter hängen
			this.filter.connect(this.mAudioContext.destination); //und den Filter an unsern finalen AudioContext hängen

		}else{

			gainNode.connect(this.mAudioContext.destination); //andernfalls nur unseren Ausgangston and den finalen Audiocontext hängen und den Filter ignorieren
		}

		sourceNode.start(0); //Ton abspielen in 0 Sekunden (sofort)
	}

    this.mActiveNote[id].mNote = note; //Die gerade aktive Note wird gespeichert, damit drawPiano() (welches in Endlosschleife läuft) das Keyboard richtig zeichnet.
    this.mActiveNote[id].mTo = new Date().getTime(); //mTo muss aktualisiert werden. drawPiano() hinterlegt gedrückte Tasten farbig und die Färbung wird nach einer gewissen ZEIT schwächer.
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////drawPiano() -> Canvaspiano wird immer wieder gezeichnet (mit TimeOut)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.drawPiano = function(){

	function renderLoop(me)//this-Objekt wird übergeben, da bei einem this-Aufruf innerhalb der Funktion auf das Window-Objekt verweisen würde
	{

	  var ctx = me.mCanvasPiano.getContext('2d'); //2D-Canvas

	  var xres = me.mCanvasPiano.width; //Breite
	  var yres = me.mCanvasPiano.height; //Höhe

	  var num = 8*me.mNumNotes/12 - 5; //Anzahl der GanznotenTasten (weiße Klaviertasten)
	  var dx = xres/num;

	  ctx.fillStyle = '#ffffff';
	  ctx.fillRect(0, 0, xres, yres);

	  var needsAnim = false;
	  var time = (new Date()).getTime(); //Es wird mit Zeit gearbeitet, da Farbüng der Tasten nach dem drücken mit der Zeit wieder abschwächen soll

	  //Färbung der Ganznotentasten (weiß) wenn gedrückt und anschließend Färbung abschwächen
	  for( var i=0; i<8; i++ ){
		  //Wenn Taste/Note nicht gedrückt keine gefärbten Tasten zeichnen
		  var note = me.mActiveNote[i].mNote;
		  if( note==666 ) continue;

		  //Wenn Taste/Note gedrückt Tasten färben (nach außen hin weniger Farbe)
		  var dt = time - me.mActiveNote[i].mTo;
		  if( dt>1000 ) { me.mActiveNote[i].mNote=666; continue; }
		  needsAnim = true;
		  var e = Math.exp(-3.0*dt/1000.0);
		  var cr = Math.floor(0.8*255.0*e + (1.0-e)*255.0 );
		  var cg = Math.floor(0.8*192.0*e + (1.0-e)*255.0 );
		  var cb = Math.floor(0.8* 64.0*e + (1.0-e)*255.0 );
		  var str = 'rgb(' + cr + ',' + cg + ',' + cb + ')';
		  ctx.fillStyle = str;

		  var n = note % 12;
		  if( (n==1) || (n==3) || (n==6) || (n==8) || (n==10) ) continue;

		  var y = me.stn(note);

		  var x = y*dx;

		  ctx.fillRect(x, 0, dx, yres );
	  }

	  //Zwischenlinien zwischen den Tasten zeichnen
	  ctx.strokeStyle = '#282A31';

	  ctx.lineWidth = 1.5;

	  ctx.beginPath();
	  for( var i=0; i<num; i++ ){
		  var x = dx*i;

		  ctx.moveTo(x, 0);
		  ctx.lineTo(x, yres);

	  }
	  ctx.stroke();

	  //Halbnotentasten in schwarz zeichnen
	  ctx.fillStyle = '#000000';

	  for( var i=0; i<num; i++ ){
		  var n = i % 7;
		  if( (n==2) || (n==6) ) continue;
		  var x = i*dx + dx*0.7;
		  ctx.fillRect(x, 0, dx*0.6, yres*0.6 );
	  }

	  //Tastenbeschriftung
	  ctx.fillStyle= '#000000';
	  ctx.font = "10pt Helvetica";
	  var str = "YXCVBNMQWERTZUIOP";

	  for( var i=0; i<17; i++ )
		   ctx.fillText( str[i], 14 + (i+me.mOctave*7)*dx, yres-10 );


	  //Färbung der Halbnotentasten (schwarz) wenn gedrückt und anschließend Färbung abschwächen
	  for( var i=0; i<8; i++ ){
		  //Wenn Taste/Note nicht gedrückt keine gefärbten Tasten zeichnen
		  var note = me.mActiveNote[i].mNote;
		  if( note==666 ) continue;

		  //Wenn Taste/Note gedrückt Tasten färben (nach außen hin weniger Farbe)
		  var dt = time - me.mActiveNote[i].mTo;
		  if( dt>1000 ) { me.mActiveNote[i].mNote=666; continue; }
		  needsAnim = true;
		  var e = Math.exp(-3.0*dt/1000.0);
		  var cr = Math.floor(0.8*255.0*e + (1.0-e)*0.0 );
		  var cg = Math.floor(0.8*192.0*e + (1.0-e)*0.0 );
		  var cb = Math.floor(0.8* 64.0*e + (1.0-e)*0.0 );
		  var str = 'rgb(' + cr + ',' + cg + ',' + cb + ')';
		  ctx.fillStyle = str;

		  var n = note % 12;
		  if( (n==0) || (n==2) || (n==4) || (n==5) || (n==7) || (n==9) || (n==11) ) continue;

		  var y = me.stn(note);
		  var x = y*dx + dx*0.7 - dx*0.5;
		  ctx.fillRect(x, 0, dx*0.6, yres*0.6 );
	  }

	  var tin = 100;
	  if( needsAnim ) tin = 15;
	  setTimeout( renderLoop, tin, me ); //Virtuelles Keyboard wird immer wieder gezeichnet.
	}

	setTimeout(renderLoop, 0, this ); //Virtuelles Keyboard wird immer wieder gezeichnet.
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////initAudio(sound_data) und createAudio() (spezielle für Audiofiles, da diese beim abspielen anders behandelt werden, als z.B. selbst generierte digitale Sinussignale)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////Audiofile "dekodieren" und in buffer speichern
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.initAudio = function(sound_data) { //hier wird die Audiofile "dekodiert"
	this.source = this.context.createBufferSource(); //Audiobuffer erstellen

	if(this.context.decodeAudioData) {
		this.context.decodeAudioData(sound_data, function(buffer) { //Wenn Audiofile dekodiert werden kann, dann wird folgende Funktion aufgerufen, ansonsten exception
			me.source.buffer = buffer; //den dekodierten buffer in den zu spielenden buffer speichern
			me.createAudio(); //und eigene createAudio() aufrufen
		}, function(e) {//Fehlermeldung, wenn Datei nicht kodiert werden kann
			console.log(e); //spezifische Fehlermeldung für Konsole
			alert("Audiofile kann nicht kodiert werden bitte drag&droppen Sie eine ordnungsgemäße Datei (.mp3, .wav....) "); //Allgemeine Fehlermeldung
		});
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////AudiofileNode mit EffekteNode verbinden und EffektNode mit der ZielNode verbinden. Zuletzt abspielen.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.createAudio = function() {	//Anhängen von Effekten und abspielen der Audiodatei
	if(this.looping == true){
		this.source.loop = true;
		this.loopSource = this.source; //Source zwischenspeichern um später beispielsweise mit disconnect() das abspielen stoppen zu können!
	}
	else{
		this.source.playbackRate.value = this.pitch; // Hier wird die Abspielgeschwindigkeit angepasst, damit man bei samples höhere und tiefere Noten spielen kann
		this.fileSource = this.source;
	}

	var gainNode = this.context.createGain();
	this.source.connect(gainNode);
	gainNode.gain.value = this.gainValue/100; //Lautstärke der SourceFile einstellen

	// Create the filter
	if (this.filter_type >= 0 && this.filter_type <= 8){ //Wenn Filtertype zwischen 0 und 8 gewählt, einen hinzufügen
		this.filter = this.context.createBiquadFilter();
		this.filter.type = this.filter_type; // Typ des Filters z.B. 0 = Tiefpassfilter, 1 = Hochpassfilter
		this.filter.frequency.value = this.filter_freq// Den cutoff vom Filter bei 440 HZ setzen.
		this.filter.q = this.filter_quality; //der Qualitätsfaktor (kann bei gewissen Filtern angewandt werden.

		gainNode.connect(this.filter); //AudioSource an den Filter hängen
		this.filter.connect(this.context.destination); //Und den Filter an den finalen Context hängen

	}else{

		gainNode.connect(this.context.destination); //wenn kein Filter ausgewählt, nur die Source an den fiinalen Context hängen
	}
	// Spielen des Sound in 0 Sekunden(sofort)
	this.source.start(0);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////Audio stoppen und disconnecten
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.disconnect = function(mySource) {
	mySource.stop(0); //abspielen stoppen
	mySource.disconnect(0); //disconnecten
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////Eventbehandlung mit FileReader()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


JamCloud.prototype.event = function(evt) {
	evt.preventDefault(); //hindert den Browser übliches Javascript aufzurufen, in diesem Fall, wenn Audio gedropt wird, wird verhindert, dass der interne AudioPlayer aufgerufen wird! evt-Daten werden gelöscht

	var droppedFiles = evt.dataTransfer.files; //Datei abfangen und in droppedFiles speichern

	var reader = new FileReader(); //neuer Filereader

	reader.onload = function(fileEvent) {//wenn man Audiofile loopen möchte, dann Audio in loopData speichern, ansonsten Audio nur in playFileData speichern
		if(me.looping == true){
			me.loopData = fileEvent.target.result;
			me.initAudio(me.loopData); //initAudio mit Datei vom FileReader aufrufen
		}else{
			me.playFileData = fileEvent.target.result;
		}
	}

	reader.readAsArrayBuffer(droppedFiles[0]); //hier wird auch reader.onload aufgerufen
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////Eventbehandlung für loopEvents
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.loopEvent = function(evt) {
	var dateiname = evt.dataTransfer.files[0].name;//Dateiname aus Event auslesen
	$('#loopArea').html("<p>"+dateiname+"</p>");//Dateiname mit dem Text vom Drop-div ersetzen
	$('#loopArea').append("<input type='button' class='reset' value='STOP' onclick='myJamCloud.disconnect(myJamCloud.loopSource)'></input> "); //Stop Button einfügen, welcher bei klicken die Audiofile stoppt und disconnected
	me.looping = true;
	me.event(evt);
	evt.preventDefault(); //Standardevent abbrechen (sonst würde die Audiofile im internen Player von z.B. Chrome geladen und abgespielt werden)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////Eventbehandlung für dropFileEvents
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.dropFileEvent = function(evt) {
	var dateiname = evt.dataTransfer.files[0].name;//Dateiname aus Event auslesen
	$('#playFileArea').html("<p>"+dateiname+"</p>");//Dateiname mit dem Text vom Drop-div ersetzen
	me.looping = false;
	me.playFile = true;
	me.event(evt);
	evt.preventDefault(); //Standardevent abbrechen (sonst würde die Audiofile im internen Player von z.B. Chrome geladen und abgespielt werden)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////bei dragOver jegliche Standardevents abbrechen -> preventDefault()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.dragOver = function(evt) {
	evt.preventDefault(); //jegliche Standardevents abbrechen
	return false;
}





