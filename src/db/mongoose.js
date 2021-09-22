const mongoose = require('mongoose');

const connectionURL =
  'mongodb+srv://ryanjt:radsRbad937!@botcracy.jhozv.mongodb.net/botcracy?retryWrites=true&w=majority';

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
});
