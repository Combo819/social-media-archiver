import asyncHandler from 'express-async-handler';
import express, { Request, Response } from 'express';
import { container } from '../../../Config/inversify.config';
import { ResourceError } from '../../../Error/ErrorClass';
import {
  CollectionTypes,
  IMonitorService,
  MONITOR_IOC_SYMBOLS,
} from '../Types';

const monitorRouter = express.Router();

monitorRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const monitorService = container.get<IMonitorService>(
      MONITOR_IOC_SYMBOLS.IMonitorService,
    );
    const monitors = await monitorService.getMonitorCollections();
    res.send(monitors);
  }),
);

monitorRouter.post(
  '/validate',
  asyncHandler(async (req: Request, res: Response) => {
    const { url, type }: { url: string; type: CollectionTypes } = req.body;
    const monitorService = container.get<IMonitorService>(
      MONITOR_IOC_SYMBOLS.IMonitorService,
    );
    const isValid = await monitorService.validate(url, type);
    res.send(isValid);
  }),
);

monitorRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { url, type }: { url: string; type: CollectionTypes } = req.body;
    const monitorService = container.get<IMonitorService>(
      MONITOR_IOC_SYMBOLS.IMonitorService,
    );
    const isAdded = await monitorService.add(url, type);
    res.send(isAdded);
  }),
);

monitorRouter.delete(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { url }: { url: string } = req.body;
    const monitorService = container.get<IMonitorService>(
      MONITOR_IOC_SYMBOLS.IMonitorService,
    );
    const isRemoved = await monitorService.remove(url);
    res.send(isRemoved);
  }),
);

monitorRouter.get(
  '/max',
  asyncHandler((req: Request, res: Response) => {
    const monitorService = container.get<IMonitorService>(
      MONITOR_IOC_SYMBOLS.IMonitorService,
    );
    const max = monitorService.getMaxCollectionSize();
    res.send(max);
  }),
);

monitorRouter.get('/types', (req: Request, res: Response) => {
  const monitorService = container.get<IMonitorService>(
    MONITOR_IOC_SYMBOLS.IMonitorService,
  );
  const types = monitorService.getCollectionTypes();
  res.send(types);
});

export { monitorRouter };
