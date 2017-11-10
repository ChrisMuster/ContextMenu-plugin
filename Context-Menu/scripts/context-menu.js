(function($) {
//Bespoke control options for the plugin
	/*var menuOpts = [];//Empty array to hold any context options that are detached from the menu, ready for reattaching
		only used if alternate hide or show options used in the callback function*/
	var hideCount = [];	//Empty array, used to keep track of whether context options are hidden and how many

	var menuObject = {		//Object to hold all the options to be passed through to the plugin
		choices: {			//Object to hold all the context menu choices and ids
			"Hide": "hide",
			"Show": "show",
			"Colour Red": "red",
			"Colour Green": "green",
			"Remove Colour": "removeColour",	//added an extra option that wasn't in the task requirements, for fun
			"Double Size": "doubleSize",
			"Half Size": "halfSize",
			"Show ID": "showID"
		},

	//beforeShow and afterShow could be combined as one function, but were kept separate as per the task instructions

		beforeShow: function(element, custOpts) { //function that hides or disables options depending on criteria given

			if (hideCount.length === 0) {	//if no menu options are hidden...
				custOpts.disable("show");	//...then disable the "Show" option, as it is unnecessary
			}

			var size = parseInt($(element).css("font-size"));
			if (size <= 4) {					//if size of font gets this small...
				custOpts.disable("halfSize");	//...disable the "Half Size" option, as we don't want to go smaller
			}

			if (size >= 256) {					//if size of font is greater than this...
				custOpts.disable("doubleSize");	//...disable the "Double Size" option, as we don't want to go any bigger
			}

			if (element.hasClass("green")) {	//if the menu has a green background...
				custOpts.hide("green");			//...hide the green option, as it is unnecessary
			}

			if (element.hasClass("red")) {		//if the menu has a red background...
				custOpts.hide("red");			//...hide the red option, as it is unnecessary
			}

			if (element.hasClass("white")) {	//if the menu has a white (default) background...
				custOpts.hide("removeColour");	//...hide the "Remove Colour" option, as it already has no colour
			}
		},

		afterShow: function(element, custOpts) { //function that shows or enables options depending on criteria given

			if (hideCount.length > 0) {		//if any menu options are hidden...
				custOpts.enable("show");	//...enable the "Show" option, so that hidden menu options can be shown again
			}

			var size = parseInt($(element).css("font-size"));
			if (size > 4) {						//if size of font is greater than this...
				custOpts.enable("halfSize");	//...enable the "Half Size" option
			}

			if (size < 256) {					//if size of font is less than this...
				custOpts.enable("doubleSize");	//...enable the "Double Size" option
			}

			if (!(element.hasClass("green"))) {	//if the menu does not have a green background...
				custOpts.show("green");			//...show the green option
			}

			if (!(element.hasClass("red"))) {	//if the menu does not have a red background...
				custOpts.show("red");			//...show the red option
			}

			if (!(element.hasClass("white"))) {	//if the menu does not have a white (default) background...
				custOpts.show("removeColour");	//...show the "Remove Colour" option
			}
		},

		callback: function(element, option, custOpts) {		//function to action clicks made on the context menu

			var size = parseInt($(element).css("font-size"));	//collects the current menu option font size
			var iWidth = parseInt($(element).children().css("width"));	//collects the current image width
			var iHeight = parseInt($(element).children().css("height"));	//collects the current image height

			switch (option) {
				case "hide":
				/*	menuOpts.push($(element).detach());		//alternate way of hiding menu options, 
					hideCount.push(1);*/					//to use with the empty menuOpts array above

					$(element).hide();	//if "hide" is chosen, hide the current menu option
					hideCount.push(1);	//add 1 to the hideCount array
					break;
				case "show":
				/*	for (var i in menuOpts) {						//alternate way of showing menu options,
						$(element).parent().append(menuOpts[i]);	//to use with the empty menuOpts array above
						hideCount.pop(1);
					}*/

					$("li").show();			//if "show" is chosen, show all the hidden <li>'s
					hideCount.length = 0;	//reset the hideCount array to zero
					break;
				case "red":  //if "red" chosen, change current background to red with white text, add red class, remove other classes
					$(element).css({"background-color" : "red", "color" : "white"}).addClass("red").removeClass("green").removeClass("white");
					break;
				case "green":  //if "green" chosen, change background to green with white text, add green class, remove other classes
					$(element).css({"background-color" : "green", "color" : "white"}).addClass("green").removeClass("red").removeClass("white");
					break;
				case "removeColour":  //if this is chosen, set background to white with blue text, add white class, remove other classes
					$(element).css({"background-color" : "white", "color" : "DarkBlue"}).addClass("white").removeClass("red").removeClass("green");
					break;
				case "doubleSize":  //if this is chosen...
					size *= 2;		//take the current font size and double it
					iWidth *= 2;	//take the current image width and double it
					iHeight *= 2;	//take the current image height and double it
					$(element).children().css({"width" : iWidth + "px"});	//set image width to new width
					$(element).children().css({"height" : iHeight + "px"});	//set image height to new height
					$(element).css({"font-size" : size + "px"});			//set font size to new size
					custOpts.winResize();		//make sure when the font changes the size of the Menu options...
					custOpts.menuStay();		//...it does not push the menu off the screen
					break;				
				case "halfSize":  //if this is chosen...
					size /= 2;	  //take the current font size and divide in half
					iWidth /= 2;  //take the current image width and divide in half 
					iHeight /= 2; //take the current image height and divide in half
					$(element).children().css({"width" : iWidth + "px"});	//set image width to new width
					$(element).children().css({"height" : iHeight + "px"});	//set image height to new height
					$(element).css({"font-size" : size + "px"});			//set font size to new size
					break;
				case "showID":
					alert("This element's ID is: " + element.prop("id")); //put an alert on the screen with id of menu option
					break;										
				default:
					console.log("Option not set!");
			}
		}
	};

	$("li").contextMenu(menuObject);	//call the plugin on all the <li>'s

}(jQuery));