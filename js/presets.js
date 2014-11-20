////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////Presets
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

JamCloud.prototype.newSound = function(){//wird bei der Initialisierung aufgerufen

	switch(this.preset){
		case 1:
			var myPreset = new String("f = cos(0.251*w*t); y  = 0.5*cos(1.0*w*t+3.14*f)*exp(-0.0007*w*t); y += 0.2*cos(2.0*w*t+3.14*f)*exp(-0.0009*w*t); y += 0.2*cos(4.0*w*t+3.14*f)*exp(-0.0016*w*t); y += 0.1*cos(8.0*w*t+3.14*f)*exp(-0.0020*w*t); y *= 0.9 + 0.1*cos(70.0*t); y = 2.0*y*exp(-22.0*t) + y;");
			break;
		case 2:	
			var myPreset= new String("y  = 0.6*sin(1.0*w*t)*exp(-0.0008*w*t); y += 0.3*sin(2.0*w*t)*exp(-0.0010*w*t); y += 0.1*sin(4.0*w*t)*exp(-0.0015*w*t); y += 0.2*y*y*y; y *= 0.9 + 0.1*cos(70.0*t); y = 2.0*y*exp(-22.0*t) + y;");
			break;
		case 3:	
			var myPreset = new String("t = t + .00015*noise(12*t); rt = t; r = t*w*.2; r = fmod(r,1); a = 0.15 + 0.6*(rt); b = 0.65 - 0.5*(rt); y = 50*r*(r-1)*(r-.2)*(r-a)*(r-b); r = t*w*.401; r = fmod(r,1); a = 0.12 + 0.65*(rt); b = 0.67 - 0.55*(rt); y2 = 50*r*(r-1)*(r-.4)*(r-a)*(r-b); r = t*w*.399; r = fmod(r,1); a = 0.14 + 0.55*(rt); b = 0.66 - 0.65*(rt); y3 = 50*r*(r-1)*(r-.8)*(r-a)*(r-b); y += .02*noise(1000*t); y  /= (t*w*.0015+.1); y2 /= (t*w*.0020+.1); y3 /= (t*w*.0025+.1); y = (y+y2+y3)/3;"); 
			break;
		case 4:
			var myPreset = new String("y  = 0.6*sin(1.0*w*t)");
			break;
		case 5:
			var myPreset = new String("var f = 0.001*(cos(5*t)); y  = 1.0*(saw((1.00+f)*0.1*w*t,1)-0.5);");
			break;
		case 6:
			var myPreset = new String("tt= 1-t; a= sin(t*w*.5)*log(t+0.3)*tt; b= sin(t*w)*t*.4; c= fmod(tt,.075)*cos(pow(tt,3)*w)*t*2; y= (a+b+c)*tt;");
			break;
		case 7:
			var myPreset = new String("y  = 0.100*exp( -t/1.000 )*sin( 0.56*w*t ); y += 0.067*exp( -t/0.900 )*sin( 0.56*w*t ); y += 0.100*exp( -t/0.650 )*sin( 0.92*w*t ); y += 0.180*exp( -t/0.550 )*sin( 0.92*w*t ); y += 0.267*exp( -t/0.325 )*sin( 1.19*w*t ); y += 0.167*exp( -t/0.350 )*sin( 1.70*w*t ); y += 0.146*exp( -t/0.250 )*sin( 2.00*w*t ); y += 0.133*exp( -t/0.200 )*sin( 2.74*w*t ); y += 0.133*exp( -t/0.150 )*sin( 3.00*w*t ); y += 0.100*exp( -t/0.100 )*sin( 3.76*w*t ); y += 0.133*exp( -t/0.075 )*sin( 4.07*w*t );");	
			break;	
		case 8:
			var myPreset = new String("f = 0.001*(cos(5*t)); y  = 1.0*(saw((1.00+f)*0.1*w*t,1)-0.5); y += 0.7*(saw((2.01+f)*0.1*w*t,1)-0.5); y += 0.5*(saw((4.02+f)*0.1*w*t,1)-0.5); y += 0.2*(saw((8.02+f)*0.1*w*t,1)-0.5); y *= 20*t*exp(-4*t); y *= 0.9+0.1*cos(40*t);");
			break;
		case 9:
			var myPreset = new String("y  = 6.0*t*exp( -2*t )*sin( w*t ); y *= .8+.2*cos(16*t);");
			break;	
		case 10:
			var myPreset = new String("y = max(-1.0,min(1.0,8.0*sin(3000*t*exp(-6*t))));");
			break;
		case 11:
			var myPreset = new String("y  = 0.5*noise(32000*t)*exp(-32*t); y += 2.0*noise(3200*t)*exp(-32*t); y += 3.0*cos(400*(1-t)*t)*exp(-4*t);");	
			break;	
		case 12:
			var myPreset = new String("f = 1000-2500*t; y = sin(f*t); y += .2*random(); y *= exp(-12*t); y *= 8;");
			break;
		case 13:
			var myPreset = new String("y  = .6*cos(w*t)*exp(-4*t); y += .4*cos(2*w*t)*exp(-3*t); y += .01*cos(4*w*t)*exp(-1*t); y = y*y*y + y*y*y*y*y + y*y; a = .5+.5*cos(8*t); y = sin(y*a*3.14); y *= 30*t*exp(-.1*t);");
			break;
		case 14:
			var myPreset = new String("f = cos(0.7*w*t); y  = 0.5*cos(1.0*w*t+3.14*f)*exp(-0.0007*w*t); y += 0.2*cos(2.0*w*t+3.14*f)*exp(-0.0009*w*t); y += 0.2*cos(4.0*w*t+3.14*f)*exp(-0.0016*w*t); y += 0.1*cos(8.0*w*t+3.14*f)*exp(-0.0020*w*t); y *= 0.9 + 0.1*cos(70.0*t); y = 2.0*y*exp(-22.0*t) + y;");
			break;
		case 15:
			var myPreset = new String("f = 0.001*(cos(2*t)); y  = 1.0*(saw((1.00+f)*0.1*w*t,1)-0.5);");
			break;	
		case 16:
			var myPreset = new String("f = fmod(t,6.2831/w)*w/6.2831; a = .7+.3*cos(6.2831*t); y = -1.0+2*saw(f,a); y = y*y*y; y = 15*y*t*exp(-5*t);");
			break;
		case 17:
			var myPreset = new String("a1 = .5+.5*cos(0+t*12); a2 = .5+.5*cos(1+t*8); a3 = .5+.5*cos(2+t*4); y  = saw(.2500*w*t,a1)*exp(-2*t); y += saw(.1250*w*t,a2)*exp(-3*t); y += saw(.0625*w*t,a3)*exp(-4*t); y *= .8+.2*cos(64*t);");	
			break;
		case 18:
			var myPreset = new String("var f = 0.001*(cos(5*t)); y  = 1.0*(saw((1.00+f)*0.1*w*t,1)-0.5); y += 0.7*(saw((2.01+f)*0.1*w*t,1)-0.5); y += 0.5*(saw((4.02+f)*0.1*w*t,1)-0.5); y += 0.2*(saw((8.02+f)*0.1*w*t,1)-0.5); y *= 20*t*exp(-4*t); y *= 0.9+0.1*cos(40*t);");
			break;
		case 19:
			var myPreset = new String("h = fmod(t,.5); y  = 0.2*noise(32000*h)*exp(-32*h); y += 1.0*noise(3200*h)*exp(-32*h); y += 7.0*cos( 320-100*exp(-10*h))*exp(-4*h); h = fmod(t+.15,1.0); y += 0.5*noise(32000*h)*exp(-64*h); h = fmod(t+.25,1.0); y += 1.0*noise(32000*h)*exp(-32*h); t += .25; s = sign(sin(.5*6.2831*t)); h = fmod(t,.5); y += 2.0*cos(6.2831*(105+11*s)*t)*exp(-6*h); h = fmod(t,.125)/.125; y += 1.4*noise(320*h)*exp(-32*h); g = .018; t2 = t+ .05*cos(t*6.2831); f = fmod(t2,g)/g; a = .5+.4*cos(6.2831*t2); f = saw(f,a); f = -1.0+2*f; f = f*f*f; y += f*1.5; y *= .6;");	
			break;
		case 20:
			var myPreset = new String("y  = 0.6*random(1.0*w*t)"); 
			break;	
		default:	
			var myPreset= new String("y  = 0.6*sin(1.0*w*t)*exp(-0.0008*w*t); y += 0.3*sin(2.0*w*t)*exp(-0.0010*w*t); y += 0.1*sin(4.0*w*t)*exp(-0.0015*w*t); y += 0.2*y*y*y; y *= 0.9 + 0.1*cos(70.0*t); y = 2.0*y*exp(-22.0*t) + y;");
	}  
      myPreset = myPreset.replace( /sin/gi, "Math.sin" );
      myPreset = myPreset.replace( /cos/gi, "Math.cos" );
      myPreset = myPreset.replace( /tan/gi, "Math.tan" );
      myPreset = myPreset.replace( /asin/gi, "Math.asin" );
      myPreset = myPreset.replace( /acos/gi, "Math.acos" );
      myPreset = myPreset.replace( /exp/gi, "Math.exp" );
      myPreset = myPreset.replace( /pow/gi, "Math.pow" );
      myPreset = myPreset.replace( /sqrt/gi, "Math.sqrt" );
      myPreset = myPreset.replace( /log/gi, "Math.log" );
      myPreset = myPreset.replace( /abs/gi, "Math.abs" );
      myPreset = myPreset.replace( /min/gi, "Math.min" );
      myPreset = myPreset.replace( /max/gi, "Math.max" );
      myPreset = myPreset.replace( /round/gi, "Math.round" );
      myPreset = myPreset.replace( /floor/gi, "Math.floor" );
      myPreset = myPreset.replace( /ceil/gi, "Math.ceil" );
      myPreset = myPreset.replace( /random/gi, "Math.random" );
	
	  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  ////////////////////////////////////////////////////////////////Presets
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
      var func = new Function( "w", "num", "buf", "var isr = 1.0/44100.0; for( i=0; i<num; i++ ) { var t = i*isr; var y=0.0; " + myPreset + "; buf[i] = y; }" );
	
      var me = 0;
      var sid = 0;

      function calcSample()
      {
       
          var f = 440.0*Math.pow( 2.0, (sid-9-12)/12.0 );
          var w = 2.0*Math.PI*f;
		  
		  
		  
          func(w,me.mSLen,me.mSamples[sid]);
  
          sid = sid + 1;
  
          setTimeout( calcSample, 2 );
      }
      me = this;
      sid = 0;
      calcSample();
	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////Mathematische Funktionen für das generieren digitaler Signale
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function fmod(x,y)
{
    return x%y;
}

function sign(x)
{
    if( x>0.0 ) x=1.0; else x=-1.0;
    return x;
}
function smoothstep(a,b,x)
{
    if( x<a ) return 0.0;
    if( x>b ) return 1.0;
    var y = (x-a)/(b-a);
    return y*y*(3.0-2.0*y);
}
function clamp(x,a,b)
{
    if( x<a ) return a;
    if( x>b ) return b;
    return x;
}
function step(a,x)
{
    if( x<a ) return 0.0;
    else      return 1.0;
}
function mix(a,b,x)
{
    return a + (b-a)*Math.min(Math.max(x,0.0),1.0);
}
function over(x,y)
{
    return 1.0 - (1.0-x)*(1.0-y);
}
function tri(a,x)
{
    x = x / (2.0*Math.PI);
    x = x % 1.0;
    if( x<0.0 ) x = 1.0+x;
    if(x<a) x=x/a; else x=1.0-(x-a)/(1.0-a);
    return -1.0+2.0*x;
}

function saw(x,a)
{
    var f = x % 1.0;

    if( f<a )
        f = f/a;
    else
        f = 1.0 - (f-a)/(1.0-a);
    return f;
}

function sqr(a,x)
{
    if( Math.sin(x)>a ) x=1.0; else x=-1.0;
    return x;
}
function grad(n, x)
{
    n = (n << 13) ^ n;
    n = (n * (n * n * 15731 + 789221) + 1376312589);
    var res = x;
    if( n & 0x20000000 ) res = -x;
    return res;
}

function noise(x)
{
    var i = Math.floor(x);
    var f = x - i;
    var w = f*f*f*(f*(f*6.0-15.0)+10.0);
    var a = grad( i+0, f+0.0 );
    var b = grad( i+1, f-1.0 );
    return a + (b-a)*w;
}

JamCloud.prototype.stn = function( n ){
	var o = Math.floor(n/12);
	n = n % 12;

	if( n>4 ) n+=1;
	return 7*o + (n/2);
}	

function cellnoise(x)
{
    var n = Math.floor(x);
    n = (n << 13) ^ n;
    n = (n * (n * n * 15731 + 789221) + 1376312589);
    n = (n>>14) & 65535;
    return n/65535.0;
}
function frac(x)
{
    return x % 1.0;
}

