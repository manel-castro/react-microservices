import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("I'm in the component ", currentUser);
  return currentUser ? (
    <h4>You're logged in</h4>
  ) : (
    <h4>You're NOT logged in</h4>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("Landing page!! ");
  const client = buildClient(context);
  return;
  const { data } = await client.get("api/users/currentuser");

  return data;
};

export default LandingPage;
