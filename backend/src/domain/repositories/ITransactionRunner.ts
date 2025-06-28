export interface ITransactionRunner {
  run<T>(callback: () => Promise<T>): Promise<T>;
}