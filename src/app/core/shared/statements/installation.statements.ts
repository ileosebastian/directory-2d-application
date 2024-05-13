
export const FACULTY_INSTALLATION_STATEMENT = `INSERT INTO faculty(campus, name) VALUES(?, ?);`;

export const BUILDING_INSTALLATION_STATEMENT = `INSERT INTO building(uuid, campus, faculty, floors, name) VALUES(?, ?, ?, ?, ?);`;

export const PLANE_INSTALLATION_STATEMENT = `INSERT INTO plane(uuid, columns, rows, widthTiles, heightTiles, stage, floor, waypoints, buildingId) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`;

export const PLACE_INSTALLATION_STATEMENT = `INSERT INTO place(uuid, name, code, title, category, campus, faculty, wayPointId, planeId) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`;

export const DETAIL_PLACE_INSTALLATION_STATEMENT = `INSERT INTO place_detail(placeId, floor, belongsProfessor, professorsId) VALUES(?, ?, ?, ?);`;

export const PROFESSOR_INSTALLATION_STATEMENT = `INSERT INTO professor(id, name, campus, faculty, department, office, infoId) VALUES(?, ?, ?, ?, ?, ?, ?);`;

export const DETAIL_PROFESSOR_INSTALLATION_STATEMENT = `INSERT INTO professor_detail(uuid, category, dedication, email, schedule) VALUES(?, ?, ?, ?, ?);`;
