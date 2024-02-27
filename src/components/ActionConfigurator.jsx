import React from 'react';
import { Dropdown } from 'monday-ui-react-core';
import "monday-ui-react-core/dist/main.css";

const ActionConfigurator = ({ groups, selectedGroup, onActionsChange }) => {
  const groupOptions = groups.map(group => ({ id: group.id, label: group.title }));

  return (
    <div>
      <h4>Configure Actions for Duplicates:</h4>
      <Dropdown
        color="primary"
        placeholder="Select Group for Duplicates"
        options={groupOptions}
        onChange={(value) => onActionsChange(value)}
        selectedId={selectedGroup}
      />
    </div>
  );
};

export default ActionConfigurator;