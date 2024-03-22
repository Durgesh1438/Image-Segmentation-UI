import * as XLSX from 'xlsx'

export const base64ToBlob = (base64Data, contentType = 'image/png') => {
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([byteArray], { type: contentType });
};

export const sanitizeBase64 = (base64String) => {
    const prefixIndex = base64String.indexOf(';base64,');
    if (prefixIndex !== -1) {
        return base64String.slice(prefixIndex + ';base64,'.length);
    }
    return base64String;
};

export const convertDataToExcelFile = (sheetData) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    // Add a worksheet
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // Convert the workbook to a data URL
    const excelFileDataUrl = XLSX.write(workbook, { type: 'base64' });
    // Create a data URL for the Excel file
    const excelFileUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelFileDataUrl}`;
    return excelFileUrl;
  };

export const clientId="846813517923-heolcnivb3oh6i5vc5f15kntk2nbpar3.apps.googleusercontent.com"

export const API_URL='http://localhost:3001'
