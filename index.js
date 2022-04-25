import express from "express";
import cors from "cors";
const app = express();

let user = [];
let tweets = [];

app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.post("/sign-up", (req, res) => {
  let username = req.body.username;
  let avatar = req.body.avatar;
  if (!username || !avatar) {
    res.status(400).send("Todos os campos são obrigatórios!");
  } else if (avatar && username) {
    user.push({ username: username, avatar: avatar });
    res.status(201).send("OK");
  }
});

app.post("/tweets", (req, res) => {
  let infosUser = user.find((element) => element.username === req.headers.user);

  if (!infosUser || req.body.tweet === "") {
    res.status(404).send("Preencha os campos corretamente!!!");
  } else {
    tweets.push({
      username: infosUser.username,
      avatar: infosUser.avatar,
      tweet: req.body.tweet,
    });
    res.status(201).send("OK");
  }
});

app.get("/tweets", (req, res) => {
  if (req.query.page >= 2 || tweets.length >= 10) {
    if (req.query.page * 10 >= tweets.length) {
      res.status(400).send("Informe uma página válida!");
      return;
    }
    let tweetStart = req.query.page * 10 - 10;
    let tweetsToSend = [];

    while (tweetStart < parseInt(req.query.page) * 10) {
      tweetStart++;

      console.log(tweetsToSend);
      tweetsToSend.push(tweets[tweetStart]);
    }
    res.send(tweetsToSend);
  } else {
    if (tweets.length >= 10) {
      let send10Tweets = [];
      for (let index = 0; index < 10; index++) {
        send10Tweets.push(tweets[index]);
      }
      res.send(send10Tweets);
    } else {
      res.send(tweets);
    }
  }
});

app.get("/tweets/:username", (req, res) => {
  let userTweets = [];
  for (let index = 0; index < tweets.length; index++) {
    if (tweets[index].username === req.params.username) {
      userTweets.push(tweets[index]);
    }
  }
  res.send(userTweets);
});

app.listen(5000);
