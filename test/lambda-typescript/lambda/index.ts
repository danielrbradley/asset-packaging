export const handler = async (event: unknown, context: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello world!",
    }),
  };
};
