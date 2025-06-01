import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';
import DataPreview from './DataPreview';
import DataVisualization from './DataVisualization';

const Dashboard = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/datasets');
      setDatasets(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching datasets',
        description: error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleUploadSuccess = (dataset) => {
    setDatasets([dataset, ...datasets]);
    setSelectedDataset(dataset);
  };

  const handleDatasetSelect = async (dataset) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/datasets/${dataset._id}`);
      setSelectedDataset(response.data);
    } catch (error) {
      toast({
        title: 'Error loading dataset',
        description: error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDownload = async (dataset) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/datasets/${dataset._id}/download`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `processed_${dataset.originalName}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Error downloading dataset',
        description: error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDelete = async (dataset) => {
    try {
      await axios.delete(`http://localhost:5000/api/datasets/${dataset._id}`);
      setDatasets(datasets.filter(d => d._id !== dataset._id));
      if (selectedDataset?._id === dataset._id) {
        setSelectedDataset(null);
      }
      toast({
        title: 'Dataset deleted',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Error deleting dataset',
        description: error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000
      });
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Welcome, {user.name}</Heading>
        </HStack>

        <Box borderWidth={1} borderRadius="lg" p={4} bg="white">
          <Heading size="md" mb={4}>Upload New Dataset</Heading>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </Box>

        <HStack spacing={6} align="flex-start">
          <Box flex={1} borderWidth={1} borderRadius="lg" p={4} bg="white">
            <Heading size="md" mb={4}>Your Datasets</Heading>
            <VStack spacing={3} align="stretch">
              {datasets.map(dataset => (
                <Box
                  key={dataset._id}
                  p={3}
                  borderWidth={1}
                  borderRadius="md"
                  cursor="pointer"
                  bg={selectedDataset?._id === dataset._id ? 'blue.50' : 'white'}
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => handleDatasetSelect(dataset)}
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{dataset.originalName}</Text>
                      <HStack spacing={2}>
                        <Badge colorScheme={dataset.status === 'completed' ? 'green' : 'yellow'}>
                          {dataset.status}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(dataset.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                    </VStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        variant="ghost"
                        size="sm"
                        icon={<Text>⋮</Text>}
                      />
                      <MenuList>
                        <MenuItem onClick={() => handleDownload(dataset)}>
                          Download
                        </MenuItem>
                        <MenuItem onClick={() => handleDelete(dataset)} color="red.500">
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Box>
              ))}
              {datasets.length === 0 && (
                <Text color="gray.500" textAlign="center">
                  No datasets uploaded yet
                </Text>
              )}
            </VStack>
          </Box>

          <Box flex={2} borderWidth={1} borderRadius="lg" p={4} bg="white">
            {selectedDataset ? (
              <Tabs>
                <TabList>
                  <Tab>Preview</Tab>
                  <Tab>Visualize</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <DataPreview
                      data={selectedDataset.previewData}
                      columns={selectedDataset.columns}
                    />
                  </TabPanel>
                  <TabPanel>
                    <DataVisualization
                      data={selectedDataset.previewData}
                      columns={selectedDataset.columns}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <Text color="gray.500" textAlign="center">
                Select a dataset to view details
              </Text>
            )}
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Dashboard;