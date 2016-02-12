# Youtube mp3 downloader
Youtube mp3 downloader is Node Webkit app, hacked together from ffmpeg module, Angular library and Materialize stylesheet. Source code and setup is available from that repository, including instructions how to build your own from source code. Code is licenced under GNU GPL v3.0, LICENCE file is checked in for your reading pleasures. 

# How does it work?
Start by installing and running the app. Copy-paste example songs from example.txt to quick start or start by manually adding songs. Song urls are automatically retrieved from Youtube search as well as thumbnail urls but both can be overwritten manually. Once you are satisfied with songs, select download folder and start downloading.

## Quick note on Youtube search
Inbuild Youtube search is using default Youtube search and returns first video that matches query. Query is composed as artist - title (tags), if any part of data is missing, it will just skip it when constructing query. Inbuild Youtube search might return different results than your private personalised Youtube search, if you are dissatisfied with results, manually correct it.

## How are songs saved?
Each song is saved with filename "artist - title (tags).mp3" and ffmpeg library takes care song metadata are saved as well. That means if you open song in any modern media player, artist and title shown will be the same as in app. Embedded thumbnail of Youtube video is an added bonus, isn't it?

Now go and download Youtube!

# Developer stuff
Node-webkit library is checked in, you don't need to download it separately. I'm using Webstorm and I suggest you to do the same, just choose Node-Webkit configuration and point "NW.js interpreter" to nwjs-v0.12.3-win-x64\nw.exe. Voila! Otherwise refer that [guide](https://github.com/nwjs/nw.js/#quick-start).

## How to build from source
1. Run ``gulp build`` from project root
2. Install Inno and run setup.iss
3. Replace Source Paths with correct one and build 
4. **(Note)** Checked-in NW library has modified icon and if you use it to build app, built app will also use that icon