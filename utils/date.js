const addDateSuffix = date => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const dateNum = date.getDate();
    const suffix = suffixes[(dateNum - 20) % 10] || suffixes[dateNum] || suffixes[0];
    return `${dateNum}${suffix}`;
  };
  
  module.exports = (
    timestamp,
    { monthLength = 'short', dateSuffix = true } = {}
  ) => {
    const months = monthLength === 'short'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const dateObj = new Date(timestamp);
    const formattedMonth = months[dateObj.getMonth()];
    const formattedDay = dateSuffix ? addDateSuffix(dateObj) : dateObj.getDate();
    const formattedHour = dateObj.getHours() % 12 || 12;
    const formattedMinutes = dateObj.getMinutes().toString().padStart(2, '0');
    const periodOfDay = dateObj.getHours() >= 12 ? 'pm' : 'am';
  
    return `${formattedMonth} ${formattedDay}, ${dateObj.getFullYear()} at ${formattedHour}:${formattedMinutes} ${periodOfDay}`;
  };
  