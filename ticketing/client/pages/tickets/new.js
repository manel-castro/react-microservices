import { useState } from "react";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => {
      console.log("ticket: ", ticket);
      Router.push("/");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  const onBlurHandler = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      // default isNaN if passed other than number
      return;
    }

    setPrice(value.toFixed(2)); //Two decimals
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onBlur={onBlurHandler}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
