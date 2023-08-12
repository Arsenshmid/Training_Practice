const soapRequest = require('easy-soap-request');

const soapClient = async (url, headers, xml) => {
  const { response } = await soapRequest(url, headers, xml);
  const { body } = response;
  return body;
};

export default soapClient;
