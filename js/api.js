// JavaScript Document

// INITIALIZE RESOURCE API
$(document).ready(function() {
	
	var resapi = resourceAPIInit();
	window.resapi = resapi;
	//window.resapi.getCategories();
	window.resapi.checkSession();


});



function resourceAPIInit(){
	
	
	var resapi= {
		
			// PROPERTIES
			//------------------------------------
			attributes: {
					appName : 'resourceAPI',
					version : '0.1',
					endpoint : 'https://www.navigateopen.info/pubres/api/',
					apikey : '1P1NSY4Z',
					sessionId : '', // need to retrieve this with each
					zip : '',
					countyId : '',
					catid : '',
					catIndex : -1
					
					// format of requests https://www.referweb.net/pubres/api/GetSessionId/?ip={apikey:'SSSSSS',xxx:'xxx'}
					
					  
												
			},
			
			activeRequest : '',
			requestTypes : {
				session : 	{ name : 'GetSessionID', 	 parameters : { apikey : ''}},
				category : 	{ name : 'GetCategories', 	 parameters : { apikey : '', sid : ''}},
				county: 	{ name : 'GetCounty',  		 parameters : { apikey : '', sid : '', zip : ''}},
				services : 	{ name : 'ServiceProviders', parameters : { apikey : '', sid : '', zip : '', st : 'c', county : 'Benton', catid: '',sn : ''}},
			},
			// GET SESSION ID
			checkSession : function(){
				if(this.attributes.sessionId == ""){
					this.activeRequest = 'session';
					this.set();
				}	
			},
			set : function(){
				
				var setValid = 1;
				// GET THE REQUEST OBJ
				var request = this.requestTypes[this.activeRequest];
				
				// SET ENDPOINT
				request.uri = this.attributes.endpoint + request.name + '/';
				
				// SET API KEY
				request.parameters.apikey = this.attributes.apikey;
				
				switch(this.activeRequest){
						
					case 'category':
						request.parameters.sid = this.attributes.sessionId;
						
					break;
						
					case 'county':
						request.parameters.sid = this.attributes.sessionId;
						request.parameters.zip = this.attributes.zip;
						
					break;
					
					case 'services':
						request.parameters.sid = this.attributes.sessionId;
						request.parameters.zip = this.attributes.zip;
						//request.parameters.county = this.attributes.county;
						request.parameters.catid = this.attributes.catid;
						
					break;
				}
				
				
				if(setValid == 1){
					console.log(request);
					this.request(request);
				}
				
				
			
			},
			// CALL THE API
			request : function(request){
				
				$.ajax({url :request.uri,
						type:"POST",
						contentType: 'application/json; charset=utf-8',
						processData: false,
						success :	function(data){
							resapi.postRequest(data);
						},
						data: JSON.stringify(request.parameters)
						
				});
				
			},
			// DO SOMETHING AFTER THE REQUEST
			postRequest : function(data){
				switch(this.activeRequest){
						
					case 'session':
						this.attributes.sessionId = data[0].session_id;
						
					break;
						
					case 'county':
						this.attributes.countyId = data[0].c_id;
						this.attributes.county = data[0].county;
						
					break;
					case 'services':
						// SAVE THE DATA OBJECT TO THE CATEGORIES OBJ
						this.attributes.categories.elements[this.attributes.catIndex].data = data;
						this.getServices();
						
						//window.app.summary.resources.get();
					break;
				}
			},
			// GET ALL AVAILABLE RESOURCE DATA FOR ALL CATEGORIES
			getServices : function(){
				//for(var category in  resapi.attributes.categories.elements){
				if(this.attributes.catIndex == -1){
					this.attributes.catIndex = 0;
				}
				else{
					this.attributes.catIndex++;
				}
				
				if(resapi.attributes.categories.elements[this.attributes.catIndex] != undefined){
					var cat =  resapi.attributes.categories.elements[this.attributes.catIndex];
					if( cat.data != undefined){
						delete cat.data;
					}
					
					this.attributes.catName = cat.name;
					this.attributes.catid = cat.id[0];

					// GET SERVICE
					this.getService();
					
					
				}
				else{
					app.summary.resources.spinner('remove');
					this.attributes.catIndex = -1;
				}
				
				
					
				//}
				
			},
			// GET A SERVICE
			getService : function(){
				this.activeRequest = 'services';
				this.requestTypes.services.parameters.zip = this.attributes.zip;
				this.requestTypes.services.parameters.catid = this.attributes.catid;
				this.set();
				
			}
			
			
		
		
			
	};
	return resapi;
}