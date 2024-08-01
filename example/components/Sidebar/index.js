'use client';

import React from 'react';
import './styles.css';
import {
  useDisplayContext,
  useDisplayDispatch
} from '../../context/DisplayContextProvider';
import { BarIcon, LineIcon, PieIcon, ScatterPlotIcon } from '../Icons';
import { chartTypes, scatterPlotExampleData } from '../../static/config';
import { useChartDispatch } from '../../context/ChartContextProvider';

const sidebarList = [
  {
    key: chartTypes.BAR,
    name: 'Bar',
    icon: <BarIcon />
  },
  {
    key: chartTypes.LINE,
    name: 'Line',
    icon: <LineIcon />
  },
  {
    key: chartTypes.PIE,
    name: 'Pie',
    icon: <PieIcon />
  },
  {
    key: chartTypes.DOUGHNUT,
    name: 'Doughnut',
    icon: <PieIcon />
  },
  {
    key: chartTypes.STACK_BAR,
    name: 'Stack Bar',
    icon: <BarIcon />
  },
  {
    key: chartTypes.STACK_CLUSTER,
    name: 'Stack Cluster Column',
    icon: <BarIcon />
  },
  {
    key: chartTypes.SCATTER_PLOT,
    name: 'Scatter Plot',
    icon: <ScatterPlotIcon />
  },
  {
    key: chartTypes.STACK_LINE,
    name: 'Stack Line',
    icon: <LineIcon />
  }
];

const Sidebar = () => {
  const chartDispatch = useChartDispatch();
  const displayDispatch = useDisplayDispatch();
  const { selectedChartType } = useDisplayContext();

  const handleOnSidebarClick = ({ key }) => {
    displayDispatch({
      type: 'SET_SELECTED_CHART_TYPE',
      payload: key
    });

    if (key === chartTypes.SCATTER_PLOT) {
      chartDispatch({
        type: 'UPDATE_CHART',
        payload: {
          data: scatterPlotExampleData
        }
      });
    }
  };

  return (
    <div className="sidebar w-80 h-screen text-gray-800 flex flex-col">
      <div className="p-4 text-xl font-bold">Chart Types</div>
      <ul className="flex-1 space-y-2 p-4">
        {sidebarList.map((chartType, index) => (
          <li key={index}>
            <button
              className={`sidebar-item flex items-center w-full text-left p-2 rounded ${chartType.key === selectedChartType ? 'active' : ''}`}
              onClick={() => handleOnSidebarClick(chartType)}
            >
              <div className="icon h-5 w-5">{chartType.icon}</div>
              {chartType.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
