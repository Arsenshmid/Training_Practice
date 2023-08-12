const express = require('express');
const router = express.Router();

router.post('/addTest', (req, res) => {
    const { name } = req.body;
    // Вставить новый тест в базу данных
    db('tests').insert({name})
      .then(() => {
        res.json({message: "Test added successfully"});
      })
      .catch(err => {
        res.status(500).json({message: "Error adding test"});
      });
});

module.exports = router;
