import { Loader2 } from 'lucide-react';
import './LoadingPage.css';

export default function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <Loader2 className="loading-spinner" />
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
}
