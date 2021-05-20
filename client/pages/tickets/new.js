import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const newTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  const onBlur = () => {
    const val = parseFloat(price);

    if (isNaN(val)) {
      return;
    }

    setPrice(val.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="form-control"
            type="text"
            id="title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={({ target }) => setPrice(target.value)}
            className="form-control"
            type="text"
            id="price"
          />
        </div>

        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default newTicket;
