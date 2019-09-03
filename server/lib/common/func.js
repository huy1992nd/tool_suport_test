exports.formatime = (daybefore=0, type='all')=>{
	var d = new Date(new Date().getTime() - daybefore*24*60*60*1000);
	var date = d.getDate() > 10 ? d.getDate() : '0'+d.getDate();
	var month = d.getMonth()+1 > 10 ? d.getMonth()+1 : '0'+ (d.getMonth()+1);
	var y = d.getFullYear();
	var hr = d.getHours() > 10 ? d.getHours() : 0 + d.getHours();
	var min = d.getMinutes() > 10 ? d.getMinutes() : '0'+ d.getMinutes();
	var seconds = d.getSeconds() > 10 ? d.getSeconds() : '0'+d.getSeconds();
  switch (type) {
    case 'all':
      return `${y}-${month}-${date} ${hr}:${min}:${seconds}`;
      break;

    case 'yyyy-mm-dd':
      return `${y}-${month}-${date}`;
      break;
  
    default:
      return '';
      break;
  }
	
}