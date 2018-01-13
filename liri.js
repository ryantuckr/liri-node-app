require("dotenv").config();
var info = require("./keys.js");


//var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);

//NODE PACKAGES
var inquirer = require('inquirer');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");


//FIRST USER PROMPT
inquirer.prompt([{
        type: "input",
        name: "welcomemessage",
        message: "Hello and Welcome to LIRI"
    },

    {
        type: "list",
        name: "check1",
        message: "How can I assist you, please select an option below:",
        choices: ["Tweets", "Spotify Search", "Movie Search", "Random"]
    },


]).then(answers => {
    //console.log(JSON.stringify(answers));
    // if (answers.check1 === "Tweets") {


    //.....................SWTICH CASE CODE BLOCK
    switch (answers.check1) {
        case "Tweets":
            twitter();
            break;

        case "Spotify Search":

            inquirer.prompt([{
                    type: "input",
                    message: "What track can I look up?",
                    name: "song"
                }, ])
                .then(answers => {

                    if (!answers.song) {
                        console.log("ERROR: NO SONG SEARCHED");
                        console.log("Defaulting to 'The Signs', from 'Ace of Base'");


                        var Spotify = require('node-spotify-api');

                        var spotify = new Spotify({
                            id: process.env.SPOTIFY_ID,
                            secret: process.env.SPOTIFY_SECRET,
                        });
                        //working!!!!!!!
                        spotify.request("https://api.spotify.com/v1/albums/5UwIyIyFzkM7wKeGtRJPgB")
                            .then(function (data) {
                                //console.log(data);
                                for (i = 0; i < data.artists.length; i++) {
                                    console.log("----------------------------------------------------------");
                                    console.log("Artist(s): " + data.artists[i].name);
                                    console.log("Album Name: " + data.name);
                                    console.log("Spotify Link: " + data.href);
                                }
                            })
                            .catch(function (err) {
                                console.error('Error occurred: ' + err);
                            });

                    } else {
                        //console.log(answers.song);
                        spotify_this(answers.song);
                    }

                });

            break;

        case "Movie Search":
            inquirer.prompt([{
                    type: "input",
                    message: "What Movie can I look up?",
                    name: "movie"
                }, ])
                .then(answers => {

                    if (!answers.movie) {
                        //console.log("You didnt put a movie in");
                        console.log("------------------------------------------------");
                        console.log("ERROR: NO MOVIE SEARCHED");
                        console.log("Defaulting to 'Mr. Nobody'");
                        console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>");
                        console.log("It's on Netflix!");
                        console.log("------------------------------------------------");
                        
                        var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
                        
                        //console.log(queryUrl);
                    
                        request(queryUrl, function (error, response, body) {
                    
                            if (!error && response.statusCode === 200) {
                    
                                console.log("----------------------------------------");
                                console.log("Title: " + JSON.parse(body).Title);
                                console.log("Release Year: " + JSON.parse(body).Year);
                                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                                //console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[0].Value);
                                console.log("Country: " + JSON.parse(body).Country);
                                console.log("Languages: " + JSON.parse(body).Language);
                                console.log("Plot: " + JSON.parse(body).Plot);
                                console.log("Actors: " + JSON.parse(body).Actors);
                                console.log("----------------------------------------");
                            }
                            logData(queryUrl);
                        });
                        

                    } 
                    else {
                        //console.log(answers.movie);
                        movie_this(answers.movie);
                    }
                });

            break;
        case "Random":
            random_this();
            break;
    };
});

//.....................TWITTER CODE BLOCK
function twitter() {

    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    var params = {
        screen_name: 'ryantuckr',
        count: 20
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                console.log("------------------------------------------------------------")
                console.log("Tweet Text: " + tweets[i].text);
                console.log("Timestamp: " + tweets[i].created_at);

                fs.appendFile("log.txt", tweets[i].text + "\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }


                });
                console.log("file saved");
            };

        }
    });

};

//.....................SPOTIFY CODE BLOCK
function spotify_this(song) {

    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET,
    });

    spotify.search({
            type: 'track',
            query: song
        },
        function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            for (i = 0; i < data.tracks.items.length; i++) {
                console.log("------------------------------------------------------------");
                console.log("Artist(s): " + data.tracks.items[i].album.artists[0].name);
                console.log("Album Name: " + data.tracks.items[i].album.name);
                console.log("Track: " + data.tracks.items[i].name);
                console.log("Spotify Link: " + data.tracks.items[i].album.href);

            };
            logData(song);
        });

};

//.....................MOVIE CODE BLOCK
function movie_this(movie) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    //console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log("----------------------------------------");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            //console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Languages: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("----------------------------------------");
        }
        logData(movie);
    });
};

//.....................DO THIS CODE BLOCK
function random_this() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        } else {
            //split the data by the ",", loop the array, and store them seperatly
            var dataArr = data.split(",")
            for (i = 0; i < dataArr.length; i++) {
                var command = dataArr[0];
                var searchItem = JSON.parse(dataArr[1]);

            };
            console.log("----------------------------------------------------")
            console.log("READING FILE.....100%");
            console.log("COMMAND = " + command);
            console.log("SEARCH TERM = " + searchItem);
            //console.log(searchItem);

            if (command === "spotify-this-song") {
                spotify_this(searchItem);
            } else {
                movie_this(searchItem);
            }
        };

    });

};

function logData(song, movie) {
    fs.appendFile("log.txt", song + " was searched" + "\n", function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("file saved");
    });
}