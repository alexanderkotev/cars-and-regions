import { FormControl, InputLabel, Input, Select, MenuItem, Button } from '@mui/material';
import axios from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateCar.css';

type CreateCarProps = {
  createCar: (brand: string, region: string) => Promise<void>;
};

const CreateCar: React.FC<CreateCarProps> = ({createCar}): JSX.Element => {
  const {REACT_APP_API_HOST, REACT_APP_API_PORT} = process.env;
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [allRegions, setAllRegions] = useState<string[]>([]);
  const [brand, setBrand] = useState<string>('');
  const [showMessage, setShowMessage] = useState<string>('');

  const getRegions = async () => {
    await axios.get(`${REACT_APP_API_HOST}:${REACT_APP_API_PORT}/regions`)
    .then(res => res.data.map((region: { name: string; }) => region.name))
    .then(res => setAllRegions(res))
    .catch(err => console.log(err));
  };

  useEffect(() => {
    getRegions();
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>)  => {
    e.preventDefault();
    await createCar(brand, selectedRegion).then(
      () => setShowMessage('Car created successfuly!')
    ).catch(err => setShowMessage('Unable to create car. ' + {err}));
  };
  

  return (
    <>
      <Link to='/'>Back</Link>
      <h2>Create new car</h2>
      <form className='createCarTable' onSubmit={handleSubmit}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel htmlFor="car-brand">Car brand</InputLabel>
          <Input 
            id="car-brand" 
            aria-describedby="brand-helper-text" 
            onChange={e => setBrand(e.target.value)} 
            required
            inputProps={{ maxLength: 20 }} />
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel htmlFor="car-region-select-small">Region</InputLabel>
          <Select
            id="car-region-select-small"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            label="Region"
            required
            >
            {allRegions.map(region => <MenuItem key={region} value={region}>{region}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" type='submit'>Create car</Button>
      </form>
      {showMessage && <p className='message'>{showMessage}</p>}
    </>
  );
}

export default CreateCar;
