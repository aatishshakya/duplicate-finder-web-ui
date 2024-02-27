import React, { useState, useEffect } from 'react';
import mondaySdk from 'monday-sdk-js';
import ColumnSelector from './components/ColumnSelector';
import ActionConfigurator from './components/ActionConfigurator';
import "monday-ui-react-core/tokens";
import { postData } from './helper/httpHelper';

const monday = mondaySdk();

function DuplicateDetectorConfig() {
  const [columns, setColumns] = useState([]);
  const [groups, setGroups] = useState([]);
  const [boardId, setBoardId] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    monday.listen('context', (res) => {
      const { boardId } = res.data;
      console.log('the board id is:', boardId);
      setBoardId(boardId);
      fetchColumns(boardId);
      fetchGroups(boardId);
    });
  }, []);

  const handleColumnChange = (newSelection) => {
    if (!selectedColumns.includes(newSelection)) {
      setSelectedColumns([...selectedColumns, newSelection]);
    }
  };

  const handleActionsChange = (newSelection) => {
    setSelectedGroup(newSelection);
  };

  const fetchColumns = async (boardId) => {
    const query = `query { boards(ids: ${boardId}) { columns { id, title, type, settings_str } } }`;
    try {
      const response = await monday.api(query);
      setColumns(response.data.boards[0].columns);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGroups = async (boardId) => {
    const query = `
    query {
      boards(ids: [${boardId}]) {
        groups {
          id
          title
          color
        }
      }
    }
  `;
    try {
      const response = await monday.api(query);
      setGroups(response.data.boards[0].groups);
    } catch (error) {
      console.error(error);
    }
  };

  const saveConfiguration = async (e) => {
    e.preventDefault();
    const inputData = {
      boardId,
      groupId: selectedGroup.id,
      columnIds: selectedColumns,
    };
    console.log(inputData);
    const url = 'https://966795a90b03.apps-tunnel.monday.com/create-duplicates';
    try {
      const result = await postData(url, inputData);
      console.log(result); // Process result here
    } catch (error) {
      console.error('Request failed', error);
    }
  };

  return (
    <div>
      <ColumnSelector columns={columns} selectedColumns={selectedColumns} onColumnChange={handleColumnChange} />
      <ActionConfigurator groups={groups} selectedGroup={selectedGroup} onActionsChange={handleActionsChange} />
      <button onClick={saveConfiguration}>Save Configuration</button>
    </div>
  );
}

export default DuplicateDetectorConfig;
