$(document).ready(function(){  
	$.get('https://api.openweathermap.org/data/2.5/forecast?id=703448&units=metric&lang=ua&APPID=fd67a390d12405e06869f5d1fe3504cd', function(data1){
		$('#name').text(data1.city.name)
		$('#humidity>span').text(data1.list[0].main.humidity)
		$('#temp>span').text(data1.list[0].main.temp) 
		$('#temp_max>span').text(data1.list[0].main.temp_max) 
		$('#temp_min>span').text(data1.list[0].main.temp_min)
		$('#wind_deg>span').text(data1.list[0].wind.deg)
		$('#wind_speed>span').text(data1.list[0].wind.speed)
		$('#weather_desc>span').text(data1.list[0].weather[0].description)
// 		$('#weather_main>span').text(data1.list[0].weather[0].main)
		$('#icon>span').text(data1.list[0].weather[0].icon)
		$('#clouds>span').text(data1.list[0].clouds.all)	
      var date = timestamp2date(data1.list[0].dt)
		var day = Number(date.slice(6,8))
		var month = getMonth(date.slice(8,11))
        var DayOfWeek = getDayOfWeek(date.slice(0, 3))
		$('.days').eq(0).find('.date>span').text(day + ' ' + month)
		$('.days').eq(0).find('img').attr('src', 'http://openweathermap.org/img/w/' + data1.list[0].weather[0].icon + '.png')
		$('.days').eq(0).find('.day-name').text(DayOfWeek)
        getfiveDays(day, month, DayOfWeek)
        console.log(data1)
        function searchIndexNext(){
          for (var i=0; i<11; i++){
            var pp = data1.list[i].dt_txt.slice(8,10)
            if (data1.list[i].dt_txt.slice(8,10) !== data1.list[0].dt_txt.slice(8,10)){
              break;
            }
          }
          return i
        }
      
       function getMinTempToday(ind) {
  var num=Number(data1.list[0].main.temp_min)
  for (var i=1; i < ind;i++){
      if (num>Number(data1.list[i].main.temp_min)){
        num=Number(data1.list[i].main.temp_min)
      }
  }
  return num
}
      function getMaxTempToday(ind) {
  var num=Number(data1.list[0].main.temp_max)
  for (var i=1; i < ind;i++){
      if (num<Number(data1.list[i].main.temp_max)){
        num=Number(data1.list[i].main.temp_max)
      }
  }
  return num
}

      
      function getMinTemp(ind) {
  var num=Number(data1.list[ind].main.temp_min)
  for (var i=ind; i < ind+8;i++){
      if (num>Number(data1.list[i].main.temp_min)){
        num=Number(data1.list[i].main.temp_min)
      }
  }
  return num
}
      function getMaxTemp(ind) {
  var num=Number(data1.list[ind].main.temp_max)
  for (var i=ind; i < ind+8;i++){
      if (num<Number(data1.list[i].main.temp_max)){
        num=Number(data1.list[i].main.temp_max)
      }
  }
  return num
}

      function sendTempIcon(ind){
        $('.days').eq(0).find('.temp-max').text(getMaxTempToday(ind))
        $('.days').eq(0).find('.temp-min').text(getMinTempToday(ind))
      for (var i=0; i<4; i++){
        var dopInd = ind + 8*i
        $('.days').eq(i+1).find('.temp-max').text(getMaxTemp(dopInd))
        $('.days').eq(i+1).find('.temp-min').text(getMinTemp(dopInd))
        $('.days').eq(i+1).find('img').attr('src', 'http://openweathermap.org/img/w/'+ geticon(dopInd) +'.png')
       
       }
      }
           sendTempIcon(searchIndexNext())
           
           function geticon(ind) {
  var arr = []
  for (var i=ind; i < ind+8;i++){
      arr.push(data1.list[i].weather[0].icon)
  }
      arr.sort()
      if (arr[7]=='01n'){
        return '01d'
      } else if (arr[7]=='02n'){
        return '02d'
        } else if (arr[7]=='10n'){
        return '10d'
      } else {
  return arr[7]
      }
}
      
	});
})




function arrDays(day){
	var arr = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"]
	var arr1 = []
	for (var i = arr.indexOf(day); i<7; i++){
		arr1.push(arr[i])
	}
	for (var j = 0; j<arr.indexOf(day); j++){
		arr1.push(arr[j])
	}
	return arr1
}

function timestamp2date(timestamp) { 
	var theDate = new Date(timestamp * 1000); 
	return theDate.toGMTString(); 
}

function getfiveDays(today, month, nameday){
	for (var i = 1; i < 5; i++) {
		$('.days').eq(i).find('.date>span').text(Number(today) + Number(i) + ' ' + month)	
		$('.days').eq(i).find('.day-name').text(arrDays(nameday)[i])
	}		
}

function getDayOfWeek(number){
	switch (number) {
		case 'Mon':
		return 'пн';
		case 'Tue':
		return 'вт';
		case 'Wed':
		return 'ср'
		case 'Thu':
		return 'чт';
		case 'Fri':
		return 'пт';
		case 'Sat':
		return 'сб';
		case 'Sun':
		return 'нд';
	}
}

function getMonth(number){
	switch (number) {
		case 'Jan':
		return 'січня';
		case 'Feb':
		return 'лютого';
		case 'Mar':
		return 'березня';
		case 'Apr':
		return 'квітня';
		case 'May':
		return 'травня';
		case 'Jun':
		return 'червня';
		case 'Jul':
		return 'липня';
		case 'Aug':
		return 'серпня';
		case 'Sep':
		return 'вересня';
		case 'Oct':
		return 'жовтня';
		case 'Nov':
		return 'листопада';
		case 'Dec':
		return 'грудня';
	}
}


$('.city').click(function(){  
	var id = $(this).data('id')
	$.get('https://api.openweathermap.org/data/2.5/weather?id=' + id +'&units=metric&lang=ua&APPID=6324127f0373b5e57bf4ca57ff788093', function(data){
		$('#name').text(data.name) 
		$('#humidity>span').text(data.main.humidity)
		$('#temp>span').text(data.main.temp)
		$('#temp_max>span').text(data.main.temp_max)
		$('#temp_min>span').text(data.main.temp_min)
		$('#weather_main>span').text(data.weather.main)
		$('#wind_deg>span').text(data.wind.deg)
		$('#wind_speed>span').text(data.wind.speed)
		$('#weather_desc>span').text(data.weather[0].description)
		$('#weather_main>span').text(data.weather[0].main)
		$('#icon>span').text(data.weather[0].icon)
		$('#clouds>span').text(data.clouds.all)
	}); 
})