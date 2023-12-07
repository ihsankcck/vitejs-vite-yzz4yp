import { useEffect, useState } from 'react';
import '../App.css';
import LazyComponent from '../lazy-component';

const getPluginModule = (pluginPathName) => () =>
  import(`../plugins/${pluginPathName}/index.jsx`);

const importPlugins = async () => {
  try {
    const [configs, schemas] = await Promise.all([
      import.meta.glob('@/plugins/*/config.js', { eager: true }),
      import.meta.glob('@/plugins/*/schema.js', { eager: true }),
    ]);

    const plugins = Object.entries(configs).reduce(
      (acc, [configPathName, configModule]) => {
        const basePath = configPathName.replace(/\/config\.([jt]sx?)$/, '');

        const schemaModule = schemas[basePath + '/schema.js'];

        const dynamicModulePath = basePath.replace('/src/plugins/', '');

        const config = configModule?.default;
        const schema = schemaModule?.default?.();

        return {
          ...acc,
          [config.namespace]: {
            config,
            schema,
            module: getPluginModule(dynamicModulePath),
          },
        };
      },
      {}
    );

    return plugins;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

function App() {
  const [plugins, setPlugins] = useState({});

  console.log(plugins);

  useEffect(() => {
    const fetchPlugins = async () => {
      setPlugins(await importPlugins());
    };

    fetchPlugins();
  }, []);

  if (!plugins['button']) return null;

  return Object.entries(plugins).map(([name, plugin]) => (
    <LazyComponent module={plugins[plugin.config.namespace]?.module} />
  ));
}

export default App;
