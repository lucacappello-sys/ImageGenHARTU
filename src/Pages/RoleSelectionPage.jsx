import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import './RoleSelectionPage.css';

const roles = [
  {
    id: 'smart-line-operator',
    title: 'SMART LINE OPERATOR',
    description: 'Works alongside robots in shared areas, supervises their operations, and performs basic troubleshooting. As robots handle the most manual and repetitive tasks, this role requires broader skills than before, especially technical, analytical, and collaboration skills.',
    color: '#3FACE2',
    prompt: "A photorealistic half-length portrait of a person with the same face, expression, and original colors as the base image. The person is wearing blue work overalls over a white t-shirt and a well-proportioned yellow hard hat. The background is a realistic, naturally lit vegetable packaging factory, with details such as conveyor belts, plastic crates filled with vegetables, workers handling produce, and industrial equipment. The environment should reflect the role of a SMART LINE OPERATOR, showing an organized, professional workspace with coherent textures, lights, and shadows. The image should look like a real photograph with natural lighting and believable factory context.",
    image: './images/Smart operator.png'
  },
  {
    id: 'plant-flow-keeper',
    title: 'PLANT FLOW-KEEPER',
    description: 'Manages and coordinates the team and work area, supervises production flows, supports operators and robots and ensures process efficiency. The role combines strong management, technical, operational, and analytical skulls to plan activities, resolve medium-level issues, and maintain smooth and safe production operations.',
    color: '#E69B38',
    prompt: "A photorealistic half-length portrait of a person with the same face, expression, and original colors as the base image. The person is wearing a clean light-blue button-up work shirt with rolled sleeves and dark work trousers, combined with a well-proportioned yellow hard hat, giving a professional supervisory appearance. In one hand, he is holding a visible checklist clipboard. The background is a realistic, naturally lit vegetable packaging factory with conveyor belts, crates filled with vegetables, robotic arms, and workers. The environment must reflect the role of PLANT FLOW KEEPER: managing and coordinating the team and work area, supervising production flows, supporting operators and robots, and ensuring process efficiency. Coherent textures, lights, and shadows.",
    image: './images/Plant.png'
  },
  {
    id: 'tech-solver',
    title: 'TECH SOLVER',
    description: 'Acts as the reference for programming robots, configuring systems to optimise production processes, performing maintenance, and solving technical issues. Requires strong technical skills on new programming codes and solid analytical skills.',
    color: '#2956A5',
    prompt: "A photorealistic half-length portrait of a person with the same face, expression, and original colors as the base image. The person is wearing a dark blue technical work uniform with pockets, and an orange reflective safety vest on top, highlighting a technical supervisor role. He is not wearing a hat or helmet. In one hand, the person is holding a rugged laptop showing code or system diagnostics, symbolizing robot programming and technical problem solving. The background is a realistic, naturally lit vegetable packaging factory with robotic arms, conveyor belts, and industrial control panels, emphasizing automation and technology. The environment must reflect the role of TECH SOLVER: programs robots, configures systems to optimize production processes, performs maintenance, and solves technical issues. Make it look like a real professional photograph with coherent textures, lights, and shadows, conveying strong technical expertise, precision, and analytical skills.",
    image: './images/Tech.png'
  }
];

export default function RoleSelectionPage({ onNext, onBack }) {
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const selectedRole = roles.find(role => role.id === selectedRoleId);

  const handleNext = () => {
    if (selectedRole) {
      onNext(selectedRole);
    }
  };

  return (
    <div className="role-selection-page">
      <div className="role-selection-header-container">
        <div className="role-selection-header-content">
          <h2 className="role-selection-title">Choose the role:</h2>
          <p className="role-selection-subtitle">Select the role to interpret</p>
        </div>
      </div>

      <div className="role-selection-body">
        <div className="role-selection-body-content">
          <div className="role-cards-grid">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                isSelected={selectedRoleId === role.id}
                onClick={() => setSelectedRoleId(role.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="role-selection-footer-container">
        <div className="role-selection-footer-content">
          <button onClick={onBack} className="back-button">
            <ChevronLeft className="back-icon" />
          </button>

          <div className="pagination-dots">
            {[0, 1, 2].map((page) => (
              <div
                key={page}
                className={`pagination-dot ${page === currentPage ? 'active' : ''}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedRoleId}
            className={`continue-button ${!selectedRoleId ? 'disabled' : ''}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`role-card ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: role.color }}
    >
      <div className="role-card-image">
        {role.image ? (
          <img src={role.image} alt={role.title} className="role-card-img" />
        ) : (
          <div className="role-card-placeholder">
            Role Illustration
          </div>
        )}
      </div>
      <h3 className="role-card-title">{role.title}</h3>
      <p className="role-card-description">
        {role.description}
      </p>
    </div>
  );
}
