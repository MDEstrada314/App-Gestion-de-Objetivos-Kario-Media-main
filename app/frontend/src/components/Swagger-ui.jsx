import React, {useState} from "react";
import SwaggerUi from "swagger-ui-react"
import 'swagger-ui-react/swagger-ui.css';
import swaggerYaml from './../../../../'; 

const MyComponent = () => {
  const [showSwagger, setShowSwagger] = useState(false);

  const toggleSwagger = () => {
    setShowSwagger(!showSwagger);
  };

  return (
    <div>
      <button onClick={toggleSwagger}>Mostrar Swagger</button>
      {showSwagger && (
        <SwaggerUi spec={"swaggerJson"} />
      )}
    </div>
  );
};

export default MyComponent;