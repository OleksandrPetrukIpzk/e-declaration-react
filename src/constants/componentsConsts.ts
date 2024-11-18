import {openSansUrlsPartialURL} from "./urls";

export const openSansUrls = {
    partial: openSansUrlsPartialURL,
    full:
        '../assets/fonts/OpenSans/OpenSans.ttf',
};

export  const inputPlaced = [
    {
        x: 35,
        y: 228,
    },
    {
        x: 295,
        y: 228,
    },
    {
        x: 465,
        y: 228,
    },
    {
        x: 35,
        y: 260,
    },
    {
        x: 250,
        y: 260,
    },
    {
        x: 35,
        y: 293,
    },
    {
        x: 320,
        y: 293,
    },
    {
        x: 35,
        y: 325,
    },
    {
        x: 40,
        y: 355,
    },
    {
        x: 248,
        y: 355,
    },
    {
        x: 35,
        y: 398,
    },
    {
        x: 175,
        y: 398,
    },
    {
        x: 345,
        y: 398,
    },
    {
        x: 35,
        y: 428,
    },
    {
        x: 225,
        y: 428,
    },
    {
        x: 320,
        y: 428,
    },
    {
        x: 35,
        y: 474,
    },
    {
        x: 100,
        y: 474,
    },
    {
        x: 248,
        y: 474,
    },
    {
        x: 320,
        y: 474,
    },
    {
        x: 485,
        y: 474,
    },
    {
        x: 35,
        y: 513,
    },
    {
        x: 105,
        y: 513,
    },
    {
        x: 248,
        y: 513,
    },
    {
        x: 320,
        y: 513,
    },
    {
        x: 485,
        y: 513,
    },
]

export const inputArray = [{
    id: 0,
    type: 'text',
    placeholder: 'Your surname',
},
    {
        id: 1,
        type: 'text',
        placeholder: 'Place where are you born',
    },
    {
        id: 2,
        type: 'text',
        placeholder: 'Date when are you born',
    },
    {
        id: 3,
        type: 'text',
        placeholder: 'Your name',
    },
    {
        id: 4,
        type: 'text',
        placeholder: 'Your number of passport',
    },
    {
        id: 5,
        type: 'text',
        placeholder: 'Your name by father',
    },
    {
        id: 6,
        type: 'text',
        placeholder: 'Register number',
    },
    {
        id: 7,
        type: 'text',
        placeholder: 'Dop number if you have',
    },
    {
        id: 8,
        type: 'text',
        placeholder: 'Phone number',
    },
    {
        id: 9,
        type: 'email',
        placeholder: 'Email',
    },
    {
        id: 10,
        type: 'text',
        placeholder: 'Name opikun',
    },
    {
        id: 11,
        type: 'text',
        placeholder: 'Surname opikun',
    },
    {
        id: 12,
        type: 'text',
        placeholder: 'Father opikun',
    },
    {
        id: 13,
        type: 'text',
        placeholder: 'Passport opikun',
    },
    {
        id: 14,
        type: 'text',
        placeholder: 'Date birth opikun',
    },
    {
        id: 15,
        type: 'text',
        placeholder: 'Register number opikun',
    },
    {
        id: 16,
        type: 'text',
        placeholder: 'Index where you register',
    },
    {
        id: 17,
        type: 'text',
        placeholder: 'Street where you register',
    },
    {
        id: 18,
        type: 'text',
        placeholder: 'Number of house where you register',
    },
    {
        id: 19,
        type: 'text',
        placeholder: 'Name of city where you register',
    },
    {
        id: 20,
        type: 'text',
        placeholder: 'Region where you register',
    },
    {
        id: 21,
        type: 'text',
        placeholder: 'Place where live now index',
    },
    {
        id: 22,
        type: 'text',
        placeholder: 'Place where live now street',
    },
    {
        id: 23,
        type: 'text',
        placeholder: 'Place where live now house',
    },
    {
        id: 24,
        type: 'text',
        placeholder: 'Place where live now place',
    },
    {
        id: 25,
        type: 'text',
        placeholder: 'Place where live now region',
    },
]

export const inputArrayWithoutOpikun = inputArray.slice(0, 10).concat(inputArray.slice(16));

export const inputArrayWithOpikun = inputArray.slice(10, 15);