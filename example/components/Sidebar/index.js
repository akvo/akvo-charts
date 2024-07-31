'use client';

import React from 'react';
import './styles.css';
import {
  useDisplayContext,
  useDisplayDispatch
} from '../../context/DisplayContextProvider';

const chartTypes = [
  {
    key: 'bar',
    name: 'Bar'
  },
  {
    key: 'line',
    name: 'Line'
  },
  {
    key: 'pie',
    name: 'Pie'
  },
  {
    key: 'doughnut',
    name: 'Doughnut'
  },
  {
    key: 'stack-bar',
    name: 'Stack Bar'
  },
  {
    key: 'stack-cluster-column',
    name: 'Stack Cluster Column'
  }
];

const Sidebar = () => {
  const displayDispatch = useDisplayDispatch();
  const { selectedChartType } = useDisplayContext();

  const handleOnSidebarClick = ({ key }) => {
    displayDispatch({
      type: 'SET_SELECTED_CHART_TYPE',
      payload: key
    });
  };

  return (
    <div class="sidebar w-64 h-screen text-gray-800 flex flex-col">
      <div class="p-4 text-xl font-bold">Chart Types</div>
      <ul class="flex-1 space-y-2 p-4">
        {chartTypes.map((chartType, index) => (
          <li key={index}>
            <button
              class={`sidebar-item block w-full text-left p-2 rounded ${chartType.key === selectedChartType ? 'active' : ''}`}
              onClick={() => handleOnSidebarClick(chartType)}
            >
              {chartType.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
