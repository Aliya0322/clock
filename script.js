let apiTime = null;

async function getTime(zoneName) {
    const fetchResult = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=NDRUUY5TDIIA&format=json&by=zone&zone=${zoneName}`);
    const data = await fetchResult.json();
    const time = data.formatted.split(" ")[1];
    const [hoursStr, minutesStr, secondsStr] = time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);

    const nowDate = new Date();
    nowDate.setHours(hours);
    nowDate.setMinutes(minutes);
    nowDate.setSeconds(seconds);
    return nowDate;
}

async function arrowRun() {
    let hours, minutes, seconds;
    
    if (apiTime instanceof Date) {
        apiTime.setSeconds(apiTime.getSeconds() + 1);
        hours = apiTime.getHours() % 12;
        minutes = apiTime.getMinutes();
        seconds = apiTime.getSeconds();
    } else {
        const now = new Date();
        hours = now.getHours() % 12;
        minutes = now.getMinutes();
        seconds = now.getSeconds();
    }

    const secondsDeg = 6 * seconds;
    const minutesDeg = 6 * minutes + secondsDeg / 60;
    const hoursDeg = 30 * hours + (30 * seconds / 60 + 30 * minutes) / 60;
    
    document.getElementById('hour-arrow').style.transform = `rotate(${hoursDeg-90}deg)`;
    document.getElementById('minute-arrow').style.transform = `rotate(${minutesDeg-90}deg)`;
    document.getElementById('second-arrow').style.transform = `rotate(${secondsDeg-90}deg)`;
}

setInterval(arrowRun, 1000);

document.getElementById('submit-btn').addEventListener('click', async function() {
    const input = document.getElementById('city-input').value.trim();
    if (!input || !input.includes('/') ) {
        alert('Введите локацию в формате: Region/City\nНапример: Europe/Moscow');
        return;
    }
    const [region, city] = input.split("/")
    if(!region || !city) {
        alert('Неверный формат. Введите Region/City\nПример: Europe/Moscow');
        return;
    };

    apiTime = await getTime(input);
});
