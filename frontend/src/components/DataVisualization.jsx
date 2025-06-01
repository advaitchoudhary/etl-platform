import React, { useState, useMemo } from 'react';
import {
  Box,
  Select,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Button
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';

const CHART_TYPES = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie'
};

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D'
];

const DataVisualization = ({ data, columns }) => {
  const [chartType, setChartType] = useState(CHART_TYPES.BAR);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');

  const numericColumns = useMemo(() => {
    return columns.filter(col => col.type === 'number');
  }, [columns]);

  const stringColumns = useMemo(() => {
    return columns.filter(col => col.type === 'string');
  }, [columns]);

  const processedData = useMemo(() => {
    if (!xAxis || !yAxis || !data.length) return [];

    if (chartType === CHART_TYPES.PIE) {
      const aggregated = data.reduce((acc, item) => {
        const key = item[xAxis];
        acc[key] = (acc[key] || 0) + Number(item[yAxis]);
        return acc;
      }, {});

      return Object.entries(aggregated).map(([name, value]) => ({
        name,
        value
      }));
    }

    return data.map(item => ({
      name: item[xAxis],
      value: Number(item[yAxis])
    }));
  }, [data, xAxis, yAxis, chartType]);

  const renderChart = () => {
    if (!processedData.length) return null;

    switch (chartType) {
      case CHART_TYPES.BAR:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case CHART_TYPES.LINE:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );

      case CHART_TYPES.PIE:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white">
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Chart Type</FormLabel>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value={CHART_TYPES.BAR}>Bar Chart</option>
              <option value={CHART_TYPES.LINE}>Line Chart</option>
              <option value={CHART_TYPES.PIE}>Pie Chart</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>X-Axis (Category)</FormLabel>
            <Select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              placeholder="Select column"
            >
              {stringColumns.map(col => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Y-Axis (Value)</FormLabel>
            <Select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              placeholder="Select column"
            >
              {numericColumns.map(col => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>

        {processedData.length > 0 ? (
          <Box height="400px">{renderChart()}</Box>
        ) : (
          <Text textAlign="center" color="gray.500">
            Select columns to visualize the data
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default DataVisualization;