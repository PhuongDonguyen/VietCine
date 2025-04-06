const { connectToDatabase } = require("../config/DbConfig");
const cloudinary = require('../config/cloudinary.config');

const getUsers = async (req, res) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool
            .request().query('SELECT * FROM [User]');
        res.status(200).json({ data: result.recordset }); 
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool
            .request()
            .input('id', id)
            .query('SELECT * FROM [User] WHERE UserId = @id');
        res.status(200).json({ data: result.recordset[0] });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { FullName, Email, Phone, Address } = req.body;
    let avatar_url = null;

    try {
        const pool = await connectToDatabase();

        // Handle avatar upload if file exists
        if (req.file) {
            const public_id = `${req.file.originalname.split('.')[0]}-${Date.now()}`;
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'vietcine',
                public_id: public_id
            });
            avatar_url = uploadResult.secure_url; // Get the URL from the upload result
        }

        // Prepare and execute the database query
        const request = pool.request()
            .input('name', FullName)
            .input('email', Email)
            .input('phone', Phone)
            .input('address', Address)
            .input('id', id);

        let query;
        if (avatar_url) {
            query = 'UPDATE [User] SET FullName = @name, Email = @email, Phone = @phone, Address = @address, Avatar = @avatar WHERE UserId = @id';
            request.input('avatar', avatar_url);
        } else {
            query = 'UPDATE [User] SET FullName = @name, Email = @email, Phone = @phone, Address = @address WHERE UserId = @id';
        }

        await request.query(query);

        // Fetch updated user data to return in response
        const updatedUser = await pool.request()
            .input('id', id)
            .query('SELECT * FROM [User] WHERE UserId = @id');

        res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser.recordset[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error updating user',
            error: err.message
        });
    }
};

module.exports = { getUsers, updateUser, getUserById };