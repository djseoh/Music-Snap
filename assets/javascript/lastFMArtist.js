
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
        url: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo",
        contentType: 'application/json',
        success: function(data){
        console.log(data); 

        var bio = data.artist.bio.summary;
        var artistpic = data.artist.image[2]['#text'];
        var relatedartists = data.artist.similar.artist;
        console.log(relatedartists);

        $('#artist-bio').html('<img src =' + artistpic + '><br>'+  bio + '<br>');

        $("#related-artist-table > thead").append("<tr><th>Related Artists</th></tr>")

        for (var i = 0; i<relatedartists.length; i++){

            $("#related-artist-table > tbody").append("<tr><td><img src="
            + relatedartists[i].image[1]['#text'] + "></td><td>"
            + relatedartists[i].name + "</td><td>"
            //+ relatedartists[i].url + "</td></tr>");
            +'<a href="' + relatedartists[i].url + '"target="_blank">' + relatedartists[i].name +" on lastFM</a></td></tr>");




            console.log(relatedartists[i]);

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



// $("#related-artist-table > tbody").append("<tr><td>" + relatedartists[i].name 
// + "</td><td><img src=" + relatedartists[i].image[1]['#text'] 
// + "></td><td>" + relatedartists[i].url + "</td></tr>");