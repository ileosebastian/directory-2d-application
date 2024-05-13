import { CollectionReference, DocumentData, QueryConstraint, collectionData, limit, orderBy, query, startAfter, startAt, where } from "@angular/fire/firestore";
import { Constrains } from "../models/core.interfaces";
import { Observable } from 'rxjs';


export function executeQuery<T>(
    collection: CollectionReference<DocumentData>,
    constrains: Constrains[],
): Observable<T[]> {
    const constrainsToQuery: QueryConstraint[] = [];

    for (const cons of constrains) {
        if (cons.type === 'where' && cons.field && cons.filter) {
            constrainsToQuery.push(where(cons.field, cons.filter, cons.value));
        }
        if (cons.type === 'orderBy' && cons.field) {
            constrainsToQuery.push(orderBy(cons.field, 'asc'));
        }
        if (cons.type === 'startAt') {
            constrainsToQuery.push(startAt(cons.value));
        }
        if (cons.type === 'startAfter') {
            constrainsToQuery.push(startAfter(cons.value));
        }
        if (cons.type === 'limit' && typeof cons.value === 'number') {
            constrainsToQuery.push(limit(cons.value));
        }
    }

    const q = query(
        collection,
        ...constrainsToQuery
    );

    const response = collectionData(q, { idField: 'id' }) as Observable<T[]>;

    if (!response)
        throw new Error("Error when execure query...");
    else
        return response;
}
