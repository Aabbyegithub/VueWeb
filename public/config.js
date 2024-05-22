const environments = {
    development: {
      apiUrl: 'http://localhost:5069/api',
    },
    production: {
      apiUrl: 'http://localhost:5069/api',
    },
  };
  
  const getCurrentEnvironment = () => {
    if (process.env.NODE_ENV === 'development') return 'development';
    return 'production';
  };
  
  const env = getCurrentEnvironment();
  const environment = environments[env];
  
  //export default environment;
  module.exports ={
     environment,
  } 