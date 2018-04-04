
var key = '6c8fa2acf11a4df27e6843f084a007b7';
     
$('#submit-artist').on("click", function(){

    console.log("submit artist clicked");

    $('tbody').empty();

    
     var usrArtist = $('#user-artist').val().trim();

     console.log(usrArtist);

    if(usrArtist !== ""){

        $.ajax({
        type: "GET",
         data: {
            api_key: key,
            artist:usrArtist,
            format:"json",
            limit:10
        },
        url: "http://ws.audioscrobbler.com/2.0/?method=artist.search",
        contentType: 'application/json',
        success: function(data){
        console.log(data); 

            var results = data.results.artistmatches.artist;

            console.log(results);

            console.log('<a href = "'+results[0].url + '"></a>');

            $("#artist-table > thead").append("<tr><th>Artist Name</th><th>Image</th><th>Last.FM</th></tr>")

             for (var i = 0; i<10; i++){

                $("#artist-table > tbody").append("<tr><td>" + results[i].name + "</td><td><img src=" + results[i].image[1]['#text'] 
                + "></td><td>" + results[i].url + "</td></tr>");

                console.log(results[i].name);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }    
      });  
     } 
     
});



