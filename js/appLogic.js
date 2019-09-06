// REMOVE ELEMENTS FROM THE CONTENT OBJ IF SELF
function fieldLogic(){
	
	var advancePage = 1;
	var field = window.app.questions.data.field;
	var value = window.app.questions.data.val;
	console.log('fieldLogic():field-->' + field + ':value-->' + value);
	switch(field){
			
			
		case 'AUDIENCE':
			advancePage = 0;
			if(value == 1){
				window.app.global.audience = 'self';
				window.app.attributes.pathway = 'self';
				
			}
			if(value == 2){
				window.app.global.audience = 'other';
				window.app.attributes.pathway = 'other';
			}
			
			// RELOAD CONTENT IF NEEDED
			window.app.content.get('remote',app.routing.audience);
			
			
			
			
		break;
		case 'SAFE':
			showHideElements('show','crisis');
			if(value == 1){
				showHideElements('hide','crisis');
			}
			
			
		break;
			
		case 'ROLE':
			if(value == 1){
				console.log('ROLE == 1');
				window.app.global.role = 'staff';	
				showHideElements('show','faculty');
				showHideElements('show','student');
				showHideElements('hide','staff');
				
			}
			if(value == 2){
				console.log('ROLE == 2');
				window.app.global.role = 'faculty';
				showHideElements('show','staff');
				showHideElements('show','student');
				showHideElements('hide','faculty');
				
			}
			if(value == 3){
				console.log('ROLE == 3');
				window.app.global.role = 'student';
				showHideElements('show','faculty');
				showHideElements('show','staff');
				showHideElements('hide','student');
				
			}
			
		
		break;
		case 'CAMPUS':
			
			if(value > 1 && window.app.global.role == 'student' ){
				showHideElements('hide','non-portland student');
			}
			
		break;
		
		case 'OPTIONS_0':
		case 'OPTIONS_1':
		case 'OPTIONS_2':
		case 'OPTIONS_3':
			
			advancePage = 0;
			
			
		break;	
		case 'INCIDENT_LIST_1':
		case 'INCIDENT_LIST_2':
		case 'INCIDENT_LIST_3':
		case 'INCIDENT_LIST_4':
		case 'INCIDENT_LIST_5':
		case 'INCIDENT_LIST_6':
			
			advancePage = 0;
			
			
		break;
			
			
		case 'MED_CARE':
			showHideElements('show','med_comm');
			if(value == 2 ){
				showHideElements('hide','med_comm');
			}
			
			
			
		
		break;
		
		case 'COMMUNITY_RESOURCES_1':
			advancePage = 1;
			//showHideElements('hide','zip');
		break;
		
		
		case 'COMMUNITY_RESOURCES_2':
		case 'COMMUNITY_RESOURCES_3':
		case 'COMMUNITY_RESOURCES_4':
		case 'COMMUNITY_RESOURCES_5':
		case 'COMMUNITY_RESOURCES_6':
			
			advancePage = 0;
			//showHideElements('show','zip');
			
		break;	
		case 'SHARE_ITEMS_1':
		case 'SHARE_ITEMS_2':
		case 'SHARE_ITEMS_3':
			advancePage = 0;
			
			
		break;	
		
	}
	
	return advancePage;
	
	
}



function showHideElements(visibility,type){
	
	  console.log('showHideElements():visibility-->' + visibility + ':type-->' + type);
	// SHOW/HIDE ACTIVE STATE ON ELEMENT
	var activeState = 1;
	if(visibility == 'show'){
		activeState = 1;
	}
	else{
		activeState = 0;
	}
	
	
	// QUERY MODEL FOR THE name ATTRIBUTE
   var d = jsonQ(window.app.content.data.modules.assessment.elements);
	var i = 0;
	
	// SEARCH ON NAME
   var name = d.find('name',function(){ 
	   console.log('JSONQ START A -----------------------');
		   var removeItems = [];  
			   var matchOn = this.toString();

			   console.log(matchOn);
			   switch(type){

					case 'other':
							 removeItems = ['SAFE', 'CRISIS'];


					break;
					case 'crisis':
							 removeItems = ['CRISIS'];


					break;  
					case 'staff':
							 removeItems = ['FAC_SOM', 'STUDENT_PSU','MED_CARE','MED_CARE_OFF'];


							// REMOVE MSG_SERVICES_JBT FROM THE MSG_SERVICE MSG IF FACULTY
							removeOtherElements('messages','child','MSG_SERVICES','MSG_SERVICES_HEALTH',activeState);

					break;  
					case 'faculty':
							removeItems = ['STAFF_MED_FELLOW','STAFF_POSTDOC_FELLOW','STUDENT_PSU','MED_CARE','MED_CARE_OFF'];	


							// REMOVE MSG_SERVICES_JBT FROM THE MSG_SERVICE MSG IF FACULTY
							removeOtherElements('messages','child','MSG_SERVICES','MSG_SERVICES_HEALTH',activeState);

					break; 
					case 'student':

							removeItems = ['STAFF_MED_FELLOW', 'STAFF_POSTDOC_FELLOW','FAC_SOM','COUNSELING'];

							// REMOVE MSG_REPORTING_HR FROM THE MSG_REPORTING MSG IF STUDENT
							removeOtherElements('messages','child','MSG_REPORTING','MSG_REPORTING_HR',activeState);
							// REMOVE MSG_SERVICES_WELL FROM THE MSG_SERVICE MSG IF STUDENT
							removeOtherElements('messages','child','MSG_SERVICES','MSG_SERVICES_RESIDENT',activeState);
					   
					   		removeOtherElements('assessment','child','OPTIONS',4,activeState);
					break;
					case 'non-portland student':

							removeItems = ['STUDENT_PSU'];

					break;
					case 'med_comm':

							removeItems = ['MED_CARE_OFF'];

					break;
					case 'zip':

							removeItems = ['ZIPCODE'];

					break;

			   }
				if(removeItems.indexOf(matchOn) != -1){
					window.app.content.data.modules.assessment.elements[i].active = activeState;
				}

			   i++;
   });
}
function removeOtherElements(module,level,type,subtype,activeState){
	

		// REMOVE PARENT ITEM
		if(level == 'parent'){
			 var indexP = window.app.content.data.modules[module].elements.findIndex(x => x.name === type);
			 window.app.content.data.modules[module].elements[indexP].active = activeState;
		}


	   // REMOVE CHILD ITEM
	   if(level == 'child'){
			var indexP = window.app.content.data.modules[module].elements.findIndex(x => x.name === type);
			var indexC = window.app.content.data.modules[module].elements[indexP].choices.findIndex(x => x.value === subtype);
			window.app.content.data.modules[module].elements[indexP].choices[indexC].active = activeState; 

	   }
	   
	    
	
	   
}






function getDateNow(){
	
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month =d.getMonth() + 1; //Months are zero based
		var curr_year = d.getFullYear();
		var curr_hour = d.getHours();
		var curr_min = d.getMinutes();
		var curr_sec = d.getSeconds();
	
		if(curr_date.toString().length == 1){
				curr_date = "0" + curr_date.toString();
		}
		if(curr_hour.toString().length == 1){
				curr_hour = "0" + curr_hour.toString();
		}
		if(curr_min.toString().length == 1){
				curr_min = "0" + curr_min.toString();
		}
		if(curr_sec.toString().length == 1){
				curr_sec = "0" + curr_sec.toString();
		}
		
		var dNow = (curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_min + ":" + curr_sec);

		return dNow;
	}



 Handlebars.registerHelper('ifCond', function(v1, v2, options) {
		  if(v1 === v2) {
			return options.fn(this);
		  }
		  return options.inverse(this);
		});
