//THIS FILE ORIGINALLY SCRAPED DATA, SENT DATA TO A JSON FILE AND THEN A FILE sendToDb.js AND THAT FILE WAS ABLE TO READ JSON DATA AND INSERT INTO THE hike DATABASE
//THE FILE HAS SINCE BEEN CONVERTED TO SKIP OVER THE JSON WRITE AND READ STEPS AND INSTEAD SEND FROM THE DATABASE HERE

const puppeteer= require('puppeteer'); //to be able to use xpath to datascrape
const fs= require('fs'); //to write data into json file 
const db= require('../models');
const hike = require('../models/hike');
process.setMaxListeners(0); //line of code used to avoid eventEmitter memory leak error 

// const hikeURLs= ['https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=344281caae0d5e845a5003400c0be9ef&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=344281caae0d5e845a5003400c0be9ef&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint='];

let allHikes= [];
const hikeURLs= ['https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=90&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=120&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=180&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=mileage&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=90&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=3000', 'https://www.wta.org/go-outside/hikes/hike_search?sort=mileage&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=870&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=3000', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=all&subregion=all&features%3Alist=Fall+foliage&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&features:list=Fall%20foliage&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=49aff77512c523f32ae13d889f6969c9&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=1500&searchabletext=&sort=&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=49aff77512c523f32ae13d889f6969c9&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=49aff77512c523f32ae13d889f6969c9&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=0c1d82b18f8023acb08e4daf03173e94&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=0c1d82b18f8023acb08e4daf03173e94&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=04d37e830680c65b61df474e7e655d64&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=04d37e830680c65b61df474e7e655d64&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=04d37e830680c65b61df474e7e655d64&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=b4845d8a21ad6a202944425c86b6e85f&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=b4845d8a21ad6a202944425c86b6e85f&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=b4845d8a21ad6a202944425c86b6e85f&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=592fcc9afd9208db3b81fdf93dada567&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=344281caae0d5e845a5003400c0be9ef&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=344281caae0d5e845a5003400c0be9ef&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=344281caae0d5e845a5003400c0be9ef&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=922e688d784aa95dfb80047d2d79dcf6&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=922e688d784aa95dfb80047d2d79dcf6&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=8a977ce4bf0528f4f833743e22acae5d&subregion=all&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=8a977ce4bf0528f4f833743e22acae5d&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=8a977ce4bf0528f4f833743e22acae5d&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=1500', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=90&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=1500', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=150&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=1500'];

//write async function that will give us await functionality 
async function scrapeProduct(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); //get rid of timeout error
        await page.goto(url);
    
        //there are 30 hikes listed per page (30 different divs) so we loop through them 
        for(let i = 1; i <= 30; i++){
            //NOTE:
            //page is our open page, .$x is our puppeteer selector that allows us to select an item on the page by x path
            //xpath is a way to navigate through a page 
            const [el] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[2]/div/div/a/img`); //path comes from inspect tool --> copy --> copy xpath
            const src = await el.getProperty('src');
            const imgUrl = await src.jsonValue();

            const [el1] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[3]/div[2]/div[1]/div[1]/span`);
            const txt1 = await el1.getProperty('textContent');
            const distance = await txt1.jsonValue();
    
            const [el2] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[1]/a/span`);
            const txt = await el2.getProperty('textContent');
            const title = await txt.jsonValue();

            const [el4] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[1]/h3`);
            const txt3 = await el4.getProperty('textContent');
            const region = await txt3.jsonValue();

            const [el5] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[3]/div[4]`);
            const txt4 = await el5.getProperty('textContent');
            let description = await txt4.jsonValue();
            description = await description.substring(13, description.length-9); //when data scraped, description includes lots of spaces, this line of code cuts it out 

            const [el3]= await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[3]/div[2]/div[1]/div[3]/span`);
            let txt2;
            let height;
            //some of the hikes do not have a hight point, to skip over those we check if its equal to undefined or includes 'vote'
            if(el3 != undefined){
                //only set variables if the value is not undefined
                txt2= await el3.getProperty('textContent');
                height= await txt2.jsonValue();
                //double check to make sure its including the info we want, info that includes 'vote' is unwanted 
                if(!(height.includes('vote'))){
                    //push object of info into winterHikes array
                    allHikes.push({title, region, imgUrl, height, distance, description});
                }
            }
            //console.log({imgUrl, title, height});
        }
        console.log(allHikes.length);
        //console.log(allHikes);

        //put data into json file, writeFileSync overwrites data in file so the final round will contain the final version of allHikes array
        //fs.writeFileSync('./hikeData.json', JSON.stringify(allHikes));
        console.log('length from inside scrapeProduct function', allHikes.length);
        
        browser.close();
    } catch(err) {
        console.log('error', err);
    }
}

//function that will call scrapeProduct function for each of the hikeURLs 
//made into a async function so that when we bulkCreate it will do so with the allHikes array this is filled entirely 
async function getAllHikes(){
    try {
        for(hikeURL of hikeURLs){
            await scrapeProduct(hikeURL);
        }
        console.log('length from getAllHikes async function', allHikes.length);
        //console.log(allHikes);
        //does not reach this part until the for of loop is completed, will have access to the fully filled/final version of allHikes array and can now attempt a bulkCreate

        //bulk create takes an array of items 
        for(let hikeData of allHikes){
            db.hike.findOrCreate({
                where: {title: hikeData.title},
                defaults: {
                    region: hikeData.region,
                    imgUrl: hikeData.imgUrl,
                    height: hikeData.height,
                    distance: hikeData.distance,
                    description: hikeData.description
                }
            })
            .then(([foundOrCreated, created])=> {
                console.log('HIKE', foundOrCreated);
                console.log('created', created);
            })
        }
    } catch(err) {
        console.log('getAllHikes error', err);
    } 
}

//call getAllHikes()
getAllHikes();
// console.log('ALL THE HIKES', all);


