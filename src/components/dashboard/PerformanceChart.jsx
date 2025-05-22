import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

const PerformanceChart = ({ options, series, type = 'line', height = 350, width = '100%' }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="h-[350px] w-full flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-lg">Loading chart...</div>;
  }
  
  return <Chart options={options} series={series} type={type} height={height} width={width} />;
};

PerformanceChart.propTypes = {
  options: PropTypes.object.isRequired,
  series: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
  type: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PerformanceChart;