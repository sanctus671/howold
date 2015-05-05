var spinner = new Spinner({
  lines: 17, // The number of lines to draw
  length: 1, // The length of each line
  width: 14, // The line thickness
  radius: 12, // The radius of the inner circle
  corners: 0.5, // Corner roundness (0..1)
  rotate: 60, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#FF9716', // #rgb or #rrggbb or array of colors
  speed: 1.6, // Rounds per second
  trail: 100, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: true, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
});

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
		
		
		
		
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		tutorial();
		
    },

	sharePicture: function() {
		
		 var imageLink;
		//console.log('Calling from CapturePhoto');
		navigator.screenshot.save(function(error,res){
			if(error){
				console.error(error);
			}else{
				console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
				//For android
				imageLink = res.filePath;
				window.plugins.socialsharing.share(null, null,'file://'+imageLink, null);

				//For iOS
				//window.plugins.socialsharing.share(null,   null,imageLink, null)
			}
		 },'jpg',50,'myScreenShot');
	
	},		
	
	useGetFile: function() {
		navigator.camera.getPicture(
			app.onPhotoSuccess,
			function(message){/*alert('Failed: ' + message);*/},
			{
				quality: 25,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				encodingType: Camera.EncodingType.JPEG,
				correctOrientation: true
			
			
			}
		
		
		)
	
	},	
	useGetPicture: function() {
		navigator.camera.getPicture(
			app.onPhotoSuccess,
			function(message){/*alert('Failed: ' + message);*/},
			{
				quality: 25,
				sourceType: Camera.PictureSourceType.Camera,
				encodingType: Camera.EncodingType.JPEG,
				correctOrientation: true,
				cameraDirection: Camera.Direction.FRONT
			
			
			}
		
		
		)
	
	},
	
	onPhotoSuccess: function(imageURI) {
		$('.welcome').hide();
		spinner.spin(document.body);
		var image = document.getElementById('image');
		image.src = imageURI;
		$('.box').remove();
		var options = new FileUploadOptions();
		options.fileKey="fileToUpload";
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";

		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI("http://www.taylorhamling.com/HowOld/script.php"), app.win,  app.fail, options);		
		
		
	
	},
	
	win: function(r){
		//alert("Response =" + r.response);
		var response = $.parseJSON(r.response);
		
		//send away to microsoft
		$(function() {
			var params = {
				// Specify your subscription key
				'subscription-key': '1e5ea185c56f4c9fbe3204031489417d',
				// Specify values for optional parameters, as needed
				// analyzesFaceLandmarks: "false",
				 analyzesAge: "true",
				 analyzesGender: "true",
				// analyzesHeadPose: "false",
			};
			 
			$.ajax({
				url: 'https://api.projectoxford.ai/face/v0/detections?' + $.param(params),
				type: 'POST',
				contentType: 'application/json',
				data: '{url:"http://taylorhamling.com/HowOld/' + response.url + '"}'
			})
			.done(function(data) {

				var imageHeight = document.getElementById('image').naturalHeight;
				var imageWidth = document.getElementById('image').naturalWidth
				var scaledHeight = $('.main').height();
				var scaledWidth = $('.main').width();
				
				var scaleHeightFactor = scaledHeight/imageHeight;
				var scaleWidthFactor = scaledWidth/imageWidth;	
				
				if (data.length < 1){
					alert("No faces detected. Please try again.");
				}
				
				for (var index in data){
					//alert("You are a " + data[index]["attributes"]["gender"] + " who is " + data[index]["attributes"]["age"] + " years old");
					$('body').append('<div class="box" style="display:none; width:' + data[index]["faceRectangle"]["width"]*scaleWidthFactor + 'px; height:' + data[index]["faceRectangle"]["height"]*scaleHeightFactor + 'px; top:' + data[index]["faceRectangle"]["top"]*scaleHeightFactor + 'px; left:' + data[index]["faceRectangle"]["left"]*scaleWidthFactor + 'px;">' +
					'<i class="attributes fa fa-' + data[index]["attributes"]["gender"] + '"></i>' +
					'<div class="attributes age">' + data[index]["attributes"]["age"] + '</div>' +
					'</div>');

				}
				$('.box').fadeIn();
				spinner.stop();
				//clean up
				/*
				$.ajax({
					url: 'http://www.taylorhamling.com/HowOld/delete.php',
					type: 'POST',
					data: {url:response.url}
				});
				*/
			})
			.fail(function() {
				spinner.stop();
				alert("No faces detected. Please try again.");
				//still clean up
				/*
				$.ajax({
					url: 'http://www.taylorhamling.com/HowOld/delete.php',
					type: 'POST',
					data: {url:response.url}
				});
				*/
			});
		});			
		
		
	
	},
	
	fail: function(error){
		spinner.stop();
		alert("There was an error. Please try again.");
	
	}
	

	
	

	


	
    
};
