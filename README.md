# Insurance Analytics Platform

A comprehensive web application for managing and analyzing insurance claims with integrated machine learning capabilities.

## Features

- **Claims Management**
  - Submit new insurance claims
  - Track claim status
  - Upload supporting documents
  - View detailed claim information

- **Analytics Dashboard**
  - Claims summary visualization
  - Real-time status updates
  - Performance metrics
  - Risk assessment insights

- **Report Generation**
  - Generate customized reports
  - Export data in multiple formats
  - Claims analysis by type and status

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Recharts for data visualization
- Python ML Server

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8+ (for ML server)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd insurance-analytics
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install ML server dependencies:
```bash
cd ml_server
pip install -r requirements.txt
```

## Running the Application

You can start both the frontend and ML server using a single command:

```bash
npm run start-dev
```

Or run them separately:

- Frontend only:
```bash
npm start
```

- ML server only:
```bash
cd ml_server
python app.py
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the frontend in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run start-dev` - Starts both frontend and ML server
- `npm run eject` - Ejects from Create React App

## Project Structure

```
insurance-analytics/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API and business logic
│   └── types/          # TypeScript type definitions
├── ml_server/          # Python ML server
└── public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.