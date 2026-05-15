import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExportExcelButton = ({ data, columns }) => {
  const [fileName, setFileName] = useState("data");

  const handleExport = () => {
    if (!fileName.trim()) return alert("Tên file không được để trống!");

    // 🔍 Lọc cột được phép export (mặc định là true)
    const exportableColumns = columns.filter(col => col.export !== false);

    // 🔄 Chuyển đổi dữ liệu để export
    const exportData = data.map((row) => {
      const formattedRow = {};
      exportableColumns.forEach((col) => {
        formattedRow[col.title] = row[col.dataIndex];
      });
      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <input
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Nhập tên file"
        style={{ padding: '4px 8px', marginRight: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <button onClick={handleExport} style={{ padding: '6px 12px' }}>
        Export Excel
      </button>
    </div>
  );
};

export default ExportExcelButton;
