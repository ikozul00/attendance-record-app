import { ref, increment, update, get, child } from "firebase/database";
import database from "./connectToDatabase.js";
import { students } from "./const.js";
import { getCurrentDate } from "./helper-functions.js";

const updateProfesor = (date) => {
  update(
    ref(database, `root/Predmeti/Ugradbeni računalni sustavi/Profesor/Datumi/`),
    { [date]: 1 }
  );
};

const updateStudent = (student, date, value) => {
  update(
    ref(
      database,
      `root/Predmeti/Ugradbeni računalni sustavi/Studetni/${student}/Datumi`
    ),
    { [date]: value }
  );
};

export const updateAttendance = (classroom) => {
  console.log("update");
  const date = getCurrentDate();
  get(
    ref(
      database,
      `root/Ucionice/${classroom}/${date}/Ugradbeni računalni sustavi`
    )
  )
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const profesorValue = data.Profesor.value;
        updateProfesor(date);
        console.log(profesorValue);
        var dates = {};
        students.map((student) => {
          if (data.Studetni[student]?.value / profesorValue > 0.85) {
            console.log(student);
            dates = { ...dates, [student]: 1 };
            updateStudent(student, date, 1);
          } else {
            dates = { ...dates, [student]: 0 };
            updateStudent(student, date, 0);
          }
        });
        update(
          ref(
            database,
            `root/Predmeti/Ugradbeni računalni sustavi/Datumi/${date}/`
          ),
          { ...dates }
        );
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
