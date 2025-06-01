# ETL Platform with Data Visualization

A web-based platform for uploading, processing, and visualizing CSV and Excel files with built-in authentication.

## Features

- User authentication (register/login)
- File upload support for CSV and Excel files
- Automatic data extraction and cleaning
- Data preview in tabular format
- Interactive data visualization (Bar, Line, Pie charts)
- Download processed data
- Responsive design with Chakra UI

## Tech Stack

### Frontend
- React with Vite
- Chakra UI for styling
- React Router for navigation
- Recharts for data visualization
- React Table for data display
- Axios for API communication

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- Multer for file uploads
- XLSX and CSV-Parse for file processing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

## Setup Instructions

1. Clone the repository

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Datasets
- POST `/api/datasets/upload` - Upload new dataset
- GET `/api/datasets` - Get all datasets
- GET `/api/datasets/:id` - Get single dataset
- GET `/api/datasets/:id/download` - Download processed dataset
- DELETE `/api/datasets/:id` - Delete dataset

## File Processing

The platform supports:
- CSV files
- Excel files (.xlsx)

Processing includes:
- Data extraction
- Column type detection
- Basic data cleaning
- Preview generation
- CSV conversion

## Data Visualization

Available chart types:
- Bar Chart
- Line Chart
- Pie Chart

Features:
- Dynamic axis selection
- Automatic data aggregation
- Responsive design
- Interactive tooltips

## Security Features

- JWT-based authentication
- Password hashing
- Protected API routes
- File type validation
- File size limits

## Error Handling

- Comprehensive API error responses
- Frontend error notifications
- File upload validation
- Data processing error handling

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT