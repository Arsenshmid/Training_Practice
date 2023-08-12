import React from 'react';

const AddClient = () => {
  return (
    <div>
      <h1>Add Client</h1>
      <form>
        <label>Name:</label>
        <input type="text" name="name" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddClient;