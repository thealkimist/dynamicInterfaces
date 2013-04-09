	var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';
		style.href = chrome.extension.getURL('mystyles.css');
		document.head.appendChild(style);


		$('body').append('<div class="draggable"><form name=editor><input name=name><textarea name=data cols =41 rows =10 id="hideMe">0</textarea><input type=button value="SUBMIT" id="doSetItem"><input type=button value="CLEAR STORAGE" id="doClear"><script></script></form></div>');
		
		$(".draggable").css('background', 'rgba(255,0,0,0.50)');
		$(".draggable2").css('background', 'rgba(0,0,255,0.10)');

		
		$(document)ready(function() { 
			$(".draggable").draggable();
    			var socket = io.connect("http://127.0.0.1:8080");
    			socket.on('update_position', function (data) {
      			var x = data.x;
      			var y = data.y;
      				
    			});
 			
 			$(".draggable").draggable().mousemove(function(){
      		var coord = $(this).position();
      		$("#left").val(coord.left);
      		$("#top").val(coord.top);
      		socket.emit('receive_position', { x: coord.left, y: coord.top });
    		});


 			$("input#doSetItem").click(function(){
 				
	       	var offset=$(this).offset();
	       	console.log(this.tagName + "coords (" + offset.left + ", " + offset.top + ") ");
	     	//function doSetItem() {
	       	var name = document.forms.editor.name.value;
	       	var data = document.forms.editor.data.value;
	       	localStorage.setItem(name, data);
	       	doShowAll();
 			});


 			$("input#doClear").click(function(){
 			//function doClear() {
       		localStorage.clear();
        	doShowAll();
 				
 			});

 		});

		
		$("*", document.body).click(function (e) {
  			var offset = $(this).offset();
  			e.stopPropagation();
  			//$(".draggable").append('<p id="coords">' + this.tagName + " coords ( " + offset.left + ", " + offset.top + " )" + '</p>');
  			console.log(this.tagName + " coords ( " + offset.left + ", " + offset.top + " )" );
		});


		
 	
 	   function doShowAll() {
       var key = "";
       var store="doSetItem";
       //var pairs = "<tr><th>Name</th><th>Value</th></tr>\n";
       var i=0;
       for (i=0; i<=localStorage.length-1; i++) {
         key = localStorage.key(i);
         store += "<tr><td>"+key+"</td>\n<td>"+localStorage.getItem(key)+"</td></tr>\n";
         //pairs += "<tr><td>"+key+"</td>\n<td>"+localStorage.getItem(key)+"</td></tr>\n";
       }
       	 if(store == "<tr><th>name</th></tr>\n"){
       	 	store += "<tr><td><i>empty</i></td>\n<td><i>empty</i></td></tr>\n";

       //if (pairs == "<tr><th>Name</th><th>Value</th></tr>\n") {
         //pairs += "<tr><td><i>empty</i></td>\n<td><i>empty</i></td></tr>\n";
       //}
       document.getElementById('store').innerHTML = store;
       }

	   };
 

 		

       

       

      

   