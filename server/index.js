const express = require('express');
const app = express();
const port = 5000;
const cors = require("cors");
const pool = require('./db');


//middleware
app.use(cors());
app.use(express.json()); //req.body


// Validates if the car query params are valid
// I could use express-validate, but I don't want another library for such a small task, so i tried to think of a simple function to work with.
const validateCar = async (brand, region) => {
  try {
    // Gets all region names and converts it to array
    const regions = await pool.query(`SELECT DISTINCT name FROM regions`);
    const allRegions = regions.rows.map(el => el.name);
    // Checks for both conditions. If we had more, that function would become too big and unreadable, but for those two it seems ok.
    if (allRegions.includes(region)) {
      if (brand.length <= 20) {
        return {
          success: true,
          error: null
        }
      }
      else {
        return {success: false, error: 'Bad request: Brand is too long.'}
      }
    }
    else {
      return {success: false, error: 'Bad request: Region does not exist.'}
    }
  } catch (error) {
    return {success: false, error: `${error}`};
  }
};

// << ROUTES >>

// Create car
app.post('/cars', async (req, res, next) => {
  try {
    const {brand, region} = req.body;
    // Let's see if the req params are valid
    const {success, error} = await validateCar(brand, region);
    if (success) {
      const query = `INSERT INTO cars (id, brand, region, creationdate) VALUES(default, '${brand}', '${region}', (to_timestamp(${Date.now()} / 1000.0))) RETURNING *`;
      const newPlace = await pool.query(query);
      res.json(newPlace.rows[0]);
    }
    else {
      res.status(400).send(error);
    }
  } catch (error) {
    next(`${error}`);
    console.error(error);
  }
})

//Get all cars
app.get('/cars', cors(), async (req, res, next) => {
  try {
    const query = 'SELECT * FROM cars';
    const allPlaces = await pool.query(query);
    res.json(allPlaces.rows);
  } catch (error) {
    next(`${error}`);
    console.error(error);
  }
});

// Delete a car
app.delete("/cars/:id", async(req, res, next) => {
  try {
    const {id} = req.params;
    const query = `DELETE FROM cars WHERE id=${id}`;
    const deletedCar = await pool.query(query);
    if (deletedCar.rowCount) {
      res.json(`A car with id ${id} was deleted!`);
    }
    else {
      const error = new Error (`Could not find a car with id ${id}`);
      error.code = 400;
      throw error;
    }
  } catch (error) {
    next(`${error}`);
    console.error(error);
  } 
});

//Get all regions
app.get('/regions', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM regions';
    const allPlaces = await pool.query(query);
    res.json(allPlaces.rows);
  } catch (error) {
    next(`${error}`);
    console.error(error);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})