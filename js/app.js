// JavaScript Document

// INITIALIZE APP
$(document).ready(function() {


	if(window.location.host == 'localhost'){
		window.directory = {app : 'http://localhost/respectforall_onsen/web/',
						   cms : 'http://localhost/respectforall_onsen/cms/'};
	}
	else{
		window.directory = {app : 'https://ohsurespectforall.com',
						    cms : 'https://ohsurespectforall.com/cms/'};
	}



	
	
	
	// ONLINE INITIALIZE
	if(navigator.onLine){
		var app = appInit();
		app.init();
		window.app = app;
		
	
	}
	// OFFLINE
	else{
		showOffline();
		
	}
	
	
	Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
	});

	
	
	
});



function appInit(){
	
	
	var app = {
		
			// PROPERTIES
			//------------------------------------
			attributes: {
					appName : 'respect_for_all',
					country : 'us',
					pathway : 'self',
					version : '0.1',
					saveLocal : 'no',
					language : 'en',
					source : window.directory
					  
												
			},
			//----------------------------------
			// USER DATA
			//----------------------------------
			data : {
					id : 0,
					pin : {
						set :1
					},
					status : 'new',
					feedback : {
							name : '',
							comments : []
					},
					QUESTIONS : {},
					PROGRESS : {
							sections :{},
							modules : {},
							log : []
					}
			},
			
			//----------------------------------
			// INITIALIZATION
			//----------------------------------
			init : function(){
				//$('#mp-tab-1').attr('label','Hello');
				
				
				//this.carousel.start();
				this.content.get('remote',app.routing.start);
				this.save();
				
			},
			save : function(type){
				var data = JSON.stringify(this.data);
				$.post('com/save.php',{data : data},function(data){
					app.data.id = data;
				});
			},
			feedback : {
				
				page : '',
				name : $('#feedback-name'),
				text : $('#feedback-text'),
				counter :$('#feedback-counter'),
				index : -1,
				getPage : function(){
					this.text.val('');
					if(app.global.pageName != ""){
						this.page = app.global.pageName;
					}
					else{
						this.page = myNavigator.topPage.name;
					}
					$('#feedback-page').text(this.page);
					this.name.val(app.data.feedback.name);
					// CHECK IF PAGE ALREADY EXISTS
					this.index = app.data.feedback.comments.findIndex(x => x.page === this.page);
					if(this.index != -1){
						this.text.val(app.data.feedback.comments[this.index].comment);
					}
					
				},
				save: function(){
					
					if(this.index != -1){
						app.data.feedback.comments[this.index].comment = this.text.val();
					}
					else{
						var comment = {};
						comment.page = this.page;
						comment.comment = this.text.val();
						app.data.feedback.comments.push(comment);
					}
					
					
					if(this.name.val() != ""){
						app.data.feedback.name = this.name.val();
					}
					this.index = -1;
					this.counter.text(app.data.feedback.comments.length);
					app.save();
				}
			},
			global : {
					module : 'assessment',
					moduleType : 'questions',
					section : '',
					audience : 'self',
				    role : 'student',
					pageIndex : 0,
					pageName : '',
				
					
					init : function(){
						
						//ONSEN UI LISTER TO ADD IN TEMPLATED PAGE
						document.addEventListener('init', function (event) {
							  if (event.target.id === 'message' || event.target.id === 'message2') {
								  event.target.querySelector('div.page-content').innerHTML =  app.templates[app.message.type].renderedTemplate(app.message.page);

							  }
							  if (event.target.id === 'resource1' || event.target.id === 'resource2') {
								  event.target.querySelector('div.page-content').innerHTML =  app.templates[app.resourcePage.type].renderedTemplate(app.resourcePage.page);

							  }
							
							 if (event.target.id === 'questions' || event.target.id === 'summary') {
								    var title = event.target.data && event.target.data.title ? event.target.data.title : 'Custom Page';
									event.target.querySelector('ons-toolbar div.center').textContent = title;

									var page = event.target.data && event.target.data.page ? event.target.data.page: 'Custom Page';
									 event.target.querySelector('div.page-content').innerHTML = app.templates.questions.renderedTemplate(app.questions.page);

							  }

							});
					
						$(document).on('click','.e-exit', function(){
							window.location.href = 'https://www.google.com';
						});
							
						$(document).on('click','.feedback-fab', function(){
							$('#feedback-window').toggle();
							app.feedback.getPage();
						});
						$(document).on('click','.button-close-fab', function(){
							$('#feedback-window').toggle();
							
						});
						$(document).on('click','.button-save-fab', function(){
							$('#feedback-window').toggle();
							app.feedback.save();
							
						});
						// LOAD IN TEMPLATES AND TAB BAR
						app.templates.load('questions',function(){ } );
						app.templates.load('message1',function(){ } );
						app.templates.load('message2',function(){ } );
						app.templates.load('resources_list',function(){ } );
						app.templates.load('resources_item',function(){ } );
						app.templates.load('resource1',function(){ } );
						app.templates.load('resource2',function(){ } );
						app.pin.init();
						app.questions.init();
						app.summary.init();
						app.tabbar.load();

					}
				
			},
			menu : {
		
				show : function(){
					 var menu = document.getElementById('menu');
  					 menu.open();
				},
				load : function(page){
					  menu.close();
					  app.routing.refresh(page);
					 

				}
				
			},
			//----------------------------------
			// LOAD IN THE JSON MODEL
			//----------------------------------
			content : {
					data : {},
					get : function(type, callback){
								
					
							switch(type){

								case 'options':
									$.getJSON('appFiles/options.json').done(function(json){
										app.pathway.options = json;
										app.pathway.get('pathway_local');
									}).fail(function(jqxhr,textStatus,error){
										console.log(error);	
									});
								break;

								case 'local':
									$.getJSON('json/source.json').done(function(json){
										app.content.data = json;
										app.routing.start();
									}).fail(function(jqxhr,textStatus,error){
										console.log(error);	
									});
								break;
								case 'remote':
									$.post(app.attributes.source.cms + 'com/pathway_get.php',app.attributes,function(json){
										app.content.data = json.pathway;
										//app.routing.start();
										callback();

									});
								break;
							

							}


							},
				
					
			},
			//----------------------------------
			// ROUTE TO CORRECT PAGE
			//----------------------------------
			routing : {
				
				// DETECT THE 3 USER PROGRESS TYPES
				start : function(){
					
					app.global.init();
					
					// RETURNING USER
					if(app.data.pin.set == 1){
						//app.pin.show();
						app.onboarding.get();
						
					}
					// RETURNING USER, BUT NOT YET PIN SET
					else if(app.data.pin == 0){
						app.pin.set();
					}
					// NEW USER
					else if(app.data.status == 'new'){
						app.onboarding.get();
					}
					else{
						
					}
					
				},
				reload : function(){
						app.nav.check('forward');
					
				},
				reloadSummary :function(){
					app.routing.showMain();
					app.nav.continue = 1;
				},
				audience : function(){
					switch(window.app.global.audience){
						case 'self':
							app.routing.push('self.html','right');
						break;
							
						case 'other':
							app.routing.push('reset.html','right');
						break;
					}
					
				},
				refresh : function(tab){
					var index = 0;
					switch(tab){
						case 'assessment':
							index = 0;
						break;
						case 'summary':
							index = 1;
						break;
							
					}	
					myTabbar.setActiveTab(index,{callback:app.routing.showMain});
					app.nav.continue = 1;
				},
				
				
				showMain : function(){
					myNavigator.bringPageTop('navbar.html',{animation:'fade'});
				},
				onboardingDone : function(){
					// LOAD IN THE FIRST PAGE
					this.push('start.html','fade');
					 app.onboarding.modal.hide();
					 
				
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
				}
				
				
				
			},
		
			// -----------------------------------------------
			// PIN PAGE
			// -----------------------------------
			pin : {
				pinField : $('#pin-field'),
				pinValue : '',
				init : function(){
					$(document).on('click','.pin-field',function(){
						app.pin.setValue($(this).text());
							
					});	
					$(document).on('click','.pin-clear',function(){
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
						 		this.transition();

					   		}
					}
						
				},
				check : function(){
					console.log(this.pinValue);
				},
				transition : function(){
					$('#pin-keypad').hide();
					$("#pin-1-card").children().fadeOut(500, function() {
						var pin3 = $('#pin-3-card').children(); 
						$('#pin-1-card').empty().append(pin3).fadeIn(500,function(){
							$('#pin-2-card').show();
						});
						
						$('#pin-button-next').show();
					});
					
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
						$(document).on('click','.info-view',function(){
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
					
					app.save();
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
					
					if(type == 'message1'){
						this.page.animation = "lift";
					}
					else{
						this.page.animation = "right";
					}
					this.page.container =  type + '.html'; //app.content.data.modules.messages.container;
					console.log(this.page);	
					this.show();
					
				},
				show : function(){
					
					myNavigator.pushPage(this.page.container,{
										   animation : this.page.animation,
											callback : app.progress.log // CALLBACK TO UPDATE PROGRESS
										   }
										 );
				}
				
				
			},
			summary : {
				type : '',
				init : function(){
					

						// HANDLE INPUT EVENTS
						$(document).on('click','.summary-options ons-card',function(){
							console.log('summary item');
							app.summary.handleInput( $(this) );
						});
						// TRIGGER THE API TO GET RESOURCES ONCE WE HAVE A ZIP CODE
						$(document).on('click','#button-zipcode',function(){
							app.summary.resources.spinner('add');
							app.summary.resourcesAPI();
							
						});
						// LOAD RESOURCE CATEGORIES IN BACKGROUND
						app.summary.resources.getCategories();
					
				},
				
				resourcesAPI : function(){
					var zipcode = $('#zipcode_input input').val();
					if(zipcode != ""){
						window.resapi.attributes.zip = zipcode;
						window.resapi.getServices();
							
					}
					
					
				},
				resources : {
					target : 'community_resources_list',
					nearby : [],
					other : [],
					category : '',
					get : function(){
						app.summary.resources.nearby = [];
						app.summary.resources.other = [];
						app.summary.resources.filter(app.resourcePage.catIndex);
						app.summary.resources.createList(app.resourcePage.catIndex);
				
						
						/*
						for(var i=0;i<this.data.length;i++){
							this.show(this.data[i].Name);
							console.log(this.data[i].Name);
						}*/
						
					},
					filter : function(catIndex){
						console.log(catIndex);
						var d = resapi.attributes.categories.elements[catIndex].data;
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
								this.other.push(d[i]);
							}
						}
							
						
					},
					// GET A LIST OF CATEGORY IDS TO USE
					getCategories : function(){
						$.getJSON('json/resource_api_category_ids.json').done(function(json){
							resapi.attributes.categories = json;
							resapi.attributes.categories.language = app.attributes.language;

						}).fail(function(jqxhr,textStatus,error){
							console.log(error);	
						});
					},
					
					createList : function(catIndex){
						
							// BUILD FIRST 3
							var type = 'nearby';
							var resourceList = {};
							resourceList.firstSet = '';
							resourceList.nearby = this[type].length;
							for(var i=0;i<3;i++){
								var resObj = this.resourceDetail(type,i);
								resourceList.firstSet = resourceList.firstSet + app.templates.resources_item.renderedTemplate(resObj);
							}
							// BUILD MORE LIST
							if(this[type].length > 3){
								resourceList.isMoreSet = 1;
								resourceList.moreSet = '';
								
								for(i=3;i<this[type].length;i++){
									resObj = this.resourceDetail(type,i);
									resourceList.moreSet = resourceList.moreSet + app.templates.resources_item.renderedTemplate(resObj);
								}
							}
						
						
							type = 'other';
							
							if(this[type].length > 0){
								resourceList.isOtherSet = 1;
								resourceList.otherSet = '';
								resourceList.other = this[type].length;
								
								for(i=0;i<this[type].length;i++){
									resObj = this.resourceDetail(type,i);
									resourceList.otherSet = resourceList.otherSet + app.templates.resources_item.renderedTemplate(resObj);
									
								}
							}
							
						
							// APPEND TO ELEMENT ALREADY ON VISIBLE PAGE
							$('#' + this.target + '').append(app.templates.resources_list.renderedTemplate(resourceList));
							app.summary.resources.fixEnd();
						
								
						
						
					},
					// GENERATE A HTML SNIPPET OF THE RESOURCE
					resourceDetail : function(type,i){
						var resObj = {};
						resObj.name = this[type][i].Name
						console.log(this[type][i].Sites[0]);
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
					spinner : function(type){
						switch(type){
							case 'add':
								$('#button-zipcode').html('<ons-icon size="30px" spin icon="md-spinner"></ons-icon>');
							break;
							case 'remove':
								$('#button-zipcode').html('Go');
							break;
						}
					}
					
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
						case 'resources-ohsu':
							app.message.createMessage('message1','MSG_RESOURCES_OHSU');
						break;
						case 'resources-comm':
							app.resourcePage.createPage('resource1');
							
							
						break;	
						case 'feedback':
						case 'share':
							console.log(app.summary.type);
							app.global.module = app.summary.type;
							app.global.moduleType = 'questions';
							app.global.pageIndex =0;
							app.nav.check('forward');
						break;
						
							
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
							this.page =  resapi.attributes.categories;
							// LANGUAGE - TO BE USED FOR THE RESPONSE OPTIONS
							this.page.language = app.attributes.language;
							this.page.animation = "lift";
							this.page.callback = app.progress.log;
							
						break;
							
						// RESOURCES LIST PAGE
						case 'resource2':
							console.log(categoryIn);
							this.type = type;
							// GET THE ENTIRE ELEMENT FROM THE MODULE
							for(var category in  resapi.attributes.categories.elements){

								if( resapi.attributes.categories.elements[category].name == categoryIn){
									this.catIndex = category;
									console.log(this.catIndex);
									this.page =  resapi.attributes.categories.elements[category];
									console.log(this.page);
								}
							}
							
							// SET ATTRIBUTES FOR THE PAGE
							//--------------------------------
							// SET PAGE TITLE
							this.page.title = resapi.attributes.categories.elements[this.catIndex].text[app.attributes.language];

							// LANGUAGE - TO BE USED FOR THE RESPONSE OPTIONS
							this.page.language = app.attributes.language;
							this.page.animation = "right";
							this.page.callback = app.summary.resources.get;
						break;
					}
					
					app.global.pageName = this.page.name;
					this.page.container = this.type + '.html';
					console.log(this.page);	
					this.show();
					
				},
				show : function(){
					
					myNavigator.pushPage(this.page.container,{
										    animation : this.page.animation,
											callback : this.page.callback//app.progress.log // CALLBACK TO UPDATE PROGRESS
											
										   }
										 );
				}
			},
			//----------------------------------
			// ONBOARDING - USED FOR NEW USERS
			//----------------------------------
			onboarding: {
				index : 0,
				length : 0,
				carousel : $('#carousel-onboarding')[0],
				carouselInner : $('#carousel-onboarding-inner'),
				
				// GET THE TEMPLATE
				get : function(){
					// SHOW THE MODAL
					app.onboarding.modal.show();
					app.templates.load('onboarding',function(){ app.onboarding.load(); } );	// callback load onboarding once template is loaded
				
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
						app.global.pageName = '';
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
						
						
						this.carouselInner.append(app.templates.onboarding.renderedTemplate(data));
						
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
					$(document).on('click','.onboarding-item-outer',function(){
						app.onboarding.index++;
						app.global.pageName = 'onboarding_' + app.onboarding.index;
						// HIDE ONBOARDING IF AT THE END
						if(app.onboarding.length == app.onboarding.index){
							
							app.routing.onboardingDone();
						}
						// GET NEXT IN CAROUSEL IF MORE
						else{
							app.onboarding.carousel.next();
							
						}
						
						
						
						
							
					});
					$(document).on('click','.onboarding-close',function(){
						app.onboarding.modal.hide();
						
						
							
					});
					// ADD BUTTON LISTENER FOR PREVIOUS
					$(document).on('click','.onboarding-prev-option',function(){
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
					$(document).on('click','.onboarding-option',function(){
						app.carousel.carousel.next();
						
							
					});
					// ADD BUTTON LISTENER FOR PREVIOUS
					$(document).on('click','.onboarding-prev-option',function(){
						app.carousel.carousel.prev();
							
					});
				}
				
				
			},
			//----------------------------------
			// NAVIGATION BAR AT THE BOTTOM
			//----------------------------------
			tabbar : {
				load : function(){
					
					
					$(document).on('click','.nav-tab',function(){
						app.global.module = $(this).attr('data-value');
						if(app.content.data.modules[app.global.module] != undefined){
							app.global.moduleType = app.content.data.modules[app.global.module].type;
						}
						else{
							app.global.moduleType = '';
						}
						
	
					});
					
					// CHANGE TOOLBAR HEADING BASED ON NAVBAR BUTTON SELECTED
					document.addEventListener('prechange', function(event) {
						if(event.tabItem){
							document.querySelector('#toolbar-main').innerHTML = event.tabItem.getAttribute('label');
						}

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
									app.global.pageIndex--;
								}
								myNavigator.popPage();
								console.log('PAGE INDEX: ' + app.global.pageIndex);
							break;
							
							
							case 'forward':
								console.log('forward:' + this.continue);
								if(this.continue == 1){
									
									if(window.app.content.data.modules[app.global.module].elements[app.global.pageIndex].active == 0){
										app.global.pageIndex++;
										this.update('forward');
										console.log('PAGE INDEX: ' + app.global.pageIndex);
									}
									else{
										// CREATE THE PAGE
										app[app.global.moduleType].createPage();

										// ADD IT TO THE ONSEN NAVIGATOR
										myNavigator.pushPage(app[app.global.moduleType].page.container, 
												  { data: { title: app[app.global.moduleType].page.title, 
															page : app.templates[app.global.moduleType].renderedTemplate(app[app.global.moduleType].page)

															},
													callback : app.progress.set // CALLBACK TO UPDATE PROGRESS
												   }
												 );
										app.global.pageIndex++;
										console.log('PAGE INDEX: ' + app.global.pageIndex);
									}
									
								}

							break;
					}
					//app.progress.set();
					
				},	
				// HANDLE END OF ASSESSMENT AND AUTO LOAD OF SUMMARY
				endCheck : function(){
					
					// IF END OF MODULE
					if(window.app.content.data.modules[app.global.module].elements[app.global.pageIndex] == undefined){
						console.log('no more pages');
						this.continue = 0;
						
						// IF END OF SUMMARY SECTIONS, THEN GO BACK TO SUMMARY
						if(app.global.module == 'share' || app.global.module == 'feedback'){
							app.routing.reloadSummary();
						}
						else{
							app.routing.push('assessment_finished.html','fade');
							
						}
						
						
					}
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
					},
					log : function(){
						var logPage = {};
						logPage.name = app.global.pageName;
						logPage.date = getDateNow();
						app.data.PROGRESS.log.push(logPage);
					}
				
				},
			
			//----------------------------------
			// LOAD IN TEMPLATES
			//----------------------------------
			templates : {
				onboarding : {
					src : 'onboarding',
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
				// TEMPLATE LOADING ACCEPTS A CALLBACK
				load : function(template,callback){
					// IF NOT ALREADY TEMPLATED, THEN GET THE TEMPLATE
					console.log('template start');
					if(this[template].rendered == 0){
						var temp = this[template].src;
						$.ajax({
							url: 'templates/' + temp + '.hbs',
							success: function(data) {
								source    = data;
								console.log('template success');
								app.templates[template].renderedTemplate  = Handlebars.compile(source);
								app.templates[template].rendered = 1;
								
								if(typeof callback == 'function') {
								   callback(data);
								}
							}	//callback(data);
								//app.onboarding.load();
							
							              
						});   
						
					}
					// JUST RERUN THE TEMPLATE
					else{
						//callback;
					}
					
			
					
					
				}
			},
			
		
		
			
	};
	return app;
}

function showOffline(){
	$("#device-offline" ).text('Device is offline').toggle();
}