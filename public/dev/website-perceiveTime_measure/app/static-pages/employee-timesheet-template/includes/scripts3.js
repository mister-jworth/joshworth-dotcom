var Device = {
    detect: function(key) {
        if(this['_'+key] === undefined) { this['_'+key] = navigator.userAgent.match(new RegExp(key, 'i')); }
        return this['_'+key];
    },
    // check for android to find android tablets
    isMobile: function() { return navigator.userAgent.match(/mobile/i) || navigator.userAgent.match(/android/gi);}, 
    iDevice: function() { return this.detect('iPhone') || this.detect('iPod') || this.detect('iPad'); },
    iPad: function() { return this.detect('iPad'); },
    svg: function() { return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"); }
};

$(function() {
	
	//timesheet - karl.erss@gmail.com
	
	var row = '<div style="display:none;" class="ts ts-row cfx"><input class="primary" type="text"/><a href="#" class="remove">×</a><input class="secondary" type="text"/><input class="secondary" type="text"/><input class="secondary" type="text"/><input class="secondary" type="text"/><input class="secondary" type="text"/></div>';

	function initListeners(){
		$('.remove').click(function(e){
			e.preventDefault();
			console.log('ja');		
			c = $(this).closest('.ts-row');
			c.slideUp(function(){
				this.remove();
			});
		});
		
		$('input.secondary').blur(function(e){
			a = $(this).val().replace(/[A-Za-z$-]/g, "");
			if(a.length != 0){
				$(this).val(a + 'h');
			}
			else{
				$(this).val('');
			}
		});
	}
	initListeners();
	$('#addrow').click(function(e){
		e.preventDefault();
		var newrow=$(this);
		$('#ts-inner').append(row);
		$('.ts-row').last().slideDown();
		$('#ts-inner').append(newrow);
		initListeners();
		
	});
	
	
	
	
	$('#print').click(function(e){
		var output = '<table id="result">';
		output += '<thead><tr><td>Activity</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Total (activity)</td></tr></thead><tbody>'
		var totals = [0,0,0,0,0];
		$('.ts-row').each(function(index, element) {
			var hours = Array();
			var activityTotal = 0;
			output += '<tr>';
            output +='<td>' + $(element).children('.primary').first().val()+'</td>';
			$(element).children('.secondary').each(function(index2, element2) {
				var k = $(element2).val();
				if (k.length != 0){
					activityTotal += parseInt(k);
					totals[index2] += parseInt(k);
				}
            	hours.push('<td>' + k + '</td>');
            });
			hours.reverse();
			output += hours.join('');
			output += '<td>' + activityTotal + 'h</td>';
			output += '</tr>';
        });
		
		output += '</tbody>';
		totals.reverse();
		t = totals.reduce(function(a, b) {
			return a + b;
		});
		output += '<tfoot><tr><td>Total (day)</td><td>'+totals[0]+'h</td><td>'+totals[1]+'h</td><td>'+totals[2]+'h</td><td>'+totals[3]+'h</td><td>'+totals[4]+'h</td><td>'+t+'h</td></tr></tfoot>';
		output += '</table>';
		console.log(totals);
		
		$('#output').html(output);
		var disp_setting="toolbar=yes,location=no,directories=yes,menubar=yes,"; 
		disp_setting+="scrollbars=yes,width=780, height=780, left=100, top=25"; 
		var docprint=window.open("about:blank", "_blank", disp_setting); 
		var oTable = document.getElementById("result");
		docprint.document.open(); 
		docprint.document.write('<html><head><style>@media print {table{width: 100%;} tr:nth-child(even){background-color: #ddd !important; -webkit-print-color-adjust: exact; }}</style><title>Timesheet</title>'); 
		docprint.document.write('</head><body><center>');
		docprint.document.write(oTable.parentNode.innerHTML);
		docprint.document.write('</center></body></html>'); 
		docprint.document.close(); 
		docprint.print();
		docprint.close();
	});
	
	//timesheet end
	    
    var setVideoContainer = function() {
        var ratio = 1.8,
            $c = $('#video-container'),
            w = $c.width(),
            h = $c.height();
            
        if (w/h > ratio) {
            $c.children('video').css({
                'width' : '100%',
                'height' : 'auto'
            });
        }
        else {
            $c.children('video').css({
                'height' : '100%',
                'width' : 'auto'
            });
        }
    };
    
    setVideoContainer();
    $(window).resize(setVideoContainer);
    
    
    var videoModal;
    $('.btn-video').click(function(event) {
        event.preventDefault();
        
        if (!videoModal) {
            videoModal = new $.modal({});
            videoModal.getContainer().on('hide', function() {
                videoModal.getContainer().find('.overlay-popup').empty();
            });
        }
      
        videoModal.setContent($('#video-modal-tpl').html());
        videoModal.show();
    });
    
    if (!Device.isMobile()) {
        $('#video-container video').show();
    }
    
    
});


(function() {

    var matched, browser;
    // Use of jQuery.browser is frowned upon.
    // More details: http://api.jquery.com/jQuery.browser
    // jQuery.uaMatch maintained for back-compat
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();
        
        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];
        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };
    matched = jQuery.uaMatch( navigator.userAgent );
    browser = {};
    if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    }
    
    // Chrome is Webkit, but Webkit is also Safari.
    if ( browser.chrome ) {
        browser.webkit = true;
    } else if ( browser.webkit ) {
        browser.safari = true;
    }
    
    jQuery.browser = browser;

})();


(function($) {

    var Modal = function(options) {
        
        this.settings = $.extend({
            type: 'popup',
            skin: 'none',
            closeOnEscape: true
        }, options);
        this._id = Math.round(new Date().getTime());
        this._init();
    };

    Modal.prototype = {

        _init: function() {
            
            this.handleDocumentKeyup = $.proxy(this.handleDocumentKeyup, this);
            this.handleResize = $.proxy(this.handleResize, this);
            this.handleModalCloseClick = $.proxy(this.handleModalCloseClick, this);
            this.handleOverlayClick = $.proxy(this.handleOverlayClick, this);
            
            this.$_container = $('<div />').addClass('overlay');

            if (this.settings.zIndex) { this.$_container.css('z-index', this.settings.zIndex); }
            
            if ($.browser.msie) { this.$_container.append('<iframe class="overlay-iframe" src="javascript:false" frameborder="0"></iframe>'); }
            this.$_container.append('<div class="overlay-content"><a href="" class="modal-close">&times;</a></div>');
            this.$_container.on('click', '.modal-close', this.handleModalCloseClick);
            this.$_content = this.$_container.children('.overlay-content');
            this.$_content.append('<div class="overlay-popup"></div>');
            this.$_popup = this.$_content.find('.overlay-popup');
            
            if (this.settings.skin == 'dark') { this.$_container.addClass('overlay-dark'); }
            if (this.settings.skin == 'light-dark') { this.$_container.addClass('overlay-light-dark'); }
            $('body').append(this.$_container);
        },
        
        // Listens for keyboard events and waiting for ESC to close this balloon.
        handleDocumentKeyup: function(event) {
            if (event.keyCode == 27 && this.settings.closeOnEscape) {
                this.hide();
            }
        },
        
        handleResize: function() {
          this.setPosition();
        },
        
        handleModalCloseClick: function(e) {
            e.preventDefault();
            this.hide();
        },
        
        handleOverlayClick: function() {
            this.hide();
        },
        
        setPosition: function() {
            var wh = $(window).height();
            if (this.settings.type == 'over') {
                this.$_popup.css({
                    //'height': wh + 'px',
                    'position' : 'static'
                });
            }
            else {
                this.$_popup.css({
                    'position' : 'absolute',
                    'top': '50%',
                    'left': '50%'
                });
                var height = this.$_popup.outerHeight(),
                    width = this.$_popup.outerWidth(),
                    dimensions = this.getDimensions();

                this.$_popup.css({
                    'margin-top': -height / 2,
                    'margin-left': -width / 2
                });
                
                if (height > dimensions[0]) { this.$_popup.css({'top': '0px', 'margin-top': '0'}); }
                if (width > dimensions[1]) { this.$_popup.css({'left': '0px', 'margin-left': '0'}); }
            }
            
            this.getContainer().find('.modal-resizable').trigger('setSize');
        },
        
        getDimensions: function () {
			var $el = $(window),
                h = $.browser.opera && $.browser.version < '9.5' ? window.innerHeight : $el.height();
			
			return [h, $el.width()];
		},
        
        setContent: function(html) {
            this.$_popup.empty().append(html);
        },
        setContentObject: function($obj) {
            $obj = $obj.clone();
            this.$_popup.empty().append($obj);  
        },
        
        show: function() {
            this.html_of = $('html').css('overflow');
            this.body_of = $('body').css('overflow');
            this.scrollTop = $(window).scrollTop();
            $(window).scrollTop(0);
            $('body, html').css('overflow', 'hidden');
            $('body').addClass('overlay-open');
            
            this.$_content.css('visibility','hidden');
            this.$_container.show();
            this.setPosition();
            $(window).on('resize', this.handleResize);
            $(window).on('orientationchange', this.handleResize);
            $(document).on('keyup', this.handleDocumentKeyup);
            this.$_container.on('click', this.handleOverlayClick);
            this.$_content.css('visibility','visible');
        },
        
        hide: function() {
            this.$_container.hide();
            this.$_container.trigger('hide');
            $('html').css('overflow', this.html_of);
            $('body').css('overflow', this.body_of).removeClass('overlay-open');
            $(window).off('resize', this.handleResize);
            $(window).off('orientationchange', this.handleResize);
            $(document).off('keyup', this.handleDocumentKeyup);
            this.$_container.off('click', this.handleOverlayClick);
            $(window).scrollTop(this.scrollTop);
        },
        
        getContainer: function() {
            return this.$_container;
        }
    };
    
    $.modal = Modal;
    
}(jQuery));

