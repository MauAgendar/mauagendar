import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database";

class User extends Model {
    public id!: number;
    public name!: string;
    public password!: string;
    public email!: string;
    public phonenumber!: string;
    public readonly created_at!: Date;

    public readonly updated_at!: Date;

    public static associations: {};
    public static async exists(email: string): Promise<boolean> {
        const user = await User.findOne({ where: { email } });
        return !!user;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        phonenumber: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        tableName: "users",
        sequelize,
        timestamps: false,
    }
);

export default User;
