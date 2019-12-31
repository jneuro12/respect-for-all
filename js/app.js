

function appInit(){
	
	
	var app = {
		
			// PROPERTIES
			//------------------------------------
			attributes: {
					appName : 'respect_for_all',
					country : 'us',
					pathway : 'self',
					version : '0.4',
					saveLocal : 'no',
					language : 'en',
					source : window.directory,
					stores : {
							general : 'rfa_pin'
							
					}
												
			},
			//----------------------------------
			// USER DATA OBJECT
			//----------------------------------
			data : {
					feedback : {
							name : '',
							comments : []
					},
					QUESTIONS : {},
					PROGRESS : {
							sections :{},
							modules : {},
							log : []
					},
					REPORTING : {
						
					},
					id : 0
			},
			
			//----------------------------------
			// INITIALIZATION
			//----------------------------------
			init : function(){
				//$('#mp-tab-1').attr('label','Hello');
				
				
				//this.carousel.start();
				console.log('init');
				// CHECK FOR LS
				app.storage.get(app.storage.stores.general,app.storage.read);
				
				
			},
			// ----------------------------------
			// SAVING
			//----------------------------------
			save : function(type){
				var data = JSON.stringify(this.data);
				$.post('com/save.php',{data : data},function(data){
					app.data.id = data;
					
					// IF NEWLY GENERATED ID, THEN SAVE TO LS
					if(app.storage.data.id == 0){
						app.storage.data.id = data;
						app.storage.update();
						app.save();
					}
					
				});
			},
			get : function(id){
				
				$.post('com/get.php',{id : id},function(data){
					// RETURNED DATA
					app.data = data;
					if(app.storage.data.audience == 1){
						app.global.audience = 'self';
						app.attributes.pathway = 'self';
					}
					if(app.storage.data.audience == 2){
						app.global.audience = 'other';
						app.attributes.pathway = 'other';
						app.global.role = app.data.role;
					}
				
					// RETRIEVE THE AUDIENCE FILE OF KNOWN AUDIENCE TYPE
					app.content.get('remote',app.routing.init);
				});
			},
			//---------------------------------
			// FUNCTIONS - DATA STORAGE
			//---------------------------------
			storage : {
				stores : {
					general : 'rfa'
				},
				data : {
					onboarding : 0,
					id : 0,
					pin : 0,
					intro : 0,
					outro : 0,
					return : 0,
					audience : 0,
					summary : 0,
					zip : 0,
					resources : []
				},
				update : function(){
						
					localforage.setItem(app.storage.stores.general, app.storage.data).then(function() {
						 return true;
					}).catch(function(err) {
						console.log('localforage error');
						console.log(err);
					});	



				},
				remove: function(store,callback){
					localforage.removeItem(app.storage.stores.general,callback);	
				},
				get : function(store,callback){

					localforage.getItem(store, callback);


				},
				read : function(err,val){
					console.log(val);	
					// RETURNING USER
					if(val != null){
							app.storage.data = val;
							app.get(app.storage.data.id);
							
					}
					// NEW USER
					else{
						// RETRIEVE DEFAULT PATHWAY AS IT CONTAINS ONBOARDING
						app.content.get('remote',app.routing.init);
						// CREATE A RECORD
						app.save();

					}
				},	
				reset : function(){
					for(var item in this.data){
						this.data[item] = 0;
					}
				}
				
			},
			
	
			// ---------------------------------------------------------
			// GLOBAL ATTRIBTUES, EVENTS, FUNCTIONS
			//-----------------------------------------------------------
			global : {
				    parentModule : 'assessment',
					module : 'assessment',
					moduleType : 'questions',
					section : '',
					audience : 'self',
				    role : 'student',
					moduleIndex : 0,
					pageIndex : 0,
					pageName : '',
					

					
					init : function(){
						
						//ONSEN UI LISTER TO ADD IN TEMPLATED PAGE
						document.addEventListener('init', function (event) {
							  console.log(event.target);
							
							 
								event.target.querySelector('div.page__content').innerHTML =  event.target.data.page;

						});
						document.addEventListener('show', function (event) {
							  console.log(event.target);
							 console.log( $(event.target).attr('id'));
							var cp = $(event.target).attr('id');
							var pp = $(event.target).prev('ons-page.page').attr('id');
							
							console.log('cp:' + cp + ' ' + 'pp:' + pp);
							
							if( cp == 'questions' && pp != 'questions'){
								$(event.target).find('.button-container .button-nav-back').remove();
							}
							
							 
								

						});
						$(document).on('pointerdown','ons-back-button', function(){
							 app.summary.reload();
						});
						
						// EMERGENCY EXIT
						$(document).on('pointerdown','.e-exit', function(){
							window.location.href = 'https://www.google.com';
						});
						
						
						
						// LOAD IN TEMPLATES AND TAB BAR
						// onboarding template is handled separately
						app.templates.load('onboarding');
						app.templates.load('audience');
						app.templates.load('intro');
						app.templates.load('questions');
						app.templates.load('message1');
						app.templates.load('message2');
						app.templates.load('resources_list');
						app.templates.load('resources_item');
						app.templates.load('resource1');
						app.templates.load('resource2');
						app.templates.load('summary');
						app.templates.load('reporting');
						app.templates.load('reportingCall');
						app.templates.load('otherRoleLevels');
						app.templates.load('otherRoleTable');
						// INITIALIZE OTHERS
						app.pin.init();
						app.questions.init();
						app.summary.init();
						
						app.content.get('reporting');

					}
				
			},
			//----------------------------------
			// MENU OPTION (SLIDE IN MENU)
			//----------------------------------
			menu : {
			
				show : function(){
					 var menu = document.getElementById('menu');
  					 menu.open();
				},
				load : function(page){
					  menu.close();
					  app.routing.refresh(page);
					 

				},
				close: function(){
					
					 var menu = document.getElementById('menu');
  					 menu.close();
				
				}
			
				
			},
			//----------------------------------
			// LOAD IN THE JSON MODEL
			//----------------------------------
			content : {
					data : {},
					get : function(type, callback){
								
					
							switch(type){
									
								

								// PULL FROM LOCAL  - NOT MAINTAINED RIGHT NOW
								case 'local':
									$.getJSON('json/source.json').done(function(json){
										app.content.data = json;
										app.routing.init();
									}).fail(function(jqxhr,textStatus,error){
										console.log(error);	
									});
								break;
								// PULL FROM REMOTE SOURCE
								case 'remote':
									$.post(app.attributes.source.cms + 'com/pathway_get.php',app.attributes,function(json){
										app.content.data = json.pathway;
										app.content.removeInactive();
										callback(); //app.routing.init();

									});
								break;
								// REPORTING DEFINITIONS
								case 'reporting':
									$.getJSON('json/reporting.json').done(function(json){
										app.reporting.data = json;
										
									}).fail(function(jqxhr,textStatus,error){
										console.log(error);	
									});
								break;
										
							}


					},
					
					removeInactive : function(){
						for(var mod in app.content.data.modules){ var removalArr = [];
							for(var i=0;i< app.content.data.modules[mod].elements.length;i++){
								if(app.content.data.modules[mod].elements[i].active == 0){
									removalArr.push(i);
								}
							}
							console.log(removalArr);
							for (var ii = removalArr.length -1; ii >= 0; ii--){
								app.content.data.modules[mod].elements.splice(removalArr[ii],1);
							}
						}
					}
				
					
			},
			//----------------------------------
			// ROUTE TO CORRECT PAGE
			//----------------------------------
			routing : {
				
				// DETECT THE 3 USER PROGRESS TYPES
				init : function(){
					console.log('routing.init');
					if(app.storage.data.id < 424){
						app.routing.reset();
					}
					else{
						app.global.init();
					}
				
					
				},
				start : function(){
				
					console.log('routing.start');
					// NEW USER - SHOW ONBOARDING
					if(app.storage.data.onboarding == 0){
				
						app.onboarding.show();
						
					}
					// RETURNING USER, BUT NO AUDIENCE YET,  BYPASS ONBOARDING
					else if(app.storage.data.audience == 0){
						app.audience.show();
					}
				
					else{
						// SELF
						if(app.storage.data.audience == 1){
							// SHOW PIN
							app.routing.returnUser();
							 //app.routing.push('pinenter.html','right');
						}
						
						else{
							// RETURN TO PROGRESS
							app.routing.returnUser();	
						}
					} 
					
				},
				reload : function(){
						app.nav.check('forward');
					
				},
				
				getModule : function(increment){
					console.log('getModule');
					if(increment != undefined){
						app.global.moduleIndex++;
						app.global.pageIndex = 0;
					}
					app.global.module = window.app.content.data.appOrder[app.global.moduleIndex];
					app.global.parentModule = app.global.module;
					app.global.moduleType = window.app.content.data.modules[app.global.module].type;
					app.data.PROGRESS.lastPage = '';
					app.data.PROGRESS.lastModule = app.global.module;
					
					if(app.global.module == 'summary'){
							app.summary.show();
					}
					else{
						if(app.global.module == 'assessment'){
							app[app.global.moduleType].createPage();
							app.nav.addPage();

						}
						else{
							app.page.add();
						}
					}
					
					
					
				},
				

		
				pop : function(){
					myNavigator.popPage();
				},
				push : function(page,animation){
					myNavigator.pushPage(page,{
								animation : animation,
								callback :app.progress.log// CALLBACK TO UPDATE PROGRESS
							   }
							 );
				},
				// DIRECTS A RETURN USER TO
				returnUser : function(){
					// IF SUMMARY DONE, SHOW SUMMARY
					if(app.storage.data.summary == 1 || app.data.PROGRESS.lastModule == 'outro'){
						app.global.module = 'summary';
						app.global.moduleType = 'summary';
						app.summary.show();
						
					}
					else{
						console.log('returnUser:' + app.data.PROGRESS.lastModule);
						if(app.data.PROGRESS.lastModule == 'intro'){
							app.data.PROGRESS.lastModule = 'assessment';
						}
						app.nav.returnToLast();
					}
					
				}, 
				reset : function(){
					myNavigator.popPage();
					app.storage.remove(app.storage.stores.general,app.routing.startOver);
					
					
				},
				startOver : function(){
					//app.storage.reset();
					window.location.href = 'index.html';
					//app.storage.read();
					//app.routing.start();
				}
				
				
				
			},
		
			// -----------------------------------------------
			// PIN PAGE
			// -----------------------------------
			pin : {
				pinField : $('#pin-field'),
				pinValue : '',
				init : function(){
					$(document).on('pointerdown','.pin-field',function(){
						app.pin.setValue($(this).text());
							
					});	
					$(document).on('pointerdown','.pin-field-enter',function(){
						app.pin.checkValue($(this).text());
							
					});	
					$(document).on('pointerdown','.pin-clear',function(){
						app.pin.pinValue = '';
						$('#pin-field').val('');
							
					});
				},
				show : function(){
					myNavigator.pushPage('pin.html');
					$('#pin-button-next').hide();
				},
				
				setValue : function(valueIn){
					console.log('PIN:' + valueIn);
					var pinField = this.pinField;
					if ( this.pinValue.length <= 3 ) {
						  this.pinValue = this.pinValue + valueIn;
						   $('#pin-field').val(this.pinValue);
						
							if(this.pinValue.length == 4){
								app.storage.data.pin = this.pinValue;
						 		app.storage.update();
								this.transition();

					   		}
					}
						
				},
				checkValue : function(valueIn){
					var pinField = this.pinField;
					if ( this.pinValue.length <= 3 ) {
						  this.pinValue = this.pinValue + valueIn;
						   $('#pin-field').val(this.pinValue);
						
							if(this.pinValue.length == 4){
								// CORRECT PIN 
								if(app.storage.data.pin == this.pinValue){
						 			app.storage.update();
									this.transitionCorrect();
								}
								// WRONG PIN
								else{
									this.transitionWrong();
								}

					   		}
					}
				},
				transition : function(){
					$('#pin-keypad').hide();
					$("#pin-1-card").children().fadeOut(500, function() {
						var pin3 = $('#pin-3-card').children(); 
						$('#pin-1-card').empty().append(pin3).fadeIn(500,function(){
							$(this).addClass('card-white');
							$('#pin-2-card').show();
						});
						$('#pin-what').hide();
						$('#pin-button-next').show();
					});
					
				},
				transitionCorrect : function(){
					$('#pin-keypad').hide();
					$("#pin-enter-1-card").children().fadeOut(500, function() {
						var pin3 = $('#pin-enter-2-card').children(); 
						$('#pin-enter-1-card').empty().append(pin3).fadeIn(500,function(){
							$(this).addClass('card-white');
						});
						$('#pin-what').hide();
						$('#pin-button-next').show();
						app.routing.returnUser();
					});
					
				},
				transitionWrong : function(){
					
					$("#pin-enter-1-card").hide();
					$('#pin-enter-3-card').fadeIn(500,function(){
						$(this).fadeOut(2000,function(){
							$("#pin-enter-1-card").show().addClass('card-white');
						});
						
					});
					
				}
			
				
			},
			//----------------------------------
			// SPECIFIC HANDLING FOR AUIDIENCE SELECTION
			//----------------------------------
			audience : {
				// PAGE
				page : {},
				animation : 'fade',
				container : 'flat.html',
				show: function(){
					
					console.log('onboarding done, show audience');
					
					app.global.moduleType = 'audience';
					app.page.add();

				},
				// GET THE AUDIENCE FILE ONCE WE KNOW WHICH ONE
				new : function(){
					//app.global.moduleIndex++;
					window.app.content.get('remote',app.routing.getModule);
					app.storage.data.return = 1;
					app.storage.update();
				}
			
				// RETURN USER RETRIEVAL HANDLED WITH THE app.get()
				
				
				
			},
			//----------------------------------
			// SPECIFIC HANDLING FOR INTRO TYPE SCREENS
			//----------------------------------
			intro : {
				page : {},
				animation : 'fade',
				container : 'intro.html',
				show: function(){
					
					app.page.add();

				},
				done : function(){
					switch(app.global.module){
						case 'intro':
							app.routing.getModule(1);
							app.storage.update();
							app.save();
						break;
							
						case 'outro':
							app.storage.data.summary = 1;
							app.storage.update();
							app.save();
							app.routing.getModule(1);
						break;
					}
				}
				
				
				
			},
			//----------------------------------
			// QUESTIONS
			//----------------------------------
			questions : {
				page : {},
				data : {
					field : '',
					val : 0
				},
				init : function(){
					

						// HANDLE INPUT EVENTS
						/*$(document).on('click','ons-radio',function(){
							console.log('QUESTION CLICKED---------------');
							var d = new Date();console.log(d.getMilliseconds());
							app.questions.handleInput( $(this) );
							
						});*/
						$(document).on('change','.question-event',function(){
							console.log('QUESTION CLICKED---------------');
							var d = new Date();console.log(d.getMilliseconds());
							app.questions.handleInput( $(this) );
							
						});
						$(document).on('keyup','.textarea',function(){
							app.questions.handleText( $(this) );
						});
					
						// HANDLE THE infoView AND buttonView SUBTYPES WHICH SHOW A MESSAGE
						$(document).on('pointerdown','.info-view, .button-view, .small-info-view',function(){
							app.questions.handleInfoView( $(this) );
						});
					
				},
				
				handleInput : function(input){
					//console.log('QUESTION CLICKED');
					var input = input.find('input').parent();
					console.log('handleInput');
					console.log(input);
					app.questions.data.field = input.attr('name');
					app.questions.data.val = input.val();
					app.questions.data.type = input.attr('data-type');
					app.questions.data.fieldType = input.attr('data-field-type');
					app.questions.data.message = '';
					app.questions.data.message = input.attr('data-message');
					
					// CHECK IF CHECKBOX UNCHECKED
					if(app.questions.data.fieldType == 'checkbox'){
						 if(app.data.QUESTIONS[app.questions.data.field] != undefined){
							app.data.QUESTIONS[app.questions.data.field] = 0;
						 }
						else{
							app.data.QUESTIONS[app.questions.data.field] = 1;
						}
					} 
					// RADIOBUTTON
					else if(app.questions.data.fieldType == 'radio'){
						// SAVE TO DATA OBJ
						app.data.QUESTIONS[app.questions.data.field] = Number(app.questions.data.val);
					}
					// TEXT FIELDS
					else{
						app.data.QUESTIONS[app.questions.data.field] = app.questions.data.val;
					}
					
					

					// RUN LOGIC ON SELECTION
					app.questions.logic();
					
				},
				handleText : function(input){
					app.questions.data.field = input.attr('name');
					app.questions.data.val = input.val();
					app.data.QUESTIONS[app.questions.data.field] = app.questions.data.val;
				},
				
				// QUESTION SUBTYPES WHICH SHOW A MESSAGE
				handleInfoView :function(input){
					app.message.createMessage('message1',input.attr('data-message'));
				},
				// SET THE PAGE ATTRIBUTES
				createPage : function(){
					
					
					// GET THE ENTIRE ELEMENT FROM THE MODULE
					this.page =  app.content.data.modules[app.global.module].elements[app.global.pageIndex];
					
					app.global.pageName = this.page.name;
					// SET ATTRIBUTES FOR THE PAGE
					//--------------------------------
					// SET PAGE TITLE
					this.page.title = app.content.data.modules[app.global.module].text[app.attributes.language];
					
					// SET SECTION HEADER
					for(var i=0;i<app.content.data.modules[app.global.module].sections.length;i++){
						var sec = app.content.data.modules[app.global.module].sections[i];
						if(sec.name == this.page.section){
							this.page.sectionHeader = sec.text[app.attributes.language];
						}
					}
					
					// LABEL FOR CURRENT LANGUAGE
					this.page.label = this.page.text[app.attributes.language];
					// LANGUAGE - TO BE USED FOR THE RESPONSE OPTIONS
					this.page.language = app.attributes.language;
					
					this.page.container =  app.content.data.modules[app.global.module].container;
					
					
					
					// CHECK FOR FIELD TYPES
					if(app.content.data.modules[app.global.module].elements[app.global.pageIndex].type == 'input'){
						this.page.input = 1;
					}
					// CHECK FOR FIELD TYPES
					if(app.content.data.modules[app.global.module].elements[app.global.pageIndex].type == 'textarea'){
						this.page.textarea = 1;
					}
					if(app.content.data.modules[app.global.module].elements[app.global.pageIndex].type == 'label'){
						this.page.labelOnly = 1;
					}
					if(app.content.data.modules[app.global.module].elements[app.global.pageIndex].type == 'section_intro'){
						this.page.sectionTitle =app.content.data.sections[app.content.data.modules[app.global.module].elements[app.global.pageIndex].section].text[app.attributes.language];
						this.page.sectionIntro = 1;
					}
					if(app.content.data.modules[app.global.module].elements[app.global.pageIndex].infoView != undefined){
						this.page.infoView = 1;
					}
					if(app.content.data.modules[app.global.module].elements[app.global.pageIndex].buttonView != undefined){
						this.page.buttonView = 1;
					}
					console.log(this.page);
					app.data.PROGRESS.lastPage = this.page.name;
					app.data.PROGRESS.lastModule = app.global.module;
					
				
				},
				logic : function(){
					var advancePage = 1;
					
					console.log(this.data);
					// CHECK LOGIC MAP FOR ANYTHING TO DO ON THIS ITEM
					advancePage = fieldLogic();
					
					
					// IF A MESSAGE FIELD, THEN SHOW THE MESSAGE, BUT DON'T ADVANCE PAGE
					if(this.data.type == 'message'){
						advancePage = 0;
						app.message.createMessage('message1',this.data.message);
					}
					
					if(advancePage == 1){
						console.log('advancePage == 1');
						app.nav.check('forward');
					}
					
					
				}
			},
			//----------------------------------
			// MESSAGES
			//----------------------------------
			message : {
				page : {},
				type : 'message1',  // message1 or message
				createMessage : function(type,messageIn){
					console.log(messageIn);
					this.type = type;
					// GET THE ENTIRE ELEMENT FROM THE MODULE
					for(var message in  app.content.data.modules.messages.elements){
						
						if( app.content.data.modules.messages.elements[message].name == messageIn){
							var msgIndex = message;

							console.log(msgIndex);
							this.page =  app.content.data.modules.messages.elements[message];
						}
					}
					app.global.pageName = this.page.name;
					
					// SET ATTRIBUTES FOR THE PAGE
					//--------------------------------
					// SET PAGE TITLE
					this.page.title = app.content.data.modules.messages.elements[msgIndex].text[app.attributes.language];
					// LABEL FOR  CURRENT LANGUAGE
					this.page.label = app.content.data.modules.messages.elements[msgIndex].description[app.attributes.language];
					// LANGUAGE - TO BE USED FOR THE RESPONSE OPTIONS
					this.page.language = app.attributes.language;
					
					// CONTROL ANIMATION OF MESSAGE PAGE DEPENDING ON TYPE
					if(type == 'message1'){
						this.page.animation = "lift";
					}
					else{
						this.page.animation = "right";
					}
					// message1 or message2 containers
					this.page.container =  type + '.html'; //app.content.data.modules.messages.container;
					console.log(this.page);	
					this.show();
					
				},
				show : function(){
					
					myNavigator.pushPage(this.page.container,{
										  data : {page : app.templates.temps[app.message.type].renderedTemplate(app.message.page),
												 title : 'Message'},
										   animation : this.page.animation,
											callback : app.message.postLogic // CALLBACK TO UPDATE PROGRESS
										   }
										 );
				},
				postLogic : function(){
					
					app.reporting.checkIncident();
					app.progress.log();
				}
				
				
			},
			// ------------------------------------------------------
			// SUMMARY
			//------------------------------------------------------
			summary : {
				type : '',
				page : {},
				animation : 'fade',
				container : 'summary.html',
				show: function(){
					
					app.page.add();

				},
				init : function(){
					

						// HANDLE INPUT EVENTS
						$(document).on('pointerdown','.summary-item',function(){
							console.log('summary item');
							app.summary.handleInput( $(this) );
						});
						// TRIGGER THE API TO GET RESOURCES ONCE WE HAVE A ZIP CODE
						$(document).on('touch','#button-zipcode',function(){
							app.storage.data.zip =  $('#zipcode_input').val();
							
							if( app.storage.data.zip.length == 5 ){
								app.storage.update();
								app.summary.resources.spinner('add');
								app.summary.resourcesAPI();
							}
							else{
								$('#button-zipcode').text('Not a valid zip');
								setTimeout(function(){
									$('#button-zipcode').text('Go');
								},1500);
							}
								
							
							
						});
						// LOAD RESOURCE CATEGORIES IN BACKGROUND
						app.summary.resources.getCategories();
					
				},
				// DO SOMETHING ON THE SUMMARY PAGE
				handleInput : function(input){
					app.summary.type = input.attr('data-value');
					switch(app.summary.type){
						case 'about':
							app.message.createMessage('message1','MSG_SUMMARY_ABOUT');
						break;
						case 'incident':
							app.message.createMessage('message1','MSG_SUMMARY_INCIDENT');
						break;
						
						case 'resources_comm':
							app.resourcePage.createPage('resource1');	
						break;
						
						case 'resources_ohsu':
						case 'reporting':
						case 'feedback':
						case 'share':
							
							
							app.nav.continue = 1;
							console.log(app.summary.type);
							app.global.parentModule = 'summary';
							app.global.module = app.summary.type;
							app.global.moduleType = 'questions';
							app.global.pageIndex = 0;
							app.nav.addPage();
							//app.nav.check('forward');
						break;
						
							
					}
					
				},	
				reload :function(){
					
					myNavigator.bringPageTop('summary.html',{animation:'fade'});
					$('#summary').find('.page__background').removeClass('quartiary-background');
					$('#summary-item').remove();
				},
				resourcesAPI : function(){
					console.log('resourcesAPI');
					
						
						var zipcode = $('#zipcode_input input').val();
						if(zipcode != ""){
							window.resapi.attributes.zip = zipcode;
							if(app.summary.resources.running == 0){
								app.summary.resources.running = 1;
								for(var category in  resapi.attributes.categories.elements){
									resapi.attributes.categories.elements[category].retrieved = 0;
								}
								window.resapi.getServices();
							}

						}
					
					
					
					
				},
				
				resources : {
					target : 'community_resources_list',
					nearby : [],
					other : [],
					running : 0,
					category : '',
					get : function(){
						app.summary.resources.nearby = [];
						app.summary.resources.other = [];
						app.summary.resources.filter(app.resourcePage.catIndex);
						app.summary.resources.createList(app.resourcePage.catIndex, app.resourcePage.page.title);
				
						
						/*
						for(var i=0;i<this.data.length;i++){
							this.show(this.data[i].Name);
							console.log(this.data[i].Name);
						}*/
						
					},
					filter : function(catIndex){
						console.log(catIndex);
						var d = app.storage.data.resources.elements[catIndex].data;
						console.log(d);
						for(var i=0;i<d.length;i++){
							var dist = d[i].Sites[0].Distance;
							if(dist != ""){
								if(Number(dist) <=10){
									this.nearby.push(d[i]);
								}
								else{
									this.other.push(d[i]);
								}
							}
							else{
								d[i].Sites[0].Distance = '?';
								this.other.push(d[i]);
							}
						}
							
						
					},
					// GET A LIST OF CATEGORY IDS TO USE
					getCategories : function(){
						
							$.getJSON('json/resource_api_category_ids.json').done(function(json){
							resapi.attributes.categories = json;
							resapi.attributes.categories.language = app.attributes.language;
							console.log(json.elements.length);	
							// UPDATE LS IF NO CATEGORIES ALREADY SAVED
							if(app.storage.data.resources.length == 0){
								app.storage.data.resources = json;
								app.storage.update();
							}
							// CHECK IF CATEGORY ALREADY EXISTS OR NOT AND IF NOT, ADD IT
							else{
								for(var i=0; i<json.elements.length;i++){
									console.log(json.elements[i]);
									if(app.storage.data.resources.elements[i] == undefined){
										app.storage.data.resources.elements[i] = json.elements[i];
									}
								}
								app.storage.update();
							}

						}).fail(function(jqxhr,textStatus,error){
							console.log(error);	
						});
						
						
					},
					
					createList : function(catIndex, title){
						  console.log('resources.createList: ' + catIndex);
							// BUILD FIRST 3
							var type = 'nearby';
							var resourceList = {};
							resourceList.firstSet = '';
							resourceList.nearby = this[type].length;
							for(var i=0;i<3;i++){
								var resObj = this.resourceDetail(type,i);
								resourceList.firstSet = resourceList.firstSet + app.templates.temps.resources_item.renderedTemplate(resObj);
							}
							// BUILD MORE LIST
							if(this[type].length > 3){
								resourceList.isMoreSet = 1;
								resourceList.moreSet = '';
								
								for(i=3;i<this[type].length;i++){
									resObj = this.resourceDetail(type,i);
									resourceList.moreSet = resourceList.moreSet + app.templates.temps.resources_item.renderedTemplate(resObj);
								}
							}
						
						
							type = 'other';
							
							if(this[type].length > 0){
								resourceList.isOtherFirstSet = 1;
								resourceList.otherFirstSet = '';
								resourceList.other = this[type].length;
								
								
								for(var i=0;i<3;i++){
									var resObj = this.resourceDetail(type,i);
									resourceList.otherFirstSet = resourceList.otherFirstSet + app.templates.temps.resources_item.renderedTemplate(resObj);
								}
								// BUILD MORE LIST
								if(this[type].length > 3){
									resourceList.isOtherSet = 1;
									resourceList.otherSet = '';

									for(i=3;i<this[type].length;i++){
										resObj = this.resourceDetail(type,i);
										resourceList.otherSet= resourceList.otherSet + app.templates.temps.resources_item.renderedTemplate(resObj);
									}
								}

								
								
							}
							
							resourceList.title = title;
							// APPEND TO ELEMENT ALREADY ON VISIBLE PAGE
							$('#' + this.target + '').append(app.templates.temps.resources_list.renderedTemplate(resourceList));
							app.summary.resources.fixEnd();
						
								
						
						
					},
					// GENERATE A HTML SNIPPET OF THE RESOURCE
					resourceDetail : function(type,i){
						var resObj = {};
						resObj.name = this[type][i].Name;
						resObj.distance = this[type][i].Sites[0].Distance;
						//console.log(this[type][i].Sites[0]);
						if(this[type][i].Sites[0].Phones != undefined){
							if(this[type][i].Sites[0].Phones[0] != undefined){
								resObj.phone1 = this[type][i].Sites[0].Phones[0].Phone;
							}
							
							if(this[type][i].Sites[0].Phones[1] != undefined){
								resObj.phone2 = this[type][i].Sites[0].Phones[1].Phone;
							}
						}
						if(this[type][i].Sites[0].URL != undefined){
							resObj.url = this[type][i].Sites[0].URL;
						}
						
						resObj.counter = i+1;
					
						return resObj;
					},
					// APPEND WHOLE LIST TO TARGET CONTAINER
					fixEnd: function(){
						
						// FIX ONSEN UI WANTING TO MOVE LAST ITEM TO THE TOP OF THE EXPANDABLE LIST
						var el = $('#res-nearby div.top').find('div.list-item__center').detach();
						$('#res-nearby').find('.list .list-item:last-child').empty().append(el);
						
		
						var el = $('#res-other div.top').find('div.list-item__center').detach();
						$('#res-other').find('.list .list-item:last-child').empty().append(el);
						
					
					
					},
					updateCounter : function(){
						
						for(var category in  app.storage.data.resources.elements){
							var n = 'count_' + app.storage.data.resources.elements[category].name;
							if(app.storage.data.resources.elements[category].data != undefined){
								$('#' + n + '').text(app.storage.data.resources.elements[category].data.length);
								console.log(app.storage.data.resources.elements[category].data.length);
							}
							
						}

						
					},
					update : function(){
						


						this.running = 0;
						this.spinner('remove');	
					},
					spinner : function(type){
						switch(type){
							case 'add':
								$('#button-zipcode').html('<ons-icon size="30px" spin icon="md-spinner"></ons-icon>');
							break;
							case 'remove':
								$('#button-zipcode').html('Go');
								//$('#summary-resources-community').show();
							break;
						}
					}
					
				},
				
				
				
			},
			
			//----------------------------------
			// RESOURCES PAGE - A LIST OF SPECIFIC CATEGORY RESOURCES
			//----------------------------------
			resourcePage : {
				page : {},
				catIndex : 0,
				type : 'resource1',  
				createPage : function(type,categoryIn){
					
					switch(type){
						
						// CATEGORY PAGE
						case 'resource1':
							this.type = type;
							
							console.log('resourcePage.createPage - resource1');
							
							// GET NUMBER OF RESOURCES FOR EACH CATEGORY IF ALREADY RETRIEVED
							if(app.storage.data.resources.elements != undefined){
								for(var category in  app.storage.data.resources.elements){
									if( app.storage.data.resources.elements[category].data == undefined){
										app.storage.data.resources.elements[category].number = 0;
									}
									else{
										app.storage.data.resources.elements[category].number = app.storage.data.resources.elements[category].data.length;
									}
									
								
								
								}
							}

							// NEED TO CLONE THE RESOURCES DATA BEFORE PASSING IT TO THE PAGE
							var d = JSON.stringify(app.storage.data.resources);
							this.page =  JSON.parse(d);
							
							this.page.title = "Community Resources"
							// LANGUAGE - TO BE USED FOR THE RESPONSE OPTIONS
							this.page.language = app.attributes.language;
							this.page.animation = 'right';
							this.page.callback = app.resourcePage.onShow;
							this.page.container = 'summary-item.html';
						break;
							
						// RESOURCES LIST PAGE
						case 'resource2':
							console.log(categoryIn);
							this.type = type;
							
							// GET THE ENTIRE ELEMENT FROM THE MODULE
							for(var category in  app.storage.data.resources.elements){

								if( app.storage.data.resources.elements[category].name == categoryIn){
									this.catIndex = category;
									console.log(this.catIndex);
									var d = JSON.stringify(app.storage.data.resources.elements[category]);
									this.page =   JSON.parse(d);
									//this.page =  app.storage.data.resources.elements[category];
									console.log(this.page);
								}
							}
							
							// SET ATTRIBUTES FOR THE PAGE
							//--------------------------------
							// SET PAGE TITLE
							this.page.title = app.storage.data.resources.elements[this.catIndex].text[app.attributes.language];

							// LANGUAGE - TO BE USED FOR THE RESPONSE OPTIONS
							this.page.language = app.attributes.language;
							this.page.animation = "right";
							// CREATE THE LIST OF RESOURCES FROM THE JSON PAYLOAD
							this.page.callback = app.summary.resources.get;
							this.page.container = 'resource2.html';
						break;
					}
					
					app.global.pageName = this.page.name;
					
					console.log(this.page);	
					console.log(this.type);
					this.show();
					
				},
				// CHECK IF ZIP ALREADY ENTERED AND RESOURCE DATA AVAILABLE
				onShow : function(){
						app.global.pageName = 'resources_comm';
						app.progress.log();
						if(app.storage.data.zip != 0){
							$('#zipcode_input input').val(app.storage.data.zip);
							$('#summary-resources-community').show();
						}
					$('body').find('.button-container').remove();
					
					
				},
				show : function(){
					
					myNavigator.pushPage(this.page.container,{
											data : { page : app.templates.temps[app.resourcePage.type].renderedTemplate(app.resourcePage.page),
												     title : this.page.title},
										    animation : this.page.animation,
											callback : this.page.callback//app.progress.log // CALLBACK TO UPDATE PROGRESS
											
										   }
										 );
				}
			},
			//----------------------------------
			// GENERIC PAGE CREATOR
			//----------------------------------
			page : {
				
				add : function(){
					
					this.create();
					
					
					// ADD IT TO THE ONSEN NAVIGATOR
					myNavigator.pushPage(app[app.global.moduleType].container, 
										 { data: { title: '', 
										  		   page : app.templates.temps[app.global.moduleType].renderedTemplate(app[app.global.moduleType].page)},
								
										  animation : app[app.global.moduleType].animation,
										  callback : app.progress.set // CALLBACK TO UPDATE PROGRESS
							   }
							 );
					app.global.pageIndex++;
					console.log('PAGE INDEX: ' + app.global.pageIndex);
					
				},
				create : function(){
					
					app[app.global.moduleType].page = app.content.data.modules[app.global.module];
					app[app.global.moduleType].page.language = app.attributes.language;
					app[app.global.moduleType].page.section = app.global.module;
					app.global.pageName = app.content.data.modules[app.global.module].name;
					
					
					// ADD ROLE ON SUMMARY PAGE
					if(app.global.moduleType == 'summary'){
						if(app.data.REPORTING != undefined){
							app[app.global.moduleType].page.role = app.data.REPORTING.title;
						}
					}
				},
				
				
			},
		
			//----------------------------------
			// LOADING FUNCTIONS
			//----------------------------------
			loading : {
				container : $('#loading-modal'),
				
				show : function(){

					//var modal = document.querySelector('#loading-modal');
					this.container.show();

				},
				hide : function(){
					//var modal = document.querySelector('#loading-modal');
					this.container.hide();
					//app.modal.hide();

				}
					
			},
			//----------------------------------
			// ONBOARDING - USED FOR NEW USERS
			//----------------------------------
			onboarding : {
				index : 0,
				length : 0,
				carousel : $('#carousel-onboarding')[0],
				carouselInner : $('#carousel-onboarding-inner'),
				
				// GET THE TEMPLATE
				show : function(){
					// SHOW THE MODAL
					app.onboarding.modal.show();
					app.onboarding.load(); //app.templates.temps.load('onboarding',function(){ app.onboarding.load(); } );	// callback load onboarding once template is loaded
				
				},
				done : function(){
					app.storage.data.onboarding = 1;
					app.onboarding.modal.hide();
					app.storage.update();
					app.save();
				},
				// MODAL CONTROLS
				modal : {
					show : function(){
						$('#navbar-page').hide();
						 var modal = document.querySelector('#onboarding-modal');
						modal.show();
						app.global.pageName = 'onboarding_0';
					},
					hide : function(){
						 var modal = document.querySelector('#onboarding-modal');
						modal.hide();
						//app.global.pageName = '';
					}
				},
				// LOAD THE CONTENT FROM THE JSON MODEL
				load: function(){
					console.log('load');
					var elements = app.content.data.modules.onboarding.elements;
					this.length = elements.length;
					for(var i in elements){
						var o = elements[i];
						var data = {};
						console.log(o);
						data.header = o.header[app.attributes.language];
						data.subheader = o.subheader[app.attributes.language];
						data.detail = o.detail[app.attributes.language];
						data.img = o.img;
						data.dots = 2;
						data.index = i;
						console.log(data);
						
						// ADD PAGE TO THE CAROUSEL
						
						
						this.carouselInner.append(app.templates.temps.onboarding.renderedTemplate(data));
						
						i++;
							
					}
					
					  this.carouselInner.find('.progress-body').each(function(index){
							console.log(index + ':' + i);
						  	$(this).find('.progress-dot').each(function(index2){
								if(index == index2){
									$(this).addClass('active-dot');
								}
							});
							
							
						});
					
					
					// ADD NEXT LISTENER ONTO OPTION CHOICES
					$(document).on('pointerdown','.button-onboarding',function(){
					//$(document).on('click','.onboarding-item-outer',function(){
						app.onboarding.index++;
						app.global.pageName = 'onboarding_' + app.onboarding.index;
						// HIDE ONBOARDING IF AT THE END
						if(app.onboarding.length == app.onboarding.index){
							
							app.onboarding.done();
							app.audience.show();
						}
						// GET NEXT IN CAROUSEL IF MORE
						else{
							app.onboarding.carousel.next();
							
						}
						
						
						
						
							
					});
					$(document).on('pointerdown','.onboarding-close',function(){
						app.onboarding.modal.hide();
						
						
							
					});
					// ADD BUTTON LISTENER FOR PREVIOUS
					$(document).on('pointerdown','.onboarding-prev-option',function(){
						app.onboarding.carousel.prev();
							
					});
					
					
					
				}
				
				
			},
			//----------------------------------
			// ONBOARDING CAROUSEL - USED FOR NEW USERS
			//----------------------------------
			carousel : {
				carousel : $('#carousel-onboarding')[0],
				modal : {
					show : function(){
						 var modal = document.querySelector('ons-modal');
						modal.show();
						
					},
					hide : function(){
						 var modal = document.querySelector('ons-modal');
						modal.hide();
					}
				},
				
				start : function(){
					app.carousel.modal.show();
					var onboarding = '';
					
					/*	// GET ONBOARDING ITEMS
					app.form.fields.appType.optionsRendered = app.form.renderOptions(app.form.fields.appType.options);
					app.form.fields.audienceType.optionsRendered = app.form.renderOptions(app.form.fields.audienceType.options);
					onboarding = onboarding + app.form.renderLabel(app.form.fields.appType);
					onboarding = onboarding + app.form.renderLabel(app.form.fields.audienceType);

					// ADD TO DOM
					$('#carousel-onboarding-inner').html(onboarding);
					
					*/
					
					// ADD NEXT LISTENER ONTO OPTION CHOICES
					$(document).on('pointerdown','.onboarding-option',function(){
						app.carousel.carousel.next();
						
							
					});
					// ADD BUTTON LISTENER FOR PREVIOUS
					$(document).on('pointerdown','.onboarding-prev-option',function(){
						app.carousel.carousel.prev();
							
					});
				}
				
				
			},
			
			//----------------------------------
			// NAV - CONTROL MOVEMENT THROUGH THE MODULES
			//----------------------------------
			nav : {
				continue : 1,
				check: function(dir){
					this.endCheck();
					this.update(dir);
				},
				
				update : function(dir){
					
					switch(dir){
							
							
							
							case 'back':
							
								app.global.pageIndex--;
								if(window.app.content.data.modules[app.global.module].elements[app.global.pageIndex].active == 0){
									this.update('back');
								}
								myNavigator.popPage();
								console.log('PAGE INDEX: ' + app.global.pageIndex);
							break;
							
							
							case 'forward':
								console.log('forward:' + this.continue);
								if(this.continue == 1){
									app.global.pageIndex++;
									// IF NEXT PAGE IS INACTIVE, THEN INCREMENT INDEX
									if(window.app.content.data.modules[app.global.module].elements[app.global.pageIndex].active == 0){
										
										this.update('forward');
										console.log('PAGE INDEX: ' + app.global.pageIndex);
									}
									
									// IF ACTIVE PAGE, CREATE AND ADD IT.
									else{
										this.addPage();
										
										console.log('PAGE INDEX: ' + app.global.pageIndex);
									}
									
								}

							break;
					}
					app.save();
					//app.progress.set();
					
				},	
				addPage : function(){
					// CREATE THE PAGE
					app[app.global.moduleType].createPage();

					myNavigator.pushPage(app[app.global.moduleType].page.container, 
						  { data: { title: app[app.global.moduleType].page.title, 
									page : app.templates.temps[app.global.moduleType].renderedTemplate(app[app.global.moduleType].page)

									},
							callback : app.progress.set // CALLBACK TO UPDATE PROGRESS
						   }
						 );
				},
				// HANDLE END OF A MODULE
				endCheck : function(){
					var onePageForward = app.global.pageIndex + 1;
					// IF END OF MODULE
					if(window.app.content.data.modules[app.global.module].elements[onePageForward] == undefined){
						console.log('no more pages');
						this.continue = 0;
						
						
						// IF END OF SUMMARY SECTIONS, THEN GO BACK TO SUMMARY
						if(app.global.parentModule == 'summary'){
							app.summary.reload();
						}
						
						// GET NEXT MODULE
						else{
							app.routing.getModule(1);
							
							
						}
						
						
					}
				},
				// RETURN TO LAST ITEM (USED FOR RETURNING WITHIN THE ASSESSMENT)
				returnToLast : function(){
					
					
					app.global.module = app.data.PROGRESS.lastModule;
					app.global.parentModule = app.global.module;
					app.global.moduleIndex = app.content.data.appOrder.findIndex(x => x === app.global.module);
					// CREATE THE PAGE
					app.global.pageIndex = app.content.data.modules[app.global.module].elements.findIndex(x => x.name === app.data.PROGRESS.lastPage);
					if(app.global.pageIndex == -1){
						app.global.pageIndex = 0;
					}
					app.nav.addPage();
				}
			},
			// -------------------------------------
			// FUNCTION - UPDATE PROGRESS DATA AND PROGRESS BAR
			//---------------------------------------
			progress : {

				
					// SET THE ACTIVE BAR
					set : function(){
						if(app[app.global.moduleType].page.section != undefined){
								
								// UPDATE PROGRESS DATA
								app.progress.update();
							
							
								app.global.section = app[app.global.moduleType].page.section;
							
								// LOOP OVER THE PROGRESS BAR BUBBLES
								$('body').find('.progress-bar-item').each(function(index,el){
									var section = $(this).attr('data-value');
									console.log(section);
									
									// IF CURRENT SECTION MATCHES BUBBLE, THEN MAKE IT ACTIVE
									if(section == app[app.global.moduleType].page.section){
										console.log('match');
										//$(this).find('.progress-bar-bubble-inner').addClass('progress-active').blink();
									}
									if(app.data.PROGRESS.sections[section] != undefined){
										if(app.data.PROGRESS.sections[section].dateCompleted != undefined){
											
											$(this).find('.progress-bar-bubble-inner').addClass('progress-done');
										}
									}
									
								});
						}
						
					},
					update : function(){
						
						var section = app[app.global.moduleType].page.section;
						
						
						// CREATE SECTION IN PROGRESS
						if(app.global.section == '' || app.global.section != section && app.data.PROGRESS.sections[section] == undefined){
							
							app.data.PROGRESS.sections[section] = {};
							app.data.PROGRESS.sections[section].dateStarted = getDateNow();
							
						}
						// MARK SECTION COMPLETED
						if(app.global.section != '' && (app.global.section != section && app.data.PROGRESS.sections[app.global.section].dateCompleted == undefined) ){
							app.data.PROGRESS.sections[app.global.section].dateCompleted = getDateNow();
							
						}
						
						app.progress.log();
						
						app.progress.check();
					},
					check : function(){
						pageLogic();
						
						
					},
					// LOG THE PAGE AS ACCESSED
					log : function(){
						var logPage = {};
						if(app.global.pageName != ""){
							logPage.name = app.global.pageName;
						}
						else{
							logPage.name = myNavigator.topPage.name;
						}
						
						logPage.date = getDateNow();
						app.data.PROGRESS.log.push(logPage);
					},
					
				
				},
			
			//----------------------------------
			// LOAD IN TEMPLATES
			//----------------------------------
			templates : {
				temps : {
					onboarding : {
						src : 'onboarding',
						rendered : 0,
						renderedTemplate : '',	
					},
					summary: {
						src : 'summary',
						rendered : 0,
						renderedTemplate : '',	
					},
					questions : {
						src : 'questions',
						rendered : 0,
						renderedTemplate : '',	
					},
					message1 : {
						src : 'message1',
						rendered : 0,
						renderedTemplate : '',	
					},
					message2 : {
						src : 'message2',
						rendered : 0,
						renderedTemplate : '',	
					},
					resources_list : {
						src : 'resources_list',
						rendered : 0,
						renderedTemplate : '',	
					},
					resources_item : {
						src : 'resources_item',
						rendered : 0,
						renderedTemplate : '',	
					},
					resource1: {
						src : 'resource1',
						rendered : 0,
						renderedTemplate : '',	
					},
					resource2: {
						src : 'resource2',
						rendered : 0,
						renderedTemplate : '',	
					},

					otherRoleTable: {
						src : 'other_role_table',
						rendered : 0,
						renderedTemplate : '',	
					},
					otherRoleLevels: {
						src : 'other_role_levels',
						rendered : 0,
						renderedTemplate : '',	
					},
					reporting: {
						src : 'reporting',
						rendered : 0,
						renderedTemplate : '',	
					},
					reportingCall: {
						src : 'reporting_call',
						rendered : 0,
						renderedTemplate : '',	
					},
					intro: {
						src : 'intro',
						rendered : 0,
						renderedTemplate : '',	
					},

					audience: {
						src : 'audience',
						rendered : 0,
						renderedTemplate : '',	
					}
				},
			
				// TEMPLATE LOADING ACCEPTS A CALLBACK
				load : function(template,callback){
					// IF NOT ALREADY TEMPLATED, THEN GET THE TEMPLATE
					console.log('template start' + template);
					if(this.temps[template].rendered == 0){
						var temp = this.temps[template].src;
						$.ajax({
							url: 'templates/' + temp + '.hbs',
							success: function(data) {
								source    = data;
								console.log('template success:' + temp);
								app.templates.temps[template].renderedTemplate  = Handlebars.compile(source);
								app.templates.temps[template].rendered = 1;
								app.templates.checkEndLoad();
								//if(typeof callback == 'function') {
								//   callback(data);
								//}
							}	//callback(data);
								//app.onboarding.load();
							
							              
						});   
						
					}
					// JUST RERUN THE TEMPLATE
					else{
						//callback;
					}
					
			
					
					
				},
				checkEndLoad : function(){
					var o = 1;
					for(var i in this.temps){
						
						if(this.temps[i].rendered == 0){
							
							o = 0;
						}
					}
					
					if(o == 1){
						console.log('temps all loaded');
						app.routing.start();
					}
				}
			},
			// ---------------------------------------------------------
			// FOR SHOWING NUMBERS TO CALL 
			//-----------------------------------------------------------
			reporting : {
				incidentList : ['MSG_INCIDENT_DISC','MSG_INCIDENT_ASSAULT','MSG_INCIDENT_HARASSMENT','MSG_INCIDENT_STALKING','MSG_INCIDENT_IPV'],
				checkIncident : function(){
					if(app.global.audience == 'other'){
						console.log(myNavigator.topPage.id);
						if($.inArray(app.global.pageName, app.reporting.incidentList) != -1){
							if( $('#reporting-call').length == 0 && myNavigator.topPage.id == 'message'){
								$('#message').find('.content').append(app.templates.temps.reportingCall.renderedTemplate());


							}


						}
					}
					
				},
				
			}
		
		
			
	};
	return app;
}
