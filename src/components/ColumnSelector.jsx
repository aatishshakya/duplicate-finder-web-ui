import React from 'react';
import { Dropdown } from 'monday-ui-react-core';
import "monday-ui-react-core/dist/main.css";

const ColumnSelector = ({ columns, selectedColumns, onColumnChange }) => {
  // const statusOptions = columns.filter(col => col.type === 'status').map(col => ({ value: col.id, label: col.title }));
  const emailOptions = columns.filter(col => col.type === 'email').map(col => ({ id: col.id, label: col.title }));
  const numberOptions = columns.filter(col => col.type === 'numbers').map(col => ({ id: col.id, label: col.title })); // Assuming 'number' type columns are 'text' in monday

  return (
    <div>
      <h4>Select Columns for Duplicate Detection:</h4>
      {/* <Dropdown
        placeholder="Select Status Column"
        options={statusOptions}
        onChange={(value) => onColumnChange({ ...selectedColumns, status: value })}
        selectedId={selectedColumns.status}
      /> */}
      <Dropdown
        placeholder="Select Email Column"
        options={emailOptions}
        onChange={(value) => onColumnChange(value.id)}
        selectedId={selectedColumns.email}
      />
      <Dropdown
        placeholder="Select Number Column"
        options={numberOptions}
        onChange={(value) => onColumnChange(value.id)}
        selectedId={selectedColumns.number}
      />
    </div>
  );
};

export default ColumnSelector;