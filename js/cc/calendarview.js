    $(function () {

        /* initialize the external events
         -----------------------------------------------------------------*/
        function ini_events(ele) {
            ele.each(function () {

                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim($(this).text()) // use the element's text as the event title
                };

                // store the Event Object in the DOM element so we can get to it later
                $(this).data('eventObject', eventObject);

                // make the event draggable using jQuery UI
                $(this).draggable({
                    zIndex: 1070,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });

            });
        }

        ini_events($('#external-events div.external-event'));

        /* initialize the calendar
         -----------------------------------------------------------------*/
        //Date for the calendar events (dummy data)
        var date = new Date();
        var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();
        var dateofMonth=y+'-'+m+'-'+d;
        var date	=	dateofMonth;
        var events = [];
        var eventsCache = {};
        //fetchCalenderAttendance(dateofMonth);
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month'
            },
            buttonText: {
                today: 'today',
                month: 'month'
            },
            /*
            eventRender: function(event, element) {
                 //$(element).tooltip({title: event.loc ,placement:'bottom' });  
                 $(element).tooltip({title: event.loc,container: "body"});                   
            },	 
            */
        eventMouseover: function (data, event, view) {

            tooltip = '<div class="tooltiptopicevent" style="width:auto;height:auto;background:#feb811;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' 
            				+ 'In: ' + ': ' + data.intime + '</br>' + 'Out: ' + ': ' + data.outtime + '</div>';


            $("body").append(tooltip);
            $(this).mouseover(function (e) {
                $(this).css('z-index', 10000);
                $('.tooltiptopicevent').fadeIn('500');
                $('.tooltiptopicevent').fadeTo('10', 1.9);
            }).mousemove(function (e) {
                $('.tooltiptopicevent').css('top', e.pageY + 10);
                $('.tooltiptopicevent').css('left', e.pageX + 20);
            });


        },
        eventMouseout: function (data, event, view) {
            $(this).css('z-index', 8);

            $('.tooltiptopicevent').remove();

        },
        dayClick: function () {
            tooltip.hide()
        },
        eventResizeStart: function () {
            tooltip.hide()
        },
        eventDragStart: function () {
            tooltip.hide()
        },
        viewDisplay: function () {
            tooltip.hide()
        },  	
            events: function(start, end, timezone, callback) {
            	
             //have we already cached this time?
		        if (events.eventsCache 
		            && events.eventsCache[start.toString + "-" + end.toString]){
		
		                    //if we already have this data, pass it to callback()
		            callback(eventsCache[start.toString + "-" + end.toString]);
		            return;
		        }
		        
             var date = $('#calendar').fullCalendar('getDate');			    
			    obtanied	= date._d;
			    obtaniedDate	= obtanied.toString();
			    //console.log(obtaniedDate);
			    dateofMonth	= convert(obtaniedDate);
     	       var post_url = base_url+"ccattendance/attendance/fetchMonthlyAttendance";
		            $.ajax({
		            url: post_url,
		            type: "POST",
		            dataType: 'json',
		            cache: true,
		            data: {
		                // our hypothetical feed requires UNIX timestamps
		                //start: start.unix(),
		                //end: end.unix(),
		                dateofMonth:dateofMonth,
		                csrf_test_name : csrf_token
		            },
		            success: function(result) {
		            	 var events = [];
		            	 if (!events.eventsCache)
                      events.eventsCache = {};

            			//store your data
            			eventsCache[start.toString + "-" + end.toString] = result;
            
		                $.each(result,function(index,res) //here we're doing a foeach loop round each city with id as the key and city as the value
		                   {
		                   	var date = (res.start).split('-'); //To get date,month  and year separately
		                   	/*
		                   	var time_from = (meeting.time_from).split(':'); //To get hr,min and sec
		                   	var time_to = (meeting.time_to).split(':'); //To get hr,min and sec
		                   	hrs_from= time_from[0];
		                   	hrs_to= time_to[0];
		                   	meridian_from=meeting.meridian_from;
		                   	meridian_to=meeting.meridian_to;
		                   	if(meridian_from == "PM" && hrs_from < 12) hrs_from = parseInt(hrs_from) + parseInt(12);
		                   	if(meridian_from == "AM" && hrs_from == 12) hrs_from = parseInt(hrs_from)-parseInt(12);
		                   	//if(meridian_from == "AM" && hrs_to == 12) hrs_to = parseInt(hrs_to)-parseInt(12);
		                   	//if(meridian_to == "PM" && hrs_to < 12) hrs_to = parseInt(hrs_to) + parseInt(12);
									*/
		                   	events.push({
		                   		
		                    	   title:  res.title,
		                    	   loc: res.title,
		                    	   start:res.start,
		                    	   end:res.end,
		                    	   intime:res.intime,
		                    	   outtime:res.outtime,
		                        //start: new Date(date[0],date[1] -1, date[2], hrs_from , time_from[1] ), // will be parsed //date[1] -1 is used becz march is 2 as default bt march is 3 in our database
		                        //end:   new Date(date[0],date[1] -1, date[2] , hrs_to, time_to[1] ),
		                        allDay: false,
		                        //url: base_url+'admin/meetings/view/'+meeting.id,
		                        color: res.borderColor					                    
		                        });
		                   });
		                
		                callback(events);
		             }
		          });
		        },
            editable: false,
            droppable: false, // this allows things to be dropped onto the calendar !!!
            drop: function (date, allDay) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;
                copiedEventObject.backgroundColor = $(this).css("background-color");
                copiedEventObject.borderColor = $(this).css("border-color");

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }

            }
        });

        /* ADDING EVENTS */
        var currColor = "#3c8dbc"; //Red by default
        //Color chooser button
        var colorChooser = $("#color-chooser-btn");
        $("#color-chooser > li > a").click(function (e) {
            e.preventDefault();
            //Save color
            currColor = $(this).css("color");
            //Add color effect to button
            $('#add-new-event').css({"background-color": currColor, "border-color": currColor});
        });
        $("#add-new-event").click(function (e) {
            e.preventDefault();
            //Get value and make sure it is not null
            var val = $("#new-event").val();
            if (val.length == 0) {
                return;
            }

            //Create events
            var event = $("<div />");
            event.css({
                "background-color": currColor,
                "border-color": currColor,
                "color": "#fff"
            }).addClass("external-event");
            event.html(val);
            $('#external-events').prepend(event);

            //Add draggable funtionality
            ini_events(event);

            //Remove event from text input
            $("#new-event").val("");
        });
        
         /*
          $('.fc-corner-left').click(function() {
			    //$('#calendar').fullCalendar('prev');
			    var date = $('#calendar').fullCalendar('getDate');			    
			    obtanied	= date._d;
			    obtaniedDate	= obtanied.toString();
			    //console.log(obtaniedDate);
			    //tempString1	= removeBefore(obtaniedDate);
			    //tempString2	= removeAfter(tempString1);
			    dateofMonth	= convert(obtaniedDate);
			    if(dateofMonth)
			    {
			    	fetchCalenderAttendance(dateofMonth);
			    }
			    //console.log(dateofMonth);
			  });
			
			  $('.fc-corner-right').click(function() {
			    var date = $('#calendar').fullCalendar('getDate');
			    obtanied	= date._d;
			    obtaniedDate	= obtanied.toString();
			    //console.log(obtaniedDate);
			    //tempString1	= removeBefore(obtaniedDate);
			    //tempString2	= removeAfter(tempString1);
			    dateofMonth	= convert(obtaniedDate);
			    if(dateofMonth)
			    {
			    	fetchCalenderAttendance(dateofMonth);
			    }
			    //console.log(dateofMonth);
			  });
			  */
    });
    
    
    function fetchCalenderAttendance(dateofMonth)
    {
    	 var date	=	dateofMonth;
		 var post_url = base_url+"ccattendance/attendance/fetchMonthlyAttendance";
		 
	 	 $.ajax({
		 url: post_url,
		 data:{dateofMonth:date,csrf_test_name:csrf_token},
		 type: "POST",
		 dataType: 'JSON',
		 beforeSend: function ( xhr ) 
		 {
	         //Add your image loader here
	         $('#loading').show(); 
	    },
		 success: function(result)
	    { 
	    	$('#loading').hide(); 
	      var event= result;
	      $('#calendar').fullCalendar( 'renderEvent', event, true);
	       //$('#calendar').fullCalendar( 'updateEvent', event );
	    }
	   });//end of ajax 
    }
    
    
    function removeBefore(str)
    {
		s = str.substring(str.indexOf("{") + 1);
   	return s;
    }
    
    
    function removeAfter(str)
    {
    	s = str.substring(0, str.indexOf('}')); 
    	return s;
    }
    
    function convert(str) 
    {
	    var mnths = { 
	        Jan:"01", Feb:"02", Mar:"03", Apr:"04", May:"05", Jun:"06",
	        Jul:"07", Aug:"08", Sep:"09", Oct:"10", Nov:"11", Dec:"12"
	    },
	    date = str.split(" ");
	
	    return [ date[3], mnths[date[1]], date[2] ].join("-");
	 }