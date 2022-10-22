import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    // this._client // no ts error, but inside promise ts error

    return new Promise<void>((res, rej) => {
      this._client!.on("connect", () => {
        console.log("Connected to Nats!");

        res();
      });
      this._client!.on("error", (err) => {
        rej(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
