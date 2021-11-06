type ParamsQueue = {
  url: string;
  staticPath: string;
};

interface ImageServiceInterface {
  downloadImage: (
    imageUrl: string,
    priority?: number,
  ) => void;
}

export { ParamsQueue, ImageServiceInterface };
