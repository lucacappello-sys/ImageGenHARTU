import './App.css';
import { useState } from 'react';
import WelcomePage from './Pages/WelcomePage';
import RoleSelectionPage from './Pages/RoleSelectionPage';
import TakePicturePage from './Pages/TakePicturePage';
import ResultsPage from './Pages/ResutsPage';
import LoadingPage from './Pages/LoadingPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [selectedRole, setSelectedRole] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState(null);


  const handleStart = () => {
    setCurrentPage('role-selection');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPage('take-picture');
  };

  const handleBackFromRoleSelection = () => {
    setCurrentPage('welcome');
  };

  const handleBackFromTakePicture = () => {
    setCurrentPage('role-selection');
  };

  // const handleContinueFromTakePicture = (image) => {
  //   setCapturedImage(image);
  //   setCurrentPage('results');
  // };

  const handleCloseResults = () => {
    setCurrentPage('welcome');
    setSelectedRole(null);
    setCapturedImage(null);
  };

  return (
    <div className="app-container">
      {currentPage === 'welcome' && (
        <WelcomePage onStart={handleStart} />
      )}
      {currentPage === 'role-selection' && (
        <RoleSelectionPage
          onNext={handleRoleSelect}
          onBack={handleBackFromRoleSelection}
        />
      )}
      {currentPage === 'take-picture' && selectedRole && (
        <TakePicturePage
          rolePrompt={selectedRole.prompt}
          onBack={handleBackFromTakePicture}
          onContinue={(img, genUrl) => {
            setCurrentPage('results');
            setCapturedImage(img);
            setGeneratedUrl(genUrl);   // 🔑 salva anche l’URL generato
          }
          }
        />
      )}
  
      {currentPage === 'results' && selectedRole && capturedImage && (
        <ResultsPage
          selectedRole={selectedRole}
          capturedImage={capturedImage}
          generatedImageUrl={generatedUrl}
          onClose={handleCloseResults}
        />
      )}
      
    </div>
  );
}
