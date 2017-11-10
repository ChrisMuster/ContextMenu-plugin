(function($){
    $.fn.contextMenu = function(opts){
        var element = this;

        var menu = $('<ul id="contextMenu-custom"></ul>');

        var curElement = !1;

        var defaults = {
            beforeShow:function(){},
            afterShow:function(){},
            callback:function(){},
            trigger:'contextmenu',
            closeTrigger:'click',
            options:{
                'No Options Set':'No Options set'
            }
        };

        var options = $.extend({},defaults,opts);

        for(var func in options.options){
            var out = "id=" + options.options[func];
            $(menu).append('<li ' + out + '>' + func + '</li>');
        }

        $(element).on(options.trigger,function(event){
            curElement = $(event.target);
            $(document).trigger('close_menu');
            var x = event.pageX;
            var y = event.pageY;
            event.preventDefault();
            closeMenu();
            assembleMenu();
            menu.hide().show(100).css({top:y + "px", left:x + "px"});
        });

        $(document).on(options.closeTrigger + ' ' + 'close_menu',function(event){
            event.preventDefault();
            closeMenu();
        });

        $(menu).on(options.closeTrigger,function(event){
            event.preventDefault();
            closeMenu();
            opts.callback.call(this,curElement,event.target.id);
        });

    //    options.onInit(menu,api);

        function assembleMenu(){
            options.beforeShow(curElement,api,menu);
            menu.appendTo('body');
        }

        function closeMenu(){
            menu.detach();
        }

        function disable(id){
            menu.find('#' + id).addClass('disabled');
        }

        function enable(id){
            menu.find('#' + id).removeClass('disabled');
        }

        function hide(id){
            menu.find('#' + id).hide();
        }

        function show(id){
            menu.find('#' + id).show();
        }

        var api = {
            disable:disable,
            enable:enable,
            hide:hide,
            show:show
            };

        function menuRepos(){
            var width = $(window).width();
            var height = $(window).height();
            var x = parseInt($("#contextMenu-custom").css("left"));
            var y = parseInt($("#contextMenu-custom").css("top"));
            var menuW = $('#contextMenu-custom').width();
            var menuH = $('#contextMenu-custom').height();
            if(x + menuW > width){
                x -= 10;
                $("#contextMenu-custom").css({left:x});
            }
        
            if(x < 0){
                $("#contextMenu-custom").css({left:"0px"});
            }

            if(y + menuH > height){
                y -= 10;
                $("#contextMenu-custom").css({top:y});
            }

            if(y < 0){
                $("#contextMenu-custom").css({top:"0px"});
            }
        }

        $(window).resize(function(){
            menuRepos();
        });

        $(document).keyup(function(event){
            if(event.which === 27){
                closeMenu();
            }
        });
    };
}(jQuery));