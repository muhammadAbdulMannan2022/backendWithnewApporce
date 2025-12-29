import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 5 }, // ramp up
    { duration: "20s", target: 10 }, // steady load
    { duration: "10s", target: 0 }, // ramp down
  ],
};

const BASE_URL = "https://d43b51591bef.ngrok-free.app";

export default function () {
  const payload = JSON.stringify({
    email: "programalltest@gmail.com",
    password: "12345678",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  check(res, {
    "status is 200 or 401": (r) => r.status === 200 || r.status === 401,
    "response < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
