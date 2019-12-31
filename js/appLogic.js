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
				app.storage.data.audience = 1;
				
			}
			if(value == 2){
				window.app.global.audience = 'other';
				window.app.attributes.pathway = 'other';
				app.storage.data.audience = 2;
			}
			
			app.audience.new();
			
			
			
		break;
		
			
		case 'ROLE':
			if(window.app.global.audience == 'self'){
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
			}
			if(window.app.global.audience == 'other'){
				if(value == 1){
					console.log('ROLE == 1');
					window.app.global.role = 'staff';
					showHideElements('hide','staff_other');
				}
				if(value == 2){
					console.log('ROLE == 2');
					window.app.global.role = 'faculty';
					showHideElements('hide','faculty_other');
				}
				if(value == 3){
					console.log('ROLE == 3');
					window.app.global.role = 'student';
					showHideElements('hide','student_hide');
				}
				//getReportingRole();
			}
			window.app.data.role = window.app.global.role;
		break;
		case 'EMPLOYEE_MANAGER':
			if(value == 1 ){
				showHideElements('hide','manager');
			}
			// NO MANAGER
			if(value == 2 ){
				showHideElements('show','manager');
			}
			//getReportingRole();
		break;
		case 'EMPLOYEE_RESIDENT':
			
			// YES RESIDENT
			if(value == 1 ){
				showHideElements('hide','resident-yes');
			}
			// NO RESIDENT
			if(value == 2 ){
				showHideElements('hide','resident-no');
			}
			//getReportingRole();
		break;
		case 'EMPLOYEE_SUPERVISE':
		case 'EMPLOYEE_POSTDOC':
		case 'FACULTY_VISITING':
			//getReportingRole();
			
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


function pageLogic(){
	
	console.log('pageLogic');
	switch(app.global.pageName){
		
			
		case 'intro':
		case 'outro':
			app.storage.data[app.global.pageName] = 1;
			app.storage.update();
			app.save();
		break;
		

		case 'ROLE':	
		case 'ROLE_THEM':
			$('body').find('.button-container .button-nav-back').remove();
			
		break;
			
		case 'OPTIONS':
		case 'INCIDENT_CAP':
			addSummaryMessage();
			
		break;	
			
		case 'MANDATORY_RESPONSIBILITY_SUMMARY_1':
			getReportingRole();
			//$('body').find('.meta-reporting').html(getReportingDescription());
			$('body').find('.meta-reporting-levels').html(getReportingTable(1));
			addSummaryMessage();
			app.save();
		break;
		case 'MANDATORY_RESPONSIBILITY_SUMMARY_2':
			//getReportingRole();
			//$('body').find('.meta-reporting').html(getReportingDescription());
			$('body').find('.meta-reporting-table').html(getReportingTable(2));
			addSummaryMessage();
			app.save();
		break;
		
		case 'REPORTING_1':
			//$('body').find('.meta-reporting').html(getReportingDescription());
			$('body').find('.button-container').remove();
			$('body').find('.meta-reporting-levels').html(getReportingTable(1));
			$('body').find('.meta-reporting-table').html(getReportingTable(2));
			$('body').find('.meta-reporting-table').find('.summary-report-title').remove();
			$('body').find('.page__background').removeClass('quartiary-background').addClass('primary-background');
	
			
			app.save();
			
		break;
		
		case 'audience':
		
			//$('body').find('.meta-reporting').html(getReportingDescription());
			$('body').find('.page-content').removeClass('primary-background');
			$('body').find('.page__background').addClass('quartiary-background');
			
			app.save();
		case 'SHARE_INTRO':
		case 'resources_ohsu':
		
			//$('body').find('.meta-reporting').html(getReportingDescription());
			$('body').find('.page-content').removeClass('primary-background');
			$('body').find('.page__background').addClass('quartiary-background');
			$('body').find('.button-container').remove();
			
			
		break;
	
		
		case 'FEEDBACK_1':
		
	
			$('body').find('.button-container .button-nav-back').remove();
			
			
		break;	
	}
	
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
					case 'staff_other':
							 removeItems = ['FACULTY_VISITING'];

					break;
					case 'faculty':
							removeItems = ['STAFF_MED_FELLOW','STAFF_POSTDOC_FELLOW','STUDENT_PSU','MED_CARE','MED_CARE_OFF'];	


							// REMOVE MSG_SERVICES_JBT FROM THE MSG_SERVICE MSG IF FACULTY
							removeOtherElements('messages','child','MSG_SERVICES','MSG_SERVICES_HEALTH',activeState);

					break; 
					 case 'faculty_other':
							removeItems = ['EMPLOYEE_MANAGER','EMPLOYEE_RESIDENT','EMPLOYEE_SUPERVISE','EMPLOYEE_POSTDOC','EMPLOYEE_CSA'];	

					break; 
					case 'student':

							removeItems = ['STAFF_MED_FELLOW', 'STAFF_POSTDOC_FELLOW','FAC_SOM','COUNSELING'];

							// REMOVE MSG_REPORTING_HR FROM THE MSG_REPORTING MSG IF STUDENT
							removeOtherElements('messages','child','MSG_REPORTING','MSG_REPORTING_HR',activeState);
							// REMOVE MSG_SERVICES_WELL FROM THE MSG_SERVICE MSG IF STUDENT
							removeOtherElements('messages','child','MSG_SERVICES','MSG_SERVICES_RESIDENT',activeState);
					   
					   		removeOtherElements('assessment','child','OPTIONS',4,activeState);
					break;
					case 'student_other':
					   	removeItems = ['FACULTY_VISITING','EMPLOYEE_MANAGER','EMPLOYEE_RESIDENT','EMPLOYEE_SUPERVISE','EMPLOYEE_POSTDOC','EMPLOYEE_CSA'];

					break;
					case 'manager':

							removeItems = ['EMPLOYEE_RESIDENT','EMPLOYEE_SUPERVISE','EMPLOYEE_POSTDOC'];

					break;
					case 'resident-yes':

							removeItems = ['EMPLOYEE_POSTDOC'];

					break;
					case 'resident-no':

							removeItems = ['EMPLOYEE_SUPERVISE'];

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
			 if(indexP != -1){
				  window.app.content.data.modules[module].elements[indexP].active = activeState;
			 }
			
		}


	   // REMOVE CHILD ITEM
	   if(level == 'child'){
			var indexP = window.app.content.data.modules[module].elements.findIndex(x => x.name === type);
		    if(indexP != -1){
				var indexC = window.app.content.data.modules[module].elements[indexP].choices.findIndex(x => x.value === subtype);
				 if(indexC != -1){
					window.app.content.data.modules[module].elements[indexP].choices[indexC].active = activeState; 
				 }
			}

	   }
	   
	    
	
	   
}



function getReportingRole(){
	
	var q = window.app.data.QUESTIONS;
	var role = '';
	switch(window.app.global.role){
			
		case 'staff':

			if(q.EMPLOYEE_MANAGER == 1){
				role = 'employee_super';
			}

			if(q.EMPLOYEE_RESIDENT == 1 && q.EMPLOYEE_SUPERVISE == 1){
				role = 'resident_super';
			}
		
			if(q.EMPLOYEE_RESIDENT == 1 && q.EMPLOYEE_SUPERVISE == 2){
				role = 'resident';
			}
	
			if(q.EMPLOYEE_POSTDOC == 1){
				role = 'post_doc';
			}
			if(role == ''){
				role = 'employee';
			}
			
			
		
			
		break;
		case 'faculty':
			if(q.FACULTY_VISITING == 1){
				role = 'faculty';
			}
			else{
				role = 'faculty_super';
			}
			
		break;
		case 'student':
			role = 'student';
		break;
		
	}
	
	window.app.data.REPORTING = app.reporting.data.reporting.responsibility[role];
	
	
	// CHECK FOR CSA EMPLOYEE - APPLIES TO ANY STAFF ROLE
	if(q.EMPLOYEE_CSA == 1){
		// copy the csa requirments to the levels
		window.app.data.REPORTING.levels.csa = app.reporting.data.reporting.csa;
	}
	
	
	
	
}

function addSummaryMessage(){
	
	$('body').find('.question-container').append('<div class=\"callout font-2\"><i class=\"fas fa-sticky-note\"></i>This information will also be in your summary</div>');
	
}
function getReportingDescription(){
	console.log('getReportingDescription');
	
	var r = window.app.data.REPORTING;
	r.display = {};
	
	for(var l=0;l<app.reporting.data.reporting.levelsOrder.length;l++){
		var level = app.reporting.data.reporting.levelsOrder[l];
		// IF RESPONSIBLE LEVEL IS NOT EMPTY, THEN GET NAME OF LEVEL
		if(r.levels[level].length >0){
			r.display[level] = app.reporting.data.reporting.levels[level];
		}
	}
	
	
	
	console.log(r);
	var template = app.templates.temps.otherRole.renderedTemplate(r);
	//var template = Handlebars.compile($("#tmpl_role").html());
	return template;
	
}

function getReportingTable(page){
	console.log('getReportingTable');
	var r = window.app.data.REPORTING;
	
	r.levelDisplay = [];
	r.table = {};
	// CREATE A LEVEL OBJ FROM THE REFERNCE TO USE AS THE HEADER
	for(var l=0;l<app.reporting.data.reporting.levelsOrder.length;l++){
		var level = app.reporting.data.reporting.levelsOrder[l];
		r.levelDisplay[l] = app.reporting.data.reporting.levels[level];
		
		
	}
	
	// CREATE AN INCIDENT OBJ FROM THE REFERENCE
	for(var i=0;i<app.reporting.data.reporting.incidentsOrder.length;i++){
		var incident = app.reporting.data.reporting.incidentsOrder[i];
		r.table[i] = {};
		r.table[i].title = app.reporting.data.reporting.incidents[incident].title;
		r.table[i].message = app.reporting.data.reporting.incidents[incident].message;
		// LOOP OVER THE LEVELS
		for(var l=0;l<app.reporting.data.reporting.levelsOrder.length;l++){
			var level = app.reporting.data.reporting.levelsOrder[l];
			// SET DEFAULT 0, IE MR = 0 OR CSA = 0
			r.table[i][level] = 0;
			
			// UPDATE BASED ON USERS ACTUAL LEVEL
			for(var levInc in r.levels[level]){
				
				if(incident == r.levels[level][levInc]){
					r.levelDisplay[l].responsible = 1;
					r.table[i][level] = 1;
				}
				
			}
		}
	}
	
	
	
	
	
	var template = '';
	switch(page){
		case 1:
			template = app.templates.temps.otherRoleLevels.renderedTemplate(r);
		break;
			
		case 2:
			template = app.templates.temps.otherRoleTable.renderedTemplate(r);
		break;
	}
	
	
	
	
	
		
	
	return template;
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

Handlebars.registerHelper("setVar", function(varName, varValue, options) {
  this[varName] = varValue;
    return '';
});