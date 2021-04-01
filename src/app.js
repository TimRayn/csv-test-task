import './app.scss';
import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import Table from './table';
import moment from 'moment';

function ErrorComponent({ errorText }) {
  return (
    <div className='error'>
      {errorText}
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
        item.bad_data.push('phone');
      }
      const matchEmail = dataArray.find(elem => elem !== item && elem.email.toLowerCase() === item.email.toLowerCase());
      if (matchEmail) {
        item.duplicate_with = matchEmail.id;
        item.bad_data.push('email');
      }
    }
  }

  function parseData(dataArr) {
    dataArr.map(obj => {
      // cut spaces and check for empty fields
      for (const key in obj) {
        if (key !== 'bad_data') obj[key] = obj[key].trim();
        if (obj[key] === '' && ['full_name', 'phone', 'email'].includes(key)) {
          setError(`Row with id ${obj.id} has empty required field!`);
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
      if (obj.yearly_income < 0 || obj.yearly_income > 1000000)
        obj.bad_data.push('yearly_income');

      // parse license states
      // не впевнений,чи правильно зрозумів завдання
      parseStates(obj.license_states);
      if (obj.license_states === '') obj.bad_data.push('license_states');

      // parse expiration date
      parseDate(obj.expiration_date, obj.bad_data);

      // parse phone
      obj.phone = '+1' + obj.phone.slice(-10);
      if (obj.phone.lenght < 12 || !obj.phone.match(/^\+\d/)) obj.bad_data.push('phone');

      //parse has children
      if (obj.has_children === '') obj.has_children = 'FALSE';
      if (!['TRUE', 'FALSE'].includes(obj.has_children)) obj.bad_data.push('has_children');

      // parse license number
      if (!obj.license_number.match(/\w{6}/)) obj.bad_data.push("license_number");


    });
  }

  function parseDate(date, bad_data) {
    if (!(moment(date, 'YYYY-MM-DD', true).isValid() ||
      moment(date, 'MM/DD/YYYY', true))) bad_data.push('expiration_date');
  }

  function parseStates(states) {
    states.split('|').map(state => {
      if (!state.includes(',')) return state;
      return state.split(',').map(shortState => {
        if (shortState.length < 3) return shortState;
        return '';
      }).join('');
    }).join(', ');
  }

  function fileHandle(fileData, fileInfo) {
    console.log(fileInfo);
    if (fileInfo.name.slice(-4) !== '.csv') {
      setData(null);
      setError(true);
      console.log(data);
      return;
    }
    setError(null);
    const newData = fileData.map(item => {
      item.id = (fileData.indexOf(item) + 1).toString();
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
        cssClass='csv-reader-input'
        parserOptions={papaparseOptions}
        onFileLoaded={fileHandle}
        label='Import users'
      />
      {data ?
        <Table array={data} />
        : null}
      {error ?
        <ErrorComponent errorText={error} />
        : null}
    </div>
  );
}

export default App;
