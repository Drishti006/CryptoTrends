import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

const api_key ="x_cg_demo_api_key=";
const yourAPI_KEY = "CG-LUQUJ4ypWjctUvzNwHSKD7eJ"
const API_URL = "https://api.coingecko.com/api/v3/";

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));




app.get("/", async (req,res)=>{
    try {
        const response = await axios.get(API_URL + "search/trending" )
        const coins = response.data.coins;
        const topCoins = coins.filter(c => c.item.score < 5);
        res.render("index.ejs",{
            coin: topCoins,
            index:-1,
            final:null,
            important:null
        })
    } catch (error) {
        console.log(error.message)
    }
})




app.get('/coin-details/:index', async(req, res) => {
    const index = parseInt(req.params.index);
    try {
        const response = await axios.get(API_URL + "search/trending" )
        const coins = response.data.coins;
        const topCoins = coins.filter(c => c.item.score < 5);
        const changeData = topCoins[index]?.item?.data?.price_change_percentage_24h;
        const change = changeData?.usd !== undefined ? changeData.usd.toFixed(2) + "%" : "N/A";
        res.render('index.ejs', {
        change,
        coin:topCoins,
        final:null,
        important:coins[index].item
        });
    } catch (error) {
        res.render("index.ejs",{
            coin:null,
            index:-1
        })
    }
    
});

app.post("/search", async (req, res) => {
  const query = req.body.search || "";
  try {
    const response = await axios.get(API_URL + "search?query=" + query);
    console.log(response.data)
    res.render("index.ejs",{
        coin:null,
        returndata: response.data,
        final:null
    })
  } catch (error) {
    console.log(error.message)
  }

});

app.get("/search-coin-details/:index", async (req,res)=>{
    const query = req.params.index;
    console.log(query)
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${query}`)
        const coin = response.data;
        res.render("index.ejs",{
            final:coin,
            coin:null,
            index:-1,
            returndata:null
        })
    } catch (error) {
        console.log("hehe")
    }
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})