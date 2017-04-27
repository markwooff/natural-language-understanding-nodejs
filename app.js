/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const app = express();
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const nlu = new NaturalLanguageUnderstandingV1({
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
});

// setup body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Bootstrap application settings
require('./config/express')(app);


app.get('/', function(req, res) {
  res.render('index');
});

app.post('/api/analyze', function(req, res, next) {
  nlu.analyze(req.body, (err, results) => {
    if (err) {
      return next(err);
    } else {
      res.json({ query: req.body.query, results });
    }
  });
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
