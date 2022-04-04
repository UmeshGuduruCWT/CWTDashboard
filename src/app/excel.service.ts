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
    // console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', compression : true });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    FileSaver.saveAs(data, fileName + ' '+ new Date().toLocaleDateString()+ EXCEL_EXTENSION);
  }
  // public exportascsvfile(data: any[], excelFileName: string){
  //   const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
  //   const header = Object.keys(data[0]);
  //   let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
  //   csv.unshift(header.join(','));
  //   let csvArray = csv.join('\r\n');

  //   var blob = new Blob([csvArray], {type: 'text/csv' })
  //   FileSaver.saveAs(blob, excelFileName + ' '+ new Date().toLocaleDateString()+".csv");
  // }
  // public exportasxlsfile(data: any[], excelFileName: string){
  //     const blob = new Blob([JSON.stringify(data)], { type: 'application/vnd.ms-excel;charset=utf-8' });
  //     FileSaver.saveAs(blob, excelFileName + ' '+ new Date().toLocaleDateString()+".xls");
  // }
}