const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());  

let persons = [];     

app.get('/api/persons', (req, res) => {
  res.json(persons);
});


app.post('/api/persons', (req, res) => {
  const person = req.body;
  console.log(person);  
  persons.push(person);
  res.status(201).json(person);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
