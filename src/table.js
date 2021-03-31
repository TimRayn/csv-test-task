import React from 'react';

function Table({ array }) {
  console.log(array);
  const head = Object.keys(array[0]);

  






  return (
    <div className='table'>
      <table>
        <thead>
          <tr>
            {head.map(item => <td key={item}>{item}</td>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;