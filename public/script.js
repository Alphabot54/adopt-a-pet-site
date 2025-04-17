// Date-Time
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(setTime, 1000);
function setTime(){
    const date = new Date();
    document.getElementById('dateTime').innerHTML = days[date.getDay()] + ", " + months[date.getMonth()] + ". " + date.getDate() /*+ " " + date.getFullYear() */+ "<br>" + date.toLocaleTimeString();
}