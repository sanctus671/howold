
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
		
		app.useGetPicture();
	
	
		//HANDLES UPLOADING AND UPDATED BACKGROUND SCREEN
		$('#uploadImageForm').on('submit',function(e){
			e.preventDefault();
			this.sendImage();
		});
    },
	
	useGetPicture: function() {
		navigator.camera.getPicture(
			app.onPhotoSuccess,
			function(message){alert('Failed: ' + message);},
			{
				quality: 75,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: Camera.PictureSourceType.Camera,
				encodingType: Camera.EncodingType.JPEG,
				correctOrientation: true
			
			
			}
		
		
		)
	
	},
	
	onPhotoSuccess: function(imageURI) {
		var image = document.getElementById('image');
		image.src = imageURI;
		var options = new FileUploadOptions();
		options.fileKey="fileToUpload";
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";

		options.params = params;

		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI("http://www.taylorhamling.com/script.php"), app.win,  app.fail, options);		
		
		
	
	},
	
	win: function(r){
		alert("Response =" + r.response);
	
	},
	
	fail: function(error){
		alert("An error has occurred: Code = " + error.code);
	
	},
	

	
	


	
	sendImage: function(){
			var files = document.getElementById('fileToUpload').files;
			var formData = new FormData();
			var file = files[0];


			// Add the file to the request.
			formData.append('fileToUpload', file, file.name);	
			
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://www.taylorhamling.com/HowOld/script.php', true);
			xhr.onload = function (data) {
				if (xhr.status === 200) {
					// File(s) uploaded.
					var response = $.parseJSON(data.target.response);
					if (response.result === "error"){
						//error
					}
					else{
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
								console.log(data);
								//update background image
								//create squares on image
							})
							.fail(function() {
								//error
							});
						});				
					}
				} 
				else {
					//error
				}
			};	

			xhr.send(formData);	
	
	}


	
    
};
