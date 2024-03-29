import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import { Header } from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
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
    // This populates all componenents with Component.getInitialProps
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return { pageProps, ...data };
};

export default AppComponent;
