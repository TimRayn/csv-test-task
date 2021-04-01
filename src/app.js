import './app.scss';
import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import TableComponent from './table';
import moment from 'moment';
import STATES from './states.json';

const statesShorts = Object.keys(STATES);
const statesFulls = Object.values(STATES);
const REQUIRED_FIELDS = ['full_name', 'phone', 'email'];

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

  const parseOptions = {
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
        if (item.duplicate_with === '-') item.duplicate_with = matchPhone.id;
        item.bad_data.push('phone');
      }
      const matchEmail = dataArray.find(elem => elem !== item && elem.email.toLowerCase() === item.email.toLowerCase());
      if (matchEmail) {
        if (item.duplicate_with === '-') item.duplicate_with = matchEmail.id;
        item.bad_data.push('email');
      }
    }
  }

  function parseData(dataArr) {
    dataArr.forEach(candidate => {
      for (const key in candidate) {
        // cut spaces
        if (key !== 'bad_data') candidate[key] = candidate[key].trim();
        // check for required fields
        if (candidate[key] === '' && REQUIRED_FIELDS.includes(key)) {
          setError(`Row with id ${candidate.id} has empty required field!`);
          candidate.bad_data.push(key);
        }
      }

      // parse age
      candidate.age = Number(candidate.age);
      if (candidate.age < 21)
        candidate.bad_data.push('age');

      // parse experience
      if (candidate.experience > candidate.age - 21 || candidate.experience < 0)
        candidate.bad_data.push('experience');

      // parse yearly income
      candidate.yearly_income = Number(candidate.yearly_income).toFixed(2);
      if (candidate.yearly_income < 0 || candidate.yearly_income > 1000000)
        candidate.bad_data.push('yearly_income');

      // parse license states
      // не впевнений,чи правильно зрозумів завдання;
      // розраховано на строки типу такої: "CA, California | AL | Texas | Montana, MT"
      parseStates(candidate);

      // parse expiration date
      validateDate(candidate.expiration_date, candidate.bad_data);

      // parse phone
      candidate.phone = '+1' + candidate.phone.slice(-10);
      if (candidate.phone.length < 12 || !candidate.phone.match(/^\+\d/)) candidate.bad_data.push('phone');

      //parse has children
      if (candidate.has_children === '') candidate.has_children = 'FALSE';
      if (!['TRUE', 'FALSE'].includes(candidate.has_children)) candidate.bad_data.push('has_children');

      // parse license number
      if (!candidate.license_number.match(/\w{6}/)) candidate.bad_data.push("license_number");
    });
  }

  function validateDate(date, bad_data) {
    if (!(moment(date, 'YYYY-MM-DD', true).isValid() ||
      moment(date, 'MM/DD/YYYY', true).isValid())) bad_data.push('expiration_date');
  }

  function parseStates(candidate) {
    let isOk = true;
    let statesArray = candidate.license_states.split('|');
    statesArray = statesArray.map(stateNames => stateNames.split(',').map(state => {
      state = state.trim();
      if (statesShorts.includes(state)) {
        return state;
      }
      else if (statesFulls.includes(state)) {
        const resultState = statesShorts.find(short => STATES[short] === state)
        return resultState;
      }
      isOk = false;
      return state;
    }));
    candidate.license_states = [...new Set(...statesArray)].join(', ');
    if (!isOk) candidate.bad_data.push('license_states');
  }


  function fileHandle(fileData, fileInfo) {
    if (fileInfo.name.slice(-4) !== '.csv') {
      setData(null);
      setError(true);
      return;
    }
    setError(null);
    const newData = fileData.map(item => {
      item.id = (fileData.indexOf(item) + 1).toString();
      item.duplicate_with = '-';
      item.bad_data = [];
      return item;
    });

    parseData(newData);
    checkDuplicates(newData);
    setData(newData);
  }

  return (
    <div className='app'>
      <CSVReader
        cssClass='csv-reader-input'
        parserOptions={parseOptions}
        onFileLoaded={fileHandle}
        label='Import users'
      />
      {data ?
        <TableComponent array={data} />
        : null}
      {error ?
        <ErrorComponent errorText={error} />
        : null}
    </div>
  );
}

export default App;
