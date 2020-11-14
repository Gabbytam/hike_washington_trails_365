const puppeteer= require('puppeteer'); //to be able to use xpath to datascrape
const fs= require('fs'); //to write data into json file 

let allHikes= [];
const hikeURLs= ['https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=60&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=90&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=120&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=180&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=', 'https://www.wta.org/go-outside/hikes/hike_search?sort=mileage&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=90&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=3000', 'https://www.wta.org/go-outside/hikes/hike_search?sort=mileage&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=870&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=3000', 'https://www.wta.org/go-outside/hikes/hike_search?title=&region=all&subregion=all&features%3Alist=Fall+foliage&rating=0&mileage%3Alist%3Afloat=0.0&mileage%3Alist%3Afloat=25&elevationgain%3Alist%3Aint=0&elevationgain%3Alist%3Aint=5000&highpoint=&searchabletext=&sort=rating&filter=Search', 'https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&features:list=Fall%20foliage&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint='];

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
            const dist = await txt1.jsonValue();
    
            const [el2] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[1]/a/span`);
            const txt = await el2.getProperty('textContent');
            const title = await txt.jsonValue();

            const [el4] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[1]/h3`);
            const txt3 = await el4.getProperty('textContent');
            const region = await txt3.jsonValue();

            const [el5] = await page.$x(`//*[@id="search-result-listing"]/div[${i}]/div/div[3]/div[4]`);
            const txt4 = await el5.getProperty('textContent');
            let summary = await txt4.jsonValue();
            summary = await summary.substring(13, summary.length-9);

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
                    allHikes.push({imgUrl, title, height, dist, region, summary});
                }
            }
            //console.log({imgUrl, title, height});
        }
        console.log(allHikes.length);
        //console.log(allHikes);

        //put data into json file, writeFileSync overwrites data in file so the final round will contain the final version of allHikes array
        fs.writeFileSync('./hikeData.json', JSON.stringify(allHikes));
        
        browser.close();
    } catch(err) {
        console.log('error', err);
    }
}

//function that will call scrapeProduct function for each of the hikeURLs 
function getAllHikes(){
    for(hikeURL of hikeURLs){
        scrapeProduct(hikeURL);
    }
    //scrapeProduct('https://www.wta.org/go-outside/hikes/hike_search?sort=rating&rating=0&mileage:float:list=0.0&mileage:float:list=25.0&features:list=Fall%20foliage&features:list=Wildflowers/Meadows&title=&region=all&searchabletext=&filter=Search&subregion=all&b_start:int=30&elevationgain:int:list=0&elevationgain:int:list=5000&highpoint=');
}


//call getAllHikes()
getAllHikes();
// console.log('ALL THE HIKES', all);


