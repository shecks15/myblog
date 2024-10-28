const genres = require("./genres");
const data = [
    "Программирование",
    "Веб-разработка",
    "Дизайн",
    "Искусственный интеллект",
];

async function writeDataGenre(){
    const length = await genres.countDocuments();
    if(length == 0){
        data.map((item, index) => {
            new genres({
                name: item,
                key: index
            }).save();
        })
    }
}
module.exports = writeDataGenre;