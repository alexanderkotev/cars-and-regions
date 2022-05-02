import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CarsTable from './components/CarsTable';
import CreateCar from './components/CreateCar';
import axios from 'axios';
import { Car } from './utils/types';

const App: React.FC<{}> = (): JSX.Element => {
  const {REACT_APP_API_HOST, REACT_APP_API_PORT} = process.env;
  const [carsData, setCarsData] = useState<Car[]>([]);

  const getCars = async () => {
    await axios.get(`${REACT_APP_API_HOST}:${REACT_APP_API_PORT}/cars`)
    .then(res => setCarsData(res.data))
    .catch(err => console.log(err));
  };

  const createCar = async (brand: string, region: string) => {
    await axios.post(`${REACT_APP_API_HOST}:${REACT_APP_API_PORT}/cars/`, {brand, region})
    .then(() => getCars())
    .catch(err => console.log(err));
  };

  const deleteCar = async (id: number) => {
    await axios.delete(`${REACT_APP_API_HOST}:${REACT_APP_API_PORT}/cars/${id}`)
    .then(() => getCars())
    .catch(err => console.log(err));
  };
  
  useEffect(() => {
    getCars();
}, []);

  return (
    <div className='App'>
      <BrowserRouter>   
        <Routes>
          <Route path="/" element={<CarsTable carsData={carsData} deleteCar={deleteCar}/>} />
          <Route path="/create-car" element={<CreateCar createCar={createCar}/>} />
          <Route
            path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;