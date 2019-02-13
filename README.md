# manchester-pong
This codebase consists of the frontent and backend code required to run and host an interactive Pong Game for public spaces. It was originaly started to celibrate the life of [Ralph H. Baer](https://en.wikipedia.org/wiki/Ralph_H._Baer) who is considered "the Father of Video Games".

## Requirements
 - Node 10.X

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
