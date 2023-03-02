import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 5000 || process.env.PORT;
const clog = console.log;

app.use(bodyParser.json());

app.post('/', (req, res) => {
  let body = req.body;
  if (!body.url) {
    res.json({message: 'Please POST with {"url" : "...."}'});
  } else {
    let url = body.url;
    axios.get(url).then((response) => {
      let data = response.data;
      let $ = cheerio.load(data);
      let rawData = $('#__NEXT_DATA__').text();
      let jsonData = JSON.parse(rawData);
      let dehydratedReduxStateKey = jsonData.props.pageProps.dehydratedReduxStateKey;
      jsonData = JSON.parse(dehydratedReduxStateKey);
      let rawQuestions = jsonData.setPage.termIdToTermsMap;
      let questions = []
      for (let i in rawQuestions) {
        let qc = {word: rawQuestions[i].word, definition: rawQuestions[i].definition}
        questions.push(qc);
      }
      let numberOfQuestions = questions.length;
      let responseData = {
        total: numberOfQuestions,
        data: questions
      }
      res.json(responseData);
    });
  }
});

app.get('/', (req, res) => {
  res.json({message: 'Please POST with {"url" : "...."}'});
})

app.listen(PORT, (err) => {
  if (err) {
    clog(err.message);
  } else {
    clog(`Listen on port http://localhost:${PORT}`);
  }
})


