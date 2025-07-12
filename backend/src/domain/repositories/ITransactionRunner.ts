export interface ITransactionRunner {
  run<T>(callback: (tx: any) => Promise<T>): Promise<T>;
}