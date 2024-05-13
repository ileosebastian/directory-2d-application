import { Injectable, inject } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection } from '@angular/fire/firestore';

import { firstValueFrom } from 'rxjs';

import { Constrains } from '../../shared/models/core.interfaces';
import { DetailProfessor, Professor } from '../../professor/domain/professor.domain';
import { Building } from '../../map/domain/building.domain';
import { PlaneParsed } from '../../map/domain/plane.domain';
import { DetailPlace, Place } from '../../place/domain/place.domain';
import { Faculty } from '../../university/domain/faculty.domain';
import { CampusPermitted, UUID } from '../../shared/models/core.types';

import { fixedConstrains } from '../../shared/data/fixed-constrains.data';
import { executeQuery } from '../../shared/utils/execute-firestore-query.utils';
import { Campus } from '../../university/domain/campus.domain';


@Injectable({
  providedIn: 'root'
})
export class FirestoreOnlineService {

  private facultyCollection: CollectionReference<DocumentData>;
  private professorsCollection: CollectionReference<DocumentData>;
  private detailProfessorsCollection: CollectionReference<DocumentData>;
  private buildingsCollection: CollectionReference<DocumentData>;
  private plansCollection: CollectionReference<DocumentData>;
  private placesCollection: CollectionReference<DocumentData>;
  private detailPlaceCollection: CollectionReference<DocumentData>;

  private readonly db = inject(Firestore);

  constructor() {
    this.facultyCollection = collection(this.db, "faculties");
    this.professorsCollection = collection(this.db, "professors");
    this.detailProfessorsCollection = collection(this.db, "professor-details");
    this.buildingsCollection = collection(this.db, "buildings");
    this.plansCollection = collection(this.db, "plans");
    this.placesCollection = collection(this.db, "places");
    this.detailPlaceCollection = collection(this.db, "place-details");
  }

  async getALLFacultiesByCampus(campus: CampusPermitted): Promise<Faculty[]> {
    const constrains: Constrains[] = [
      {
        type: 'where',
        field: 'campus',
        filter: '==',
        value: campus
      },
      {
        type: 'where',
        field: 'published',
        filter: '==',
        value: true
      },
    ];

    const obs = executeQuery<Faculty>(
      this.facultyCollection,
      [...constrains]
    );

    return await firstValueFrom(obs);
  }

  async getALLProfessorsByCampus(campus: CampusPermitted): Promise<Professor[]> {
    const constrains: Constrains[] = [
      {
        type: 'where',
        field: 'campus',
        filter: '==',
        value: campus
      },
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

    const obs = executeQuery<Professor>(
      this.professorsCollection,
      [...constrains]
    );

    return await firstValueFrom(obs);
  }

  async getALLDetailProfessors(): Promise<DetailProfessor[]> {
    const constrains: Constrains[] = [
      {
        type: 'where',
        field: 'published',
        filter: '==',
        value: true
      },
    ];

    const obs = executeQuery<DetailProfessor>(
      this.detailProfessorsCollection,
      [...constrains]
    );

    return await firstValueFrom(obs);
  }

  async getALLBuildingsByCampus(campus: CampusPermitted): Promise<Building[]> {
    const constrains: Constrains[] = [
      {
        type: 'where',
        field: 'campus',
        filter: '==',
        value: campus
      },
      {
        type: 'where',
        field: 'published',
        filter: '==',
        value: true
      },
    ];

    const obs = executeQuery<Building>(
      this.buildingsCollection,
      [...constrains]
    );

    return await firstValueFrom(obs);
  }

  async getALLPlansByBuildingId(buildingId: UUID): Promise<PlaneParsed[]> {
    const constrains: Constrains[] = [
      {
        type: 'where',
        field: 'buildingId',
        filter: '==',
        value: buildingId
      },
      {
        type: 'where',
        field: 'published',
        filter: '==',
        value: true
      },
    ];

    const obs = executeQuery<PlaneParsed>(
      this.plansCollection,
      [...constrains]
    );

    return await firstValueFrom(obs);
  }

  async getALLPlacesByCampus(campus: CampusPermitted): Promise<Place[]> {
    const constrains: Constrains[] = [
      {
        type: 'where',
        field: 'campus',
        filter: '==',
        value: campus
      },
      {
        type: 'where',
        field: 'published',
        filter: '==',
        value: true
      },
    ];

    const obs = executeQuery<Place>(
      this.placesCollection,
      [...constrains]
    );

    return await firstValueFrom(obs);
  }

  async getALLDetailPlaces(): Promise<DetailPlace[]> {
    const constrains: Constrains[] = [
      {
        type: 'where',
        field: 'published',
        filter: '==',
        value: true
      },
    ];

    const obs = executeQuery<DetailPlace>(
      this.detailPlaceCollection,
      [...constrains]
    );

    return await firstValueFrom(obs);
  }

}
