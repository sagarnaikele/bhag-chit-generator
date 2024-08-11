import React, { useState } from 'react';
import './BhagChitGenerator.css';
import * as XLSX from 'xlsx';

const BhagChitGenerator = () => {
    const [data, setData] = useState({});
    const [currentSheet, setCurrentSheet] = useState('');
    const [shlokKramank, setShlokKramank] = useState('');

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetsData = {};
            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }); // Read as 2D array
                const filledData = fillMergedCells(jsonData);
                sheetsData[sheetName] = {
                    data: filledData.filter(row => row[6] !== ''), // Filter out rows without Mangalacharan data
                    shlokKramank: sheet['G2'] ? sheet['G2'].v : ''
                };
            });
            setData(sheetsData);
            setCurrentSheet(workbook.SheetNames[0]);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleSheetChange = (event) => {
        setCurrentSheet(event.target.value);
        setShlokKramank(data[event.target.value].shlokKramank);
    };

    const fillMergedCells = (jsonData) => {
        let lastDay = '';
        let lastDate = '';

        return jsonData.map(row => {
            if (row[1]) lastDay = row[1];
            if (row[2]) lastDate = row[2];
            return [row[0], lastDay, lastDate, ...row.slice(3)];
        });
    };

    const generateHTML = () => {
        if (!currentSheet || !data[currentSheet]) return null;

        const jsonData = data[currentSheet].data;
        const rows = jsonData.slice(1);
        const groupedData = groupBy(rows, 6); // 7th column (index 6)

        return Object.entries(groupedData).map(([group, records], groupIndex) => (
            <div className="card" key={groupIndex}>
                <h4>|| श्रीराम समर्थ ||</h4>
                <h4>|| जय जय रघुवीर समर्थ ||</h4>
                <div className="card-header">
                    <p><strong>श्री सदस्य:</strong> {group}</p>
                    <p><strong>श्लोक क्र:</strong> {shlokKramank}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>अ.क्रं</th>
                            <th style={{ width: '15%' }}>श्रीबैठक</th>
                            <th style={{ width: '15%' }}>दिनांक <br />व वार</th>
                            <th style={{ width: '25%' }}>वेळ</th>
                            <th style={{ width: '13%' }}>स्वरूप </th>
                            <th style={{ width: '18%' }}>श्रीमंगलाचरण<br />वर्तमान समास</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td>
                                <td>{row[5]}</td>
                                <td>{row[1]}<br />{row[2]}</td>
                                <td>{row[3]}</td>
                                <td>{row[4]}</td>
                                <td>&#x2714;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ));
    };

    const groupBy = (data, index) => {
        return data.reduce((acc, item) => {
            const key = item[index];
            (acc[key] = acc[key] || []).push(item);
            return acc;
        }, {});
    };

    return (
        <div className="container">
            <div className="no-printme">
                <input type="file" id="fileInput" accept=".xlsx, .xls" onChange={handleFileSelect} />
                {currentSheet && (
                    <select onChange={handleSheetChange} value={currentSheet}>
                        {Object.keys(data).map((sheetName, index) => (
                            <option key={index} value={sheetName}>
                                {sheetName}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <div id="previewContainer" className="a4-page printme">
                {generateHTML()}
            </div>
        </div>
    );
};

export default BhagChitGenerator;

// import React, { useState } from 'react';
// import './BhagChitGenerator.css';
// import * as XLSX from 'xlsx';

// const BhagChitGenerator = () => {
//     const [data, setData] = useState({});
//     const [currentSheet, setCurrentSheet] = useState('');
//     const [shlokKramank, setShlokKramank] = useState('');

//     const handleFileSelect = (event) => {
//         const file = event.target.files[0];
//         const reader = new FileReader();

//         reader.onload = (e) => {
//             const data = new Uint8Array(e.target.result);
//             const workbook = XLSX.read(data, { type: 'array' });
//             const sheetsData = {};
//             workbook.SheetNames.forEach((sheetName) => {
//                 const sheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }); // Read as 2D array
//                 const filledData = fillMergedCells(jsonData);
//                 sheetsData[sheetName] = {
//                     data: filledData.filter(row => row[6] !== ''), // Filter out rows without Mangalacharan data
//                     shlokKramank: sheet['G2'] ? sheet['G2'].v : ''
//                 };
//             });
//             setData(sheetsData);
//             setCurrentSheet(workbook.SheetNames[0]);
//         };

//         reader.readAsArrayBuffer(file);
//     };

//     const handleSheetChange = (event) => {
//         setCurrentSheet(event.target.value);
//         setShlokKramank(data[event.target.value].shlokKramank);
//     };

//     const fillMergedCells = (jsonData) => {
//         let lastDay = '';
//         let lastDate = '';

//         return jsonData.map(row => {
//             if (row[1]) lastDay = row[1];
//             if (row[2]) lastDate = row[2];
//             return [row[0], lastDay, lastDate, ...row.slice(3)];
//         });
//     };

//     const generateHTML = () => {
//         if (!currentSheet || !data[currentSheet]) return null;

//         const jsonData = data[currentSheet].data;
//         const rows = jsonData.slice(1);
//         const groupedData = groupBy(rows, 6); // 7th column (index 6)

//         return Object.entries(groupedData).map(([group, records], groupIndex) => (
//             <div className="card" key={groupIndex}>
//                 <h4>|| श्रीराम समर्थ ||</h4>
//                 <h4>|| जय जय रघुवीर समर्थ ||</h4>
//                 <div className="card-header">
//                     <p><strong>श्री सदस्य:</strong> {group}</p>
//                     <p><strong>श्लोक क्र:</strong> {shlokKramank}</p>
//                 </div>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th style={{ width: '5%' }}>अ.क्रं</th>
//                             <th style={{ width: '15%' }}>श्रीबैठक</th>
//                             <th style={{ width: '15%' }}>दिनांक <br />व वार</th>
//                             <th style={{ width: '20%' }}>वेळ</th>
//                             <th style={{ width: '18%' }}>श्रीमंगलाचरण</th>
//                             <th style={{ width: '18%' }}>वर्तमान समास</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {records.map((row, rowIndex) => (
//                             <tr key={rowIndex}>
//                                 <td>{rowIndex + 1}</td>
//                                 <td>{row[1]}</td>
//                                 <td>{row[2]}<br />{row[3]}</td>
//                                 <td>{row[4]}</td>
//                                 <td>&#x2714;</td>
//                                 <td>&#x2714;</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         ));
//     };

//     const groupBy = (data, index) => {
//         return data.reduce((acc, item) => {
//             const key = item[index];
//             (acc[key] = acc[key] || []).push(item);
//             return acc;
//         }, {});
//     };

//     return (
//         <div>
//             <div className="no-printme">
//                 <input type="file" id="fileInput" accept=".xlsx, .xls" onChange={handleFileSelect} />
//                 {currentSheet && (
//                     <select onChange={handleSheetChange} value={currentSheet}>
//                         {Object.keys(data).map((sheetName, index) => (
//                             <option key={index} value={sheetName}>
//                                 {sheetName}
//                             </option>
//                         ))}
//                     </select>
//                 )}
//             </div>
//             <div id="previewContainer" className="a4-page printme">
//                 {generateHTML()}
//             </div>
//         </div>
//     );
// };

// export default BhagChitGenerator;

// // import React, { useState } from 'react';
// // import './BhagChitGenerator.css';
// // import * as XLSX from 'xlsx';

// // const BhagChitGenerator = () => {
// //     const [data, setData] = useState({});
// //     const [currentSheet, setCurrentSheet] = useState('');
// //     const [shlokKramank, setShlokKramank] = useState('');

// //     const handleFileSelect = (event) => {
// //         const file = event.target.files[0];
// //         const reader = new FileReader();

// //         reader.onload = (e) => {
// //             const data = new Uint8Array(e.target.result);
// //             const workbook = XLSX.read(data, { type: 'array' });
// //             const sheetsData = {};
// //             workbook.SheetNames.forEach((sheetName) => {
// //                 const sheet = workbook.Sheets[sheetName];
// //                 const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }); // Read as 2D array
// //                 const filledData = fillMergedCells(jsonData);
// //                 sheetsData[sheetName] = {
// //                     data: filledData.filter(row => row[6] !== ''), // Filter out rows without Mangalacharan data
// //                     shlokKramank: sheet['G2'] ? sheet['G2'].v : ''
// //                 };
// //             });
// //             setData(sheetsData);
// //             setCurrentSheet(workbook.SheetNames[0]);
// //         };

// //         reader.readAsArrayBuffer(file);
// //     };

// //     const handleSheetChange = (event) => {
// //         setCurrentSheet(event.target.value);
// //         setShlokKramank(data[event.target.value].shlokKramank);
// //     };

// //     const fillMergedCells = (jsonData) => {
// //         let lastDay = '';
// //         let lastDate = '';

// //         return jsonData.map(row => {
// //             if (row[1]) lastDay = row[1];
// //             if (row[2]) lastDate = row[2];
// //             return [row[0], lastDay, lastDate, ...row.slice(3)];
// //         });
// //     };

// //     const generateHTML = () => {
// //         if (!currentSheet || !data[currentSheet]) return null;

// //         const jsonData = data[currentSheet].data;
// //         const rows = jsonData.slice(1);
// //         const groupedData = groupBy(rows, 6); // 7th column (index 6)

// //         return Object.entries(groupedData).map(([group, records], groupIndex) => (
// //             <div className="card" key={groupIndex}>
// //                 <h4>|| श्रीराम समर्थ ||</h4>
// //                 <h4>|| जय जय रघुवीर समर्थ ||</h4>
// //                 <div className="card-header">
// //                     <p><strong>श्री सदस्य:</strong> {group}</p>
// //                     <p><strong>श्लोक क्र:</strong> {shlokKramank}</p>
// //                 </div>
// //                 <table>
// //                     <thead>
// //                         <tr>
// //                             <th style={{ width: '5%' }}>अ.क्रं</th>
// //                             <th style={{ width: '15%' }}>श्रीबैठक</th>
// //                             <th style={{ width: '15%' }}>दिनांक <br />व वार</th>
// //                             <th style={{ width: '20%' }}>वेळ</th>
// //                             <th style={{ width: '18%' }}>श्रीमंगलाचरण</th>
// //                             <th style={{ width: '18%' }}>वर्तमान समास</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {records.map((row, rowIndex) => (
// //                             <tr key={rowIndex}>
// //                                 <td>{rowIndex + 1}</td>
// //                                 <td>{row[1]}</td>
// //                                 <td>{row[2]}<br />{row[3]}</td>
// //                                 <td>{row[4]}</td>
// //                                 <td>&#x2714;</td>
// //                                 <td>&#x2714;</td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         ));
// //     };

// //     const groupBy = (data, index) => {
// //         return data.reduce((acc, item) => {
// //             const key = item[index];
// //             (acc[key] = acc[key] || []).push(item);
// //             return acc;
// //         }, {});
// //     };

// //     return (
// //         <div>
// //             <div className="no-printme">
// //                 <input type="file" id="fileInput" accept=".xlsx, .xls" onChange={handleFileSelect} />
// //                 {currentSheet && (
// //                     <select onChange={handleSheetChange} value={currentSheet}>
// //                         {Object.keys(data).map((sheetName, index) => (
// //                             <option key={index} value={sheetName}>
// //                                 {sheetName}
// //                             </option>
// //                         ))}
// //                     </select>
// //                 )}
// //             </div>
// //             <div id="previewContainer" className="a4-page printme">
// //                 {generateHTML()}
// //             </div>
// //         </div>
// //     );
// // };

// // export default BhagChitGenerator;


// // // import React, { useState } from 'react';
// // // import './BhagChitGenerator.css';
// // // import * as XLSX from 'xlsx';

// // // const BhagChitGenerator = () => {
// // //     const [data, setData] = useState({});
// // //     const [currentSheet, setCurrentSheet] = useState('');
// // //     const [shlokKramank, setShlokKramank] = useState('');

// // //     const handleFileSelect = (event) => {
// // //         const file = event.target.files[0];
// // //         const reader = new FileReader();

// // //         reader.onload = (e) => {
// // //             const data = new Uint8Array(e.target.result);
// // //             const workbook = XLSX.read(data, { type: 'array' });
// // //             const sheetsData = {};
// // //             workbook.SheetNames.forEach((sheetName) => {
// // //                 const sheet = workbook.Sheets[sheetName];
// // //                 const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }); // Read as 2D array
// // //                 sheetsData[sheetName] = {
// // //                     data: jsonData.filter(row => row.some(cell => cell !== '')), // Filter out empty rows
// // //                     shlokKramank: sheet['G2'] ? sheet['G2'].v : ''
// // //                 };
// // //             });
// // //             setData(sheetsData);
// // //             setCurrentSheet(workbook.SheetNames[0]);
// // //         };

// // //         reader.readAsArrayBuffer(file);
// // //     };

// // //     const handleSheetChange = (event) => {
// // //         setCurrentSheet(event.target.value);
// // //         setShlokKramank(data[event.target.value].shlokKramank);
// // //     };

// // //     const generateHTML = () => {
// // //         if (!currentSheet || !data[currentSheet]) return null;

// // //         const jsonData = data[currentSheet].data;
// // //         const rows = jsonData.slice(1);
// // //         const groupedData = groupBy(rows, 6); // 7th column (index 6)

// // //         return Object.entries(groupedData).map(([group, records], groupIndex) => (
// // //             <div className="card" key={groupIndex}>
// // //                 <h4>|| श्रीराम समर्थ ||</h4>
// // //                 <h4>|| जय जय रघुवीर समर्थ ||</h4>
// // //                 <div className="card-header">
// // //                     <p><strong>श्री सदस्य:</strong> {group}</p>
// // //                     <p><strong>श्लोक क्र:</strong> {shlokKramank}</p>
// // //                 </div>
// // //                 <table>
// // //                     <thead>
// // //                         <tr>
// // //                             <th style={{ width: '5%' }}>अ.क्रं</th>
// // //                             <th style={{ width: '15%' }}>श्रीबैठक</th>
// // //                             <th style={{ width: '15%' }}>दिनांक <br />व वार</th>
// // //                             <th style={{ width: '20%' }}>वेळ</th>
// // //                             <th style={{ width: '18%' }}>श्रीमंगलाचरण</th>
// // //                             <th style={{ width: '18%' }}>वर्तमान समास</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {records.map((row, rowIndex) => (
// // //                             <tr key={rowIndex}>
// // //                                 <td>{rowIndex + 1}</td>
// // //                                 <td>{row[1]}</td>
// // //                                 <td>{row[2]}<br />{row[3]}</td>
// // //                                 <td>{row[4]}</td>
// // //                                 <td>&#x2714;</td>
// // //                                 <td>&#x2714;</td>
// // //                             </tr>
// // //                         ))}
// // //                     </tbody>
// // //                 </table>
// // //             </div>
// // //         ));
// // //     };

// // //     const groupBy = (data, index) => {
// // //         return data.reduce((acc, item) => {
// // //             const key = item[index];
// // //             (acc[key] = acc[key] || []).push(item);
// // //             return acc;
// // //         }, {});
// // //     };

// // //     return (
// // //         <div>
// // //             <div className="no-printme">
// // //                 <input type="file" id="fileInput" accept=".xlsx, .xls" onChange={handleFileSelect} />
// // //                 {currentSheet && (
// // //                     <select onChange={handleSheetChange} value={currentSheet}>
// // //                         {Object.keys(data).map((sheetName, index) => (
// // //                             <option key={index} value={sheetName}>
// // //                                 {sheetName}
// // //                             </option>
// // //                         ))}
// // //                     </select>
// // //                 )}
// // //             </div>
// // //             <div id="previewContainer" className="a4-page printme">
// // //                 {generateHTML()}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default BhagChitGenerator;
