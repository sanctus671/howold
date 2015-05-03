var pictureSource;   // picture source
var destinationType; // sets the format of returned value

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
	
		pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;	
		//HANDLES GETTING IMAGES FROM THE CAMERA PLUGIN
		
	
	
	
		//HANDLES UPLOADING AND UPDATED BACKGROUND SCREEN
		$('#uploadImageForm').on('submit',function(e){
			e.preventDefault();
			
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


		});
    },

	capturePhoto: function() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, allowEdit: true, destinationType: destinationType.DATA_URL });
    },


	getPhoto: function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: source });
    },

	onPhotoURISuccess: function (imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    },	
	
	onFail: function(message) {
      alert('Failed because: ' + message);
    }	
	
	
    
};
