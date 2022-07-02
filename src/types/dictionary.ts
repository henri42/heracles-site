export interface IEvent {
  argsValue: string[];
  block: {
    timestamp: string;
  };
}

export interface IEventsResponse {
  events: {
    totalCount: number;
    nodes: IEvent[];
  };
}