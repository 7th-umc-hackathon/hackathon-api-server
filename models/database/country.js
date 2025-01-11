import { DataTypes, Model, Sequelize } from "sequelize";

class Country extends Model {
  static init(sequelize) {
    return super.init(
      {
        country_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        common_name: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        ccn3: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cca3: {
          type: DataTypes.STRING(3),
          allowNull: false,
        },
        national_flag_url: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
      },
      {
        sequelize,
        tableName: "country",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, {
      as: "users",
      foreignKey: "country_id",
    });
    this.hasMany(models.Relay, {
      as: "current_relays",
      foreignKey: "current_country_id",
    });
    this.hasMany(models.Relay, {
      as: "next_relays",
      foreignKey: "next_country_id",
    });
  }
}

export default Country;
