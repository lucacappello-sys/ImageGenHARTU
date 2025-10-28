import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import './TakePicturePage.css';
import { api } from '../api';
import axios from 'axios';
import LoadingPage from './LoadingPage';





// async function safeParseJSON(res) {
//   const ct = res.headers.get('content-type') || '';
//   if (ct.includes('application/json')) return await res.json();
//   const raw = await res.text().catch(() => '');
//   return { __nonJson: true, raw };
// }

export default function TakePicturePage({ rolePrompt, onBack, onContinue }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('other');
  const [isSending, setIsSending] = useState(false);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!useFileUpload) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [facingMode, useFileUpload]);

  const startCamera = async () => {
    try {
      setError('');
      setErrorType('other');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported in this browser.');
        setErrorType('other');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings and reload the page.');
        setErrorType('permission');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found on this device.');
        setErrorType('notfound');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application.');
        setErrorType('other');
      } else {
        setError('Unable to access camera. Please check your browser permissions.');
        setErrorType('other');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // const switchCamera = () => {
  //   setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  //   setCapturedImage(null);
  // };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function confirmAndSend() {
    if (!capturedImage) return;
    setIsSending(true);
    setSendError('');
    try {
      const base = import.meta.env.VITE_API_BASE || ''; 
      const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;

      const { data } = await axios.post(`${cleanBase}/api/generate`, {
        prompt: rolePrompt || '',
        imageBase64: capturedImage,
      });
      if (!data?.imageUrl) throw new Error(data?.error || 'No imageUrl');
      onContinue?.(capturedImage, data.imageUrl);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.detail || err.message;
      setSendError(status ? `Errore server ${status}: ${msg}` : msg);
    } finally {
      setIsSending(false);
    }
  }


  return (
    <div className="take-picture-page">
      <div className="take-picture-header-container">
        <div className="take-picture-header-content">
          <h2 className="take-picture-title">Take a front-facing photo of yourself</h2>
          <p className="take-picture-subtitle">Position your face at the center of the circle.</p>
        </div>
      </div>

      <div className="take-picture-body">
        <div className="take-picture-body-content">
          <div className="camera-container">
            {error ? (
              <div className="error-state">
                <AlertCircle className="error-icon" />
                <p className="error-message">{error}</p>

                {errorType === 'permission' && (
                  <div className="error-instructions">
                    <p className="error-instructions-title">To enable camera access:</p>
                    <ol className="error-instructions-list">
                      <li>Look for the camera icon in your browser's address bar</li>
                      <li>Click it and select "Allow"</li>
                      <li>Reload the page</li>
                    </ol>
                  </div>
                )}

                <div className="error-actions">
                  <button onClick={startCamera} className="retry-button">
                    Try Again
                  </button>
                  <label className="upload-button">
                    Upload Photo Instead
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="file-input"
                    />
                  </label>
                </div>
              </div>
            ) : capturedImage ? (
              <>
                <img src={capturedImage} alt="Captured" className="captured-image" />
                <div className="camera-overlay">
                  <div className="camera-guide"></div>
                </div>
                <div className="camera-controls">
                  <button onClick={retakePhoto} className="switch-camera-button">
                    <RefreshCw className="switch-camera-icon" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-video"
                />
                <div className="camera-overlay">
                  <div className="camera-guide"></div>
                </div>
                <div className="camera-controls">
                  <button onClick={capturePhoto} disabled={!!error} className="capture-button" title="Capture Photo">
                    <Camera className="capture-icon" />
                  </button>
                  <label className="file-upload-button" title="Upload Photo">
                    <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="file-input"
                    />
                  </label>
                </div>
              </>
            )}
            <canvas ref={canvasRef} className="hidden-canvas" />
          </div>
        </div>
      </div>

      <div className="take-picture-footer-container">
        <div className="take-picture-footer-content">
          <button onClick={onBack} className="back-button">
            <svg className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="progress-indicator">
            <div className="progress-dot"></div>
            <div className="progress-dot active"></div>
            <div className="progress-dot"></div>
            
          </div>

          <button
            onClick={capturedImage ? confirmAndSend : null}
            disabled={!capturedImage || isSending}
            className={`continue-button ${!capturedImage || isSending ? 'disabled' : ''}`}
          >
            {isSending ? 'Sending...' : 'Continue'}

          </button>
        </div>
      </div>
      {isSending && (
        <div className="loading-overlay">
          <LoadingPage message="Generating your portrait..." />
        </div>
      )}
    </div>
  );
}
