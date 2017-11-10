(function($) {

	$.fn.contextMenu = function(opts) {

		var elem = this;			//all the <li>'s
		var menuDiv = elem.parent();//the <li>'s parent, #menuOptions
		var winWidth, winHeight;	//to capture the changing window width and height
		var menuOpts = $('<ul id="custContext"></ul>');//the new right-click context menu (empty)
		var current = null;			//current element that has been clicked on, set to null to start
		var eti = null;				//used to change the event.target.id if necessary, set to null to start
		var defaults = {					//setup default options, blank as all options will be set...
			choices: {						//...in the calling code and not in the plugin code 
				"No Options": "No Options"
			},
			beforeShow: function() {},
			afterShow: function() {},
			callback: function() {}
		};

		var options = $.extend({}, defaults, opts);	//combines the default options with the options set in the calling code

		var custOpts = {		//allows the function calls hide, show, disable and enable to be passed to other functions... 
			hide : hide,		//...so they can be called from anywhere they are passed
			show : show,
			disable : disable,
			enable : enable,
			winResize : winResize,
			menuStay : menuStay
		};

//Setup function**************************************************************************************
		
		function onInit(el, options, menuOpts) {
			if (!(el.hasClass("white"))) {				//setup menu with initial class of "white"
				$(el).css({"background-color" : "white", "color" : "DarkBlue"}).addClass("white");
			}

			if (menuOpts.length <= 1) {	//if the empty context menu exists...
				for (var choice in options.choices) {	//...then for every choice in the options (hide, show, etc)...
					var menuID = "id=" + options.choices[choice];	//...set an "id" as that choice...
					$(menuOpts).append("<li " + menuID + ">" + choice + "</li>");	//...attach that id to a <li> and set it..
				}																	//...inside the context menu
			}
			return menuOpts;	//return the full context menu to the main code as a variable
		}

		onInit(elem, options, menuOpts);	//call the setup function
		winResize();				//call the function to set the initial window width and height

//Event handlers***************************************************************************************

		$(elem).on("contextmenu", function(event) {			//handles right click on the menu <li>'s'
			if ($(event.target).hasClass('list-star')) {	//if right click was on the icon inside the <li>...
				current = $(event.target).parent();			//set the current element back to the menu <li>
				eti = current.prop('id');					//set the event.target.id to the menu<li> id
			} else {										//otherwise
				current = $(event.target);					//set the current element to the menu <li>
			}
			$(document).trigger("close_menu"); //set a trigger to call close_menu function if leftclick is outside of the menu
			event.preventDefault();				//stops the normal system context menu from appearing on the right click
			closeMenu();		//if a previous context menu is on screen already, close it in favour of this one
			buildMenu();		//call the function to build the new context menu
			var checkPos = setXY(event);	//call function to find and set the initial position for the context menu
			var x = checkPos.newX;	//set the x variable to the value created by the setXY function
			var y = checkPos.newY;	//set the y variable to the value created by the setXY function
			menuOpts.hide().show(100).css({top: y + "px", left: x + "px"});//show context menu in the position shown
		});

		$(document).click("close_menu", function(event) {	//closes the context menu if left clicked outside the...
			event.preventDefault();							//...context menu
			closeMenu();
		});

		$(document).keyup(function(event){					//if a key is pressed on the keyboard...
            if (event.which === 27 || event.which === 93) {	//if the key is the escape key or the context menu key...
            	event.preventDefault();						//stop the default context menu from appearing...
                closeMenu();								//and close the open context menu
            }
        });

       $(document).on("contextmenu", function(event) {	//handles a right click on anywhere other than the menu <li>'s
			event.preventDefault();						//prevents the default context menu appearing
				//if both current and eti are equal to null, no context menu has been opened, so it doesn't need closing, but
        	if ((current !== null) && (eti !== null)) {	//...if both have a value...
            	closeContext(eti, current.prop('id'));	//...call the function passing the eti and current id...
            	eti = null;								//...and reset the eti to null afterwards for next time
        	} else if ((current !== null) && (eti === null)) {	//otherwise if current has a value and eti does not...
        		closeContext(event.target.id, current.prop('id'));//call the function with event.target.id, current id instead
        	}
		});
	
		$(menuOpts).on("click", function(event) {			//left clicking on the context menu							
			closeMenu();									//close the context menu, then...
			options.callback.call(elem, current, event.target.id, custOpts); //...call the callback function to perform the choice
		});

		$(menuOpts).on("contextmenu", function(event) {		//right clicking the context menu
			event.preventDefault();							//prevent the default context menu appearing...
			closeMenu();	//...then close the menu as it was already open, and only left clicks are for choosing options
		});

		$(window).resize(function() {	//handler for when the window is resized
			winResize();	//resets current window's width and height by calling this function
			menuStay();		//makes sure the Menu doesn't appear off the screen
			contextStay();	//makes sure the context menu doesn't appear off the screen
		});

//FUNCTIONS**************************************************************************************************

		function closeContext(eventtgt, curr) { //checks to see if a right click was on the menu or elsewhere...
			if (eventtgt != curr) {				//...if it was not on the menu area...
				closeMenu();					//...close the menu
			}
		}
	
		function buildMenu() {		//builds the context menu after checking for restrictions, attaches it to the html body
			options.beforeShow(current, custOpts); //call function to set options for displaying menu before it shows
			options.afterShow(current, custOpts); //call function to set options after choices 
			menuOpts.appendTo("body");			  //attach the menu to the visible html page
		}

		function setXY(event) {										//sets the x and y coordinates for the context menu
			var contextWidth = (($("#custContext").width()) + 2);	//width of the context menu
			var contextHeight = (($("#custContext").height()) + 2);	//height of the context menu
			var farRight = (winWidth - contextWidth);  //as far as the menu can go before it starts to disappear on the right 
			var farDown = (winHeight - contextHeight);	//as far down the menu can go before disappearing on the bottom
			var x, y;
			if (event.pageX > farRight) {	//if the x coord is higher than the furthest acceptable distance right...
				x = farRight;	//...set x back to the furthest distance to the right allowed
			} else {			//otherwise...
				x = event.pageX;	//...set x to the actual x coordinates
			}

			if (event.pageY > farDown) {	//if the y coord is higher than the furthest acceptable distance down...
				y = farDown;	//...set y back to the furthest distance down allowed
			} else {			//otherwise...
				y = event.pageY;	//...set y to the actual y coordinates
			}
			return {newX: x, newY: y};	//return the x and y coordinates to be used to position the initial context menu
		}

		function closeMenu() {	//closes the context menu
			menuOpts.detach();	//closes it by detaching it from the html so it can't be seen, but not destroying it
		}

		function hide(id) {					//hides the context menu option with passed through id
			menuOpts.find("#" + id).hide();
		}

		function show(id) {					//shows the context menu option with passed through id
			menuOpts.find("#" + id).show();
		}

		function disable(id) {				//disables the context menu option with passed through id
			menuOpts.find("#" + id).addClass("disabled");
		}

		function enable(id) {				//enables the context menu option with passed through id
			menuOpts.find("#" + id).removeClass("disabled");
		}

		function winResize() {			//function to set the current width and height of the window
			winWidth = $(window).width();
			winHeight = $(window).height();
		}

		function menuStay() {			//checks position of the menu and moves it to stay on screen if necessary
			menuDiv.css("position", "absolute");
			var menuWidth = (menuDiv.width()) + 14;
			var menuHeight = (menuDiv.height()) + 14;
			var position = menuDiv.position();
			var farthestRight = (winWidth - menuWidth);
			var farthestDown = (winHeight - menuHeight);
			//after setting variables for the menu, calls function to check position and change it using these variables
			boxPosition(menuDiv, position, farthestRight, farthestDown);
		}

		function contextStay() {		//checks context menu position, moves it to stay on screen if necessary
			if ($("#custContext").length) {	//IF the context menu exists, THEN set the variables and call the function
				var cont = $("#custContext");
				var conWidth = (cont.width()) + 2;
				var conHeight = (cont.height()) + 2;
				var position = cont.position();
				var farthestRight = (winWidth - conWidth);
				var farthestDown = (winHeight - conHeight);
		  //after setting variables for the context menu, calls function to check position and change it using these variables
				boxPosition(cont, position, farthestRight, farthestDown);
			}
		}

		function boxPosition(box, pos, fRight, fDown) {	//takes the variables from either the menu or the context menu...
			if (pos.left > fRight) {					//...and checks how far right, left, up, or down it is...
					box.css({left: fRight + "px"});		//...and if a variable is out of bounds reset it to be in bounds
				}
				if (pos.left < 0) {
					box.css({left: 0 + "px"});
				}

				if (pos.top > fDown) {
					box.css({top: fDown + "px"});
				}
				if (pos.top < 0) {
					box.css({top: 0 + "px"});
				}
		}
	};	
}(jQuery));