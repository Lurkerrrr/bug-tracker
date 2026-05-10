export default (): any => {
  return {
    enviroment: `${process.env.ENV}`,
    port: parseInt(`${process.env.PORT}`, 10),
    jwt: {
      secret: `${process.env.JWT_TOKEN}`,
      expiration: `${process.env.JWT_EXPIRATION}`,
      expirationExchange: `${process.env.JWT_EXPIRATION_EXCHANGE}`,
    },
  };
};
