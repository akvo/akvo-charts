'use client';

import React from 'react';
import './styles.css';
import {
  useDisplayContext,
  useDisplayDispatch
} from '../../context/DisplayContextProvider';
import { useChartDispatch } from '../../context/ChartContextProvider';
import { BarIcon, LineIcon, PieIcon, ScatterPlotIcon, MapIcon } from '../Icons';
import { chartTypes } from '../../static/config';

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
  },
  {
    key: chartTypes.MAP,
    name: 'GEO/Map',
    icon: <MapIcon />
  }
];

const Sidebar = () => {
  const chartDispatch = useChartDispatch();
  const displayDispatch = useDisplayDispatch();

  const { selectedChartType, fullScreen } = useDisplayContext();

  const handleOnSidebarClick = ({ key }) => {
    chartDispatch({
      type: key === chartTypes.MAP ? 'MAP_SHOW' : 'MAP_HIDE'
    });
    displayDispatch({
      type: 'SET_SELECTED_CHART_TYPE',
      payload: key
    });
    chartDispatch({
      type: 'SET_EDITED',
      payload: false
    });
  };

  return (
    <div className={`${fullScreen ? '-ml-72' : ''} flex-shrink-0 w-full lg:w-72 h-auto lg:h-[calc(100vh-20px)] sidebar text-gray-800 flex flex-col animate-fadeIn transition-all duration-300`}>
      <div className="p-4 text-xl font-bold">Chart Types</div>
      <ul className="flex flex-row lg:flex-col items-center lg:items-start py-0 lg:py-4">
        {sidebarList.map((chartType, index) => (
          <li className={`w-full p-2 text-center sidebar-item ${chartType.key === selectedChartType ? 'active' : ''}`} key={index}>
            <button
              className={`flex items-center w-full text-left p-2`}
              onClick={() => handleOnSidebarClick(chartType)}
            >
              <div className="icon h-5 w-5">{chartType.icon}</div>
              <div className="hidden lg:block">{chartType.name}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
