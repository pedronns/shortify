"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class Link extends Model {
        static associate(models) {
            // future associations
        }
    }

    Link.init(
        {
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            clicks: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
             passwordHash: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            protected: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Link",
        }
    )

    return Link
}
