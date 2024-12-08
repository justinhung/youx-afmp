import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css'; // Import CSS

const SwaggerUIComponent = () => {
  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI url="/openapi.json" />
    </div>
  );
};

export default SwaggerUIComponent;
