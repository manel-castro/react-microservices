import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header! {currentUser.email} </h1>
      <Component {...pageProps} />
    </div>
  );
};
/**
 * this is a custom app component (not a page), has different props,
 * this instead has a ctx property
 */
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  // pageProps needed since next loses the automatic getInitialProps because of AppComponent

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data };
};

export default AppComponent;
