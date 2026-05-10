import { AppNotification } from './notifications';

describe('AppNotification', () => {
  let service: AppNotification;

  beforeEach(() => {
    service = {} as AppNotification;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
