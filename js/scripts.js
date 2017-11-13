$(document).ready(function(){  
	$.get('https://api.openweathermap.org/data/2.5/forecast?id=703448&units=metric&lang=ua&APPID=fd67a390d12405e06869f5d1fe3504cd', function(data1){
		$('#humidity>span').text(data1.list[0].main.humidity)
		$('.temp>span').text(Math.round(data1.list[0].main.temp))
		$('#temp_max>span').text(getMaxTemp(searchIndexNext(), 0)) 
		$('#temp_min>span').text(getMinTemp(searchIndexNext(), 0))
		$('#wind_deg>span').text(data1.list[0].wind.deg)
		$('#wind_speed>span').text(data1.list[0].wind.speed)
		$('.weather_desc>span').text(data1.list[0].weather[0].description)
		$('#icon>span').text(data1.list[0].weather[0].icon)
		$('#clouds>span').text(data1.list[0].clouds.all)	
		$('img.main-img').attr('src', 'images/' + data1.list[0].weather[0].icon + '.png')
		var date = timestamp2date(data1.list[0].dt)
		var day = Number(date.slice(5,7))
		var month = getMonth(date.slice(8,11))
		var DayOfWeek = getDayOfWeek(date.slice(0, 3))
		
		function getfiveDays(today, month, nameday){
			/* -- виведення дат на 5 днів та даних на сьогодні в sidebar -- */
			$('.days').eq(0).find('.date>span').text(today + ' ' + month)
			$('.days').eq(0).find('img').attr('src', 'images/' + data1.list[0].weather[0].icon + '.png')
			$('.days').eq(0).find('.day-name').text(nameday)
			for (var i = 1; i < 5; i++) {
				$('.days').eq(i).find('.date>span').text(Number(today) + Number(i) + ' ' + month)	
				$('.days').eq(i).find('.day-name').text(arrDays(nameday)[i])
			}		
		}
		
		getfiveDays(day, month, DayOfWeek)
		
		function searchIndexNext(){
			/* -- в масиві годин шукаемо індекс з якого починається інформація на завтрашній день  -- */
			for (var i=0; i<11; i++){
				if (data1.list[i].dt_txt.slice(8,10) !== data1.list[0].dt_txt.slice(8,10)){
					break;
				}
			}
			return i
		}
		
		function getMinTemp(ind, value) {
			/* -- шукаємо мінімальні температури на сьогодні і наступні дні -- */
			if (value == 0) {
				var num=Number(data1.list[0].main.temp_min)
				for (var i=1; i < ind;i++){
					if (num>Number(data1.list[i].main.temp_min)){
						num=Number(data1.list[i].main.temp_min)
					}
				}
			} else {
				var num=Number(data1.list[ind].main.temp_min)
				for (var i=ind; i < ind+8;i++){
					if (num > Number(data1.list[i].main.temp_min)){
						num=Number(data1.list[i].main.temp_min)
					}
				}
			}
			return Math.round(num)
		}
		
		function getMaxTemp(ind, value) {
				/* -- шукаємо максимальні температури на сьогодні і наступні дні -- */
			if (value == 0) {
				var num=Number(data1.list[0].main.temp_max)
				for (var i=1; i < ind;i++){
					if (num < Number(data1.list[i].main.temp_max)){
						num = Number(data1.list[i].main.temp_max)
					}
				}
			} else {
				var num = Number(data1.list[ind].main.temp_max)
				for (var i = ind; i < ind+8; i++){
					if (num < Number(data1.list[i].main.temp_max)){
						num = Number(data1.list[i].main.temp_max)
					}
				}
			}
			return Math.round(num)
		}
		
		function sendTempIcon(ind){
				/* -- виводимо температури та іконки в sidebar -- */
			$('.days').eq(0).find('.temp-max>span').text(getMaxTemp(ind, 0))
			$('.days').eq(0).find('.temp-min>span').text(getMinTemp(ind, 0))
			for (var i=0; i<4; i++){
				var dopInd = ind + 8*i
				$('.days').eq(i+1).find('.temp-max>span').text(getMaxTemp(dopInd, 1))
				$('.days').eq(i+1).find('.temp-min>span').text(getMinTemp(dopInd, 1))
				$('.days').eq(i+1).find('img').attr('src', 'images/'+ geticon(dopInd) +'.png')
			}
		}
		sendTempIcon(searchIndexNext())
		
		function geticon(ind) {
				/* -- шукаємо найгіршу погоду за день -- */
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
		
		function  fillDataCurrentDay(){
			/* -- заповнюємо набличку на сьогодні -- */
			var k
			switch (data1.list[0].dt_txt.slice(11,16)) {
				case '00:00':
				k = '1';
				break;
				case '03:00':
				k = '2';
				break;
				case '06:00':
				k = '3';
				break;
				case '09:00':
				k = '4';
				break;
				case '12:00':
				k = '5';
				break;
				case '15:00':
				k = '6';
				break;
				case '18:00':
				k = '7';
				break;
				case '21:00':
				k = '8';
				break;
			}
			var l = 0
			for (var i=k; i<9; i++){
				$('table:eq(0) tr:eq(2) td img').eq(i-1).attr('src', 'images/' + data1.list[l].weather[0].icon + '.png')
				$('table:eq(0) tr:eq(3) td').eq(i).text(Math.round(data1.list[l].main.temp))
				$('table:eq(0) tr:eq(4) td').eq(i).text(Math.round(data1.list[l].main.pressure))
				$('table:eq(0) tr:eq(5) td').eq(i).text(Math.round(data1.list[l].clouds.all))
				$('table:eq(0) tr:eq(6) td').eq(i).text(Math.round(data1.list[l].main.temp))
				$('table:eq(0) tr:eq(7) td').eq(i).text(Math.round(data1.list[l].wind.speed))
				l++
			}
		}
		
		fillDataCurrentDay()
		
		function  fillDataNextDay(ind, tableInd){
			/* -- заповнюємо набличку на наступні дні -- */
			for (var i=0; i< 8; i++){
				$('table').eq(tableInd).find('tr:eq(2) td img').eq(i).attr('src', 'images/' + data1.list[ind+i].weather[0].icon + '.png')
				$('table').eq(tableInd).find('tr:eq(3) td').eq(i+1).text(Math.round(data1.list[ind+i].main.temp))
				$('table').eq(tableInd).find('tr:eq(4) td').eq(i+1).text(Math.round(data1.list[ind+i].main.pressure))
				$('table').eq(tableInd).find('tr:eq(5) td').eq(i+1).text(Math.round(data1.list[ind+i].clouds.all))
				$('table').eq(tableInd).find('tr:eq(6) td').eq(i+1).text(Math.round(data1.list[ind+i].main.temp))
				$('table').eq(tableInd).find('tr:eq(7) td').eq(i+1).text(Math.round(data1.list[ind+i].wind.speed))
			}
		}
		fillDataNextDay(searchIndexNext(), 1)
		fillDataNextDay(searchIndexNext()+8, 2)
		fillDataNextDay(searchIndexNext()+16, 3)
		fillDataNextDay(searchIndexNext()+24, 4)
	});
})


$('.date').click(function(){
	$('table').hide()
	$('.date').removeClass('active') 
	$(this). addClass('active')
	$('#' + $(this).data('target')).show()  
	if ($(this).data('target') !== 'table0'){
		$('.main-info').addClass('hide')
		$('.weather_desc').addClass('hide')
		}else{
		$('.main-info').removeClass('hide')
		$('.weather_desc').removeClass('hide')
	}  
})

$('.show-cities').click(function(){
	/* ---- в моб версії відкриття і закриття списка при кліку на "міста" ---- */
	$('.list-cities').toggleClass('show hide')
})

function arrDays(currentday){
	/* -- сортуємо назви днів в залежності від сьогоднішнього дня -- */
	var arr = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"]
	var arr1 = []
	for (var i = arr.indexOf(currentday); i<7; i++){
		arr1.push(arr[i])
	}
	for (var j = 0; j<arr.indexOf(currentday); j++){
		arr1.push(arr[j])
	}
	return arr1
}

function timestamp2date(timestamp) { 
	var theDate = new Date(timestamp * 1000); 
	return theDate.toGMTString(); 
}



function getDayOfWeek(number){
	/* -- умова вибору назв днів -- */
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
	/* -- умова вибору назв місяців -- */
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
	var nameCity = $(this).data('name')
	var id = $(this).data('id')
	$('.list-cities').removeClass('show').addClass('hide')
	$.get('https://api.openweathermap.org/data/2.5/forecast?id=' + id +'&units=metric&lang=ua&APPID=fd67a390d12405e06869f5d1fe3504cd', function(data1){
		$('.title').text(nameCity)
		$('#humidity>span').text(data1.list[0].main.humidity)
		$('.temp>span').text(Math.round(data1.list[0].main.temp))
		$('#temp_max>span').text(Math.round(getMaxTemp(searchIndexNext(), 0)))
		$('#temp_min>span').text(Math.round(getMinTemp(searchIndexNext(), 0)))
		$('#wind_deg>span').text(data1.list[0].wind.deg)
		$('#wind_speed>span').text(data1.list[0].wind.speed)
		$('.weather_desc>span').text(data1.list[0].weather[0].description)
		$('#icon>span').text(data1.list[0].weather[0].icon)
		$('#clouds>span').text(data1.list[0].clouds.all)	
		$('img.main-img').attr('src', 'images/' + data1.list[0].weather[0].icon + '.png')
		var date = timestamp2date(data1.list[0].dt)
		var day = Number(date.slice(5,7))
		var month = getMonth(date.slice(8,11))
		var DayOfWeek = getDayOfWeek(date.slice(0, 3))
		
		function getfiveDays(today, month, nameday){
			/* -- виведення дат на 5 днів та даних на сьогодні в sidebar -- */
			$('.days').eq(0).find('.date>span').text(today + ' ' + month)
			$('.days').eq(0).find('img').attr('src', 'images/' + data1.list[0].weather[0].icon + '.png')
			$('.days').eq(0).find('.day-name').text(nameday)
			for (var i = 1; i < 5; i++) {
				$('.days').eq(i).find('.date>span').text(Number(today) + Number(i) + ' ' + month)	
				$('.days').eq(i).find('.day-name').text(arrDays(nameday)[i])
			}		
		}
		getfiveDays(day, month, DayOfWeek)
		
		function searchIndexNext(){
			/* -- в масиві годин шукаемо індекс з якого починається інформація на завтрашній день  -- */
			for (var i=0; i<11; i++){
				var pp = data1.list[i].dt_txt.slice(8,10)
				if (data1.list[i].dt_txt.slice(8,10) !== data1.list[0].dt_txt.slice(8,10)){
					break;
				}
			}
			return i
		}
		
		function getMinTemp(ind, value) {
			/* -- шукаємо мінімальні температури на сьогодні і наступні дні -- */
			if (value == 0) {
				var num=Number(data1.list[0].main.temp_min)
				for (var i=1; i < ind;i++){
					if (num>Number(data1.list[i].main.temp_min)){
						num=Number(data1.list[i].main.temp_min)
					}
				}
				} else {
				var num=Number(data1.list[ind].main.temp_min)
				for (var i=ind; i < ind+8;i++){
					if (num>Number(data1.list[i].main.temp_min)){
						num=Number(data1.list[i].main.temp_min)
					}
				}
			}
			return Math.round(num)
		}
		
		function getMaxTemp(ind, value) {
			/* -- шукаємо максимальні температури на сьогодні і наступні дні -- */
			if (value == 0) {
				var num=Number(data1.list[0].main.temp_max)
				for (var i=1; i < ind;i++){
					if (num<Number(data1.list[i].main.temp_max)){
						num=Number(data1.list[i].main.temp_max)
					}
				}
				} else {
				var num=Number(data1.list[ind].main.temp_max)
				for (var i=ind; i < ind+8;i++){
					if (num<Number(data1.list[i].main.temp_max)){
						num=Number(data1.list[i].main.temp_max)
					}
				}
			}
			return Math.round(num)
		}
		
		function sendTempIcon(ind){
			/* -- виводимо температури та іконки в sidebar -- */
			$('.days').eq(0).find('.temp-max>span').text(Math.round(getMaxTemp(ind, 0)))
			$('.days').eq(0).find('.temp-min>span').text(Math.round(getMinTemp(ind, 0)))
			for (var i=0; i<4; i++){
				var dopInd = ind + 8*i
				$('.days').eq(i+1).find('.temp-max>span').text(Math.round(getMaxTemp(dopInd, 1)))
				$('.days').eq(i+1).find('.temp-min>span').text(Math.round(getMinTemp(dopInd, 1)))
				$('.days').eq(i+1).find('img').attr('src', 'images/'+ geticon(dopInd) +'.png')
				
			}
		}
		sendTempIcon(searchIndexNext())
		
		function geticon(ind) {
			/* -- шукаємо найгіршу погоду за день -- */
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
		
		function  fillDataCurrentDay(){
			/* -- заповнюємо набличку на сьогодні -- */
			var k
			switch (data1.list[0].dt_txt.slice(11,16)) {
				case '00:00':
				k = '1';
				break;
				case '03:00':
				k = '2';
				break;
				case '06:00':
				k = '3';
				break;
				case '09:00':
				k = '4';
				break;
				case '12:00':
				k = '5';
				break;
				case '15:00':
				k = '6';
				break;
				case '18:00':
				k = '7';
				break;
				case '21:00':
				k = '8';
				break;
			}
			var l = 0
			for (var i=k; i<9; i++){
				$('table:eq(0) tr:eq(2) td img').eq(i-1).attr('src', 'images/' + data1.list[l].weather[0].icon + '.png')
				$('table:eq(0) tr:eq(3) td').eq(i).text(Math.round(data1.list[l].main.temp))
				$('table:eq(0) tr:eq(4) td').eq(i).text(Math.round(data1.list[l].main.pressure))
				$('table:eq(0) tr:eq(5) td').eq(i).text(Math.round(data1.list[l].clouds.all))
				$('table:eq(0) tr:eq(6) td').eq(i).text(Math.round(data1.list[l].main.temp))
				$('table:eq(0) tr:eq(7) td').eq(i).text(Math.round(data1.list[l].wind.speed))
				l++
			}
		}
		
		fillDataCurrentDay()
		
		function  fillDataNextDay(ind, tableInd){
			/* -- заповнюємо набличку на наступні дні -- */
			for (var i=0; i< 8; i++){
				$('table').eq(tableInd).find('tr:eq(2) td img').eq(i).attr('src', 'images/' + data1.list[ind+i].weather[0].icon + '.png')
				$('table').eq(tableInd).find('tr:eq(3) td').eq(i+1).text(Math.round(data1.list[ind+i].main.temp))
				$('table').eq(tableInd).find('tr:eq(4) td').eq(i+1).text(Math.round(data1.list[ind+i].main.pressure))
				$('table').eq(tableInd).find('tr:eq(5) td').eq(i+1).text(Math.round(data1.list[ind+i].clouds.all))
				$('table').eq(tableInd).find('tr:eq(6) td').eq(i+1).text(Math.round(data1.list[ind+i].main.temp))
				$('table').eq(tableInd).find('tr:eq(7) td').eq(i+1).text(Math.round(data1.list[ind+i].wind.speed))
			}
		}
		fillDataNextDay(searchIndexNext(), 1)
		fillDataNextDay(searchIndexNext()+8, 2)
		fillDataNextDay(searchIndexNext()+16, 3)
		fillDataNextDay(searchIndexNext()+24, 4)
	}); 
})

