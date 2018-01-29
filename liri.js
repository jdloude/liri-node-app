	// Node module imports needed to run the functions
	var fs = require("fs"); //reads and writes files
	var request = require("request"); //NPM package for request
	var keys = require("./keys.js"); //Loads Twitter auth keys
	var twitter = require("twitter"); //NPM for Twitter
	var Spotify = require("node-spotify-api"); //Npm for spotify
	var userInput = process.argv[2]; //User query

	switch (userInput) {
	    case "my-tweets":
	        getTweets();
	        break;
	    case "spotify-this-song":
	        spotifyThisSong();
	        break;
	    case "movie-this":
	        movieThis();
	        break;
	    case "do-what-it-says":
	        doWhatItSays();
	        break;
	        // Instructions to the user
	    default:
	        break;
	}


	// Movie function, uses the Request module to call the OMDB api
	function movieThis() {
	    var movie = process.argv[3];
	    if (!movie) {
	        movie = "mr nobody";
	    }
	    params = movie
	    request(
	        "http://www.omdbapi.com/?t=" + params + "&apikey=34232441&&y=&plot=short&r=json",
	        function(error, response, body) {
	            if (!error && response.statusCode == 200) {
	                var movieObject = JSON.parse(body);
	                console.log("Title: " + movieObject.Title);
	                console.log("Year: " + movieObject.Year);
	                console.log("Imdb Rating: " + movieObject.imdbRating);
	                console.log("Rotten Tomatoes Rating: " + movieObject.tomatoRating);
	                console.log("Country: " + movieObject.Country);
	                console.log("Language: " + movieObject.Language);
	                console.log("Plot: " + movieObject.Plot);
	                console.log("Actors: " + movieObject.Actors);

	                // calling log function to write in log.txt
	                log("Title: " + movieObject.Title);
	                log("Year: " + movieObject.Year);
	                log("Imdb Rating: " + movieObject.imdbRating);
	                log("Rotten Tomatoes Rating: " + movieObject.tomatoRating);
	                log("Country: " + movieObject.Country);
	                log("Language: " + movieObject.Language);
	                log("Plot: " + movieObject.Plot);
	                log("Actors: " + movieObject.Actors);

	            } else {
	                console.log("Error :" + error);
	                return;
	            }
	        }
	    );
	}

	// Tweet function, uses the Twitter module to call the Twitter api
	function getTweets() {
	    var twitterUsername = process.argv[3];
	    if (!twitterUsername) {
	        console.log("Please enter a user name after: node liri.js my-tweets 'User Name'");
	        log("Twitter User Name not Defined");
	    }
	    params = { screen_name: twitterUsername };

	    // console.log last 20 tweets and when they were created
	    twitter(keys).get("statuses/user_timeline/", params, function(error, data, response) {
	        if (!error) {
	            for (var i = 0; i < data.length; i++) {
	                console.log("------------------------------ " + "Tweet # " + (i + 1) + " ------------------------------" + "@" + data[i].user.screen_name + ": " + data[i].text + data[i].created_at);

	                // calling log function to write in log.txt
	                log("------------------------------ " + "Tweet # " + (i + 1) + " ------------------------------" + "@" + data[i].user.screen_name + ": " + data[i].text + data[i].created_at);
	            }
	        } else {
	            console.log("Error :" + error);
	            return;
	        }
	    });
	}

	// Spotify function, uses the Spotify module to call the Spotify api
	function spotifyThisSong(songName) {
	    var songName = process.argv[3];
	    if (!songName) {
	        songName = "The Sign";
	    }
	    params = songName;
	    var spotify = new Spotify({
	        id: "77f5c0a438b04ae4ae718a0a18345910",
	        secret: "ce7385f3fc484a96845fb0a028797b89"
	    });
	    spotify.search({ type: "track", query: params }, function(err, data) {
	        if (err) {
	            console.log("Error occurred: " + err);
	            return;
	        }

	        var queryTracks = [];
	        var spotifyItems = data.tracks.items;

	        for (var i = 0; i < 20; i++) {
	            if (data.tracks.items[i].name == songName) {
	                queryTracks.push(i);
	            }
	        }

	        console.log(queryTracks.length + " tracks found that match your query.");
	        log(queryTracks.length + " tracks found that match your query.");

	        if (queryTracks.length > 0) {
	            console.log("Track: " + spotifyItems[queryTracks[0]].name);
	            console.log("Artist: " + spotifyItems[queryTracks[0]].artists[0].name);
	            console.log("Spotify link: " + spotifyItems[queryTracks[0]].external_urls.spotify);
	            console.log("Album: " + spotifyItems[queryTracks[0]].album.name);

	            // calling log function to write in log.txt
	            log("Track: " + spotifyItems[queryTracks[0]].name);
	            log("Artist: " + spotifyItems[queryTracks[0]].artists[0].name);
	            log("Spotify link: " + spotifyItems[queryTracks[0]].external_urls.spotify);
	            log("Album: " + spotifyItems[queryTracks[0]].album.name);

	        } else if (queryTracks.length == 0) {
	            console.log("Sorry, but spotify does not contain that song in their database :(");
	            log("Sorry, but spotify does not contain that song in their database :(");
	        }
	    });
	}


	// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
	function doWhatItSays() {
	    fs.readFile("random.txt", "utf8", function(error, data) {
	        if (!error) {
	            doWhatItSaysResults = data.split(",");
	            spotifyThisSong(doWhatItSaysResults[1]);
	        } else {
	            console.log("Error occurred" + error);
	        }
	    });
	}

	// Log function uses the reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
	function log(logResults) {
	    fs.appendFile("log.txt", logResults, (error) => {
	        if (error) {
	            throw error;
	        }
	    });
	}