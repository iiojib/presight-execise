import type {
  PersonsService as PersonsServiceInterface,
  PersonsRepository,
  PersonListParameters,
} from "../app/persons.ts";
import type { PaginationQueryParameters } from "../libs/pagination.ts";

export class PersonsService implements PersonsServiceInterface {
  private repository: PersonsRepository;

  constructor(repository: PersonsRepository) {
    this.repository = repository;
  }

  getPersons(params: PersonListParameters & PaginationQueryParameters) {
    return this.repository.listPersons(params);
  }

  getTopNationalities() {
    return this.repository.listNationalities({
      page: 1,
      limit: 20,
      sortByCount: true,
    });
  }

  getTopHobbies() {
    return this.repository.listHobbies({
      page: 1,
      limit: 20,
      sortByCount: true,
    });
  }
}
