import React, { useState, useEffect } from 'react';
import mondaySdk from 'monday-sdk-js';
import ColumnSelector from './components/ColumnSelector';
import ActionConfigurator from './components/ActionConfigurator';
import "monday-ui-react-core/tokens";
import { postData } from './helper/httpHelper';
import { Loader } from 'monday-ui-react-core';

const monday = mondaySdk();

function DuplicateDetectorConfig() {
  const [columns, setColumns] = useState([]);
  const [groups, setGroups] = useState([]);
  const [boardId, setBoardId] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);

  useEffect(() => {
    monday.listen('context', (res) => {
      const { boardId } = res.data;
      setBoardId(boardId);
      fetchColumns(boardId);
      fetchGroups(boardId);
    });
  }, []);

  const handleColumnChange = (newSelection) => {
    setResponseStatus(false);
    if (!selectedColumns.includes(newSelection)) {
      setSelectedColumns([...selectedColumns, newSelection]);
    }
  };

  const handleActionsChange = (newSelection) => {
    setResponseStatus(false);
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

    const url = 'https://966795a90b03.apps-tunnel.monday.com/create-duplicates';
    try {
      setIsLoading(true);
      await postData(url, inputData);
      setResponseStatus(true);
    } catch (error) {
      setResponseStatus(false);
      console.error('Request failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ColumnSelector columns={columns} selectedColumns={selectedColumns} onColumnChange={handleColumnChange} />
      <ActionConfigurator groups={groups} selectedGroup={selectedGroup} onActionsChange={handleActionsChange} />
      <button
        disabled={(selectedGroup === '' || !selectedColumns.length || isLoading)
          ? true : false}
        onClick={saveConfiguration}>{isLoading
          ? <Loader size={40} />
          : responseStatus
            ? "Saved" :
            "Save Configuration"}
      </button>
    </div>
  );
}

export default DuplicateDetectorConfig;
