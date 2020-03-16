const url = 'https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json';
const apikey = 'd5e44ddd8ccf4615bf04c364515a0c62';


async function getData(){
  const response =  await fetch(url);
  const data = await response.json();
  console.log(data);
  return data
}

async function getRegions(){
    const data = await getData();
    const regions = data[0].regions.map(region => region.name);

    regions.forEach(region => {
   const option = document.createElement("option");
   option.innerHTML = region;
    document.getElementById("select-region").appendChild(option);
});
}

async  function getCities(cities){
    document.getElementById('select-city').innerHTML = "";
    cities.forEach( city =>{
       const option = document.createElement("option");
        option.innerHTML = city.name;
        document.getElementById("select-city").appendChild(option);
    })
}

async function setRegions(select){
    const selectedregion = select.options[select.selectedIndex].innerHTML;
    const data = await getData();
    const filteredregion = data[0].regions.filter(region => region.name === selectedregion);
     getCities(filteredregion[0].cities);
}
function activeButton(){
    document.getElementById("button").disabled = false;
}
function kelvintoCelcius(temp){
    return Math.round( (( temp - 273 ) * 100) / 100);
}

 function getoutDate(weatherdata){
    document.getElementById("data").innerHTML = "";
    document.getElementById("date").innerHTML = "";

    const today = new Date();
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + (document.getElementById('select-date').selectedIndex - 1));
    const selectedDay = selectedDate.getDate();
    console.log(selectedDay);

    const divdate = document.createElement('div');
    divdate.innerHTML = selectedDate.toLocaleDateString();
    document.getElementById('date').appendChild(divdate);

    weatherdata.list.forEach(currentWeather => {
        
        const unixTimestamp = currentWeather.dt;
        const currentWeatherDay = new Date(unixTimestamp * 1000).getDate();
        console.log(currentWeatherDay);
        const p = document.createElement('p');
        const div = document.createElement('div');
        const span = document.createElement('span');
        const img = document.createElement("img");

        if (selectedDay === currentWeatherDay) {
                img.src = `https://openweathermap.org/img/wn/${currentWeather.weather[0]["icon"]}@2x.png`;
                const datetime = new Date(unixTimestamp * 1000).toLocaleString().split(',');
                const time = datetime[1].split(':');
                p.innerHTML = time[0] + ':' + time[1];
            span.innerHTML = kelvintoCelcius(currentWeather.main.temp_min)
                +'&deg;'
                + '...'
                + kelvintoCelcius(currentWeather.main.temp_max)
                +'&deg;'
                document.getElementById('data').appendChild(div).appendChild(p);
                document.getElementById('data').appendChild(div).appendChild(img);
                document.getElementById('data').appendChild(div).appendChild(span);
                div.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 5px;
                border-radius: 10px;
                box-shadow: 2px 2px 0 #a4a9b5, -2px -2px 0 #a4a9b5;
            `
                p.style.cssText = `
                text-align: center`
        }
    });

}
 
async function getWeather(){
    const cityid = document.getElementById("select-city");
    const city = cityid.options[cityid.selectedIndex].innerHTML;
    const apiurl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
    const data = await fetch(apiurl);
    const weatherdata = await data.json();
    console.log(weatherdata);
    if(weatherdata.cod === "200"){
        getoutDate(weatherdata);
    }
    else{
        document.getElementById("data").innerHTML = "";
        const p = document.createElement("p");
        p.innerHTML = "Error";
        document.getElementById("data").appendChild(p);

    }
}



getRegions();
