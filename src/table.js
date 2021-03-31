import React from 'react';
import './table.scss';

function Table({ array }) {

  const headArray = [
    'ID',
    'Full Name',
    'Phone',
    'Email', 
    'Age', 
    'Experience',
    'Yearly Income',
    'Has children',
    'License states',
    'Expiration date',
    'License number',
    'Duplicate with'
  ];

  const headItems = headArray.map(item => {
    return <td key={item}>{item}</td>;
  });

  function getItems(obj) {
    let row = [<td key='id'>{obj.id}</td>];
    for (const key in obj) {
      let className = null;
      if (obj.bad_data.includes(key)) className = 'bad';
      if(key !== 'id' && key !== 'bad_data') row.push(<td key={key} className={className}>{obj[key]}</td>)
    }
    return row;
  }

  const bodyItems = array.map(obj => {
    return (<tr key={'tr' + obj.id}>{getItems(obj)}</tr>)
  })




  return (
    <div className='table'>
      <table>
        <thead>
          <tr key='head-tr'>
            {headItems}
          </tr>
        </thead>
        <tbody>
          {bodyItems}
        </tbody>
      </table>
    </div>
  );
}

export default Table;