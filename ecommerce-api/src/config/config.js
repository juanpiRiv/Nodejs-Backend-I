import dotenv from 'dotenv';
dotenv.config();

export const config = {
    URL_MONGODB : process.env.URL_MONGODB ,
    PORT : process.env.PORT
};