import './WelcomePage.css';

export default function WelcomePage({ onStart }) {
  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <div className="welcome-card">
          <h1 className="welcome-title">
            Future Operator Game
          </h1>
          <p className="welcome-description">
            Are you curious to get a preview of how the human role <br></br>will evolve in Industry 5.0?
          </p>
          <p className="welcome-description">
            Step into the future and experience what it’s like to be an operator in <br></br>Industry 5.0, exploring the new tasks to be performed and the skills <br></br>required.
          </p>
          <button onClick={onStart} className="welcome-button">
            START
          </button>
        </div>
      </div>
    </div>
  );
}
