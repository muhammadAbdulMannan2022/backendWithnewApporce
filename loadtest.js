import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    spike_test: {
      executor: "constant-arrival-rate",
      rate: 10, // start with 10 RPS
      timeUnit: "1s",
      duration: "1s",
      preAllocatedVUs: 10,
      maxVUs: 50,
    },
  },
};

const BASE_URL = "http://10.10.13.30:4000/";

export default function () {
  const res = http.get(BASE_URL);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response < 5000ms": (r) => r.timings.duration < 5000,
  });
}
