import React from 'react';
import './table.scss';

function Table({ array }) {

  const headArray = [
    "ID",
    "Full Name",
    "Phone",
    "Email", 
    "Age", 
    "Experience",
    "Yearly Income",
    "Has children",
    "License states",
    "Expiration date",
    "License number",
    "Duplicate with"
  ];


  console.log(array);

  const headItems = headArray.map(item => {
    return <td key={item}>{item}</td>;
  });

  function getItems(obj) {
    let row = [<td key="id">{obj.id}</td>];
    for (const item in obj) {
      if(item !== "id") row.push(<td key={item}>{obj[item]}</td>)
    }
    return row;
  }

  const bodyItems = array.map(obj => {
    return (<tr key={"tr" + obj.id}>{getItems(obj)}</tr>)
  })




  return (
    <div className='table'>
      <table>
        <thead>
          <tr key="head-tr">
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