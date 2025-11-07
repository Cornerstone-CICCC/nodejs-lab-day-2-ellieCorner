"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const users = [];
class UserModel {
    static findByUsername(username) {
        return users.find((user) => user.username === username);
    }
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.findByUsername(username);
            if (!user) {
                return null;
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            return user;
        });
    }
    static create(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
            const user = {
                id: (0, uuid_1.v4)(),
                username: newUser.username,
                password: hashedPassword,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
            };
            users.push(user);
            return user;
        });
    }
}
exports.UserModel = UserModel;
