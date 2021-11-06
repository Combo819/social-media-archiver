type ParamsQueue = {
  url: string;
  staticPath: string;
};

interface IVideoService {
  downloadVideo: (videoUrl: string) => void;
}

export { ParamsQueue, IVideoService };
