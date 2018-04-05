
 var key = '6524dd6282a581b16835b8d99cee0ae2'
 var key2 = '2681d0ca08dcb21966cf6cd38c94d4b8'

// $.ajax({
//     type: "GET",
//     data: {
//         apikey: key,
//         q_artist:artist,
//         f_has_lyrics: 1,
//         format:"jsonp",
//         callback:"jsonp_callback"
//     },
//     url: "https://api.musixmatch.com/ws/1.1/artist.search",
//     dataType: "jsonp",
//     jsonpCallback: 'jsonp_callback',
//     contentType: 'application/json',
//     success: function(data) {
//         console.log(data); 

//         console.log(data.message.body.artist_list[0].artist.artist_name);

//         var name = data.message.body.artist_list[0].artist.artist_name;
        
//         console.log(data.message.body.artist_list[0].artist.primary_genres.music_genre_list[0].music_genre.music_genre_name);

//         console.log(data.message.body.artist_list[0].artist.primary_genres.music_genre_list[1].music_genre.music_genre_name);

//         var genre = data.message.body.artist_list[0].artist.primary_genres.music_genre_list[0].music_genre.music_genre_name + "/" +
//         data.message.body.artist_list[0].artist.primary_genres.music_genre_list[1].music_genre.music_genre_name;

//         $('#artist').text(name + ' ' + genre);
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//     }    
//   });


$('#submit-lyrics').on("click", function(){

    console.log("submit-lyrics clicked");

    $('#lyrics').empty();

    
    var songtitle = $(".now-playing__name").val();
    var artist = $('.now-playing__artist').val();
    console.log(songtitle)
    console.log(artist);

    //check if entered song title is blank
    if(songtitle !== ""){

        $.ajax({
            type: "GET",
            data: {
            apikey: key,
            q_artist:artist,
            q_track: songtitle,
            format:"jsonp",
            callback:"jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function(data){
            console.log(data); 

            console.log(data.message.body.lyrics.lyrics_body);

            lyrics = data.message.body.lyrics;

             $('#lyrics').html(lyrics.lyrics_body + '<br><br>' + lyrics.lyrics_copyright);
           
         },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }    
    });
}
});