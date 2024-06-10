const express = require('express')
const app = express()
const axios = require('axios');
const bodyParser = require('body-parser');


const { initializeApp, cert } = require('firebase-admin/app');
const admin= require('firebase-admin')
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

const firebaseApp = initializeApp({
credential: admin.credential.cert(serviceAccount)});

const db = getFirestore(firebaseApp);



// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


// login signup page
app.get('/', (req, res) => {
    res.render('login_signup');
});

// login details checking
app.post('/loginsubmit', async function (req, res) {
  var mail_id=req.body.email
  var pass=req.body.pass  
  
  try{
      //for getting the data from collection
      const s=await db.collection("login_form").where('email','==',mail_id).where('password','==',pass).get();
      {
          if(s.empty)
              res.render('unsucessful')
          else
              res.render('home')
      }    
  }
  catch(error)
  {
      console.error("unable to acquire data from the database")
  }
})

// adding new users to database
app.post('/signupsubmit', async function (req, res) {
  const mail_id = req.body.email;
  const pass = req.body.pass;

  try {
      // Check if the user already exists
      const existingUserQuery = await db.collection("login_form").where("email", "==", mail_id).get();
      
      if (!existingUserQuery.empty) {
          // If user exists, check if the password matches
          let userExists = false;
          existingUserQuery.forEach(doc => {
              if (doc.data().password === pass) {
                  userExists = true;
              }
          });

          if (userExists) {
              return res.render('home');
          } else {
              return res.render('unsucessful');
          }
      } 
      else 
      {
          // If user does not exist, add new user
          await db.collection("login_form").add({
              email: mail_id,
              password: pass
          });

          // Verify the newly added user
          const newUserQuery = await db.collection("login_form").where("email", "==", mail_id).get();
          let loginSuccessful = false;
          newUserQuery.forEach(doc => {
              if (doc.data().password === pass) {
                  loginSuccessful = true;
              }
          });

          if (loginSuccessful) {
              return res.render('home');
          } else {
              return res.render('unsucessful');
          }
      }
  } catch (error) {
      console.error("Unable to store data into the database:", error);
      return res.status(500).send("Internal Server Error");
  }
});

//home page
app.get('/home', async(req,res) => {
  res.render('home')
})


//news page 
  const options_news = {
    method: 'GET',
    url: 'https://real-time-news-data.p.rapidapi.com/local-headlines',
    params: {
      query: 'New-York',
      country: 'US',
      lang: 'en',
      limit: '500'
    },
    headers: {
      'x-rapidapi-key': 'd46538e739msh56c8e06cd458440p12b9b6jsn8ebb885f039a',
      'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
    }
  };
  
  
  app.get('/news', async(req,res) => {
  try {
    const response = await axios.request(options_news);
    // console.log(response.data);
    res.render('news_api', { articles: response.data.data });
  } catch (error) {
    console.error(error);
  }
  })
  



//movies page
const options_movies = {
  method: 'GET',
  url: 'https://imdb-top-100-movies.p.rapidapi.com/',
  headers: {
    'x-rapidapi-key': '9cead6ab79mshabc52cecf12332dp11ba14jsnb26e0322b815',
    'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com'
  }
};

app.get('/movies', async(req,res) => {
try {
	const response = await axios.request(options_movies);
	// console.log(response.data);
  res.render('movies_api', { movies: response.data });

} catch (error) {
	console.error(error);
}
})



//tvshows page
const options_tvshows = {
  method: 'GET',
  url: 'https://ott-details.p.rapidapi.com/advancedsearch',
  params: {
    start_year: '1970',
    end_year: '2020',
    min_imdb: '6',
    max_imdb: '7.8',
    genre: 'action',
    language: 'english',
    type: 'movie',
    sort: 'latest',
    page: '1'
  },
  headers: {
    'x-rapidapi-key': 'd46538e739msh56c8e06cd458440p12b9b6jsn8ebb885f039a',
    'x-rapidapi-host': 'ott-details.p.rapidapi.com'
  }
};


app.get('/tvshows', async (req, res) => {
try {
const response = await axios.request(options_tvshows);
// console.log(response.data);
  res.render('tvshows_api', { shows: response.data.results });

} catch (error) {
console.error(error);
}
})


app.listen(3000, function(){
    console.log("Server is running on http://localhost:3000/")
})

