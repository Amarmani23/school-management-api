const SchoolModel = require('../models/schoolModel');
const { sortSchoolsByDistance } = require('../utils/distanceCalculator');

const addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;
        
        const schoolId = await SchoolModel.createSchool({
            name: name.trim(),
            address: address.trim(),
            latitude,
            longitude
        });
        
        res.status(201).json({
            success: true,
            message: 'School added successfully',
            data: {
                id: schoolId,
                name,
                address,
                latitude,
                longitude
            }
        });
    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const listSchools = async (req, res) => {
    try {
        const { userLatitude, userLongitude } = req;
        
        const schools = await SchoolModel.getAllSchools();
        
        if (schools.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No schools found',
                data: []
            });
        }
        
        const sortedSchools = sortSchoolsByDistance(schools, userLatitude, userLongitude);
        
        res.status(200).json({
            success: true,
            message: 'Schools retrieved successfully',
            data: sortedSchools,
            user_location: {
                latitude: userLatitude,
                longitude: userLongitude
            }
        });
    } catch (error) {
        console.error('Error listing schools:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = { addSchool, listSchools };