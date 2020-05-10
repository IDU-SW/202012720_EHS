const conn = require('./dbConnection');

exports.prepareTable = () => {
    const sql = 'drop table if exists foodlist; create table foods(id int primary key auto_increment, food varchar(50), kind varchar(50), explanation varchar(255));';
    conn.query(sql).then(ret => {
        console.log('테이블 생성');
        conn.end();
    }).catch(err => {
        console.log('테이블 생성 실패 :', err);
        conn.end();
    });
}