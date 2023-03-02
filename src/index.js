import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 5000 || process.env.PORT;
const clog = console.log;

const headers = {
  'authority': 'quizlet.com',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8',
  'cache-control': 'max-age=0',
  'cookie': 'qi5=ploueh9rp9z7%3AmpDKWe5tLzcQEQgnCJNf; fs=rqtluc; akv=%7B%7D; _gcl_au=1.1.1538915536.1677638102; _gid=GA1.2.470342959.1677638103; afUserId=6d4ea2ab-ecb4-4eda-9e9a-a70035a4c927-p; AF_SYNC=1677638105097; g_state={"i_l":0,"i_t":1677724507555}; qlts=1_sNJm13W4J.0O6--qWvGRTRDOvI4Bhf.8k6TUhOWHu9VHeo74iks1U6gOJyIutjebVDYyvZVQQhBbvQ; _pbjs_userid_consent_data=3524755945110770; _lr_env_src_ats=false; __gads=ID=54e00107faa496fe:T=1677638114:S=ALNI_MbReX3DvAejGxYB-ekV5bNIXAEJZg; __qca=P0-2046461124-1677638116578; pbjs-unifiedid=%7B%22TDID%22%3A%22b127e2f8-0026-4036-b92f-0e0806bf1a8f%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222023-02-01T02%3A35%3A30%22%7D; days_since_last_visit=1; qtkn=V3BN6XxDAKw4wGSSnTh5QF; __cfruid=c244ae55376f7d6a0eb2989f91d5ff876850e83c-1677773928; _cfuvid=S7LFSJmf8aneA1Cmqy2nryaaNZPoXqmbPJ06kvQ4HoI-1677773929000-0-604800000; qmeasure__persistence=%7B%2228%22%3A%2200000100%22%7D; session_landing_page=StudyFeed%2FlatestActivity; ab.storage.deviceId.6f8c2b67-8bd5-42f6-9c5f-571d9701f693=%7B%22g%22%3A%22a5e58cc0-dd6a-7462-2323-58b72f012fa2%22%2C%22c%22%3A1677638110345%2C%22l%22%3A1677773932757%7D; ab.storage.userId.6f8c2b67-8bd5-42f6-9c5f-571d9701f693=%7B%22g%22%3A%22140776491%22%2C%22c%22%3A1677638110337%2C%22l%22%3A1677773932757%7D; has_seen_logged_in_home_page_timestamp=1677773934340; __gpi=UID=00000bce53965f5e:T=1677638114:RT=1677773941:S=ALNI_Mbxjo0SNHqC4UOY31BcCEDYd-B7iw; _lr_geo_location=VN; cto_bundle=-0zPsV9XbnhHSWNUcFdhMHRwbnUzJTJCdUNLJTJCNzkwVjlrWTMxZ1diRlJ6eVoxTE90cFE3RWhkSTkwcURIUjJlVXlMWDJSYTRjbSUyRnREbmk1dTNJRFFzRGpzT1VTU25WeHo2OHRFNkJwS2YxeUUxN0Z2REl1b1RzQVNJM3ZYMWlneSUyQmJPMm5acmFsczg0T0dCZHUlMkJha3BvRFhUVlhnJTNEJTNE; cto_bidid=tuZ0GV9rNDBRRE9kZG9Ddk1YUDVoa2NOV2NLVHhrTldWZGJEWTRRamppJTJCZFhWUW56ZUxFOTJoaUFNQzBLNVFBWWFpMDRPQjFhbHNISXVkMExKV0x3NlElMkZ6dVVZcGEzWGh0SjFlJTJGSnA1ZVB6VktHayUzRA; tsp=set_page; ab.storage.sessionId.6f8c2b67-8bd5-42f6-9c5f-571d9701f693=%7B%22g%22%3A%22345a2960-e780-326c-b236-5cc3491d3e39%22%2C%22e%22%3A1677775900450%2C%22c%22%3A1677773932755%2C%22l%22%3A1677774100450%7D; _ga_BGGDEZ0S21=GS1.1.1677773934.3.1.1677774100.0.0.0; _ga=GA1.1.1620854651.1677638103; app_session_id=3eabccbf-acd9-4e20-9a3c-f334b690d629; __cf_bm=V7MEtnkH9DXamV7FLxl.4.ouAyvMTpEnmNivOpyPUNU-1677778665-0-AaRZSUkhS0LV5DIpSHf+RCxc2jjJ2uWgjWTRx60onNoAL2MJJA94+3u0Lkhjiz1hw5TaokhjpmTG7w2LQYhCy2U=',
  'dnt': '1',
  'sec-ch-ua': '"Microsoft Edge";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1660.14'
}

app.use(bodyParser.json());

app.post('/', (req, res) => {
  let body = req.body;
  if (!body.url) {
    res.json({message: 'Please POST with {"url" : "...."}'});
  } else {
    let url = body.url;
    axios.get(url, {headers}).then((response) => {
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
        status: "OK",
        total: numberOfQuestions,
        data: questions
      }
      res.json(responseData);
    }).catch(err => {
      res.json({status: "Error", message: err.message});
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


