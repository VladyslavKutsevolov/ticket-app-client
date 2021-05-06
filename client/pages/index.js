import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are sign in</h1> : <h1>You not are sign in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  console.log("landing page");
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
