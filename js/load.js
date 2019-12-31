// LOAD
$(document).ready(function() {

	// ONLINE INITIALIZE
	if(navigator.onLine){
		showLoading();
		getSource();
		loadApp();
	
	}
	// OFFLINE
	else{
		showOffline();
		
	}
	
});

function showLoading(){
	$('#loading-modal').show();
}

function showOffline(){
	$("#device-offline" ).text('Device is offline').toggle();
}
function getSource(){
	if(window.location.host == 'localhost'){
		window.directory = {app : 'http://localhost/respectforall_onsen/web/',
						   cms : 'http://localhost/respectforall_onsen/cms/'};
	}
	else{
		window.directory = {app : 'https://ohsurespectforall.com/',
						    cms : 'https://ohsurespectforall.com/cms/'};
	}
}
function loadApp(){
	
	// LOAD IN PRIMARY HTML CONTAINERS USED IN ONSEN
	$.ajax({
		url: window.directory.app + 'templates/onsen.html',
		success: function(data) {
			$('body').append(data);
		}	


	});  
	
	// PULL IN APP
	$.getScript(window.directory.app + 'js/app.js', function( data, textStatus, jqxhr ) {

		window.app = appInit();
		window.app.init();
		loadLogic();
		
	});
	
}
function loadAppLocal(){
	$.ajax({
		url: window.directory.app + 'templates/onsen.html',
		success: function(data) {
			$('body').append(data);
			window.app = appInit();
			window.app.init();
			loadLogic();
		}	


	});  
	
	
	
}

function loadLogic(){
	// PULL IN LOGIC
	$.getScript('js/appLogic.js', function( data, textStatus, jqxhr ) {
		setTimeout(function(){
			window.app.loading.hide();
			},
			500);
	});
	$.getScript('js/api.js', function( data, textStatus, jqxhr ) {
		
	});
}