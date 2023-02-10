import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we're on the server
    // here cookies (for token) are not managed by default
    // http://SERVICENAME.NAMESPACE.svc.cluster.local/
    //  kubectl get services -n ingress-nginx (accessing to a different namespace)

    return axios.create({
      // baseURL:
      //   "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/", // for dev
      baseURL: "http://www.indive.info/", // for prod
      headers: req.headers,
      // headers: {
      //   Host: "ticketing.dev", // this is used by ingress-nginx for routing
      // we'd need to specify cookies too
      // },
    });
  } else {
    // we're on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
