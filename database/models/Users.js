module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        code : {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nickname: {
            type: DataTypes.STRING(50), //자료형 타입
            allowNull: false //NULL 값 허용 여부
        },
        enrolled: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        class: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        studentNo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
    }, {
        // 테이블에 대한 설정 지정// static init의 매개변수와 연결되는 옵션, model/index.js에서 연결
        timestamps: false,      // true시 createAt, updateAt 컬럼 추가 각각 생성 및 수정 시 시간 반영
        underscored: false,     // 테이블과 컬럼명을 자동으로 캐멀케이스로 만든다.
        modelName: 'User',      // 프로젝트에서 사용하는 모델의 이름
        tableName: 'users',     // 실제 데이터베이스의 테이블 이름
        paranoid: false,        // true로 설정 시 데이터 삭제 시 완벽하게 삭제하지 않고 삭제기록
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Users.associate = function(models) {
        models.Users.hasMany(models.Board, {
            foreignKey: 'code',
        });
    };

    return Users;
};
