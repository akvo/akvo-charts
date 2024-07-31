'use client';

import React from 'react';
import './styles.css';
import {
  useDisplayContext,
  useDisplayDispatch
} from '../../context/DisplayContextProvider';
import { BarIcon, LineIcon, PieIcon } from '../Icons';

const chartTypes = [
  {
    key: 'bar',
    name: 'Bar',
    icon: <BarIcon />
  },
  {
    key: 'line',
    name: 'Line',
    icon: <LineIcon />
  },
  {
    key: 'pie',
    name: 'Pie',
    icon: <PieIcon />
  },
  {
    key: 'doughnut',
    name: 'Doughnut',
    icon: <PieIcon />
  },
  {
    key: 'stack-bar',
    name: 'Stack Bar',
    icon: <BarIcon />
  },
  {
    key: 'stack-cluster-column',
    name: 'Stack Cluster Column',
    icon: <BarIcon />
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
    <div class="sidebar w-80 h-screen text-gray-800 flex flex-col">
      <div class="p-4 text-xl font-bold">Chart Types</div>
      <ul class="flex-1 space-y-2 p-4">
        {chartTypes.map((chartType, index) => (
          <li key={index}>
            <button
              class={`sidebar-item flex items-center w-full text-left p-2 rounded ${chartType.key === selectedChartType ? 'active' : ''}`}
              onClick={() => handleOnSidebarClick(chartType)}
            >
              <div class="icon h-5 w-5">{chartType.icon}</div>
              {chartType.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
