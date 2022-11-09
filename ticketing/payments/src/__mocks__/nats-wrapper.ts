export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, datas: string, callback: () => void) => {
          callback();
        }
      ),

    // publish: (subject: string, datas: string, callback: () => void) => {
    //   callback();
    // },
  },
};
