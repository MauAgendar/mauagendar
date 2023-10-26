import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database";

class AppointmentModel extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public start_time!: Date;
    public end_time!: Date;
    public user_id!: number;
    public created_at!: Date;
    public updated_at!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

AppointmentModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "appointments",
        sequelize,
        timestamps: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
        underscored: true,
    }
);
const updateUpdatedAtTrigger = `
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS appointments_update_updated_at ON appointments;
CREATE TRIGGER appointments_update_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
`;
sequelize.sync().then(
    () => {
        console.log("Appointment table created");
        sequelize.query("SET DATESTYLE TO DMY");
        sequelize.query(updateUpdatedAtTrigger);
    },
    (err) => {
        console.error("Error creating appointment table:", err);
    }
);

export default AppointmentModel;
