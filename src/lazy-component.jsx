import React, { useState, useEffect, cloneElement } from 'react';

const LazyComponent = ({ module, pluginProps = {} }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const { default: loadedComponent } = await module?.();
        setComponent(loadedComponent);
      } catch (error) {
        console.error('Error loading component:', error);
      }
    };

    loadComponent();
  }, [module]);

  if (!Component) {
    return <div>Loading...</div>;
  }

  console.log('Component', Component);

  return cloneElement(Component, pluginProps);
};

export default LazyComponent;
