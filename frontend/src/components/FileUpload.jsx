import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Text,
  VStack,
  Progress,
  useToast,
  Icon
} from '@chakra-ui/react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV or XLSX file',
        status: 'error',
        duration: 3000
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post('http://localhost:5000/api/datasets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      toast({
        title: 'File uploaded successfully',
        status: 'success',
        duration: 3000
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'An error occurred during upload',
        status: 'error',
        duration: 3000
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [toast, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  return (
    <VStack spacing={4} width="100%">
      <Box
        {...getRootProps()}
        width="100%"
        p={10}
        border="2px"
        borderRadius="lg"
        borderStyle="dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        bg={isDragActive ? 'blue.50' : 'gray.50'}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          borderColor: 'blue.500',
          bg: 'blue.50'
        }}
      >
        <input {...getInputProps()} />
        <VStack spacing={2}>
          <Icon
            viewBox="0 0 24 24"
            boxSize={12}
            color={isDragActive ? 'blue.500' : 'gray.400'}
          >
            <path
              fill="currentColor"
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
            />
          </Icon>
          <Text textAlign="center" fontSize="lg">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop a CSV or XLSX file here, or click to select'}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Maximum file size: 5MB
          </Text>
        </VStack>
      </Box>

      {uploading && (
        <Box width="100%">
          <Progress
            value={uploadProgress}
            size="sm"
            colorScheme="blue"
            borderRadius="full"
          />
          <Text mt={2} fontSize="sm" textAlign="center">
            Uploading... {uploadProgress}%
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default FileUpload;