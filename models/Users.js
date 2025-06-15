module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING, 
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 1000,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};