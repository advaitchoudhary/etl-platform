const xlsx = require('xlsx');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

class DataProcessor {
  static async processFile(filePath, fileType) {
    try {
      let data;
      if (fileType === 'csv') {
        data = await this.processCSV(filePath);
      } else if (fileType === 'xlsx') {
        data = await this.processExcel(filePath);
      } else {
        throw new Error('Unsupported file type');
      }

      const columns = this.detectColumns(data[0]);
      const previewData = data.slice(0, 20);
      const rowCount = data.length;

      // Save processed data to CSV
      const processedFilePath = this.saveToCSV(data, filePath);

      return {
        columns,
        previewData,
        rowCount,
        processedFilePath
      };
    } catch (error) {
      throw new Error(`Error processing file: ${error.message}`);
    }
  }

  static async processCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(parse({
          columns: true,
          skip_empty_lines: true,
          trim: true
        }))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  static async processExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  }

  static detectColumns(firstRow) {
    return Object.keys(firstRow).map(key => {
      const columnType = this.detectColumnType(firstRow[key]);
      return {
        name: key,
        type: columnType,
        description: ''
      };
    });
  }

  static detectColumnType(value) {
    if (typeof value === 'number') return 'number';
    if (!isNaN(Date.parse(value))) return 'date';
    return 'string';
  }

  static saveToCSV(data, originalFilePath) {
    const processedDir = path.join(path.dirname(originalFilePath), 'processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir);
    }

    const timestamp = Date.now();
    const processedFilePath = path.join(processedDir, `processed_${timestamp}.csv`);
    
    const worksheet = xlsx.utils.json_to_sheet(data);
    const csvContent = xlsx.utils.sheet_to_csv(worksheet);
    fs.writeFileSync(processedFilePath, csvContent);

    return processedFilePath;
  }

  static cleanData(data) {
    return data.map(row => {
      const cleanRow = {};
      for (const [key, value] of Object.entries(row)) {
        // Remove special characters from column names
        const cleanKey = key.replace(/[^\w\s]/g, '_');
        
        // Handle null/undefined values
        if (value === null || value === undefined) {
          cleanRow[cleanKey] = '';
          continue;
        }

        // Trim strings and convert to appropriate types
        if (typeof value === 'string') {
          cleanRow[cleanKey] = value.trim();
        } else if (typeof value === 'number' && isNaN(value)) {
          cleanRow[cleanKey] = 0;
        } else {
          cleanRow[cleanKey] = value;
        }
      }
      return cleanRow;
    });
  }
}

module.exports = DataProcessor;