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
      const matchPhone = dataArray.find(elem => elem !== item && elem.phone === item.phone);
      if (matchPhone) {
        item.duplicate_with = matchPhone.id;
        matchPhone.duplicate_with = item.id;
        item.bad_data.push('phone');
      }
      const matchEmail = dataArray.find(elem => elem !== item && elem.email.toLowerCase() === item.email.toLowerCase());
      if (matchEmail) {
        item.duplicate_with = matchEmail.id;
        matchEmail.duplicate_with = item.id;
        item.bad_data.push('email');
      }
    }
  }

  function parseData(dataArr) {
    dataArr.map(obj => {
      // cut spaces and check for empty fields
      for (const key in obj) {
        if (key !== 'bad_data') obj[key] = obj[key].trim();
        if (obj[key] === '') {
          obj[key] = 'NO DATA';
          obj.bad_data.push(key);
        }
      }

      // parse age
      obj.age = Number(obj.age);
      if (obj.age < 21)
        obj.bad_data.push('age');

      // parse experience
      if (obj.experience > obj.age - 21 || obj.experience < 0)
        obj.bad_data.push('experience');

      // parse yearly income
      obj.yearly_income = Number(obj.yearly_income).toFixed(2);
      if (obj.yearly_income === "NaN") obj.yearly_income = "NO DATA";
      else if (obj.yearly_income < 0 || obj.yearly_income > 1000000)
        obj.bad_data.push('yearly_income');
      

      // parse license states
      // не впевнений,чи правильно зрозумів завдання
      parseStates(obj.license_states);
      if(obj.license_states === '') obj.bad_data.push('license_states');

      // parse expiration date
      parseDate(obj.expiration_date, obj.bad_data);
    });
  }

  function parseDate(date, bad_data){
    
  }

  function parseStates(states) {
    states.split('|').map(state => {
      if (!state.includes(',')) return state;
      return state.split(',').map(shortState => {
        if (shortState.lenght < 3) return shortState;
        return '';
      }).join('');
    }).join(', ');
  }

  function fileHandle(data, fileInfo) {
    const newData = data.map(item => {
      item.id = (data.indexOf(item) + 1).toString();
      item.duplicate_with = '-';
      item.bad_data = [];
      return item;
    });
    console.log(newData);

    parseData(newData);
    checkDuplicates(newData);
    setData(newData);
  }




  return (
    <div className='app'>
      <CSVReader
        parserOptions={papaparseOptions}
        onFileLoaded={fileHandle}
      />
      {data ?
        <Table array={data} />
        : null}
    </div>
  );
}

export default App;
