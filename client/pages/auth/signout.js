import useRequest from "../../hooks/useRequest";
import Router from "next/router";
import { useEffect } from "react";

const Signout = () => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default Signout;
