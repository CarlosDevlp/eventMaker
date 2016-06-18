var accessToken='';
$(function(){

	var addPanel=function(nombreEvento,descripcionEvento,rowid){
		return ' <div class="panel panel-default"> '         
				+' <div class="panel-body">'+nombreEvento
					+' <button  class="btn btn-default pull-right btn-remove" rowid="'+rowid+'">Eliminar</button> '
				+' </div> '
				+' <div class="panel-footer">'+descripcionEvento+'</div> '
				+' </div>';
	};
    

	//fusion table api	
	var mainUrl='https://www.googleapis.com/fusiontables/v2/query';
	var apiKey='AIzaSyBgOgCMTC76Sa1zjaew8wTiLhtE4b5b4sc';
	var tableId='1RgwO19PGqraBt4R7VmuyageDvqh-PwU6M07oyAs_'; //tabla eventos
		
		//SELECT
		select=function(){
				$.ajax({
					 method:'get',
					 url:mainUrl,
					 data:{
						'sql':"SELECT 'Nombre','Descripción','Fecha','Lugar','Organizador/Vocero','Twitter',ROWID FROM "+tableId,
						'key':apiKey
					 },
					 success: function(response){
					 	$('.container').html(''); //eliminar todo
					 	var eventHtml='';
					 	console.log(response);

					 	for(var i in response.rows)	
					 		eventHtml+= addPanel(response.rows[i][0],response.rows[i][1],response.rows[i][6]);

						$('.container').html(eventHtml);


						if(accessToken) enableButtons();
						else disableButtons();

					 }
				});
		};

		select();

		//INSERTAR
		var oauthTokenRequestUrl= 'https://accounts.google.com/o/oauth2/v2/auth?scope=fusiontables&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=ClEWqOsymN-pop3L2-RQQG5c&client_id=71629830816-c289ppb0651ainoj72j95pf3eqle4h7o.apps.googleusercontent.com';	
		insert=function(nombreEvento,descripcionEvento,date,place,organizer,twitter){

			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://www.googleapis.com/fusiontables/v2/query?sql=INSERT%20INTO%201RgwO19PGqraBt4R7VmuyageDvqh-PwU6M07oyAs_%20('Nombre'%2C'Descripci%C3%B3n'%2C'Fecha'%2C'Lugar'%2C'Organizador%2FVocero'%2C'Twitter')"+
					"%20VALUES%20%20('"+encodeURIComponent(nombreEvento)+"'%2C'"+
									 	encodeURIComponent(descripcionEvento)+"'%2C'"+
									 	encodeURIComponent(date)+"'%2C'"+
										encodeURIComponent(place)+"'%2C'"+
										encodeURIComponent(organizer)+"'%2C'"+
										encodeURIComponent(twitter)+"')&access_token="+accessToken,
				"method": "POST",
				"headers": {
				"cache-control": "no-cache"
				}
			};

			$.ajax(settings).done(function (response) {			
			 	console.log("evento insertado");
			 	console.log(response);
			 	select();			 	
			});
					

		};



		$('.btn-create').on('click',function(event){

			insert( $('.form-name').val(),
					$('.form-description').val(),
					$('.form-date').val(),
					$('.form-organizer').val(),
					$('.form-twitter').val()
				);

			$('.form-name').val('');
			$('.form-description').val('');
			$('.form-date').val('');
			$('.form-organizer').val('');
			$('.form-twitter').val('');
		});


		remove=function(rowid){
			var settings = {
			  "async": true,
			  "crossDomain": true,
			  "url": "https://www.googleapis.com/fusiontables/v2/query?sql=DELETE%20FROM%201RgwO19PGqraBt4R7VmuyageDvqh-PwU6M07oyAs_%20WHERE%20ROWID%3D'"+rowid+"'&access_token="+accessToken,
			  "method": "POST",
			  "headers": {
			    "cache-control": "no-cache"
			  }
			}

			$.ajax(settings).done(function (response) {
			  console.log(response);
			  select();
			});
				
		};
	


	disableButtons=function(){	
			$('.btn').addClass('disabled');										
			$('.btn.btn-auth').removeClass('disabled');
	};	
	

	enableButtons=function(){
			$('.btn').removeClass('disabled');						
			$('.btn.btn-auth').css('display','none');		

			$('.btn-remove').on('click',function(){
					var rowid=$(this).attr('rowid');
					console.log(rowid);
					remove(rowid);
			});


	};	
	
	setInterval(function(){


	},500);

	/*Autorizar aplicación*/
	$('.btn-auth').on('click',
		function (){
	          var config = {
	            'client_id': '651909157720-o0fv9osfkhsd7vaq8v53ig87lq26nvlc.apps.googleusercontent.com', //client id
	            'scope': 'https://www.googleapis.com/auth/fusiontables'
	          };
	          gapi.auth.authorize(config, function() {
	            console.log('login complete');
	            console.log(gapi.auth.getToken());
	            accessToken=(gapi.auth.getToken()).access_token;
	            enableButtons();
	          });
	   });


});