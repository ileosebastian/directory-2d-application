import { Routes } from "@angular/router";
import { ContentDirectoryPage } from "./content-directory/content-directory.page";
import { GENERAL_SEARCH_KEY, PLACE_SEARCH_KEY, PROFESSOR_SEARCH_KEY } from "../../../core/shared/data/constants.data";


export const routes: Routes = [
    {
        path: 'search',
        component: ContentDirectoryPage,
        children: [
            {
                path: PROFESSOR_SEARCH_KEY,
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../pages/professor-search/professor-search.page')
                            .then(p => p.ProfessorSearchPage)
                    }
                ]
            },
            {
                path: PLACE_SEARCH_KEY,
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../pages/place-search/place-search.page')
                            .then(p => p.PlaceSearchPage)
                    }
                ]
            },
            {
                path: `${PLACE_SEARCH_KEY}/:category`, // filter by place (bathroom, classrooms, and more...)
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../pages/place-search/place-search.page')
                            .then(p => p.PlaceSearchPage)
                    }
                ] 
            },
            {
                path: GENERAL_SEARCH_KEY,
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../pages/general-search/general-search.page')
                            .then(p => p.GeneralSearchPage)
                    }
                ]
            },
            {
                path: '',
                redirectTo: `/search/${PROFESSOR_SEARCH_KEY}`,
                pathMatch: 'full'
            }
        ],
    },
    {
        path: '',
        redirectTo: `/search/${PROFESSOR_SEARCH_KEY}`,
        pathMatch: 'full'
    },

];