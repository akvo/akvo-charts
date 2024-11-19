'use client';

import React, { useState } from 'react';
import './styles.css';
import {
  useDisplayContext,
  useDisplayDispatch
} from '../../context/DisplayContextProvider';
import {
  useChartContext,
  useChartDispatch
} from '../../context/ChartContextProvider';
import {
  BarIcon,
  LineIcon,
  PieIcon,
  ScatterPlotIcon,
  MapIcon,
  ChevronDownIcon
} from '../Icons';
import {
  chartTypes,
  choroplethExampleColor,
  choroplethExampleData
} from '../../static/config';

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
    icon: <MapIcon />,
    subItems: [
      {
        key: chartTypes.CHOROPLETH_MAP,
        name: 'Choropleth Map',
        icon: null
      },
      {
        key: chartTypes.CLUSTER_MAP,
        name: 'Cluster Map',
        icon: null
      }
    ]
  }
];

const Sidebar = () => {
  const [openSubItems, setOpenSubItems] = useState([]);

  const chartDispatch = useChartDispatch();
  const displayDispatch = useDisplayDispatch();

  const { selectedChartType, fullScreen } = useDisplayContext();
  const { isMap, isEdited, mapConfig } = useChartContext();

  const handleOnSidebarClick = ({ key }) => {
    const hasSubItems = sidebarList.find(
      (k) => k?.key === key && k?.subItems?.length
    );
    if (hasSubItems) {
      // toggle submenu items
      setOpenSubItems(
        (prevOpenItems) =>
          prevOpenItems.includes(key)
            ? prevOpenItems.filter((id) => id !== key) // Close if already open
            : [...prevOpenItems, key] // Open if not already open
      );
    }
    const isMapType = [
      chartTypes.MAP,
      chartTypes.CHOROPLETH_MAP,
      chartTypes.CLUSTER_MAP
    ].includes(key);
    if (isMap && !isMapType) {
      chartDispatch({
        type: 'MAP_HIDE'
      });
    }
    if (!isMap && isMapType) {
      chartDispatch({
        type: 'MAP_SHOW'
      });
    }
    if (isEdited) {
      chartDispatch({
        type: 'SET_EDITED',
        payload: false
      });
    }
    displayDispatch({
      type: 'SET_SELECTED_CHART_TYPE',
      payload: key
    });
    if (key === chartTypes.CHOROPLETH_MAP) {
      chartDispatch({
        type: 'UPDATE_MAP',
        payload: {
          data: choroplethExampleData,
          layer: {
            ...mapConfig?.layer,
            style: {
              ...mapConfig?.layer?.style,
              fillOpacity: 0.7
            },
            color: choroplethExampleColor,
            mapKey: 'Propinsi',
            choropleth: 'density'
          }
        }
      });
    }
    if (key === chartTypes.MAP) {
      chartDispatch({
        type: 'RESET_MAP'
      });
    }
    if (key === chartTypes.CLUSTER_MAP) {
      chartDispatch({
        type: 'RESET_MAP'
      });
    }
  };

  return (
    <div
      className={`${fullScreen ? '-ml-72' : ''} flex-shrink-0 w-full lg:w-72 h-auto lg:h-[calc(100vh-20px)] sidebar text-gray-800 flex flex-col animate-fadeIn transition-all duration-300`}
    >
      <div className="p-4 text-xl font-bold">Chart Types</div>
      <ul className="flex flex-row lg:flex-col items-center lg:items-start py-0 lg:py-4">
        {sidebarList.map((chartType, index) => (
          <li
            className={`w-full p-2 text-center sidebar-item ${chartType.key === selectedChartType ? 'active' : ''}`}
            key={index}
          >
            <button
              className={`flex items-center justify-between w-full text-left p-2`}
              onClick={() => handleOnSidebarClick(chartType)}
            >
              <div>
                <div className="icon h-5 w-5 float-left">{chartType.icon}</div>
                <div className="hidden lg:block float-left">
                  {chartType.name}
                </div>
              </div>
              {chartType?.subItems?.length > 0 && (
                <div
                  className={`${openSubItems.includes(chartType?.key) ? 'rotate-0' : 'rotate-90'} transition-all`}
                >
                  <ChevronDownIcon />
                </div>
              )}
            </button>
            <ul
              className={`${openSubItems.includes(chartType?.key) ? 'block' : 'hidden'} transition-all`}
            >
              {chartType?.subItems?.map((sub, sx) => (
                <li
                  className={`w-full pl-8 py-2 pr-2 text-center sidebar-item ${sub.key === selectedChartType ? 'active' : ''}`}
                  key={sx}
                >
                  <button
                    className={`flex items-center justify-between w-full text-left p-2`}
                    onClick={() => handleOnSidebarClick(sub)}
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
