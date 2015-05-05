
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
		
		
    },

	sharePicture: function() {
		navigator.screenshot.save(function(error,res){
		if(error){
			alert("There was an error");
		}else{
			window.plugins.socialsharing.share('Shared from the How Old app on Google Play and App Store!', null, res.URI, 'http://www.how-old.net');
		}
		});	
		

	
	},		
	
	useGetFile: function() {
		navigator.camera.getPicture(
			app.onPhotoSuccess,
			function(message){/*alert('Failed: ' + message);*/},
			{
				quality: 25,
				destinationType: Camera.DestinationType.FILE_URI,
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
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: Camera.PictureSourceType.Camera,
				encodingType: Camera.EncodingType.JPEG,
				correctOrientation: true,
				cameraDirection: Camera.Direction.BACK
			
			
			}
		
		
		)
	
	},
	
	onPhotoSuccess: function(imageURI) {
		$('.welcome').hide();
		$('.loader').show();
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
				$('.loader').hide();
				//clean up
				$.ajax({
					url: 'http://www.taylorhamling.com/HowOld/delete.php',
					type: 'POST',
					data: {url:response.url}
				});
			})
			.fail(function() {
				$('.loader').hide();
				alert("No faces detected. Please try again.");
				//still clean up
				$.ajax({
					url: 'http://www.taylorhamling.com/HowOld/delete.php',
					type: 'POST',
					data: {url:response.url}
				});
			});
		});			
		
		
	
	},
	
	fail: function(error){
		$('.loader').hide();
		alert("There was an error. Please try again.");
	
	}
	

	
	

	


	
    
};
