import React, { useEffect, useState } from 'react';
import { Car } from '../utils/types';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { removeDuplicates } from '../utils/helper';
import { Link } from 'react-router-dom';

type CarsTableProps = {
    carsData: Car[];
    deleteCar: (id: number) => void;
};

const CarsTable: React.FC<CarsTableProps> = ({carsData, deleteCar}): JSX.Element => {
    const [brandFilter, setBrandFilter] = useState<string>('');
    const [regionFilter, setRegionFilter] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Car[]>(carsData);
    const [availableRegions, setAvailableRegions] = useState<string[]>([]);
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);

    useEffect(() => {
        const availableRegions = removeDuplicates(carsData.map(c => c.region));
        const availableBrands = removeDuplicates(carsData.map(c => c.brand));
        setAvailableRegions(availableRegions);
        setAvailableBrands(availableBrands);
    }, [carsData]);

    useEffect(() => {
        const filtered = carsData.filter(car => {
            if(brandFilter && car.brand !== brandFilter) return false;
            if(regionFilter && car.region !== regionFilter) return false;
            return true;
        });
        setFilteredData(filtered);
    }, [brandFilter, regionFilter, carsData]);

    return (
        <>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, marginBottom: 20 }}>
                <InputLabel>Brand</InputLabel>
                <Select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    label="Brand"
                    >
                    <MenuItem value={''}>
                    <em>None</em>
                    </MenuItem>
                    {availableBrands.map(brand => <MenuItem key={brand} value={brand}>{brand}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Region</InputLabel>
                <Select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    label="Region"
                    >
                    <MenuItem value={''}>
                    <em>None</em>
                    </MenuItem>
                    {availableRegions.map(region => <MenuItem key={region} value={region}>{region}</MenuItem>)}
                </Select>
            </FormControl>
            <TableContainer sx={{margin: '20px 0'}} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell align="right">Brand</TableCell>
                    <TableCell align="right">Region</TableCell>
                    <TableCell align="right">Creation Date</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {filteredData.map((car) => (
                    <TableRow
                    key={car.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {car.id}
                    </TableCell>
                    <TableCell align="right">{car.brand}</TableCell>
                    <TableCell align="right">{car.region}</TableCell>
                    <TableCell align="right">{car.creationdate.toString().split('T')[0]}</TableCell>
                    <TableCell align="right"><Button variant="contained" onClick={() => deleteCar(car.id)}>Delete</Button></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <Link className='link' to="/create-car" >Create new car</Link>
            </>
    );
}

export default CarsTable;
