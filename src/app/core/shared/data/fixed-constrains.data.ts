import { Constrains } from "../models/core.interfaces";


export const fixedConstrains: Constrains[] = [
    {
        type: 'where',
        field: 'isVisible',
        filter: '==',
        value: true
    },
    {
        type: 'where',
        field: 'published',
        filter: '==',
        value: true
    },
];
