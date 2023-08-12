import React from 'react';

const AddRequest = () => {
  return (
    <div>
      <h1>Add Request</h1>
      <form>
        <label>Client:</label>
        <select name="client">
          <option value="client1">Client 1</option>
          <option value="client2">Client 2</option>
          <option value="client3">Client 3</option>
        </select>
        <br />
        <label>Service:</label>
        <select name="service">
          <option value="service1">Service 1</option>
          <option value="service2">Service 2</option>
          <option value="service3">Service 3</option>
        </select>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddRequest;