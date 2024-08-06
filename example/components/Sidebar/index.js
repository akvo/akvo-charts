'use client';

import React, { useEffect } from 'react';
import './styles.css';
import {
  useDisplayContext,
  useDisplayDispatch
} from '../../context/DisplayContextProvider';
import {
  useChartDispatch,
  useChartContext
} from '../../context/ChartContextProvider';
import { BarIcon, LineIcon, PieIcon, ScatterPlotIcon } from '../Icons';
import {
  excludeHorizontal,
  excludeStackMapping,
  basicChart,
  stackChartExampleData,
  chartTypes,
  scatterPlotExampleData,
  basicChartExampleData,
  exampleStackMapping
} from '../../static/config';
import { useLocalStorage } from '../../utils';
import { useECharts } from '../../../src/hooks';

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
  const displayDispatch = useDisplayDispatch();
  const { selectedChartType } = useDisplayContext();
  const chartDispatch = useChartDispatch();
  const { defaultConfig } = useChartContext();
  const [_, setDefaultStore] = useLocalStorage('defaultConfig', null);
  const [__, setRawStore] = useLocalStorage('rawConfig', null);

  useEffect(() => {
    const res = { ...defaultConfig, data: basicChartExampleData };
    delete res.stackMapping;
    chartDispatch({
      type: 'UPDATE_CHART',
      payload: res
    });
    setDefaultStore(res);
  }, []);

  const handleOnSidebarClick = ({ key }) => {
    // set default value
    let res = { ...defaultConfig, data: basicChartExampleData };
    if (!basicChart.includes(key)) {
      res = {
        ...res,
        data: stackChartExampleData
      };
    }
    if (key === chartTypes.SCATTER_PLOT) {
      res = {
        ...res,
        data: scatterPlotExampleData
      };
    }
    if (excludeHorizontal.includes(key)) {
      const transform = { ...res };
      delete transform.config.horizontal;
      res = transform;
    }
    if (excludeStackMapping.includes(key)) {
      const transform2 = { ...res };
      delete transform2.stackMapping;
      res = transform2;
    }
    if (!excludeStackMapping.includes(key)) {
      res = { ...res, stackMapping: exampleStackMapping };
    }
    chartDispatch({
      type: 'UPDATE_CHART',
      payload: res
    });
    displayDispatch({
      type: 'SET_SELECTED_CHART_TYPE',
      payload: key
    });
    chartDispatch({
      type: 'SET_EDITED',
      payload: false
    });
    setDefaultStore(res);
    setRawStore(null);
  };

  return (
    <div className="sidebar w-80 h-[calc(100vh-20px)] text-gray-800 flex flex-col">
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
