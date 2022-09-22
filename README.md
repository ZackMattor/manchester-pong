# manchester-pong
This codebase consists of the frontend and backend code required to run and host an interactive Pong Game for public spaces. It is written in NodeJS with the VueJS framework and uses websockets to stream the controls to the display screen.

It was originaly started to celebrate the life of [Ralph H. Baer](https://en.wikipedia.org/wiki/Ralph_H._Baer) who is considered "the Father of Video Games". He was born March 8, 1922 in Rodalben, Palatinate, Germany and was an avid inventor and tinkerer. Just before WWII he fled to the United States and settled in Manchester NH where he started playing around with video game technologies. One of his inventions was the arcade clasic "Table Tennis" which was later called "Pong" which is what the inspiriation for the game here came from.

The Idea for this version of Pong was for people walking down the streets of manchester to jump in and play a game of Pong with a friend. We wanted to put a large screen in a window and allow people able to walk by and use their phones to connect to the game and start playing.

Go [HERE](https://pong.zackmattor.com/test.html) to try out the test / framed version (easier to try because you don't need two mobile phones)

Go [HERE](https://pong.zackmattor.com/game) to try try out the full version! NOTE - It's build for a 1080 screen flipped on it's side so you might need to zoom out to see the whole screen.

![alt text](https://i.imgur.com/Ykx4YOt.gif)


# Technical Stuff

## Requirements
 - Node 16+

## Getting Started
To get started run the following commands...

1. install the NodeJS dependencies.
```
  npm install
```

2. Start the webpack builder.
```
  ./node_modules/.bin/webpack --watch --progress
```

3. Run the servers for frontend and backend.
```
  npm run dev
  node src/server
```

4. Visit the following link to see the game in the "test" view.
http://localhost:8080/src/web_display_test.html
