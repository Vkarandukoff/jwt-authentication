module.exports = class UserDto {
    id;
    idUser;

    constructor(model) {
        this.id = model.id;
        this.idUser = model._id;
    }
}