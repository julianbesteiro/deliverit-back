const mockRequest = (data = {}) => {
  return {
    ...data,
  } as any;
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export { mockRequest, mockResponse };
