import React from 'react';

const AddService = () => {
  return (
    <div>
      <h1>Add Service</h1>
      <form>
        <label>Name:</label>
        <input type="text" name="name" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddService;