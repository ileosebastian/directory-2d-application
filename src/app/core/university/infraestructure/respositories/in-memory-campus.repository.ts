import { Injectable } from "@angular/core";

import { CampusRepository } from "../../domain/repos/campus.repository";

import { Campus } from "../../domain/campus.domain";


const ALL_CAMPUS: Campus[] = [
    {
        name: 'portoviejo',
        text: 'Campus Portoviejo'
    },
    {
        name: 'lodana',
        text: 'Campus Lodana'
    },
    {
        name: 'chone',
        text: 'Campus Chone'
    }
];


@Injectable({
    providedIn: 'root'
})
export class InMemoryCampusRepository implements CampusRepository {

    constructor () {}

    async getAllCampus(): Promise<Campus[]> {
        return ALL_CAMPUS;
    }

}