import buildClient from "../api/build-client";

const LandingPage = ({ currentUser, tickets }) => {
  console.log("I'm in the component ", currentUser);
  console.log("I'm in the component tickets ", tickets);

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  // the returning object will be merged as props into landingpage
  return {
    tickets: data,
  };
};

export default LandingPage;
