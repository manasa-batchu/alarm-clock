let clockFace = document.getElementById('clock-face');
let setAlarmButton = document.getElementById('setAlarmButton');
let alarms = [];
// Display clock face
function updateClock() {
    let date = new Date();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let amPM = hrs < 12 ? 'AM' : 'PM'

    const { hours, minutes, seconds } = timeFormat(hrs, mins, secs);

    clockFace.innerHTML = `${hours}:${minutes}:${seconds} ${amPM}`

}

// parse input txtvalues
function parseInputValues() {
    let hours = parseInt(document.getElementById('hours').value);
    let minutes = parseInt(document.getElementById('minutes').value);
    let seconds = parseInt(document.getElementById('seconds').value);
    let AMPM = document.getElementById('AMPM').value;

    if (isNaN(hours)) {
        hours = 12;
    }
    if (isNaN(minutes)) {
        minutes = 0;
    }
    if (isNaN(seconds)) {
        seconds = 0;
    }

    if (hours == 12 && AMPM == 'AM') {
        hours = 0;
    }
    if (AMPM == 'PM' && hours != 12) {
        hours = hours + 12;
    }
    return { hours, minutes, seconds, AMPM };
}

// playing alarm
function playAlarmSound(alarmInterval) {
    const audio = new Audio('./Alarm-music.mp3');
    audio.play();

    audio.onplaying = () => {
        alert('DISMISS ALARM');
        audio.pause();
        dismissAlarm(alarmInterval);
    }
}

// alarm Interval
function createAlarmInterval(setTime) {
    const alarmInterval = setInterval(() => {
        const date = new Date();
        const currentTimer = (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000;

        if (Math.abs(currentTimer - setTime) <= 1000) {
            clearInterval(alarmInterval);
            playAlarmSound(alarmInterval);
        }
    }, 1000);
    return alarmInterval;
}



// set new alarm
function setAlarm() {

    const { hours, minutes, seconds, AMPM } = parseInputValues();
    const setTime = ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
    const alarmInterval = createAlarmInterval(setTime);

    const newAlarm = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        AMPM: AMPM,
        alarmInterval: alarmInterval
    };

    alarms.push(newAlarm);
    displayAlarms()
    resetInput()
}



// dismiss alaram upon clicking ok on alert 
function dismissAlarm(alarmInterval) {
    const alarmIndex = alarms.findIndex(alarm => alarm.alarmInterval === alarmInterval);
    if (alarmIndex !== -1) {
        clearInterval(alarmInterval);
        alarms.splice(alarmIndex, 1);
        displayAlarms();
    }

}

// reset inputs
function resetInput() {
    document.getElementById('hours').value = '12';
    document.getElementById('minutes').value = '00';
    document.getElementById('seconds').value = '00';
    document.getElementById('AMPM').value = 'AM';
}


// display list of alarms
function displayAlarms() {
    const alarmsSet = document.getElementById('alarms-set');
    alarmsSet.innerHTML = '';

    if (alarms.length === 0) {
        alarmsSet.innerHTML = `<div class="no-alarms"><img src="alarm.png"></div>`;
    }

    alarms.forEach((alarm, index) => {
        const timeObj = timeFormat(alarm.hours, alarm.minutes, alarm.seconds);
        const { hours, minutes, seconds } = timeObj;

        const alarmElement = document.createElement('div');
        alarmElement.innerHTML = `
            <div class="alarmElement" id="alarm-${index}">
                <div class="hrsminsec" style="font-size:24px;">${hours}:${minutes}:${seconds} ${alarm.AMPM}</div>
                <button class="deleteButton" onclick="deleteAlarm(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>`;
        alarmsSet.appendChild(alarmElement);
    });
}

// format time 
function timeFormat(hrs, min, sec) {
    if (hrs == 0) {
        hrs = 12
    }

    if (hrs > 12) {
        hrs = hrs - 12;
    }
    if (hrs < 10) {
        hrs = '0' + hrs;
    }
    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }

    return { hours: hrs, minutes: min, seconds: sec }

}

// delete alarms
function deleteAlarm(index) {
    clearInterval(alarms[index].alarmInterval);
    alarms.splice(index, 1);
    displayAlarms();
}

// format input 
function formatInput(input) {
    if (input.value < 10) {
        input.value = '0' + input.value;
    }
}

// clock face
updateClock();
setInterval(updateClock, 1000);

setAlarmButton.addEventListener('click', setAlarm)
