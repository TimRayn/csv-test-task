import './app.scss';
import React from 'react';
import CSVReader from 'react-csv-reader';


function App() {
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header =>
      header
        .toLowerCase()
        .replace(/\W/g, '_')
  };

  function handleForce(file, fileInfo) {

    console.log(file);
    console.log(fileInfo);
  }

  function handleDarkSideForce(error) {
    console.log(error);
  }

  

  return (
    <div className="app">
      <CSVReader
        strict

        className="csv-reader-input"
        onFileLoaded={handleForce}
        onError={handleDarkSideForce}
        parserOptions={papaparseOptions}
        inputId="ObiWan"
        inputName="ObiWan"
        inputStyle={{ }}
      />
      <div className='result-wrapper'>

      </div>
    </div>
  );
}

export default App;
