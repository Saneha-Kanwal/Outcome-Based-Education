/**
 * Card component for OBE System
 * Reusable card container
 */

import './Card.css';

const Card = ({ title, description, children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {description && <p className="card-description">{description}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;

