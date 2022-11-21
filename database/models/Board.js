module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define("Board", {
        boardCode : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        contents: {
            type: DataTypes.TEXT,
                allowNull: false
        },
        allowBoard: {
            type: DataTypes.BOOLEAN
        },
        isAnonymous: {
            type: DataTypes.BOOLEAN
        },
        Image: {
            type: DataTypes.STRING
        }
        },{
        // 테이블에 대한 설정 지정// static init의 매개변수와 연결되는 옵션, model/index.js에서 연결
            timestamps: true,      // true시 createAt, updateAt 컬럼 추가 각각 생성 및 수정 시 시간 반영
            underscored: false,     // 테이블과 컬럼명을 자동으로 캐멀케이스로 만든다.
            modelName: 'Board',      // 프로젝트에서 사용하는 모델의 이름
            tableName: 'Board',     // 실제 데이터베이스의 테이블 이름
            paranoid: false,        // true로 설정 시 데이터 삭제 시 완벽하게 삭제하지 않고 삭제기록
            charset: 'utf8',
            collate: 'utf8_general_ci',
    });
    Board.associate = function (model){
        model.Board.belongsTo(model.Users, {
            foreignKey: 'userCode',
            sourceKey: 'code'
        });

        /**
         * Users안에 있는 "id값"을 "user_id라는 컬럼 이름"으로 UserInfo모델에 새로운 컬럼으로 추가한다.
         */
            Board.hasOne(model.AllowBoard, {
                foreignKey: {
                    name: "boardCode",
                    unique: true
                },
                sourceKey: 'boardCode',


            });
    };
    return Board;
}
