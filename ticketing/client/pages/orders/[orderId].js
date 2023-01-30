import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [msLeft, setMsLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      Router.push("/orders");
      console.log(payment);
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const _msLeft = new Date(order.expiresAt) - new Date();

      if (_msLeft < 0) {
        clearInterval(interval);
        setMsLeft(0);
        return;
      }

      setMsLeft(Math.round(_msLeft / 1000));
    };

    findTimeLeft(); //since setInterval is 1s late
    const interval = setInterval(findTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {msLeft ? `Time left to pay: ${msLeft} seconds.` : "Order expired."}
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51MUbfaAs0ZMWFe7sEUq8NaCEbtc3rd7phzi8yxgcrgvqS83vHkBdzj4wg0lwCUSsqMQsSPdwDDQyvHDob4y25kg700l0cYya1m"
        amount={order.ticket.price}
        email={currentUser.email}
      ></StripeCheckout>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
