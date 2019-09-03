import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExcelService {
constructor() { }
public exportAsExcelFile(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName  + this.formatTime + EXCEL_EXTENSION);
}

private formatTime(){
	var d = new Date();
	var date = d.getDate() > 10 ? d.getDate() : '0'+d.getDate();
	var month = d.getMonth()+1 > 10 ? d.getMonth()+1 : '0'+ (d.getMonth()+1);
	var y = d.getFullYear();
	var hr = d.getHours() > 10 ? d.getHours() : 0 + d.getHours();
	var min = d.getMinutes() > 10 ? d.getMinutes() : '0'+ d.getMinutes();
	var seconds = d.getSeconds() > 10 ? d.getSeconds() : '0'+d.getSeconds();
	return `_${y}-${month}-${date}`;
}
}