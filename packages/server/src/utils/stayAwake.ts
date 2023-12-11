export function stayAwake() {
  setInterval(() => {
    void fetch(process.env.HOST + "/health-check");
  }, 1000 * 30);
}
