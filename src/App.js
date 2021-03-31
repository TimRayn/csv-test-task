import './app.scss';
import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import Table from './table';


function App() {

  const [data, setData] = useState(null);

  const papaparseOptions = {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: header =>
      header
        .toLowerCase()
        .replace(/\W/g, '_')
  };


  function checkDuplicates(dataArray) {
    for (const item of dataArray) {
      const match = dataArray.find(elem => elem !== item && (elem.phone === item.phone || elem.email.toLowerCase() === item.email.toLowerCase()))
      if(match) {
        item.duplicate_with = match.id;
        match.duplicate_with = item.id;
      }
    }

    return dataArray;
  }

  function fileHandle(data, fileInfo) {
    const newData = data.map(item => {
      item.id = (data.indexOf(item) + 1).toString();
      item.duplicate_with = '-';
      return item;
    });

    checkDuplicates(newData);

    setData(newData);
  }




  return (
    <div className="app">
      <CSVReader
        parserOptions={papaparseOptions}
        onFileLoaded={fileHandle}
      />
      {data ?
      <Table array={data}/>
      : null}
    </div>
  );
}

export default App;
