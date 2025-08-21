import type { PaginationQueryParameters } from "../libs/pagination.ts";
import type { Person } from "../models/person.ts";

export type PersonListParameters = {
  search?: string | undefined;
  nationalities?: string | string[] | undefined;
  hobbies?: string | string[] | undefined;
};

export type NationalityListSort = {
  sortByCount?: boolean | undefined;
};

export type HobbyListSort = {
  sortByCount?: boolean | undefined;
};

export type PersonsRepository = {
  listPersons: (params: PersonListParameters & PaginationQueryParameters) => Promise<Person[]>;
  listNationalities: (params: PaginationQueryParameters & NationalityListSort) => Promise<string[]>;
  listHobbies: (params: PaginationQueryParameters & HobbyListSort) => Promise<string[]>;
};

export type PersonsService = {
  getPersons: (params: PersonListParameters & PaginationQueryParameters) => Promise<Person[]>;
  getTopNationalities: () => Promise<string[]>;
  getTopHobbies: () => Promise<string[]>;
};
