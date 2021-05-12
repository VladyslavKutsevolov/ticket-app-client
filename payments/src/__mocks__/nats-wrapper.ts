export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((sub: string, data: string, cb: () => void) => {
        cb();
      }),
  },
};
