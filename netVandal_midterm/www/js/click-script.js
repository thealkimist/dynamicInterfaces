$(document).ready(function(){
	var beat;
	var startTime;
	var tempo = 80;
	var eighthNoteTime = 0.375;

	var username;
	var joojoo, maxie, yiyi;
	var beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8, beat9, beat10, beat11, beat12, beat13, beat14, beat15, beat16;
	var pitches = [];
	var joo = [];
	var max = [];
	var yi = [];

	var ah01 = new sound('audio/max/dingdong01.wav');
	var ah02 = new sound('audio/max/dingdong02.wav');
	var ah03 = new sound('audio/max/dingdong03.wav');
	var ah04 = new sound('audio/max/dingdong04.wav');
	var ah05 = new sound('audio/max/dingdong05.wav');
	var aya01 = new sound('audio/joo/mama01.wav');
	var aya02 = new sound('audio/joo/mama02.wav');
	var aya03 = new sound('audio/joo/mama03.wav');
	var aya04 = new sound('audio/joo/mama04.wav');
	var aya05 = new sound('audio/joo/mama05.wav');
	var dd01 = new sound('audio/yiyi/ew01.wav');
	var dd02 = new sound('audio/yiyi/ew02.wav');
	var dd03 = new sound('audio/yiyi/ew03.wav');
	var dd04 = new sound('audio/yiyi/ew04.wav');
	var dd05 = new sound('audio/yiyi/ew05.wav');

	//var drum = new sound('audio/drum01.wav');

	var maxVoice = [ah05, ah04, ah03, ah02, ah01];
	var jooVoice = [aya05, aya04, aya03. aya02, aya01];
	var yiVoice = [dd05, dd04, dd03, dd02, dd01];

	var socket = io.connect('http://localhost');

	socket.on('joojoo joined', function(data){
		console.log('joojoo joined');
		$('#joojoo').css({'opacity': '0.5', 'cursor': 'default'});
		$('#joojoo h2').text('SOLD OUT');
		$('#joojoo p').text('Joojoo will be in stock soon.');
	});
	socket.on('maxie joined', function(data){
		console.log('maxie joined');
		$('#maxie').css({'opacity': '0.5', 'cursor': 'default'});
		$('#maxie h2').text('SOLD OUT');
		$('#maxie p').text('Maxie is too popular. 0 left.');
	});
	socket.on('yiyi joined', function(data){
		console.log('yiyi joined');
		$('#yiyi').css({'opacity': '0.5', 'cursor': 'default'});
		$('#yiyi h2').text('SOLD OUT');
		$('#yiyi p').text('Yiyi is out of print. Go check in eBay.' );
	});
	socket.on('joo voice', function(data){
		joo = data.sounds;
	});
	socket.on('maxie voice', function(data){
		max = data.sounds;
	});
	socket.on('yiyi voice', function(data){
		yi = data.sounds;
	});

	init();

	$('.join-wrapper ul a').each(function(){
	    $('.join-wrapper ul a').click(function(){
	    	$('.join-wrapper ul a').removeClass('highlighted');
	        $(this).addClass('highlighted');
	        if( (this.id) == 'joojoo'){username = 'joojoo';}
	        if( (this.id) == 'maxie'){username = 'maxie';}
	        if( (this.id) == 'yiyi'){username = 'yiyi';}
	    });
	});

	$('#start').click(function(){
	    if(username != ''){
	    	data = {};
	    	data.username = username;
	    	socket.emit('someone joined', data);
		}
		//drum.start();
		load();
	});
	$('#quit').click(function(){
	    if(username != ''){
	    	data = {};
	    	data.username = username;
	    	socket.emit('someone left', data);
		}
		//drum.stop();
		stopBeat();
	});

	$('#beat-wrapper ul li').click(function(){
		if ($(this).hasClass('clicked')){
			$(this).removeClass('clicked');
		    for(var i = 0; i < 80; i++){
		        if( this.id == ('pitch-'+ [i+1])){
		        	pitches[i] = false;
		        }
		    }
		    if(username == 'joojoo'){
		        for(var i = 0; i < 80; i++){
		            if(pitches[i] == false){joo[i] = false;}
		        }
		    }
		    if(username == 'maxie'){
		        for(var i = 0; i < 80; i++){
		            if(pitches[i] == false){max[i] = false;}
		        }
		    }
		    if(username == 'yiyi'){
		        for(var i = 0; i < 80; i++){
		            if(pitches[i] == false){yi[i] = false;}
		        }
		    }

		} else{
			$(this).addClass('clicked');
            for(var i = 0; i < 80; i++){
                if( this.id == ('pitch-'+ [i+1])){pitches[i] = true;}
            }
            if(username == 'joojoo'){
                for(var i = 0; i < 80; i++){
                    if(pitches[i] == true){joo[i] = true;}
                }
            }
            if(username == 'maxie'){
                for(var i = 0; i < 80; i++){
                    if(pitches[i] == true){max[i] = true;}
                }
            }
            if(username == 'yiyi'){
                for(var i = 0; i < 80; i++){
                    if(pitches[i] == true){yi[i] = true;}
                }
            }
		}
	    if(username == 'joojoo'){
	    	data = {};
	    	data.username = 'joojoo';
	    	data.sounds = joo;
	    	socket.emit('joo voice', data);
		}
	    if(username == 'maxie'){
	    	data = {};
	    	data.username = 'maxie';
	    	data.sounds = max;
	    	socket.emit('maxie voice', data);
		}
	    if(username == 'yiyi'){
	    	data = {};
	    	data.username = 'yiyi';
	    	data.sounds = yi;
	    	socket.emit('yiyi voice', data);
		}
	});

/*=======================*===============================*/
function init() {
    if(!window.audioContext){
        audioContext = new webkitAudioContext;
    } else {
        throw new Error('AudioContext not supported. :(');
    }
}

function stopBeat(){
    beat = 100;
    drum.stop();
}

function load(){
    beat = 1;
    playBeats();
    function addBeat(){
        beat += 1;
        if (beat >= 17 && beat <= 22){
            playBeats();
            beat = 1;
        }
        beatVisualizer();
    }
    setInterval(addBeat,eighthNoteTime*1000);
}

function sound(source){
    var that = this;
    that.source = source;
    that.buffer = null;
    that.isLoaded = false;
    that.startSound;

    var getSound = new XMLHttpRequest();
    getSound.open('GET', that.source, 'true');
    getSound.responseType = 'arraybuffer';
    getSound.onload = function(){
        audioContext.decodeAudioData(getSound.response, function(buffer){
            that.buffer = buffer;
            that.isLoaded = true;
            if(that.isLoaded == true){
                that.startSound = audioContext.createBufferSource();
                that.startSound.buffer = that.buffer;
                that.startSound.connect(audioContext.destination);
            }
        });
    }
    getSound.send();
}

sound.prototype.play = function(time){
    if(!time){time = 0;}else{time = time;}
    if(this.isLoaded == true){
        var startSound = audioContext.createBufferSource();
        startSound.buffer = this.buffer;
        startSound.connect(audioContext.destination);
        startSound.noteOn(time);
    }
}

sound.prototype.stop = function(time){
    if(!time){time = 0;}else{time = time;}
    if(this.isLoaded == true){
        this.startSound.noteOff(time);
    }
}

sound.prototype.start = function(){
    if(this.isLoaded == true){
        this.startSound.loop = true;
        this.startSound.playbackRate.value = 1.0;
        this.startSound.noteOn(0);
    }
}

function playBeats() {
    startTime = audioContext.currentTime;
    var time = startTime;
    for(var i =0; i < 5; i ++){
        if(joo[i] == true){jooVoice[i].play(time + 1 *eighthNoteTime);}
        if(joo[5+i] == true){jooVoice[i].play(time + 2 *eighthNoteTime);}
        if(joo[10+i] == true){jooVoice[i].play(time + 3 *eighthNoteTime);}
        if(joo[15+i] == true){jooVoice[i].play(time + 4 *eighthNoteTime);}
        if(joo[10+i] == true){jooVoice[i].play(time + 5 *eighthNoteTime);}
        if(joo[25+i] == true){jooVoice[i].play(time + 6 *eighthNoteTime);}
        if(joo[30+i] == true){jooVoice[i].play(time + 7 *eighthNoteTime);}
        if(joo[35+i] == true){jooVoice[i].play(time + 8 *eighthNoteTime);}
        if(joo[40+i] == true){jooVoice[i].play(time + 9 *eighthNoteTime);}
        if(joo[45+i] == true){jooVoice[i].play(time + 10 *eighthNoteTime);}
        if(joo[50+i] == true){jooVoice[i].play(time + 11 *eighthNoteTime);}
        if(joo[55+i] == true){jooVoice[i].play(time + 12 *eighthNoteTime);}
        if(joo[60+i] == true){jooVoice[i].play(time + 13 *eighthNoteTime);}
        if(joo[65+i] == true){jooVoice[i].play(time + 14 *eighthNoteTime);}
        if(joo[70+i] == true){jooVoice[i].play(time + 15 *eighthNoteTime);}
        if(joo[75+i] == true){jooVoice[i].play(time + 16 *eighthNoteTime);}

        if(max[i] == true){maxVoice[i].play(time + 1 *eighthNoteTime);}
        if(max[5+i] == true){maxVoice[i].play(time + 2 *eighthNoteTime);}
        if(max[10+i] == true){maxVoice[i].play(time + 3 *eighthNoteTime);}
        if(max[15+i] == true){maxVoice[i].play(time + 4 *eighthNoteTime);}
        if(max[10+i] == true){maxVoice[i].play(time + 5 *eighthNoteTime);}
        if(max[25+i] == true){maxVoice[i].play(time + 6 *eighthNoteTime);}
        if(max[30+i] == true){maxVoice[i].play(time + 7 *eighthNoteTime);}
        if(max[35+i] == true){maxVoice[i].play(time + 8 *eighthNoteTime);}
        if(max[40+i] == true){maxVoice[i].play(time + 9 *eighthNoteTime);}
        if(max[45+i] == true){maxVoice[i].play(time + 10 *eighthNoteTime);}
        if(max[50+i] == true){maxVoice[i].play(time + 11 *eighthNoteTime);}
        if(max[55+i] == true){maxVoice[i].play(time + 12 *eighthNoteTime);}
        if(max[60+i] == true){maxVoice[i].play(time + 13 *eighthNoteTime);}
        if(max[65+i] == true){maxVoice[i].play(time + 14 *eighthNoteTime);}
        if(max[70+i] == true){maxVoice[i].play(time + 15 *eighthNoteTime);}
        if(max[75+i] == true){maxVoice[i].play(time + 16 *eighthNoteTime);}
        
        if(yi[i] == true){maxVoice[i].play(time + 1 *eighthNoteTime);}
        if(yi[5+i] == true){yiVoice[i].play(time + 2 *eighthNoteTime);}
        if(yi[10+i] == true){yiVoice[i].play(time + 3 *eighthNoteTime);}
        if(yi[15+i] == true){yiVoice[i].play(time + 4 *eighthNoteTime);}
        if(yi[10+i] == true){yiVoice[i].play(time + 5 *eighthNoteTime);}
        if(yi[25+i] == true){yiVoice[i].play(time + 6 *eighthNoteTime);}
        if(yi[30+i] == true){yiVoice[i].play(time + 7 *eighthNoteTime);}
        if(yi[35+i] == true){yiVoice[i].play(time + 8 *eighthNoteTime);}
        if(yi[40+i] == true){yiVoice[i].play(time + 9 *eighthNoteTime);}
        if(yi[45+i] == true){yiVoice[i].play(time + 10 *eighthNoteTime);}
        if(yi[50+i] == true){yiVoice[i].play(time + 11 *eighthNoteTime);}
        if(yi[55+i] == true){yiVoice[i].play(time + 12 *eighthNoteTime);}
        if(yi[60+i] == true){yiVoice[i].play(time + 13 *eighthNoteTime);}
        if(yi[65+i] == true){yiVoice[i].play(time + 14 *eighthNoteTime);}
        if(yi[70+i] == true){yiVoice[i].play(time + 15 *eighthNoteTime);}
        if(yi[75+i] == true){yiVoice[i].play(time + 16 *eighthNoteTime);}
        
    }
}

function beatVisualizer(){
    if(beat == 1){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-1 li').addClass('on-beat');
    }
    if(beat == 2){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-2 li').addClass('on-beat');
    }
    if(beat == 3){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-3 li').addClass('on-beat');
    }
    if(beat == 4){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-4 li').addClass('on-beat');
    }
    if(beat == 5){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-5 li').addClass('on-beat');
    }
    if(beat == 6){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-6 li').addClass('on-beat');
    }
    if(beat == 7){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-7 li').addClass('on-beat');
    }
    if(beat == 8){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-8 li').addClass('on-beat');
    }
    if(beat == 9){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-9 li').addClass('on-beat');
    }
    if(beat == 10){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-10 li').addClass('on-beat');
    }
    if(beat == 11){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-11 li').addClass('on-beat');
    }
    if(beat == 12){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-12 li').addClass('on-beat');
    }
    if(beat == 13){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-13 li').addClass('on-beat');
    }
    if(beat == 14){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-14 li').addClass('on-beat');
    }
    if(beat == 15){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-15 li').addClass('on-beat');
    }
    if(beat == 16){
        $('#beat-wrapper ul li').removeClass('on-beat');
        $('#beat-16 li').addClass('on-beat');
    }

}

});
